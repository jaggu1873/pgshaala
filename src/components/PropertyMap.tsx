import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProperty {
  id: string;
  name: string;
  area: string | null;
  latitude: number | null;
  longitude: number | null;
  photos: string[] | null;
  rating: number | null;
  vacantBeds: number;
  rentRange: string;
}

export interface MapDestination {
  latitude: number;
  longitude: number;
  label: string;       // e.g. "RVCE Campus"
  sublabel?: string;   // e.g. "Tech Park · 3.2 km"
}

interface PropertyMapProps {
  properties: MapProperty[];
  onPropertyClick: (id: string) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
  routeCoordinates?: [number, number][]; // Precise road coordinates
  destination?: MapDestination | null;   // Named destination for route
}

const getMarkerColor = (vacantBeds: number) => {
  if (vacantBeds === 0) return '#ef4444';
  if (vacantBeds <= 3) return '#f59e0b';
  return '#C5A059'; // Classic Gold
};

// Pin shows: PG short-name on top row, rent on bottom row
const createMarkerIcon = (name: string, vacantBeds: number, rent: string, isSelected: boolean) => {
  const color = getMarkerColor(vacantBeds);
  const shortName = name.length > 14 ? name.slice(0, 13) + '…' : name;
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
    <div style="
      display:flex;flex-direction:column;align-items:center;
      transform: ${isSelected ? 'scale(1.12) translateY(-6px)' : 'scale(1)'};
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    ">
      <div style="
        background:${isSelected ? '#fff' : color};
        color:${isSelected ? color : '#fff'};
        font-family:'Outfit',sans-serif;
        padding:5px 10px 4px;
        border-radius:12px;
        box-shadow:0 4px 14px ${color}55;
        border:2px solid ${color};
        white-space:nowrap;
        text-align:center;
        min-width:80px;
      ">
        <div style="font-size:10px;font-weight:800;letter-spacing:0.01em;line-height:1.2">${shortName}</div>
        <div style="font-size:9px;font-weight:600;opacity:0.8;letter-spacing:0.02em">${rent}</div>
      </div>
      <div style="width:0;height:0;margin:0 auto;
        border-left:6px solid transparent;border-right:6px solid transparent;
        border-top:8px solid ${isSelected ? '#fff' : color};
        filter: drop-shadow(0 2px 3px rgba(0,0,0,0.25));
      "></div>
    </div>`,
    iconSize: [96, 52],
    iconAnchor: [48, 52],
    popupAnchor: [0, -54],
  });
};

// Destination flag marker (star/flag pin)
const createDestinationIcon = (label: string) => {
  return L.divIcon({
    className: 'destination-map-pin',
    html: `
    <div style="display:flex;flex-direction:column;align-items:center;">
      <div style="
        background: linear-gradient(135deg,#6366f1,#8b5cf6);
        color:#fff;
        font-family:'Outfit',sans-serif;
        font-size:10px;font-weight:800;
        padding:5px 12px 4px;
        border-radius:12px;
        box-shadow:0 4px 16px rgba(99,102,241,0.5);
        border:2px solid #818cf8;
        white-space:nowrap;
        text-align:center;
        display:flex;align-items:center;gap:5px;
      ">
        <span style="font-size:13px">📍</span>
        <span>${label.length > 16 ? label.slice(0,15) + '…' : label}</span>
      </div>
      <div style="width:0;height:0;margin:0 auto;
        border-left:7px solid transparent;border-right:7px solid transparent;
        border-top:9px solid #6366f1;
        filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3));
      "></div>
    </div>`,
    iconSize: [110, 52],
    iconAnchor: [55, 52],
    popupAnchor: [0, -54],
  });
};

export default function PropertyMap({ properties, onPropertyClick, center, zoom = 12, className = '', routeCoordinates = [], destination = null }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const pathRef = useRef<L.Polyline | null>(null);
  const destMarkerRef = useRef<L.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const defaultCenter: [number, number] = center || [12.9237, 77.4987]; // Default to RVCE Area
    mapInstance.current = L.map(mapRef.current, {
      center: defaultCenter,
      zoom,
      zoomControl: false,
      attributionControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);

    // Darker, more classic map tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(mapInstance.current);

    markersRef.current = L.layerGroup().addTo(mapInstance.current);

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update destination marker separately
  useEffect(() => {
    if (!mapInstance.current) return;
    if (destMarkerRef.current) {
      destMarkerRef.current.remove();
      destMarkerRef.current = null;
    }
    if (destination) {
      const icon = createDestinationIcon(destination.label);
      destMarkerRef.current = L.marker([destination.latitude, destination.longitude], { icon })
        .bindPopup(`<div style="font-family:'Outfit',sans-serif;padding:6px 10px;background:hsl(220,25%,4%);color:#fff;border-radius:10px;">
          <div style="font-weight:800;color:#818cf8;font-size:12px">${destination.label}</div>
          ${destination.sublabel ? `<div style="font-size:10px;opacity:0.6;margin-top:2px">${destination.sublabel}</div>` : ''}
        </div>`, { closeButton: false, className: 'classic-popup' })
        .addTo(mapInstance.current!);
    }
  }, [destination]);

  // Update markers and path
  useEffect(() => {
    if (!mapInstance.current || !markersRef.current) return;
    markersRef.current.clearLayers();
    if (pathRef.current) {
      pathRef.current.remove();
      pathRef.current = null;
    }

    const validProps = properties.filter(p => p.latitude && p.longitude);
    if (validProps.length === 0) return;

    validProps.forEach(p => {
      // Highlight the PG that is the start of a route
      const isStart = routeCoordinates.length > 0 &&
        Math.abs(p.latitude! - routeCoordinates[0][0]) < 0.001 &&
        Math.abs(p.longitude! - routeCoordinates[0][1]) < 0.001;

      const icon = createMarkerIcon(p.name, p.vacantBeds, p.rentRange, isStart);
      const marker = L.marker([p.latitude!, p.longitude!], { icon });

      const popupContent = `
        <div style="font-family:'Outfit',sans-serif;min-width:210px;padding:10px;background:hsl(220, 25%, 4%);color:#fff;border-radius:14px;">
          ${p.photos?.[0] ? `<img src="${p.photos[0]}" style="width:100%;height:110px;object-fit:cover;border-radius:10px;margin-bottom:10px;border:1px solid rgba(255,255,255,0.08);" />` : ''}
          <div style="font-weight:800;font-size:13px;margin-bottom:2px;color:#C5A059;">${p.name}</div>
          <div style="font-size:10px;color:rgba(255,255,255,0.45);margin-bottom:10px;text-transform:uppercase;letter-spacing:0.05em;">${p.area || ''}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;padding-top:6px;border-top:1px solid rgba(255,255,255,0.06);">
            <span style="font-weight:800;font-size:15px;color:#C5A059;">${p.rentRange}<span style="font-size:9px;font-weight:500;opacity:0.6">/mo</span></span>
            <span style="font-size:10px;color:${getMarkerColor(p.vacantBeds)};font-weight:700;">${p.vacantBeds} BEDS FREE</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { closeButton: false, maxWidth: 270, className: 'classic-popup' });
      marker.on('click', () => { onPropertyClick(p.id); });
      markersRef.current!.addLayer(marker);
    });

    // Draw path if exists
    if (routeCoordinates.length > 1) {
      pathRef.current = L.polyline(routeCoordinates, {
        color: '#6366f1',
        weight: 5,
        opacity: 0.9,
        lineJoin: 'round',
        lineCap: 'round',
        dashArray: '1, 10',
      }).addTo(mapInstance.current);
      mapInstance.current.fitBounds(pathRef.current.getBounds(), { padding: [80, 80] });
    } else {
      const bounds = L.latLngBounds(validProps.map(p => [p.latitude!, p.longitude!]));
      mapInstance.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    }
  }, [properties, onPropertyClick, routeCoordinates]);

  return <div ref={mapRef} className={`w-full h-full ${className}`} style={{ minHeight: 400 }} />;
}
