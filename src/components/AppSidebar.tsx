import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Kanban, CalendarCheck, BarChart3, Settings,
  MessageSquare, History, X, Moon, Sun, Building2, Bed, TrendingUp,
  Map, Sparkles, Receipt, Globe, LogOut, Radio, Cpu
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const salesItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/leads', icon: Users, label: 'Leads' },
  { to: '/pipeline', icon: Kanban, label: 'Pipeline' },
  { to: '/visits', icon: CalendarCheck, label: 'Visits' },
  { to: '/conversations', icon: MessageSquare, label: 'Messages' },
  { to: '/bookings', icon: Receipt, label: 'Bookings' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics', role: 'manager' },
  { to: '/historical', icon: History, label: 'Historical', role: 'manager' },
];

const supplyItems = [
  { to: '/owners', icon: Building2, label: 'Owners', role: 'manager' },
  { to: '/inventory', icon: Bed, label: 'Inventory', role: 'manager' },
  { to: '/availability', icon: Map, label: 'Availability', role: 'manager' },
  { to: '/effort', icon: TrendingUp, label: 'Effort', role: 'manager' },
  { to: '/matching', icon: Sparkles, label: 'Matching', role: 'manager' },
  { to: '/zones', icon: Globe, label: 'Zones', role: 'admin' },
];

const simulationItems = [
  { to: '/iot', icon: Radio, label: 'Smart Infrastructure' },
  { to: '/math', icon: Cpu, label: 'Optimization Engine' },
];

const AppSidebar = ({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) => {
  const { user, role, isAdmin, isManager, isAgent, isOwner, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLight, setIsLight] = useState(() => document.documentElement.classList.contains('light'));
  useEffect(() => { 
    document.documentElement.classList.toggle('light', isLight); 
    // Ensure 'dark' is removed if we are using 'light'
    if (isLight) document.documentElement.classList.remove('dark');
  }, [isLight]);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const renderGroup = (label: string, items: any[]) => {
    const visibleItems = items.filter(item => {
      if (!item.role) return true;
      if (isAdmin) return true;
      if (item.role === 'manager' && (isManager || isAdmin)) return true;
      if (item.role === 'admin' && isAdmin) return true;
      return false;
    });

    if (visibleItems.length === 0) return null;

    return (
      <div className="mb-6">
        <p className="px-4 pt-4 pb-2 text-[10px] font-bold uppercase tracking-[0.15em] font-display text-primary/60">{label}</p>
        <div className="space-y-0.5 px-2">
          {visibleItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink key={item.to} to={item.to} onClick={onClose} className={`sidebar-link ${isActive ? 'active' : ''}`}>
                <item.icon size={16} strokeWidth={isActive ? 2 : 1.5} className={isActive ? 'text-primary' : 'text-muted-foreground'} />
                <span className={isActive ? 'font-semibold tracking-wide' : 'font-medium tracking-normal'}>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onClose} />
        )}
      </AnimatePresence>

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-[240px] flex flex-col border-r transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'hsl(var(--sidebar-background))', borderColor: 'hsl(var(--sidebar-border))' }}
      >
        {/* Logo - Classic luxury style */}
        <div className="flex items-center justify-between px-6 h-20 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-md shadow-purple-500/20">
              <span className="text-white font-display font-black text-base">PG</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-base text-foreground tracking-tight leading-tight">PG SHAALA</h1>
              <p className="text-[9px] font-medium tracking-[0.1em] text-primary/50 uppercase">The PG Suite</p>
            </div>
          </div>
          <button className="lg:hidden p-1 rounded-md hover:bg-white/5 transition-colors" onClick={onClose}>
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-none">
          {renderGroup('Demand Management', salesItems)}
          {renderGroup('Supply Chain', supplyItems)}
          {renderGroup('System Core', simulationItems)}
        </nav>

        {/* Footer */}
        <div className="px-3 py-6 border-t border-border space-y-1">
          <button onClick={() => setIsLight(!isLight)} className="sidebar-link w-full">
            {isLight ? <Moon size={15} strokeWidth={1.5} /> : <Sun size={15} strokeWidth={1.5} />}
            <span>{isLight ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
          
          <button onClick={handleLogout} className="sidebar-link w-full text-destructive/80 hover:text-destructive hover:bg-destructive/10">
            <LogOut size={15} strokeWidth={1.5} />
            <span>Terminate Session</span>
          </button>

          <div className="mt-4 mx-1 p-3 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                <span className="text-[10px] font-bold text-primary">{(user?.email?.[0] || 'U').toUpperCase()}</span>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-foreground truncate capitalize">{role || 'System Admin'}</p>
                <p className="text-[9px] text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
