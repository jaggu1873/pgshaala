import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useLeads } from '@/hooks/useCrmData';
import { useDbMatchBeds } from '@/hooks/useZones';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Sparkles, MapPin, IndianRupee, Loader2, Zap, Heart, X, Shield, Activity, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

function parseBudget(raw: string): number {
    if (!raw) return 0;
    const cleaned = raw.toLowerCase().replace(/[₹,\s]/g, '');
    const match = cleaned.match(/(\d+(?:\.\d+)?)\s*(k|l|lakh|cr)?/);
    if (!match) return 0;
    let val = parseFloat(match[1]);
    const suffix = match[2];
    if (suffix === 'k') val *= 1000;
    else if (suffix === 'l' || suffix === 'lakh') val *= 100000;
    else if (suffix === 'cr') val *= 10000000;
    return val;
}

const PLACEHOLDER_IMAGES = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1e52d34190?w=800&q=80',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80',
    'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80'
];

export default function Matching() {
    const { data: leads } = useLeads();
    const [selectedLead, setSelectedLead] = useState<string>('');
    const dbMatch = useDbMatchBeds(selectedLead);
    const [matches, setMatches] = useState<any[]>([]);
    const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);

    const activeLeads = (leads || []).filter(l => l.status !== 'booked' && l.status !== 'lost');
    const lead = activeLeads.find(l => l.id === selectedLead);

    const handleMatch = async () => {
        if (!lead) return;

        const { data } = await dbMatch.refetch();

        const enriched = (data || []).map((m: any, i: number) => ({
            ...m,
            image: PLACEHOLDER_IMAGES[i % PLACEHOLDER_IMAGES.length],
            amenities: ['High-Speed WiFi', 'Daily Cleaning', '24/7 Security', 'AC'].slice(0, 2 + (i % 3))
        }));

        setMatches(enriched);
        setExitDirection(null);
    };

    const handleSelectLead = (id: string) => {
        setSelectedLead(id);
        setMatches([]);
        setExitDirection(null);
    };

    const handleSkip = (id: string) => {
        setExitDirection('left');
        // Give state time to update before removing from array, so exit animation picks up the direction
        setTimeout(() => {
            setMatches(prev => prev.filter(m => m.bed_id !== id));
        }, 10);
    };

    const handleLike = (id: string) => {
        setExitDirection('right');
        setTimeout(() => {
            setMatches(prev => prev.filter(m => m.bed_id !== id));
        }, 10);
    };

    const topProperty = matches.length > 0 ? matches[0] : null;

    return (
        <AppLayout title="Neural Match Engine" subtitle="Quantum-assisted property synchronization">
            <div className="relative -m-6 md:-m-10 p-6 md:p-10 min-h-[calc(100vh-80px)] overflow-hidden bg-[#05050A] rounded-tl-3xl shadow-inner text-white flex flex-col">

                {/* Cyber Neon Background Blobs */}
                <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-cyan-500/20 rounded-full blur-[140px] mix-blend-screen pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-fuchsia-600/15 rounded-full blur-[160px] mix-blend-screen pointer-events-none" />
                <div className="absolute top-[30%] left-[40%] w-[30vw] h-[30vw] bg-violet-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

                {/* Cyber Grid Overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] pointer-events-none mix-blend-screen opacity-50" />

                {/* Header Controls (Deep Glass) */}
                <div className="relative z-20 mb-8 p-6 rounded-[2rem] bg-black/40 backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.8)] flex flex-col sm:flex-row items-end gap-5 group w-full max-w-7xl mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-fuchsia-500/5 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    <div className="flex-1 w-full relative z-10">
                        <label className="text-[10px] font-black tracking-[0.25em] text-cyan-400 uppercase mb-2 block flex items-center gap-2">
                            <Activity size={12} className="animate-pulse" /> SYSTEM // INITIALIZE MATCH
                        </label>
                        <div className="text-foreground">
                            <Select value={selectedLead} onValueChange={handleSelectLead}>
                                <SelectTrigger className="h-14 bg-black/50 backdrop-blur-md border-white/10 text-white hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all focus:ring-cyan-500 rounded-2xl text-base">
                                    <SelectValue placeholder="Select target parameter..." />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-950 border-white/10 text-white">
                                    {activeLeads.map(l => (
                                        <SelectItem key={l.id} value={l.id} className="hover:bg-cyan-500/20 focus:bg-cyan-500/20 cursor-pointer">
                                            <span className="font-bold text-cyan-50">{l.name}</span> <span className="text-white/40 px-2">|</span> <span className="text-white/70">{l.preferred_location || 'Any'}</span> <span className="text-white/40 px-2">|</span> <span className="text-fuchsia-300">{l.budget || 'Any'}</span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button
                        onClick={handleMatch}
                        disabled={!lead || dbMatch.isFetching}
                        className="relative z-10 gap-2 h-14 px-8 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black tracking-[0.15em] uppercase border-0 shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] transition-all duration-300 w-full sm:w-auto"
                    >
                        {dbMatch.isFetching ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                        Execute Sync
                    </Button>
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row gap-12 flex-1 max-w-7xl w-full mx-auto items-center lg:items-start justify-center">

                    {/* Left Side: Cards Area (Tinder Stack) */}
                    <div className="w-full lg:w-[420px] shrink-0 relative h-[580px] flex items-center justify-center perspective-[1000px]">
                        {!lead && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center text-cyan-500/40 bg-black/20 backdrop-blur-xl border border-white/5 rounded-[3rem]">
                                <Activity size={64} className="mb-4 opacity-20" />
                                <p className="text-sm font-bold tracking-widest uppercase text-center px-8">Awaiting Parameter Input</p>
                            </motion.div>
                        )}
                        {lead && matches.length === 0 && !dbMatch.isFetching && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center text-fuchsia-500/40 bg-black/20 backdrop-blur-xl border border-white/5 rounded-[3rem]">
                                <Zap size={64} className="mb-4 opacity-20" />
                                <p className="text-sm font-bold tracking-widest uppercase">Zero Matches Found</p>
                                <p className="text-xs mt-2 opacity-60 tracking-wider">Recalibrate search vectors.</p>
                            </motion.div>
                        )}

                        {matches.length > 0 && (
                            <div className="relative w-full h-full">
                                <AnimatePresence>
                                    {[...matches].reverse().map((m, i) => {
                                        // Reverse index so index 0 is top
                                        const originalIndex = matches.length - 1 - i;
                                        const isTop = originalIndex === 0;

                                        return (
                                            <PGCard
                                                key={m.bed_id}
                                                index={originalIndex}
                                                isTop={isTop}
                                                property={m}
                                                exitDirection={exitDirection}
                                                onLike={() => handleLike(m.bed_id)}
                                                onSkip={() => handleSkip(m.bed_id)}
                                            />
                                        );
                                    })}
                                </AnimatePresence>

                                {/* Swipe Instructions */}
                                <div className="absolute -bottom-10 left-0 right-0 flex justify-between px-6 text-white/30 text-[10px] font-bold tracking-[0.2em] uppercase pointer-events-none">
                                    <span className="flex items-center gap-1"><ArrowLeft size={12} /> Swipe Reject</span>
                                    <span className="flex items-center gap-1">Swipe Sync <ArrowRight size={12} /></span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Side: Match Panel (Sticky/Syncs to top card) */}
                    <div className="flex-1 w-full lg:max-w-[500px]">
                        <AnimatePresence mode="wait">
                            {topProperty ? (
                                <MatchPanel key={topProperty.bed_id} property={topProperty} lead={lead} />
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="h-[580px] border border-white/5 rounded-[3rem] bg-white/[0.01] backdrop-blur-xl flex flex-col items-center justify-center text-center px-10"
                                >
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                        <Activity size={32} className="text-white/20" />
                                    </div>
                                    <p className="text-white/30 text-xs font-bold tracking-[0.2em] uppercase">Panel Offline</p>
                                    <p className="text-white/10 text-[10px] uppercase tracking-widest mt-2">Initialize match sequence to load data</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}

// ----------------------------------------------------------------------
// Sub Components
// ----------------------------------------------------------------------

const PGCard = ({ property, index, isTop, exitDirection, onLike, onSkip }: any) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-10, 10]);

    // As we drag right, fuchsia opacity goes up. As we drag left, gray opacity goes up.
    const likeOpacity = useTransform(x, [0, 150], [0, 1]);
    const skipOpacity = useTransform(x, [0, -150], [0, 1]);

    const handleDragEnd = (event: any, info: any) => {
        const threshold = 100;
        if (info.offset.x > threshold) {
            onLike();
        } else if (info.offset.x < -threshold) {
            onSkip();
        }
    };

    const variants = {
        enter: { opacity: 0, scale: 0.8, y: 50 },
        center: ({ idx }: any) => ({
            opacity: 1,
            scale: 1 - idx * 0.05,
            y: idx * 25,
            zIndex: 100 - idx,
            transition: { type: "spring", stiffness: 300, damping: 25 } as any
        }),
        exit: ({ dir }: any) => ({
            x: dir === 'left' ? -300 : dir === 'right' ? 300 : 0,
            opacity: 0,
            rotate: dir === 'left' ? -20 : dir === 'right' ? 20 : 0,
            transition: { duration: 0.3 }
        })
    };

    return (
        <motion.div
            custom={{ idx: index, dir: exitDirection }}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            drag={isTop ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragEnd={handleDragEnd}
            style={{ x: isTop ? x : 0, rotate: isTop ? rotate : 0 }}
            whileTap={isTop ? { cursor: "grabbing", scale: 0.98 } : {}}
            className={`absolute top-0 left-0 right-0 h-full w-full overflow-hidden rounded-[3rem] bg-[#0A0A10]/90 backdrop-blur-3xl border ${isTop ? 'cursor-grab border-cyan-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(34,211,238,0.2)]' : 'border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]'}`}
        >
            {/* Hover Glare */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none z-10" />

            {/* Action Overlays (Like/Skip) */}
            {isTop && (
                <>
                    <motion.div style={{ opacity: likeOpacity }} className="absolute inset-0 bg-fuchsia-500/20 backdrop-blur-sm pointer-events-none z-30 flex items-center justify-center">
                        <div className="px-8 py-4 rounded-3xl border-4 border-fuchsia-400 rotate-12 bg-black/50 backdrop-blur-md">
                            <span className="text-4xl font-black text-fuchsia-400 tracking-widest uppercase drop-shadow-[0_0_15px_rgba(217,70,239,0.8)]">Sync</span>
                        </div>
                    </motion.div>
                    <motion.div style={{ opacity: skipOpacity }} className="absolute inset-0 bg-slate-500/20 backdrop-blur-sm pointer-events-none z-30 flex items-center justify-center">
                        <div className="px-8 py-4 rounded-3xl border-4 border-white/50 -rotate-12 bg-black/50 backdrop-blur-md">
                            <span className="text-4xl font-black text-white/80 tracking-widest uppercase drop-shadow-md">Reject</span>
                        </div>
                    </motion.div>
                </>
            )}

            {/* Image Section */}
            <div className="relative h-[55%] w-full overflow-hidden">
                <img src={property.image} alt="Property" className="w-full h-full object-cover pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A10] via-[#0A0A10]/20 to-transparent pointer-events-none" />

                {/* Match Badge */}
                <div className="absolute top-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-xl rounded-full text-[10px] uppercase tracking-widest font-black text-cyan-300 border border-cyan-500/30 flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                    <Sparkles size={14} className="text-cyan-400 animate-pulse" /> {property.match_score}% Sync
                </div>
            </div>

            {/* Details & Actions Section */}
            <div className="p-8 flex flex-col justify-between h-[45%] relative z-20">

                <div>
                    <h3 className="text-3xl font-black text-white leading-tight tracking-wide">{property.property_name}</h3>
                    <p className="text-xs font-bold text-white/50 flex items-center gap-1.5 mt-2 uppercase tracking-[0.2em]"><MapPin size={12} className="text-fuchsia-400" /> {property.property_area}</p>
                </div>

                <div className="flex items-end justify-between mt-2">
                    <div className="flex flex-col gap-3">
                        <span className="inline-block px-3.5 py-1.5 bg-fuchsia-500/10 rounded-xl text-[10px] uppercase tracking-wider font-bold text-fuchsia-300 border border-fuchsia-500/30 shadow-[0_0_10px_rgba(217,70,239,0.1)] w-max">Room {property.room_number}</span>
                        <div className="flex flex-wrap gap-2">
                            {property.amenities.map((am: string) => (
                                <span key={am} className="px-2.5 py-1 bg-white/[0.05] rounded-lg text-[9px] uppercase tracking-wider font-bold text-white/50 border border-white/5">{am}</span>
                            ))}
                        </div>
                    </div>

                    <div className="text-right shrink-0">
                        <p className="text-xs uppercase tracking-[0.2em] font-bold text-white/30 mb-1">Tariff</p>
                        <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)] flex items-center justify-end"><IndianRupee size={22} strokeWidth={3} className="text-cyan-400 mr-1" />{Number(property.rent_per_bed).toLocaleString()}</p>
                    </div>
                </div>

                {/* Actions (Only interactive if top) */}
                <div className={`flex items-center justify-center gap-6 mt-4 pt-6 border-t border-white/10 ${!isTop && 'opacity-50 pointer-events-none'}`}>
                    <button
                        onClick={(e) => { e.stopPropagation(); onSkip(); }}
                        disabled={!isTop}
                        className="w-16 h-16 flex items-center justify-center rounded-full bg-black/80 text-white/40 hover:bg-white/10 hover:text-white hover:rotate-[-15deg] transition-all duration-300 border border-white/10 hover:border-white/30 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                    >
                        <X size={28} />
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); onLike(); }}
                        disabled={!isTop}
                        className="w-16 h-16 flex items-center justify-center rounded-full bg-fuchsia-500/10 text-fuchsia-400 hover:bg-fuchsia-500 hover:text-white border border-fuchsia-500/30 hover:border-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,0.2)] hover:shadow-[0_0_40px_rgba(217,70,239,0.6)] hover:scale-110 transition-all duration-300"
                    >
                        <Heart size={28} className="fill-current" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};


