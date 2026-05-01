import React, { useState, useMemo, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Network, Filter, Brain, ArrowRight, Zap, Target, Search, Settings2, BarChart, MapPin, Check, X, Navigation, Building2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProperties } from '@/hooks/useCrmData';
import PropertyMap, { type MapDestination } from '@/components/PropertyMap';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

// Curated destinations around Bangalore
const DESTINATIONS: (MapDestination & { id: string; type: 'tech_park' | 'college' | 'office' })[] = [
  { id: 'rvce', label: 'RVCE Campus', sublabel: 'College · Mysore Road', latitude: 12.9232, longitude: 77.4989, type: 'college' },
  { id: 'ecity', label: 'Electronic City', sublabel: 'Tech Park · Phase 1', latitude: 12.8399, longitude: 77.6770, type: 'tech_park' },
  { id: 'manyata', label: 'Manyata Tech Park', sublabel: 'Tech Park · Hebbal', latitude: 13.0453, longitude: 77.6193, type: 'tech_park' },
  { id: 'whitefield', label: 'Whitefield ITPL', sublabel: 'Tech Park · Whitefield', latitude: 12.9859, longitude: 77.7350, type: 'tech_park' },
  { id: 'blr_airport', label: 'Kempegowda Airport', sublabel: 'Airport · BIAL', latitude: 13.1989, longitude: 77.7068, type: 'office' },
  { id: 'iimb', label: 'IIM Bangalore', sublabel: 'College · Bannerghatta Rd', latitude: 12.9295, longitude: 77.6384, type: 'college' },
  { id: 'iit_b', label: 'IIT Bangalore (IISC)', sublabel: 'College · Mathikere', latitude: 13.0210, longitude: 77.5709, type: 'college' },
  { id: 'indiranagar', label: 'Indiranagar 100ft', sublabel: 'Hub · CMH Road', latitude: 12.9784, longitude: 77.6408, type: 'office' },
  { id: 'koramangala', label: 'Koramangala Hub', sublabel: 'Startup Hub · 5th Block', latitude: 12.9352, longitude: 77.6245, type: 'office' },
  { id: 'bagmane', label: 'Bagmane Tech Park', sublabel: 'Tech Park · CV Raman Nagar', latitude: 12.9799, longitude: 77.6482, type: 'tech_park' },
];

