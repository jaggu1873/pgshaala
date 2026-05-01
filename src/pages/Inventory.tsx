import { useState, useMemo } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useInventoryOSData } from '@/hooks/useInventoryData';
import { Search, ChevronDown, CalendarDays, FileText, DollarSign, MapPin, Grid2X2, List } from 'lucide-react';
import { motion } from 'framer-motion';

const Inventory = () => {
  const { data: properties, isLoading } = useInventoryOSData();

  const [search, setSearch] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [selectedArea, setSelectedArea] = useState<string>('All Areas');
  const [expandedProps, setExpandedProps] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedProps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const areas = useMemo(() => {
    if (!properties) return [];
    const areaMap: Record<string, number> = {};
    properties.forEach((p: any) => {
      const a = p.area || 'Unknown';
      areaMap[a] = (areaMap[a] || 0) + 1;
    });
    return Object.entries(areaMap).sort((a, b) => a[0].localeCompare(b[0]));
  }, [properties]);

  const filteredProps = useMemo(() => {
    if (!properties) return [];
    return properties.filter((p: any) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          (p.address || '').toLowerCase().includes(search.toLowerCase());
      const matchArea = selectedArea === 'All Areas' || p.area === selectedArea;
      return matchSearch && matchArea;
    });
  }, [properties, search, selectedArea]);

  const stats = useMemo(() => {
    if (!properties) return { live: 0, sched: 0, occ: 0 };
    return {
      live: properties.length * 10, // Mock stats to match UI
      sched: 1,
      occ: 0
    };
  }, [properties]);

  return (
    <AppLayout title="Inventory OS" subtitle="Platform Truth">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-display tracking-tight">Inventory OS</h1>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs bg-background text-foreground border-border rounded-full px-3 py-0.5">ALL</Badge>
                <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20 rounded-full px-3 py-0.5">{stats.live} LIVE</Badge>
                <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/20 rounded-full px-3 py-0.5">{stats.sched} SCHED</Badge>
                <Badge variant="outline" className="text-xs bg-rose-500/10 text-rose-600 border-rose-500/20 rounded-full px-3 py-0.5">{stats.occ} OCC</Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-1">
              <Button variant="ghost" size="icon" className="w-8 h-8 rounded-md bg-background shadow-sm"><Grid2X2 size={16} /></Button>
              <Button variant="ghost" size="icon" className="w-8 h-8 rounded-md"><List size={16} /></Button>
            </div>
          </div>

          {/* Zones & Search */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-4 py-1 text-xs cursor-pointer">All Zones</Badge>
              {['KORA', 'MWB', 'MTP', 'YPR'].map(z => (
                <Badge key={z} variant="outline" className="bg-background text-muted-foreground hover:text-foreground border-border rounded-full px-4 py-1 text-xs cursor-pointer">
                  {z}
                </Badge>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search PG..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                  className="pl-9 h-10 bg-card rounded-xl border-border" 
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[160px] h-10 rounded-xl bg-card border-border">
                  <SelectValue placeholder="All Genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="boys">Boys</SelectItem>
                  <SelectItem value="girls">Girls</SelectItem>
                  <SelectItem value="coed">Co-ed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Property Grid */}
          {isLoading ? (
            <div className="text-center py-20 text-muted-foreground">Loading Inventory OS...</div>
          ) : filteredProps.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground bg-card rounded-xl border border-dashed border-border">
              <p>No properties match your filters.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredProps.map((p: any) => {
                const totalRooms = p.rooms?.length || 0;
                const isExpanded = expandedProps[p.id];
                const priceMatch = p.price_range?.match(/\d+/g);
                const minPrice = priceMatch ? Math.min(...priceMatch.map(Number)) : null;

                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    key={p.id} 
                    className="flex flex-col bg-card border border-rose-500/20 rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-5 flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-base flex items-center gap-2">
                            {p.name.toUpperCase()}
                            <span className="text-[10px] bg-orange-100 dark:bg-orange-950/30 text-orange-600 px-1.5 py-0.5 rounded font-mono">GP-IQ{(p.id.substring(0,3)).toUpperCase()}</span>
                          </h3>
                          <div className="flex items-start gap-2 mt-2 text-xs text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1 shrink-0" />
                            <p className="line-clamp-2 leading-relaxed">{p.address || p.area}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <p className="font-bold text-orange-500 text-sm">
                            {minPrice ? `FROM ₹${minPrice}.0K/MO` : p.price_range || 'Contact for price'}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                            {p.price_range ? `T:₹${priceMatch?.[0] || 0}k D:₹${priceMatch?.[1] || 0}k` : 'T: - D: -'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-4">
                        <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-200 text-[10px] rounded px-2 py-0.5 font-semibold tracking-wide">
                          BOYS
                        </Badge>
                        <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-200 text-[10px] rounded px-2 py-0.5 font-semibold tracking-wide">
                          MID
                        </Badge>
                        <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 text-[10px] rounded px-2 py-0.5 font-mono">
                          MGR: {p.property_manager || 'N/A'}
                        </Badge>
                      </div>
                    </div>

                    <div className="border-t border-rose-500/10">
                      <Collapsible open={isExpanded} onOpenChange={() => toggleExpand(p.id)}>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" className="w-full justify-between rounded-none h-10 px-5 text-xs font-semibold hover:bg-rose-50/50 dark:hover:bg-rose-950/20">
                            ROOM INVENTORY ({totalRooms})
                            <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-5 py-3 bg-secondary/30 text-xs border-t border-border">
                          {totalRooms > 0 ? (
                            <div className="space-y-2">
                              {p.rooms.map((r: any) => (
                                <div key={r.id} className="flex justify-between items-center py-1">
                                  <span>Room {r.room_number}</span>
                                  <Badge variant="outline" className="text-[10px]">{r.status}</Badge>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-center">No rooms configured.</p>
                          )}
                        </CollapsibleContent>
                      </Collapsible>
                    </div>

                    <div className="p-4 border-t border-rose-500/10 flex items-center justify-between bg-card">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl font-semibold text-xs border-2 shadow-sm flex gap-2">
                          <CalendarDays size={14} /> TOUR
                        </Button>
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-2 shadow-sm">
                          <FileText size={14} />
                        </Button>
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-2 shadow-sm">
                          <DollarSign size={14} />
                        </Button>
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-2 shadow-sm">
                          <MapPin size={14} />
                        </Button>
                      </div>
                      <Button variant="link" className="text-xs text-muted-foreground hover:text-foreground">
                        Details
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-card border-2 border-rose-500/10 rounded-2xl p-5 sticky top-20 shadow-sm">
            <h2 className="font-mono text-xs font-bold text-muted-foreground tracking-widest mb-4">AREAS WITH PGs</h2>
            
            <div className="relative mb-4">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search area..." 
                className="pl-8 h-9 text-xs bg-secondary/50 border-border rounded-lg" 
              />
            </div>

            <Button 
              variant="default" 
              className={`w-full justify-start h-10 mb-2 rounded-xl text-sm ${selectedArea === 'All Areas' ? 'bg-foreground text-background' : 'bg-transparent text-foreground hover:bg-secondary border'}`}
              onClick={() => setSelectedArea('All Areas')}
            >
              All Areas
            </Button>

            <div className="space-y-1 mt-3">
              {areas.map(([area, count]) => (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedArea === area ? 'bg-rose-50 dark:bg-rose-950/30 font-medium' : 'hover:bg-secondary/50'
                  }`}
                >
                  <span className="text-foreground/80">{area}</span>
                  <span className="text-orange-500 bg-orange-100 dark:bg-orange-950/50 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
};

export default Inventory;
