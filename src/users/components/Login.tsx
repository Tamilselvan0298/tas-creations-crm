import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import { Mail, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password, rememberMe);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (presetEmail: string) => {
    setError(null);
    setLoading(true);
    try {
      await signIn(presetEmail, 'password', rememberMe);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in.');
    } finally {
      setLoading(false);
    }
  };

  const presets = [
    { label: 'Admin Access', email: 'admin@tas.com' },
    { label: 'Manager Access', email: 'manager@tas.com' },
    { label: 'Sales Access', email: 'sales@tas.com' },
    { label: 'Viewer Access', email: 'viewer@tas.com' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 dark:opacity-5 dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 bg-[#0B1F3A] dark:bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-2xl items-center justify-center font-extrabold text-2xl shadow-xl shadow-slate-900/10 mb-4 animate-pulse-slow">
            T
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Welcome to TAS Outreach
          </h2>
          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
            Digital Agency CRM, SEO Audit & Automation Suite
          </p>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800/60 shadow-2xl rounded-2xl p-8 backdrop-blur-md">
          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-lg text-xs font-semibold mb-5">
              {error}
            </div>
          )}

          {/* Google SSO Login */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-2 flex items-center justify-center space-x-2 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 mb-5"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.98 1 12 1 7.35 1 3.37 3.68 1.4 7.58l3.9 3.02C6.26 7.42 8.9 5.04 12 5.04z"/>
              <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.76 2.92c2.2-2.03 3.67-5.01 3.67-8.65z"/>
              <path fill="#FBBC05" d="M5.3 10.6c-.25-.74-.39-1.53-.39-2.35 0-.82.14-1.61.39-2.35L1.4 4.88C.51 6.66 0 8.66 0 10.75c0 2.09.51 4.09 1.4 5.87l3.9-3.02z"/>
              <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.76-2.92c-1.04.7-2.38 1.11-4.2 1.11-3.1 0-5.74-2.38-6.7-5.54l-3.9 3.02C3.37 20.32 7.35 23 12 23z"/>
            </svg>
            <span className="font-semibold text-slate-700 dark:text-slate-200 text-xs">Sign in with Google</span>
          </Button>

          <div className="relative flex py-2 items-center mb-4">
            <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
            <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">or sign in with email</span>
            <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="name@agency.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail size={16} />}
              required
            />
            
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" className="text-[11px] text-[#D4AF37] hover:underline font-semibold">
                  Forgot Password?
                </Link>
              </div>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock size={16} />}
                required
              />
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center text-xs text-slate-500 dark:text-slate-400 font-medium select-none cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 h-4 w-4 rounded border-slate-300 text-[#0B1F3A] focus:ring-[#0B1F3A]" 
                />
                Remember me on this device
              </label>
            </div>

            <Button 
              type="submit" 
              className="w-full mt-2 py-2.5 font-bold"
              isLoading={loading}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Logins Section */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center">
                <Sparkles size={11} className="mr-1 text-[#D4AF37]" />
                Demo Logins
              </span>
              <span className="text-[9px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                Mock Mode
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.email}
                  onClick={() => handleQuickLogin(preset.email)}
                  disabled={loading}
                  className="px-2.5 py-1.5 text-left border border-slate-200/80 dark:border-slate-800/60 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-start space-x-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <CheckCircle2 size={11} className="text-[#D4AF37] mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold text-slate-700 dark:text-slate-200 truncate">{preset.label}</p>
                    <p className="text-[8px] text-slate-400 truncate">{preset.email}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 text-center text-xs text-slate-400">
            <span>New user? </span>
            <Link to="/signup" className="text-[#D4AF37] hover:underline font-semibold">
              Create an account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default Login;
