import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const { sendPasswordReset } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your email address.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await sendPasswordReset(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send password recovery email.');
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
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 bg-[#0B1F3A] dark:bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-2xl items-center justify-center font-extrabold text-2xl shadow-xl shadow-slate-900/10 mb-4">
            T
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Recover Password
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 dark:text-slate-400">
            We will email you instructions to reset your password.
          </p>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800/60 shadow-2xl rounded-2xl p-8 backdrop-blur-md">
          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <Send size={20} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                Reset Link Sent
              </h3>
              <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
                Check your inbox for a message from us with instructions to complete the process.
              </p>
              <Link to="/login" className="inline-flex items-center text-xs text-[#D4AF37] font-semibold mt-6 hover:underline">
                <ArrowLeft size={12} className="mr-1.5" />
                Return to login
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-850 text-red-600 dark:text-red-400 p-3 rounded-lg text-xs font-semibold">
                  {error}
                </div>
              )}

              <Input 
                label="Email Address" 
                type="email" 
                placeholder="name@agency.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail size={16} />}
                required
              />

              <Button 
                type="submit" 
                className="w-full mt-2 py-2.5 font-bold flex items-center justify-center"
                isLoading={loading}
              >
                Send Recovery Instructions
              </Button>

              <div className="text-center mt-6">
                <Link to="/login" className="inline-flex items-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  <ArrowLeft size={12} className="mr-1.5" />
                  Back to sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
export default ForgotPassword;
