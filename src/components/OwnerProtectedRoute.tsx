import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';

interface OwnerProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * OwnerProtectedRoute — Guards owner-only pages.
 * 
 * If the user is not logged in → redirect to /owner-login (not /auth).
 * If the user is logged in but not an owner → redirect to /dashboard (CRM).
 * If the user is an owner → render children.
 */
const OwnerProtectedRoute = ({ children }: OwnerProtectedRouteProps) => {
  const { user, role, loading, isOwner, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
            <Building2 size={24} className="text-emerald-500 animate-pulse" />
          </div>
          <p className="text-sm text-muted-foreground">Loading owner portal...</p>
        </motion.div>
      </div>
    );
  }

  // Not logged in → redirect to owner-specific login
  if (!user) {
    return <Navigate to="/owner-login" state={{ from: location }} replace />;
  }

  // Logged in but not an owner (admins can also access for support)
  if (!isOwner && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default OwnerProtectedRoute;
