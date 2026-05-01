import { ReactNode, useState } from 'react';
import AppSidebar from './AppSidebar';
import CommandPalette from './CommandPalette';
import NotificationBell from './NotificationBell';
import QuickAddLead from './QuickAddLead';
import { Menu, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export interface AppLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

const AppLayout = ({ children, title, subtitle, actions }: AppLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-[240px]">
        {/* Top bar — refined luxury */}
        <header className="sticky top-0 z-30 bg-background border-b border-border px-6 md:px-10 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <button className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-secondary transition-colors" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} className="text-foreground" />
            </button>
            <div className="min-w-0">
              <h1 className="font-display font-bold text-xl text-foreground truncate tracking-tight">{title}</h1>
              {subtitle && <p className="text-[10px] font-medium text-primary/60 uppercase tracking-widest truncate mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {actions}
            <div className="h-6 w-px bg-white/10 mx-2" />
            <NotificationBell />
            <button
              onClick={() => setCmdOpen(true)}
              className="hidden md:flex items-center gap-3 px-4 py-2 text-[12px] text-muted-foreground bg-white/[0.03] hover:bg-white/[0.06] rounded-full transition-all border border-white/5 shadow-inner"
            >
              <Search size={14} className="text-primary/70" />
              <span className="font-medium tracking-wide">Registry Search</span>
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-background rounded border border-white/10 text-[9px] font-bold opacity-50">
                <span>⌘</span>
                <span>K</span>
              </div>
            </button>
          </div>
        </header>

        {/* Content — generous margins */}
        <motion.main
          className="p-6 md:p-10"
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.main>
      </div>

      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
      <QuickAddLead />
    </div>
  );
};

export default AppLayout;
