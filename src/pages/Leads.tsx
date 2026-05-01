import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import AddLeadDialog from '@/components/AddLeadDialog';
import LeadDetailDrawer from '@/components/LeadDetailDrawer';
import { useLeadsPaginated } from '@/hooks/useCrmData';
import { useBulkUpdateLeads, useDeleteLeads } from '@/hooks/useLeadDetails';
import { useUpdateLead, useAgents, type LeadWithRelations } from '@/hooks/useCrmData';
import { PIPELINE_STAGES, SOURCE_LABELS } from '@/types/crm';
import { Filter, Download, Star, Trash2, PhoneCall, MessageCircle, User, IndianRupee } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const statusBadge = (status: string) => {
  const stage = PIPELINE_STAGES.find(s => s.key === status);
  if (!stage) return null;
  return (
    <span className={`badge-pipeline text-[10px] text-accent-foreground ${stage.color}`}>
      {stage.label}
    </span>
  );
};

const scoreColor = (score: number) => {
  if (score >= 70) return 'text-success';
  if (score >= 40) return 'text-warning';
  return 'text-destructive';
};

const Leads = () => {
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedLead, setSelectedLead] = useState<LeadWithRelations | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 50;
  const { data: paginatedData, isLoading } = useLeadsPaginated(page, PAGE_SIZE);
  const leads = paginatedData?.leads;
  const totalLeads = paginatedData?.total ?? 0;
  const totalPages = Math.ceil(totalLeads / PAGE_SIZE);
  const { data: agents } = useAgents();
  const bulkUpdate = useBulkUpdateLeads();
  const deleteLeads = useDeleteLeads();
  const updateLead = useUpdateLead();

  const filtered = (leads || [])
    .filter(l => {
      if (filterSource !== 'all' && l.source !== filterSource) return false;
      if (filterStatus !== 'all' && l.status !== filterStatus) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'score_high': return ((b as any).lead_score ?? 0) - ((a as any).lead_score ?? 0);
        case 'score_low': return ((a as any).lead_score ?? 0) - ((b as any).lead_score ?? 0);
        case 'response': return ((a as any).first_response_time_min ?? 999) - ((b as any).first_response_time_min ?? 999);
        default: return 0;
      }
    });

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(l => l.id)));
  };

  const handleBulkAssign = async (agentId: string) => {
    if (selectedIds.size === 0) return;
    try {
      await bulkUpdate.mutateAsync({ ids: Array.from(selectedIds), updates: { assigned_agent_id: agentId } });
      toast.success(`${selectedIds.size} leads reassigned`);
      setSelectedIds(new Set());
    } catch (err: any) { toast.error(err.message); }
  };

  const handleBulkStatus = async (status: string) => {
    if (selectedIds.size === 0) return;
    try {
      await bulkUpdate.mutateAsync({ ids: Array.from(selectedIds), updates: { status: status as any } });
      toast.success(`${selectedIds.size} leads updated`);
      setSelectedIds(new Set());
    } catch (err: any) { toast.error(err.message); }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} leads? This cannot be undone.`)) return;
    try {
      await deleteLeads.mutateAsync(Array.from(selectedIds));
      toast.success(`${selectedIds.size} leads deleted`);
      setSelectedIds(new Set());
    } catch (err: any) { toast.error(err.message); }
  };

  const handleInlineStatus = async (leadId: string, newStatus: string) => {
    try {
      await updateLead.mutateAsync({ id: leadId, status: newStatus as any });
      toast.success('Status updated');
    } catch (err: any) { toast.error(err.message); }
  };

  const handleExport = () => {
    const csv = [
      ['Name', 'Phone', 'Email', 'Source', 'Status', 'Agent', 'Location', 'Budget', 'Score'].join(','),
      ...filtered.map(l => [l.name, l.phone, l.email || '', l.source, l.status, l.agents?.name || '', l.preferred_location || '', l.budget || '', (l as any).lead_score ?? 0].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads-export.csv';
    a.click();
  };

  const openDetail = (lead: LeadWithRelations) => {
    setSelectedLead(lead);
    setDrawerOpen(true);
  };

  if (isLoading) {
    return (
      <AppLayout title="All Leads" subtitle="Loading...">
        <Skeleton className="h-[500px] rounded-2xl" />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="All Leads" subtitle={`${filtered.length} leads found`} actions={<AddLeadDialog />}>
      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={13} className="text-muted-foreground" />
          <select value={filterSource} onChange={e => setFilterSource(e.target.value)}
            className="text-2xs bg-card border border-border rounded-xl px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring/30">
            <option value="all">All Sources</option>
            {Object.entries(SOURCE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="text-2xs bg-card border border-border rounded-xl px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring/30">
            <option value="all">All Stages</option>
            {PIPELINE_STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="text-2xs bg-card border border-border rounded-xl px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring/30">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="score_high">Score: High → Low</option>
            <option value="score_low">Score: Low → High</option>
            <option value="response">Response Time</option>
          </select>
        </div>
        <div className="ml-auto">
          <Button variant="outline" size="sm" className="gap-1.5 text-2xs rounded-xl" onClick={handleExport}>
            <Download size={12} /> Export
          </Button>
        </div>
      </div>

      {/* Bulk actions */}
      {selectedIds.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-4 p-4 bg-accent/5 border border-accent/15 rounded-2xl flex-wrap"
        >
          <span className="text-2xs font-medium text-foreground">{selectedIds.size} selected</span>
          <Select onValueChange={handleBulkAssign}>
            <SelectTrigger className="h-7 w-[140px] text-2xs rounded-lg"><SelectValue placeholder="Assign to..." /></SelectTrigger>
            <SelectContent>{agents?.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
          </Select>
          <Select onValueChange={handleBulkStatus}>
            <SelectTrigger className="h-7 w-[140px] text-2xs rounded-lg"><SelectValue placeholder="Change status..." /></SelectTrigger>
            <SelectContent>{PIPELINE_STAGES.map(s => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}</SelectContent>
          </Select>
          <Button variant="destructive" size="sm" className="h-7 text-2xs gap-1 rounded-lg" onClick={handleBulkDelete}>
            <Trash2 size={10} /> Delete
          </Button>
          <button onClick={() => setSelectedIds(new Set())} className="text-2xs text-muted-foreground hover:text-foreground ml-auto transition-colors">
            Clear
          </button>
        </motion.div>
      )}

      {/* Cards List */}
      <div className="space-y-3">
        {/* Select All Header (replaces table header checkbox) */}
        {filtered.length > 0 && (
          <div className="flex items-center px-5 py-2">
            <Checkbox checked={selectedIds.size === filtered.length} onCheckedChange={toggleAll} />
            <span className="text-xs text-muted-foreground ml-3">Select All</span>
          </div>
        )}

        {filtered.map(lead => {
          const isSelected = selectedLead?.id === lead.id;
          const isChecked = selectedIds.has(lead.id);
          const stage = PIPELINE_STAGES.find(s => s.key === lead.status);
          
          return (
            <div 
              key={lead.id} 
              className={`relative overflow-hidden rounded-xl border cursor-pointer transition-all hover:bg-white/[0.02] ${isSelected ? 'bg-[#1e293b] border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'bg-[#111827] border-white/10'}`}
              onClick={() => openDetail(lead)}
            >
              {/* Left accent bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${stage?.color || 'bg-border'}`} />

              <div className="flex items-center gap-4 ml-1 p-4">
                <div onClick={e => e.stopPropagation()}>
                  <Checkbox checked={isChecked} onCheckedChange={() => toggleSelect(lead.id)} />
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Name & Contact */}
                  <div className="md:col-span-3 flex flex-col">
                    <span className="font-bold text-foreground text-sm tracking-tight">{lead.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{lead.phone}</span>
                      {lead.preferred_location && (
                        <>
                          <span className="text-xs text-muted-foreground/30">•</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[100px]">{lead.preferred_location}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="md:col-span-2" onClick={e => e.stopPropagation()}>
                    <select
                      value={lead.status}
                      onChange={e => handleInlineStatus(lead.id, e.target.value)}
                      className="text-xs font-semibold rounded-full px-3 py-1.5 cursor-pointer focus:outline-none transition-colors border border-white/5 bg-white/5 hover:bg-white/10"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {PIPELINE_STAGES.map(s => <option key={s.key} value={s.key} className="bg-[#111827] text-white">{s.label}</option>)}
                    </select>
                  </div>

                  {/* Score & Source */}
                  <div className="md:col-span-2 flex flex-col">
                    <span className={`text-xs font-semibold flex items-center gap-1 ${scoreColor((lead as any).lead_score ?? 0)}`}>
                      <Star size={12} className={scoreColor((lead as any).lead_score ?? 0).includes('success') ? 'fill-emerald-500 text-emerald-500' : ''} /> {(lead as any).lead_score ?? 0} Score
                    </span>
                    <span className="text-xs text-muted-foreground mt-1 capitalize">{SOURCE_LABELS[lead.source as keyof typeof SOURCE_LABELS] || lead.source}</span>
                  </div>

                  {/* Agent & Budget */}
                  <div className="md:col-span-3 flex flex-col">
                    <span className="text-xs text-foreground font-medium flex items-center gap-1.5">
                      <User size={12} className="text-muted-foreground" /> {lead.agents?.name || 'Unassigned'}
                    </span>
                    {lead.budget && (
                      <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                        <IndianRupee size={10} className="text-muted-foreground" /> {lead.budget}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-2 flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                    <a href={`tel:${lead.phone}`} className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group" title="Call">
                      <PhoneCall size={14} className="text-blue-400 group-hover:text-blue-300 transition-colors" />
                    </a>
                    <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group" title="WhatsApp">
                      <MessageCircle size={14} className="text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                    </a>
                  </div>

                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-[#111827] rounded-xl border border-white/10">
            <p className="text-sm text-muted-foreground">No leads found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-2xs text-muted-foreground">
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, totalLeads)} of {totalLeads}
          </p>
          <div className="flex gap-1.5">
            <Button variant="outline" size="sm" className="h-7 text-2xs rounded-lg" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-2xs rounded-lg" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}

      <LeadDetailDrawer lead={selectedLead} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </AppLayout>
  );
};

export default Leads;