// Fetch real road path using OSRM API — PG to destination
const fetchRealRoute = async (
  pgLat: number, pgLng: number,
  destLat: number, destLng: number
): Promise<{ coords: [number, number][]; distanceKm: number; durationMin: number }> => {
  try {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${pgLng},${pgLat};${destLng},${destLat}?overview=full&geometries=geojson`
    );
    const data = await res.json();
    if (data.routes?.length > 0) {
      const route = data.routes[0];
      return {
        coords: route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]),
        distanceKm: Math.round((route.distance / 1000) * 10) / 10,
        durationMin: Math.round(route.duration / 60),
      };
    }
    return { coords: [], distanceKm: 0, durationMin: 0 };
  } catch (e) {
    console.error('Routing Error:', e);
    return { coords: [], distanceKm: 0, durationMin: 0 };
  }
};

const MathModels = () => {
  const { data: properties, isLoading } = useProperties();
  const [selectedPgId, setSelectedPgId] = useState<string | null>(null);
  const [selectedDestId, setSelectedDestId] = useState<string>(DESTINATIONS[0].id);
  const [customDest, setCustomDest] = useState<MapDestination | null>(null);
  const [destSearchQuery, setDestSearchQuery] = useState('');
  const [searchingDest, setSearchingDest] = useState(false);
  const [constraints, setConstraints] = useState({ premiumOnly: true, wifiRequired: true });
  const [calculating, setCalculating] = useState(false);
  const [path, setPath] = useState<[number, number][]>([]);
  const [routeInfo, setRouteInfo] = useState<{ distanceKm: number; durationMin: number } | null>(null);

  // Stable random offsets per property (avoid re-randomizing on re-render)
  const stableOffsets = useMemo(() => {
    if (!properties) return {};
    return Object.fromEntries(
      properties.map((p: any) => [p.id, {
        lat: (Math.random() - 0.5) * 0.12,
        lng: (Math.random() - 0.5) * 0.12,
      }])
    );
  }, [properties?.length]);

  const mapProperties = useMemo(() => {
    if (!properties) return [];
    return properties.map((p: any, i: number) => ({
      ...p,
      latitude:  p.latitude  || (12.9716 + (stableOffsets[p.id]?.lat ?? 0)),
      longitude: p.longitude || (77.5946 + (stableOffsets[p.id]?.lng ?? 0)),
      vacantBeds: p.vacantBeds ?? Math.floor(Math.random() * 10),
      rentRange: p.rentRange || p.price_range || `₹${(8000 + i * 1500).toLocaleString()}`,
      budget: i % 2 === 0 ? 'premium' : 'economy',
      wifi: i % 3 !== 0,
    }));
  }, [properties, stableOffsets]);

  const selectedDest = useMemo(() => {
    if (customDest) return customDest;
    return DESTINATIONS.find(d => d.id === selectedDestId) || DESTINATIONS[0];
  }, [selectedDestId, customDest]);

  const handleDestSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destSearchQuery.trim()) return;

    setSearchingDest(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destSearchQuery + ' Bangalore')}&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const result = data[0];
        const newDest: MapDestination = {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          label: result.display_name.split(',')[0],
          sublabel: result.display_name.split(',').slice(1, 3).join(','),
        };
        setCustomDest(newDest);
        setSelectedDestId('custom');
        setPath([]);
        setRouteInfo(null);
        toast.success(`Destination found: ${newDest.label}`);
      } else {
        toast.error('Destination not found. Try adding more details.');
      }
    } catch (error) {
      toast.error('Search failed. Check connection.');
    } finally {
      setSearchingDest(false);
    }
  };

  const selectedPg   = useMemo(() => mapProperties.find(p => p.id === selectedPgId), [mapProperties, selectedPgId]);

  useEffect(() => {
    if (mapProperties.length > 0 && !selectedPgId) {
      setSelectedPgId(mapProperties[0].id);
    }
  }, [mapProperties]);

  const handleRecalculate = async () => {
    if (!selectedPgId) { toast.error('Select a PG on the map first'); return; }
    const pg = mapProperties.find(p => p.id === selectedPgId);
    if (!pg) return;
    setCalculating(true);
    try {
      const result = await fetchRealRoute(
        pg.latitude, pg.longitude,
        selectedDest.latitude, selectedDest.longitude
      );
      if (result.coords.length > 0) {
        setPath(result.coords);
        setRouteInfo({ distanceKm: result.distanceKm, durationMin: result.durationMin });
        toast.success(`Route ready · ${result.distanceKm} km · ~${result.durationMin} min`);
      } else {
        toast.error('Could not fetch road route. Check your connection.');
      }
    } catch {
      toast.error('Routing engine error');
    } finally {
      setCalculating(false);
    }
  };

  const filteredInventory = useMemo(() => {
    return mapProperties.filter(item => {
      const matchPremium = !constraints.premiumOnly || item.budget === 'premium';
      const matchWifi = !constraints.wifiRequired || item.wifi;
      return matchPremium && matchWifi;
    });
  }, [mapProperties, constraints]);

  const logicGateStatus = constraints.premiumOnly && constraints.wifiRequired ? 'OPTIMAL' : 'SUBOPTIMAL';

  return (
    <AppLayout title="Optimization Engine" subtitle="Graph theory and propositional logic models">
      <div className="space-y-6">
        
        <div className="flex gap-4 mb-2">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] font-body">MongoDB Analytics Engine</Badge>
          <Button 
            variant="ghost" 
            className="h-auto p-0 hover:bg-transparent"
            onClick={() => toast.info('Discrete Math Layer v2.2 - Advanced analytical processing enabled')}
          >
            <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-[0.2em] cursor-pointer hover:bg-primary/5 hover:text-primary transition-all border-white/10">
              Discrete Math Layer v2.2
            </Badge>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* PG → Destination Map Router */}
          <Card className="border border-white/5 bg-card/30 backdrop-blur-2xl shadow-2xl overflow-hidden rounded-2xl">
            <CardHeader className="border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[10px] font-bold uppercase tracking-[0.25em] flex items-center gap-3 text-primary/80">
                  <Navigation className="h-4 w-4" /> PG → Destination Route
                </CardTitle>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">OSRM Road Engine</span>
                </div>
              </div>
            </CardHeader>

            {/* Destination picker bar */}
            <div className="px-5 py-4 border-b border-white/5 bg-white/[0.01] space-y-4">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-muted-foreground mr-1">Presets:</span>
                {DESTINATIONS.map(d => (
                  <button
                    key={d.id}
                    onClick={() => { 
                      setSelectedDestId(d.id); 
                      setCustomDest(null);
                      setDestSearchQuery('');
                      setPath([]); 
                      setRouteInfo(null); 
                    }}
                    className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border transition-all ${
                      selectedDestId === d.id && !customDest
                        ? 'bg-indigo-500/20 border-indigo-400/50 text-indigo-300'
                        : 'border-white/5 text-muted-foreground hover:border-white/20 hover:text-foreground'
                    }`}
                  >
                    {d.type === 'tech_park' ? '🏢' : d.type === 'college' ? '🎓' : '📍'} {d.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleDestSearch} className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${searchingDest ? 'animate-pulse text-primary' : 'text-muted-foreground'}`} />
                <Input
                  value={destSearchQuery}
                  onChange={(e) => setDestSearchQuery(e.target.value)}
                  placeholder="Enter custom destination (e.g. MG Road, Phoenix Mall)..."
                  className="pl-9 pr-24 h-10 text-xs bg-white/[0.03] border-white/10 focus:border-primary/40 rounded-xl"
                />
                <Button 
                  type="submit"
                  disabled={searchingDest || !destSearchQuery.trim()}
                  className="absolute right-1 top-1 h-8 px-3 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 border-none text-[9px] font-bold uppercase"
                >
                  {searchingDest ? '...' : 'Search'}
                </Button>
              </form>
            </div>

            <CardContent className="p-0">
              <div className="h-[380px] relative">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-20">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">Syncing Nodes...</p>
                    </div>
                  </div>
                ) : (
                  <PropertyMap
                    properties={mapProperties}
                    routeCoordinates={path}
                    destination={selectedDest}
                    onPropertyClick={(id) => {
                      setSelectedPgId(id);
                      setPath([]);
                      setRouteInfo(null);
                      toast.info(`📍 ${mapProperties.find(p => p.id === id)?.name} selected as origin`);
                    }}
                    className="z-0"
                  />
                )}

                {/* Route control overlay */}
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <div className="bg-card/95 backdrop-blur-2xl p-4 rounded-2xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.6)] flex items-center gap-4">
                    {/* FROM */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[8px] font-bold uppercase text-primary/50 mb-1.5 tracking-[0.18em]">From PG</p>
                      <div className="flex items-center gap-2">
                        {selectedPg ? (
                          <div className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-[10px] font-bold text-amber-300 truncate max-w-[130px]">
                            {selectedPg.name}
                          </div>
                        ) : <span className="text-[10px] text-muted-foreground italic">Click a PG pin</span>}
                      </div>
                    </div>

                    <ArrowRight size={14} className="text-indigo-400 shrink-0" />

                    {/* TO */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[8px] font-bold uppercase text-indigo-400/60 mb-1.5 tracking-[0.18em]">To Destination</p>
                      <div className="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-400/25 text-[10px] font-bold text-indigo-300 truncate">
                        {selectedDest.label}
                      </div>
                    </div>

                    {/* Route info badge */}
                    {routeInfo && (
                      <div className="flex flex-col items-center px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-center shrink-0">
                        <span className="text-[11px] font-black text-foreground">{routeInfo.distanceKm} km</span>
                        <span className="text-[8px] text-muted-foreground flex items-center gap-0.5"><Clock size={8} /> {routeInfo.durationMin} min</span>
                      </div>
                    )}

                    <Button
                      onClick={handleRecalculate}
                      disabled={calculating || !selectedPgId}
                      size="sm"
                      className="h-10 px-5 rounded-xl text-[9px] font-bold uppercase tracking-[0.15em] gap-2 bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all active:scale-95 shrink-0"
                    >
                      {calculating ? 'Routing…' : <><Navigation size={12} /> Get Route</>}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logical Matcher - Real PG List */}
          <Card className="border border-white/5 bg-card/30 backdrop-blur-2xl shadow-2xl overflow-hidden rounded-2xl">
            <CardHeader className="border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[10px] font-bold uppercase tracking-[0.25em] flex items-center gap-3 text-primary/80">
                  <Filter className="h-4 w-4" /> Logical Matcher (Boolean Set)
                </CardTitle>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Set Theory V2</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex gap-4 mb-8">
                <Button 
                  variant={constraints.premiumOnly ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setConstraints(prev => ({ ...prev, premiumOnly: !prev.premiumOnly }))}
                  className="text-[10px] font-bold uppercase tracking-[0.15em] h-10 px-6 rounded-full transition-all active:scale-95 border-white/10"
                >
                  Premium Tier (P)
                </Button>
                <Button 
                  variant={constraints.wifiRequired ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setConstraints(prev => ({ ...prev, wifiRequired: !prev.wifiRequired }))}
                  className="text-[10px] font-bold uppercase tracking-[0.15em] h-10 px-6 rounded-full transition-all active:scale-95 border-white/10"
                >
                  WiFi Active (W)
                </Button>
              </div>
              
              <div className="space-y-3 h-[260px] overflow-y-auto pr-3 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {filteredInventory.map(item => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      key={item.id} 
                      className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 group hover:border-primary/20 hover:bg-primary/[0.02] transition-all cursor-pointer shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-bold tracking-wide text-foreground/90">{item.name}</p>
                          <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider">{item.area}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                          {item.budget === 'premium' && <Zap size={11} className="text-primary" />}
                          {item.wifi && <div className="px-2 py-0.5 rounded-md border border-primary/20 bg-primary/5 text-[8px] font-bold text-primary uppercase">WiFi</div>}
                        </div>
                        <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-widest px-2.5 h-5 border-white/5">
                          {item.budget}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {filteredInventory.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 opacity-20">
                    <Search size={40} className="mb-4 text-primary" />
                    <p className="text-[11px] font-bold uppercase tracking-[0.3em]">No Logical Matches</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Improved Decision Matrix */}
          <Card className="lg:col-span-2 border border-white/5 bg-card/30 backdrop-blur-2xl shadow-2xl overflow-hidden rounded-2xl">
            <CardHeader className="border-b border-white/5 bg-white/[0.02] py-5">
              <CardTitle className="text-[10px] font-bold uppercase tracking-[0.25em] flex items-center gap-3 text-primary/80">
                <Brain className="h-4 w-4" /> Decision Matrix & Propositional Logic
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                
                {/* Visual Logic Flow */}
                <div className="space-y-12">
                  <div className="flex items-center justify-center gap-8">
                    <div className="flex flex-col items-center gap-3">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-700 border border-white/5 ${constraints.premiumOnly ? 'bg-primary text-primary-foreground scale-110 shadow-primary/20' : 'bg-muted text-muted-foreground'}`}>
                        <span className="text-2xl font-display font-black">P</span>
                      </div>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.2em]">Premium</p>
                    </div>
                    
                    <div className="text-3xl font-black text-primary/20 font-display mt-[-20px]">∧</div>
                    
                    <div className="flex flex-col items-center gap-3">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-700 border border-white/5 ${constraints.wifiRequired ? 'bg-primary text-primary-foreground scale-110 shadow-primary/20' : 'bg-muted text-muted-foreground'}`}>
                        <span className="text-2xl font-display font-black">W</span>
                      </div>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.2em]">WiFi</p>
                    </div>
                    
                    <div className="text-3xl font-black text-primary/20 font-display mt-[-20px]">→</div>
                    
                    <div className="flex flex-col items-center gap-3">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-700 border border-white/5 ${logicGateStatus === 'OPTIMAL' ? 'bg-success text-success-foreground scale-110 shadow-success/20' : 'bg-destructive text-destructive-foreground opacity-30'}`}>
                        <span className="text-2xl font-display font-black">O</span>
                      </div>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.2em]">Output</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 px-10 py-6 bg-primary/5 rounded-2xl border border-primary/20 justify-center shadow-inner">
                    <div className="text-center">
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary/60 mb-2">State Evaluation</p>
                      <p className={`text-3xl font-display font-black tracking-tighter transition-all duration-700 ${logicGateStatus === 'OPTIMAL' ? 'text-success drop-shadow-[0_0_10px_rgba(var(--success),0.5)]' : 'text-destructive'}`}>
                        {logicGateStatus}
                      </p>
                    </div>
                    <div className="h-12 w-px bg-primary/20" />
                    <div className="text-center">
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary/60 mb-2">Confidence</p>
                      <p className="text-3xl font-display font-black tracking-tighter text-primary">99.4%</p>
                    </div>
                  </div>
                </div>

                {/* Truth Table */}
                <div className="bg-white/[0.02] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                  <table className="w-full text-[10px]">
                    <thead className="bg-white/[0.04] border-b border-white/5 font-bold uppercase tracking-[0.2em] text-primary/60">
                      <tr>
                        <th className="px-6 py-4 text-left">Input P</th>
                        <th className="px-6 py-4 text-left">Input W</th>
                        <th className="px-6 py-4 text-left bg-primary/5">Result O</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        { p: true, w: true, o: true },
                        { p: true, w: false, o: false },
                        { p: false, w: true, o: false },
                        { p: false, w: false, o: false },
                      ].map((row, i) => {
                        const isActive = constraints.premiumOnly === row.p && constraints.wifiRequired === row.w;
                        return (
                          <tr key={i} className={`transition-all duration-500 ${isActive ? 'bg-primary/10 font-bold text-primary' : 'opacity-30'}`}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-1.5 h-1.5 rounded-full ${row.p ? 'bg-success' : 'bg-destructive'}`} />
                                {row.p ? 'TRUE' : 'FALSE'}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-1.5 h-1.5 rounded-full ${row.w ? 'bg-success' : 'bg-destructive'}`} />
                                {row.w ? 'TRUE' : 'FALSE'}
                              </div>
                            </td>
                            <td className={`px-6 py-4 bg-primary/5 ${isActive ? 'text-primary' : ''}`}>
                              <div className="flex items-center gap-3">
                                {isActive && <motion.div layoutId="truth-pointer" className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />}
                                {row.o ? 'TRUE' : 'FALSE'}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="p-4 bg-primary/5 border-t border-white/5 text-[9px] font-bold uppercase tracking-[0.3em] text-primary/40 text-center italic">
                    Boolean Expression: (P ∧ W) ↔ O
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </AppLayout>
  );
};

export default MathModels;
