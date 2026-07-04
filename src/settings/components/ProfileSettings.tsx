import React, { useState } from 'react';
import { useAuth } from '../../shared/hooks/useAuth';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import { Card } from '../../shared/components/Card';
import { 
  User, 
  Building, 
  Phone, 
  Mail, 
  Lock, 
  ShieldCheck, 
  CheckCircle, 
  Upload 
} from 'lucide-react';
import { updatePassword } from 'firebase/auth';
import { auth, isMockFirebase } from '../../shared/lib/firebase';

export const ProfileSettings: React.FC = () => {
  const { user, updateUserProfileDoc } = useAuth();
  
  // Profile form states
  const [name, setName] = useState(user?.displayName || '');
  const [company, setCompany] = useState(user?.email.split('@')[0].toUpperCase() || ''); // Custom mock fallback
  const [phone, setPhone] = useState('');
  const [avatarUrl] = useState(user?.photoURL || '');
  
  // Password change states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [passMsg, setPassMsg] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setLoadingProfile(true);
    try {
      await updateUserProfileDoc({
        displayName: name,
        photoURL: avatarUrl || undefined,
      });
      setProfileMsg('Profile information updated successfully.');
    } catch (err: any) {
      setProfileMsg(err.message || 'Failed to update profile.');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);
    if (newPassword !== confirmPassword) {
      setPassMsg('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setPassMsg('Password must be at least 6 characters.');
      return;
    }

    setLoadingPass(true);
    try {
      if (!isMockFirebase && auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        setPassMsg('Password updated successfully.');
      } else {
        setPassMsg('Password updated successfully (Mock Mode).');
      }
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPassMsg(err.message || 'Failed to update password.');
    } finally {
      setLoadingPass(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">
          Account Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal workspace profile details, permissions, and credential keys.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Avatar Summary Card */}
        <div className="md:col-span-1">
          <Card className="text-center">
            <div className="relative inline-block mx-auto mb-4">
              <div className="h-24 w-24 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37] flex items-center justify-center font-bold text-3xl shadow">
                {name.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 bg-[#0B1F3A] hover:bg-slate-800 text-white rounded-full border border-slate-700 shadow shrink-0 cursor-pointer">
                <Upload size={12} />
              </button>
            </div>
            
            <h3 className="font-bold text-slate-800 dark:text-slate-100">{name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
            
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-left space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Workspace Role</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold capitalize flex items-center">
                  <ShieldCheck size={10} className="mr-1 text-[#D4AF37]" />
                  {user.role}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Created Date</span>
                <span className="text-slate-600 dark:text-slate-300 font-semibold">Jul 2026</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side Forms */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Profile Form Card */}
          <Card title="Workspace Profile Details" subtitle="Update your primary identification fields">
            {profileMsg && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 rounded-lg mb-4 flex items-center">
                <CheckCircle size={14} className="mr-2 text-emerald-500" />
                {profileMsg}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Full Name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  leftIcon={<User size={15} />}
                  required 
                />
                <Input 
                  label="Company / Agency" 
                  value={company} 
                  onChange={(e) => setCompany(e.target.value)} 
                  leftIcon={<Building size={15} />}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Phone Number" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  leftIcon={<Phone size={15} />}
                  placeholder="+1 (555) 123-4567"
                />
                <Input 
                  label="Email Address" 
                  value={user.email} 
                  disabled 
                  leftIcon={<Mail size={15} />}
                  className="opacity-60 bg-slate-50 cursor-not-allowed"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" isLoading={loadingProfile}>
                  Update Profile Info
                </Button>
              </div>
            </form>
          </Card>

          {/* Password Reset Form Card */}
          <Card title="Security Credentials" subtitle="Modify your workspace account sign-in password">
            {passMsg && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 rounded-lg mb-4 flex items-center">
                <CheckCircle size={14} className="mr-2 text-[#D4AF37]" />
                {passMsg}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="New Password" 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  leftIcon={<Lock size={15} />}
                  required 
                />
                <Input 
                  label="Confirm New Password" 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  leftIcon={<Lock size={15} />}
                  required 
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="secondary" isLoading={loadingPass}>
                  Change Account Password
                </Button>
              </div>
            </form>
          </Card>

        </div>
      </div>
    </div>
  );
};
export default ProfileSettings;
