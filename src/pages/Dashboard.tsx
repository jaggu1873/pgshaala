import AppLayout from '@/components/AppLayout';
import KpiCard from '@/components/KpiCard';
import OnboardingCard from '@/components/OnboardingCard';
import { useDashboardStats, useLeads, useAgentStats } from '@/hooks/useCrmData';
import { useAllReminders, useCompleteFollowUp } from '@/hooks/useLeadDetails';
import { useBookingStats } from '@/hooks/useBookings';
import { PIPELINE_STAGES, SOURCE_LABELS } from '@/types/crm';
import { Users, Clock, CalendarCheck, CheckCircle, TrendingUp, AlertTriangle, Timer, Star, IndianRupee, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { format, isPast } from 'date-fns';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, memo } from 'react';

const PIE_COLORS = [
  '#8b5cf6', '#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#6366f1'
];

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: leads, isLoading: leadsLoading } = useLeads();
  const { data: agentStats } = useAgentStats();
  const { data: bookingStats } = useBookingStats();
  const { data: reminders } = useAllReminders();
  const completeFollowUp = useCompleteFollowUp();
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('dashboard-leads-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        qc.invalidateQueries({ queryKey: ['leads'] });
        qc.invalidateQueries({ queryKey: ['dashboard-stats'] });
        qc.invalidateQueries({ queryKey: ['agent-stats'] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [qc]);

  const pipelineData = useMemo(() => PIPELINE_STAGES.map(stage => ({
    name: stage.label.split(' ')[0],
    count: leads?.filter(l => l.status === stage.key).length || 0,
  })), [leads]);

  const sourceData = useMemo(() => leads
    ? Object.entries(
      leads.reduce((acc, l) => {
        acc[l.source] = (acc[l.source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([key, value]) => ({ name: SOURCE_LABELS[key as keyof typeof SOURCE_LABELS] || key, value }))
    : [], [leads]);

  const newLeads = useMemo(() => leads?.filter(l => l.status === 'new') || [], [leads]);
  const hotLeads = useMemo(() => leads?.filter(l => ((l as any).lead_score ?? 0) >= 70).slice(0, 5) || [], [leads]);
  const overdueReminders = useMemo(() => reminders?.filter(r => isPast(new Date(r.reminder_date))) || [], [reminders]);

  const handleComplete = async (id: string) => {
    try {
      await completeFollowUp.mutateAsync(id);
      toast.success('Follow-up marked as done');
    } catch (err: any) { toast.error(err.message); }
  };

  if (statsLoading || leadsLoading) {
    return (
      <AppLayout title="Overview" subtitle="Real-time business insights">
        <div className="relative -m-6 md:-m-10 p-6 md:p-10 min-h-[calc(100vh-80px)] overflow-hidden bg-[#0f172a] rounded-tl-3xl shadow-inner text-white">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#7c3aed]/20 rounded-full blur-[140px] mix-blend-screen pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#22d3ee]/15 rounded-full blur-[140px] mix-blend-screen pointer-events-none" />
          
          <div className="relative z-10">
            {/* KPI Skeletons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 mt-8">
              {[...Array(8)].map((_, i) => <div key={i} className="h-[140px] rounded-2xl bg-[#111827] border border-white/5 animate-pulse shadow-[0_8px_32px_rgba(0,0,0,0.3)]" />)}
            </div>

            {/* Smart Insights Skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[...Array(3)].map((_, i) => <div key={i} className="h-[120px] rounded-2xl bg-[#111827] border border-white/5 animate-pulse shadow-[0_8px_32px_rgba(0,0,0,0.3)]" />)}
            </div>

            {/* Charts Skeletons */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
              <div className="lg:col-span-2 h-[350px] rounded-2xl bg-[#111827] border border-white/5 animate-pulse shadow-[0_8px_32px_rgba(0,0,0,0.3)]" />
              <div className="h-[350px] rounded-2xl bg-[#111827] border border-white/5 animate-pulse shadow-[0_8px_32px_rgba(0,0,0,0.3)]" />
            </div>

            {/* Bottom Row Skeletons */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <div key={i} className="h-[400px] rounded-2xl bg-[#111827] border border-white/5 animate-pulse shadow-[0_8px_32px_rgba(0,0,0,0.3)]" />)}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Overview" subtitle="Real-time business insights">
      <div className="relative -m-6 md:-m-10 p-6 md:p-10 min-h-[calc(100vh-80px)] overflow-hidden bg-[#0f172a] rounded-tl-3xl shadow-inner text-white">

        {/* Soft Ambient Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#7c3aed]/20 rounded-full blur-[140px] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#22d3ee]/15 rounded-full blur-[140px] mix-blend-screen pointer-events-none" />

        <div className="relative z-10">
          {/* Onboarding */}
          <div className="mb-8">
            <OnboardingCard />
          </div>

          {/* Overdue alert */}
          {overdueReminders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-5 bg-red-500/10 border border-red-500/20 backdrop-blur-md rounded-2xl flex items-center gap-4 flex-wrap shadow-[0_0_20px_rgba(239,68,68,0.1)]"
            >
              <AlertTriangle size={18} className="text-red-400 shrink-0" />
              <span className="text-sm font-medium text-red-400">{overdueReminders.length} overdue follow-up{overdueReminders.length > 1 ? 's' : ''} need attention</span>
            </motion.div>
          )}

          {/* KPIs Row 1 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <GlassKpiCard title="Total Leads" value={stats?.totalLeads ?? 0} icon={<Users size={18} />} color="#a855f7" />
            <GlassKpiCard title="Avg Response" value={stats?.avgResponseTime ?? 0} suffix="min" icon={<Clock size={18} />} color="#f59e0b" />
            <GlassKpiCard title="Visits Scheduled" value={stats?.visitsScheduled ?? 0} icon={<CalendarCheck size={18} />} color="#3b82f6" />
            <GlassKpiCard title="Bookings Closed" value={stats?.bookingsClosed ?? 0} icon={<CheckCircle size={18} />} color="#10b981" />
          </div>

          {/* KPIs Row 2 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            <GlassKpiCard title="Conversion Rate" value={stats?.conversionRate ?? 0} suffix="%" icon={<TrendingUp size={18} />} color="#8b5cf6" />
            <GlassKpiCard title="SLA Compliance" value={stats?.slaCompliance ?? 0} suffix="%" icon={<Timer size={18} />} color="#06b6d4" />
            <GlassKpiCard title="New Today" value={stats?.newToday ?? 0} icon={<Users size={18} />} color="#ec4899" />
            <GlassKpiCard title="SLA Breaches" value={(stats as any)?.slaBreaches ?? 0} icon={<AlertTriangle size={18} />} color="#ef4444" />
          </div>

          {/* Revenue Forecast */}
          {bookingStats && (bookingStats.revenue > 0 || bookingStats.pendingRevenue > 0) && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <GlassKpiCard title="Confirmed Revenue" value={`₹${(bookingStats.revenue / 1000).toFixed(0)}k`} icon={<IndianRupee size={18} />} color="#10b981" className="h-[140px]" />
              <GlassKpiCard title="Pipeline Revenue" value={`₹${(bookingStats.pendingRevenue / 1000).toFixed(0)}k`} icon={<TrendingUp size={18} />} color="#f59e0b" className="h-[140px]" />
              <GlassKpiCard title="Projected Revenue" value={`₹${((bookingStats.revenue + bookingStats.pendingRevenue * 0.6) / 1000).toFixed(0)}k`} icon={<IndianRupee size={18} />} color="#8b5cf6" className="h-[140px]" />
              <GlassKpiCard title="Active Bookings" value={bookingStats.confirmed + bookingStats.checkedIn} icon={<CheckCircle size={18} />} color="#3b82f6" className="h-[140px]" />
            </div>
          )}

          {/* System Intelligence Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Top Property */}
            <div className="p-5 rounded-2xl bg-[#111827] border border-white/5 flex flex-col justify-between h-[120px] relative overflow-hidden group hover:border-emerald-500/30 transition-all cursor-default">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400">
                    <Star size={14} className="fill-current" />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest">Top Asset</h4>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                   Trending
                </span>
              </div>
              <div className="relative z-10">
                <p className="text-sm font-bold text-white">PG Shaala Premium - HSR</p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1"><span className="text-emerald-400 font-bold">42</span> Bookings this month</p>
              </div>
            </div>

            {/* Demand Spike */}
            <div className="p-5 rounded-2xl bg-[#111827] border border-white/5 flex flex-col justify-between h-[120px] relative overflow-hidden group hover:border-red-500/30 transition-all cursor-default">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-red-500/10 rounded-lg text-red-400">
                    <TrendingUp size={14} />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest">Demand Spike</h4>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 flex items-center gap-1 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                   Hot
                </span>
              </div>
              <div className="relative z-10">
                <p className="text-sm font-bold text-white">Koramangala Block 5</p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1"><span className="text-red-400 font-bold">+300%</span> search volume</p>
              </div>
            </div>

            {/* AI Suggestion */}
            <div className="p-5 rounded-2xl bg-[#111827] border border-white/5 flex flex-col justify-between h-[120px] relative overflow-hidden group hover:border-cyan-500/30 transition-all cursor-default">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-cyan-500/10 rounded-lg text-cyan-400 animate-pulse">
                    <Zap size={14} />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest">AI Action</h4>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 flex items-center gap-1 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                   Insight
                </span>
              </div>
              <div className="relative z-10">
                <p className="text-sm font-bold text-white">Increase Follow-ups</p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">BTM Layout leads decaying</p>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="lg:col-span-2 p-8 rounded-2xl bg-[#111827] border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/20 transition-all flex flex-col h-[350px]"
            >
              <h3 className="font-bold text-base text-white mb-6 shrink-0">Pipeline Distribution</h3>
              <div className="flex-1 min-h-0 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={pipelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)' }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(34,211,238,0.2)', fontSize: '12px', background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(10px)', color: '#fff' }}
                      itemStyle={{ color: '#22d3ee', fontWeight: 'bold' }}
                      cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '5 5' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#22d3ee"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorUv)"
                      activeDot={{ r: 6, fill: "#22d3ee", stroke: "#fff", strokeWidth: 2, filter: "url(#glow)" }}
                      filter="url(#glow)"
                      animationDuration={1500}
                      animationEasing="ease-out"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-8 rounded-2xl bg-[#111827] border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/20 transition-all flex flex-col h-[350px]"
            >
              <h3 className="font-bold text-base text-white mb-6 shrink-0">Lead Sources</h3>
              <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={sourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value" strokeWidth={0}>
                      {sourceData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', fontSize: '12px', background: 'rgba(15,15,20,0.9)', backdropFilter: 'blur(10px)', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-3 mt-6">
                {sourceData.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-2 text-[11px] font-medium text-white/60">
                    <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    {s.name}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Needs Attention */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-[#111827] border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(239,68,68,0.1)] transition-all flex flex-col h-[400px]"
            >
              <div className="flex items-center justify-between mb-6 shrink-0">
                <h3 className="font-bold text-sm text-white">Needs Attention</h3>
                <span className="text-[10px] font-bold text-white/80 bg-white/10 px-2.5 py-1 rounded-full uppercase tracking-widest border border-white/5">{newLeads.length}</span>
              </div>
              <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {newLeads.slice(0, 5).map(lead => (
                  <div key={lead.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all cursor-default">
                    <div>
                      <p className="text-sm font-bold text-white">{lead.name}</p>
                      <p className="text-[11px] text-white/50 uppercase tracking-wider mt-1">{lead.preferred_location} · {lead.budget}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-white/50 font-medium">{lead.agents?.name}</p>
                      <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest mt-1">Awaiting</p>
                    </div>
                  </div>
                ))}
                {newLeads.length === 0 && <p className="text-xs text-white/30 text-center py-8 font-medium">All leads responded ✓</p>}
              </div>
            </motion.div>

            {/* Hot Leads */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-[#111827] border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(168,85,247,0.1)] transition-all flex flex-col h-[400px]"
            >
              <div className="flex items-center justify-between mb-6 shrink-0">
                <h3 className="font-bold text-sm text-white">Hot Leads</h3>
                <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-full uppercase tracking-widest border border-purple-500/20">Score ≥70</span>
              </div>
              <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {hotLeads.map(lead => (
                  <div key={lead.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all cursor-default group">
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">{lead.name}</p>
                      <p className="text-[11px] text-white/50 uppercase tracking-wider mt-1">{lead.preferred_location}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-black text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                      <Star size={12} className="fill-current" /> {(lead as any).lead_score}
                    </div>
                  </div>
                ))}
                {hotLeads.length === 0 && <p className="text-xs text-white/30 text-center py-8 font-medium">No hot leads yet</p>}
              </div>
            </motion.div>

            {/* Follow-ups */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-[#111827] border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(59,130,246,0.1)] transition-all flex flex-col h-[400px]"
            >
              <div className="flex items-center justify-between mb-6 shrink-0">
                <h3 className="font-bold text-sm text-white">Pending Follow-ups</h3>
                <span className="text-[10px] font-bold text-white/80 bg-white/10 px-2.5 py-1 rounded-full uppercase tracking-widest border border-white/5">{reminders?.length || 0}</span>
              </div>
              <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {(reminders || []).slice(0, 5).map(r => (
                  <div key={r.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isPast(new Date(r.reminder_date)) ? 'bg-red-500/5 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]' : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.08] hover:border-white/10'}`}>
                    <div>
                      <p className="text-sm font-bold text-white">{(r as any).leads?.name}</p>
                      <p className="text-[11px] text-white/50 uppercase tracking-wider mt-1 flex items-center gap-2">
                        {format(new Date(r.reminder_date), 'MMM d, h:mm a')}
                        {isPast(new Date(r.reminder_date)) && <span className="text-[9px] text-red-400 font-black bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">OVERDUE</span>}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-[11px] uppercase tracking-wider font-bold rounded-lg border border-white/10 bg-white/5 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:text-white hover:border-transparent transition-all duration-300 shadow-sm" onClick={() => handleComplete(r.id)}>
                      Done
                    </Button>
                  </div>
                ))}
                {(reminders?.length || 0) === 0 && <p className="text-xs text-white/30 text-center py-8 font-medium">No pending follow-ups</p>}
              </div>
            </motion.div>

          </div>

          {/* Agent Performance */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="mt-6 p-6 rounded-2xl bg-[#111827] border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/20 transition-all"
          >
            <h3 className="font-bold text-base text-white mb-6">Agent Performance Grid</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(agentStats || []).map(agent => (
                <motion.div
                  key={agent.id}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all cursor-default group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7c3aed]/20 to-[#22d3ee]/20 flex items-center justify-center border border-white/10 shadow-inner group-hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all">
                    <span className="text-sm font-black text-white">{agent.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">{agent.name}</p>
                    <div className="flex gap-4 mt-1">
                      <span className="text-[11px] font-medium text-white/50">{agent.activeLeads} <span className="uppercase tracking-widest text-[9px] opacity-70">active</span></span>
                      <span className="text-[11px] font-medium text-white/50">{agent.avgResponseTime}m <span className="uppercase tracking-widest text-[9px] opacity-70">avg</span></span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70 drop-shadow-sm">
                      {agent.totalLeads ? Math.round((agent.conversions / agent.totalLeads) * 100) : 0}%
                    </p>
                    <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5">{agent.conversions} closed</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </AppLayout>
  );
};

// ----------------------------------------------------------------------
// Sub Components
// ----------------------------------------------------------------------

const GlassKpiCard = memo(({ title, value, icon, color, suffix, trend = "+12%" }: any) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-6 rounded-2xl bg-[#111827] border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/20 transition-all duration-300 relative overflow-hidden group h-[140px] flex flex-col justify-between"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

      <div className="flex items-start justify-between relative z-20">
        <div className="p-3.5 rounded-2xl shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_currentColor]" style={{ background: `${color}15`, border: `1px solid ${color}30`, color: color }}>
          {icon}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">{trend}</span>
          <span className="text-[9px] text-white/40 uppercase tracking-widest mt-1">This Week</span>
        </div>
      </div>

      <div className="relative z-20">
        <div className="text-4xl font-black tracking-tight flex items-baseline drop-shadow-sm" style={{ color: color }}>
          {value}
          {suffix && <span className="text-sm font-bold ml-1.5 uppercase opacity-50 text-white">{suffix}</span>}
        </div>
        <p className="text-[11px] uppercase tracking-widest font-bold text-white/50 mt-2">{title}</p>
      </div>

      {/* Decorative inner glow based on color */}
      <div
        className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-[40px] opacity-20 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none"
        style={{ background: color }}
      />
    </motion.div>
  );
});

export default Dashboard;
