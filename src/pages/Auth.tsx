import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const Auth = () => {
  const navigate = useNavigate();
  const { user, isOwner, role, loading: authLoading, signIn } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('demo@pgshaala.com');
  const [password, setPassword] = useState('demo1234');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      if (isOwner) {
        navigate('/owner-portal', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [authLoading, user, isOwner, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Welcome back!');
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.info('Sign up is currently disabled. Use demo account.');
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.info('Password reset is currently disabled.');
  };

  return (
    <div className="min-h-screen bg-background flex font-body">
      {/* Left side: Visual + branding */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-16 bg-background">
        {/* Soft animated glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-white font-display font-black text-xl">PG</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">PG SHAALA</h1>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.3em]">India's Smartest PG Platform</p>
            </div>
          </div>
        </div>

        <motion.div className="relative z-10 max-w-xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
          <h2 className="font-display text-5xl font-bold text-foreground leading-[1.2] mb-6 tracking-tight">
            Find Your Perfect PG, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Effortlessly.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-md font-medium">
            Smart matching. Verified properties. Seamless booking. Experience the new standard of city living.
          </p>
        </motion.div>

        <div className="relative z-10 flex items-center justify-between">
          <p className="text-[11px] font-medium text-muted-foreground/50">© 2026 PG Shaala. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Contact'].map(item => (
              <span key={item} className="text-[11px] font-medium text-muted-foreground/50 hover:text-foreground transition-colors cursor-pointer">{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right side: Login form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#0f172a] relative overflow-hidden">
        {/* Subtle background glow for the right panel */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-purple-500/5 to-blue-500/5 pointer-events-none" />

        <motion.div 
          className="w-full max-w-[420px] relative z-10 bg-[#111827] rounded-2xl border border-white/10 p-8 shadow-2xl" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="text-center mb-8">
            <h2 className="font-display font-bold text-2xl text-white mb-2 tracking-tight">
              Welcome Back 👋
            </h2>
            <p className="text-sm text-muted-foreground">
              Login to continue your search
            </p>
          </div>

          <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-white/80 ml-1">Email Address</Label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-purple-400 transition-colors" />
                <Input 
                  className="pl-11 h-12 rounded-xl bg-white/5 border-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-white placeholder:text-white/20" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <Label className="text-sm font-medium text-white/80">Password</Label>
                <button type="button" className="text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium" onClick={handleForgot}>Forgot password?</button>
              </div>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-purple-400 transition-colors" />
                <Input 
                  className="pl-11 pr-11 h-12 rounded-xl bg-white/5 border-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-white placeholder:text-white/20" 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold text-sm hover:opacity-90 shadow-lg shadow-purple-500/25 transition-all active:scale-[0.98] border-0" 
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </Button>
            
            <div className="text-center pt-2">
              <p className="text-xs text-muted-foreground">
                Don't have an account? <button type="button" className="text-purple-400 hover:text-purple-300 font-medium transition-colors" onClick={(e) => { e.preventDefault(); handleSignup(e as any); }}>Sign up</button>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
