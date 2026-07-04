import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import { User, Mail, Lock, Shield } from 'lucide-react';
import type { UserRole } from '../../shared/types';
import { motion } from 'framer-motion';

export const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('sales');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      await signUp(email, password, name, role);
      // If real Firebase verification is triggered, signUp throws a notice error telling the user to verify.
      // If mock, it goes straight to the dashboard.
      setSuccessMsg('Account registered! Please check your email inbox to verify your account.');
      setTimeout(() => navigate('/login'), 5000);
    } catch (err: any) {
      // In AuthProvider, we throw a success message as an Error for verification check redirect.
      if (err.message.includes('successful')) {
        setSuccessMsg(err.message);
      } else {
        setError(err.message || 'Failed to create account.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Google signup failed.');
    } finally {
      setLoading(false);
    }
  };

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
          <div className="inline-flex h-12 w-12 bg-[#0B1F3A] dark:bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-2xl items-center justify-center font-extrabold text-2xl shadow-xl shadow-slate-900/10 mb-4">
            T
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Create Agency Account
          </h2>
          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
            Gain access to TAS Outreach Lead & Audit automation
          </p>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800/60 shadow-2xl rounded-2xl p-8 backdrop-blur-md">
          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-lg text-xs font-semibold mb-5">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 p-3 rounded-lg text-xs font-semibold mb-5">
              {successMsg}
            </div>
          )}

          {/* Google SSO Registration */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full py-2 flex items-center justify-center space-x-2 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 mb-5"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.98 1 12 1 7.35 1 3.37 3.68 1.4 7.58l3.9 3.02C6.26 7.42 8.9 5.04 12 5.04z"/>
              <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.76 2.92c2.2-2.03 3.67-5.01 3.67-8.65z"/>
              <path fill="#FBBC05" d="M5.3 10.6c-.25-.74-.39-1.53-.39-2.35 0-.82.14-1.61.39-2.35L1.4 4.88C.51 6.66 0 8.66 0 10.75c0 2.09.51 4.09 1.4 5.87l3.9-3.02z"/>
              <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.76-2.92c-1.04.7-2.38 1.11-4.2 1.11-3.1 0-5.74-2.38-6.7-5.54l-3.9 3.02C3.37 20.32 7.35 23 12 23z"/>
            </svg>
            <span className="font-semibold text-slate-700 dark:text-slate-200 text-xs">Sign up with Google</span>
          </Button>

          <div className="relative flex py-2 items-center mb-4">
            <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
            <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">or join with email</span>
            <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              label="Full Name" 
              type="text" 
              placeholder="Sarah Connor" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User size={16} />}
              required
            />

            <Input 
              label="Email Address" 
              type="email" 
              placeholder="sarah@agency.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail size={16} />}
              required
            />
            
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock size={16} />}
              required
              helperText="Min. 6 characters"
            />

            <div className="flex flex-col mb-4">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                Select Workspace Role
              </label>
              <div className="relative flex items-center">
                <Shield size={16} className="absolute left-3 text-slate-400 pointer-events-none" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full text-sm py-2 pl-9 pr-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <option value="admin">Administrator</option>
                  <option value="manager">Manager</option>
                  <option value="sales">Sales Officer</option>
                  <option value="viewer">Viewer / Guest</option>
                </select>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full mt-4 py-2.5 font-bold"
              isLoading={loading}
            >
              Register & Join
            </Button>
          </form>

          <div className="mt-5 text-center text-xs text-slate-400">
            <span>Already have an account? </span>
            <Link to="/login" className="text-[#D4AF37] hover:underline font-semibold">
              Sign in instead
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default Signup;
