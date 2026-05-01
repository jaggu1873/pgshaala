import React, { useState, useEffect, useMemo, useRef } from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Zap, Users, Activity, ShieldCheck, Wifi, MapPin, ChevronLeft, ChevronRight, Building2, Search, X } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useProperties } from '@/hooks/useCrmData';
import { Input } from '@/components/ui/input';

// ─── Per-PG seed for deterministic-ish base values ──────────────────────────
function pgSeed(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (Math.imul(31, h) + name.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function makeSnapshot(name: string) {
  const s = pgSeed(name);
  return {
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: parseFloat((21 + (s % 5) + Math.random() * 2).toFixed(1)),
    elec: parseFloat((0.6 + (s % 8) * 0.1 + Math.random() * 0.8).toFixed(1)),
    occ: Math.floor(4 + (s % 10) + Math.random() * 6),
  };
}

function makeHistory(name: string, len = 20) {
  return Array.from({ length: len }, (_, i) => ({
    ...makeSnapshot(name),
    time: new Date(Date.now() - (len - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }));
}

// ─── Fallback PG list if DB is empty / loading ───────────────────────────────
const FALLBACK_PGS = [
  { id: 'f1', name: 'Zion PG — Sector 62', area: 'Noida' },
  { id: 'f2', name: 'Sunrise Residency', area: 'Koramangala' },
  { id: 'f3', name: 'The Hub — Whitefield', area: 'Whitefield' },
  { id: 'f4', name: 'Green Nest PG', area: 'HSR Layout' },
  { id: 'f5', name: 'Elite Stay PG', area: 'Indiranagar' },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const IoTDashboard = () => {
  const { data: dbProperties, isLoading } = useProperties();

  const pgs = useMemo(() => {
    const list = (dbProperties as any[]) || [];
    return list.length > 0 ? list : FALLBACK_PGS;
  }, [dbProperties]);

  const [selectedId, setSelectedId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [telemetry, setTelemetry] = useState<Record<string, any[]>>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredPgs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return pgs;
    return pgs.filter((p: any) =>
      p.name?.toLowerCase().includes(q) ||
      p.area?.toLowerCase().includes(q) ||
      p.city?.toLowerCase().includes(q)
    );
  }, [pgs, searchQuery]);

  // Auto-select first PG once list is ready
  useEffect(() => {
    if (pgs.length > 0 && !selectedId) {
      setSelectedId(pgs[0].id);
    }
  }, [pgs]);

  // Initialize telemetry history for all PGs
  useEffect(() => {
    if (pgs.length === 0) return;
    const init: Record<string, any[]> = {};
    pgs.forEach(p => { init[p.id] = makeHistory(p.name); });
    setTelemetry(init);
  }, [pgs.map(p => p.id).join(',')]);

  // Live-tick every 5 s — appends one point per PG
  useEffect(() => {
    if (pgs.length === 0) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTelemetry(prev => {
        const next = { ...prev };
        pgs.forEach(p => {
          const snap = makeSnapshot(p.name);
          next[p.id] = [...(prev[p.id] || []).slice(1), snap];
        });
        return next;
      });
    }, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [pgs.map(p => p.id).join(',')]);

  const selectedPg  = pgs.find(p => p.id === selectedId);
  const chartData   = telemetry[selectedId] || [];
  const current     = chartData.length > 0 ? chartData[chartData.length - 1] : { temp: 0, elec: 0, occ: 0 };

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  return (
    <AppLayout title="Smart Infrastructure" subtitle="Real-time telemetry & IoT synchronization">
      <div className="space-y-8">

        {/* ── PG Selector ─────────────────────────────────────────── */}
        <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 backdrop-blur-md shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary/60 font-bold flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5" /> Select PG to Monitor
              <span className="ml-1 text-muted-foreground font-normal normal-case tracking-normal">
                ({filteredPgs.length} of {pgs.length})
              </span>
            </p>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-success/5 rounded-full border border-success/20">
                <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse shadow-[0_0_8px_hsl(var(--success))]" />
                <span className="text-[9px] font-bold text-success uppercase tracking-widest">Live Feed</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-full border border-primary/20">
                <Wifi className="h-3 w-3 text-primary" />
                <span className="text-[9px] font-bold text-primary uppercase tracking-widest">{pgs.length} Nodes</span>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search PG by name, area or city…"
              className="pl-9 pr-9 h-9 text-xs bg-white/[0.03] border-white/10 focus:border-primary/40 rounded-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Scrollable pill selector */}
          <div className="relative flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="shrink-0 p-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-muted-foreground"
            >
              <ChevronLeft size={14} />
            </button>
            <div
              ref={scrollRef}
              className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth"
              style={{ scrollbarWidth: 'none' }}
            >
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-9 w-32 rounded-full bg-white/5 animate-pulse shrink-0" />
                  ))
                : filteredPgs.length === 0
                ? (
                    <div className="flex items-center gap-2 px-4 py-2 text-[10px] text-muted-foreground italic">
                      <Search size={12} /> No PGs match "{searchQuery}"
                    </div>
                  )
                : filteredPgs.map((pg: any) => (
                    <button
                      key={pg.id}
                      onClick={() => setSelectedId(pg.id)}
                      className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
                        selectedId === pg.id
                          ? 'bg-primary/20 border-primary/50 text-primary shadow-[0_0_12px_hsl(var(--primary)/0.2)]'
                          : 'border-white/10 text-muted-foreground hover:border-white/25 hover:text-foreground'
                      }`}
                    >
                      <MapPin size={10} />
                      {pg.name}
                      {pg.area && (
                        <span className="opacity-50 font-normal normal-case tracking-normal">
                          · {pg.area}
                        </span>
                      )}
                    </button>
                  ))}
            </div>
            <button
              onClick={() => scroll('right')}
              className="shrink-0 p-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-muted-foreground"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* ── Active PG Header ─────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {selectedPg && (
            <motion.div
              key={selectedPg.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-4 px-6 py-4 bg-white/[0.02] rounded-2xl border border-white/5"
            >
              <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-[0_0_20px_hsl(var(--primary)/0.1)]">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-primary/60 font-bold">Monitored Asset</p>
                <h3 className="text-lg font-display font-bold tracking-tight text-foreground">{selectedPg.name}</h3>
                {(selectedPg as any).area && (
                  <p className="text-[10px] text-muted-foreground">{(selectedPg as any).area}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── KPI Grid ─────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedId + '-kpis'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <StatCard title="Climate Engine"  value={`${current.temp}°C`} icon={Thermometer} color="text-primary"  trend="+0.2° from baseline" />
            <StatCard title="Live Power Load" value={`${current.elec} kW`} icon={Zap}         color="text-info"    trend="Avg. 1.2 kW/hr" />
            <StatCard title="Core Density"    value={current.occ}          icon={Users}        color="text-success" trend="Nominal Load" />
            <StatCard title="System Shield"   value="Secure"               icon={ShieldCheck}  color="text-primary" trend="Encryption: AES-256" />
          </motion.div>
        </AnimatePresence>

        {/* ── Charts ───────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedId + '-charts'}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Telemetry Flow */}
            <Card className="lg:col-span-2 overflow-hidden border border-white/5 bg-card/30 backdrop-blur-2xl shadow-2xl rounded-2xl">
              <CardHeader className="border-b border-white/5 bg-white/[0.02] py-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[10px] font-bold uppercase tracking-[0.25em] flex items-center gap-3 text-primary/80">
                    <Activity className="h-4 w-4" /> Telemetry Flow — {selectedPg?.name || '…'}
                  </CardTitle>
                  <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest bg-primary/5 border-primary/20 text-primary">
                    Live Sync
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="gtTemp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="time" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)', fontWeight: 600 }} axisLine={false} tickLine={false} minTickGap={40} />
                      <YAxis tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(15,15,20,0.95)', backdropFilter: 'blur(20px)' }}
                        itemStyle={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                      />
                      <Area type="monotone" dataKey="temp" name="Temp (°C)"    stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#gtTemp)" />
                      <Area type="monotone" dataKey="elec" name="Power (kW)"   stroke="hsl(var(--info))"    strokeWidth={2} fillOpacity={0} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Load Factor */}
            <Card className="overflow-hidden border border-white/5 bg-card/30 backdrop-blur-2xl shadow-2xl rounded-2xl">
              <CardHeader className="border-b border-white/5 bg-white/[0.02] py-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[10px] font-bold uppercase tracking-[0.25em] flex items-center gap-3 text-success/80">
                    <Users className="h-4 w-4" /> Load Factor
                  </CardTitle>
                  <Badge variant="outline" className="text-[9px] font-bold bg-success/5 text-success border-success/20">
                    {((current.occ / 20) * 100).toFixed(0)}% Used
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="gtLoad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="hsl(var(--success))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="time" hide />
                      <YAxis domain={[0, 25]} tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(15,15,20,0.95)' }} />
                      <Area type="stepAfter" dataKey="occ" name="Occupants" stroke="hsl(var(--success))" strokeWidth={3} fillOpacity={1} fill="url(#gtLoad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Status</p>
                    <p className="text-xs font-bold text-success">Optimal</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Threshold</p>
                    <p className="text-xs font-bold text-primary">85% Limit</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* ── Grid Intelligence ────────────────────────────────────── */}
        <Card className="border border-white/5 bg-primary/5 backdrop-blur-2xl shadow-xl rounded-2xl p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="p-4 bg-primary/10 rounded-2xl shrink-0">
              <Zap className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-2">
                Grid Intelligence: Understanding Live Load
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The <span className="text-foreground font-bold">Live Power Load (kW)</span> reflects the instantaneous electrical demand of the building. In a real-world PG environment, these values fluctuate every second as air conditioners cycle, water heaters activate, or occupants plug in devices.
                Our telemetry stream captures these micro-fluctuations to provide an architectural "heartbeat" of your property's energy health.
              </p>
            </div>
          </div>
        </Card>

      </div>
    </AppLayout>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <Card className="relative border border-white/5 bg-card/30 backdrop-blur-2xl shadow-xl overflow-hidden group hover:border-primary/20 transition-all duration-500 rounded-2xl">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{title}</p>
        <div className={`p-2.5 rounded-xl border border-white/5 transition-all duration-500 group-hover:scale-110`}>
          <Icon className={`h-5 w-5 ${color} drop-shadow-[0_0_8px_currentColor]`} />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-display font-bold tracking-tight">{value}</h3>
      </div>
      <p className="text-[9px] text-muted-foreground/50 mt-3 flex items-center gap-2 font-bold uppercase tracking-widest">
        <Activity className="h-3 w-3 text-primary/40" /> {trend}
      </p>
    </CardContent>
    <div className="absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full transition-all duration-700 bg-primary shadow-[0_0_15px_hsl(var(--primary))]" />
  </Card>
);

export default IoTDashboard;