const MatchPanel = ({ property, lead }: any) => {
    const budgetLead = parseBudget(lead.budget);
    const rent = Number(property.rent_per_bed);
    let budgetMatch = 100;
    if (budgetLead > 0 && rent > 0) {
        budgetMatch = Math.min(100, Math.round((budgetLead / rent) * 100));
    }
    const locationMatch = lead.preferred_location?.toLowerCase() === property.property_area?.toLowerCase() ? 100 : 65;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full h-full"
        >
            <div className="bg-black/60 backdrop-blur-[40px] rounded-[3rem] border border-white/10 p-10 shadow-[0_8px_32px_rgba(0,0,0,0.8)] flex flex-col gap-10 h-full relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-cyan-500/20 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[200px] h-[200px] bg-fuchsia-500/10 blur-[60px] rounded-full pointer-events-none" />

                {/* Score Header */}
                <div className="text-center pb-10 border-b border-white/10 relative z-10">
                    <div className="w-40 h-40 mx-auto bg-black rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(34,211,238,0.15)] mb-8 relative border border-white/5">
                        <div className="absolute inset-3 bg-slate-950 rounded-full flex items-center justify-center shadow-inner">
                            <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-fuchsia-500 drop-shadow-lg">{property.match_score}</span>
                        </div>
                        <svg className="absolute inset-0 w-full h-full -rotate-90 transform drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                            <circle cx="80" cy="80" r="76" className="stroke-white/5 stroke-[2] fill-none" />
                            <motion.circle
                                initial={{ strokeDasharray: "0 477" }}
                                animate={{ strokeDasharray: `${(property.match_score / 100) * 477} 477` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                cx="80" cy="80" r="76"
                                className="stroke-cyan-400 stroke-[6] fill-none"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-black tracking-[0.2em] uppercase text-white">System Sync</h2>
                    <p className="text-xs font-bold tracking-widest text-cyan-400 mt-2 uppercase">Target: {property.property_name}</p>
                </div>

                {/* Progress Metrics */}
                <div className="flex flex-col gap-8 relative z-10">
                    <div className="space-y-3">
                        <div className="flex justify-between text-xs tracking-widest uppercase font-bold text-white/70">
                            <span>Fiscal Parameter</span>
                            <span className="text-fuchsia-400">{budgetMatch}%</span>
                        </div>
                        <div className="h-2 w-full bg-black rounded-full overflow-hidden shadow-inner border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${budgetMatch}%` }}
                                transition={{ duration: 1, delay: 0.1 }}
                                className="h-full bg-gradient-to-r from-fuchsia-600 to-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.5)] relative"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-xs tracking-widest uppercase font-bold text-white/70">
                            <span>Spatial Parameter</span>
                            <span className="text-cyan-400">{locationMatch}%</span>
                        </div>
                        <div className="h-2 w-full bg-black rounded-full overflow-hidden shadow-inner border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${locationMatch}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] relative"
                            />
                        </div>
                    </div>
                </div>

                {/* Highlights */}
                <div className="flex-1 mt-4 space-y-4 relative z-10">
                    <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em]">Key Identifiers</h3>

                    <div className="flex items-center gap-4 bg-white/[0.02] p-5 rounded-2xl border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-300 cursor-default group">
                        <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 shrink-0 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all">
                            <Shield size={22} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white tracking-wide uppercase">Secured Node</p>
                            <p className="text-[10px] font-bold tracking-widest uppercase text-white/40 mt-1">Verified by Central</p>
                        </div>
                    </div>
                </div>

                <Button className="w-full mt-auto h-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black tracking-widest uppercase text-base hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] border border-cyan-400/50 hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10 overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjIteSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] mix-blend-overlay opacity-30 group-hover:opacity-60 transition-opacity" />
                    Initiate Booking
                </Button>
            </div>
        </motion.div>
    );
};
