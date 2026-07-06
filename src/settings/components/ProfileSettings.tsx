import React, { useState, useEffect } from 'react';
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
  Upload,
  Settings,
  Globe,
  Sliders,
  Eye,
  EyeOff
} from 'lucide-react';
import { updatePassword } from 'firebase/auth';
import { auth, isMockFirebase } from '../../shared/lib/firebase';
import { settingsRepository } from '../../shared/services/settingsRepository';
import type { IntegrationSettings } from '../../shared/services/settingsRepository';

export const ProfileSettings: React.FC = () => {
  const { user, updateUserProfileDoc } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'integrations'>('profile');
  
  // Profile form states
  const [name, setName] = useState(user?.displayName || '');
  const [company, setCompany] = useState(user?.email.split('@')[0].toUpperCase() || '');
  const [phone, setPhone] = useState('');
  const [avatarUrl] = useState(user?.photoURL || '');
  
  // Password change states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [passMsg, setPassMsg] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  // Integrations state
  const [integrations, setIntegrations] = useState<IntegrationSettings | null>(null);
  const [selectedPlugin, setSelectedPlugin] = useState<string | null>(null);
  const [editingKeys, setEditingKeys] = useState<{ [key: string]: string }>({});
  const [pluginEnabled, setPluginEnabled] = useState(true);
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await settingsRepository.getIntegrations();
        setIntegrations(data);
      } catch (e) {
        console.error('Failed to load integration settings:', e);
      }
    };
    loadSettings();
  }, []);

  const PLUGINS = [
    { id: 'crawler', name: 'Website Crawler (Multi-page)', type: 'website crawler', enrichment: 'Connected', desc: 'Crawls multiple internal links on a business website to extract text, tags, and resources.', requires: [] },
    { id: 'social', name: 'Social Profile Finder (Free)', type: 'social enrichment', enrichment: 'Connected', desc: 'Looks for Facebook, Instagram, LinkedIn, and Twitter links in HTML tags.', requires: [] },
    { id: 'seo', name: 'Website SEO Audit (Free)', type: 'seo enrichment', enrichment: 'Connected', desc: 'Analyses meta tags, H1 headings hierarchy, missing alt attributes, and sitemaps.', requires: [] },
    { id: 'pagespeed', name: 'Google PageSpeed Insights', type: 'seo enrichment', enrichment: 'Requires API Key', desc: 'Measures page load speed metrics (LCP, CLS, INP) for mobile viewports.', requires: ['PAGESPEED_API_KEY'] },
    { id: 'email_mx', name: 'Email MX Verify (Free)', type: 'email enrichment', enrichment: 'Connected', desc: 'Validates mail server MX records to confirm if email inboxes are active.', requires: [] },
    { id: 'wappalyzer', name: 'Wappalyzer Tech Stack (Free)', type: 'tech enrichment', enrichment: 'Connected', desc: 'Detects the CMS (WordPress, Shopify, Next.js) and active Javascript libraries.', requires: [] },
    { id: 'hunter', name: 'Hunter.io Email Finder', type: 'email enrichment', enrichment: 'Requires API Key', desc: 'Finds verified professional email addresses and domains.', requires: ['HUNTER_API_KEY'] },
    { id: 'zerobounce', name: 'ZeroBounce Email Verify', type: 'email enrichment', enrichment: 'Requires API Key', desc: 'Checks email deliverability and catches spam traps.', requires: ['ZEROBOUNCE_API_KEY'] },
    { id: 'peopledatalabs', name: 'People Data Labs', type: 'email enrichment', enrichment: 'Requires API Key', desc: 'Enriches lead records with professional social profiles.', requires: ['PEOPLEDATALABS_API_KEY'] },
    { id: 'apify', name: 'Apify Actor (Configurable)', type: 'email enrichment', enrichment: 'Requires Token', desc: 'Triggers Apify Google Maps Scrapers or custom scraper actors.', requires: ['APIFY_TOKEN'] },
    { id: 'twilio', name: 'Twilio Phone Lookup', type: 'phone enrichment', enrichment: 'Requires Credentials', desc: 'Validates line types (mobile vs landline) and carrier names.', requires: ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN'] },
    { id: 'proxycurl', name: 'Proxycurl LinkedIn', type: 'social enrichment', enrichment: 'Requires API Key', desc: 'Scrapes LinkedIn company profiles, headquarters, and sizes.', requires: ['PROXYCURL_API_KEY'] },
    { id: 'google_places', name: 'Google Places Detail', type: 'company enrichment', enrichment: 'Requires API Key', desc: 'Finds opening hours, reviews, and claimed listings on Maps.', requires: ['GOOGLE_PLACES_API_KEY'] },
    { id: 'clearbit', name: 'Clearbit Company', type: 'company enrichment', enrichment: 'Requires API Key', desc: 'Enriches domains with company logos, descriptions, and revenues.', requires: ['CLEARBIT_API_KEY'] },
    { id: 'builtwith', name: 'BuiltWith Tech Stack', type: 'tech enrichment', enrichment: 'Requires API Key', desc: 'Lists every tracking pixel, advertising network, and widget.', requires: ['BUILTWITH_API_KEY'] },
    { id: 'dataforseo', name: 'DataForSEO API', type: 'seo enrichment', enrichment: 'Requires Login', desc: 'Provides real-time search volume and SERP competitor metrics.', requires: ['DATAFORSEO_LOGIN', 'DATAFORSEO_PASSWORD'] }
  ];

  const openManagePlugin = (pluginId: string) => {
    const plugin = PLUGINS.find(p => p.id === pluginId);
    if (!plugin || !integrations) return;
    
    setSelectedPlugin(pluginId);
    setPluginEnabled(integrations.enabled[pluginId] !== false);
    
    const initialKeys: { [key: string]: string } = {};
    plugin.requires.forEach(k => {
      initialKeys[k] = integrations.keys[pluginId]?.[k] || '';
    });
    setEditingKeys(initialKeys);
  };

  const handleSavePlugin = async () => {
    if (!selectedPlugin || !integrations) return;
    
    const updatedEnabled = { ...integrations.enabled, [selectedPlugin]: pluginEnabled };
    const updatedKeys = { ...integrations.keys, [selectedPlugin]: editingKeys };
    
    try {
      await settingsRepository.saveIntegrations({
        enabled: updatedEnabled,
        keys: updatedKeys
      });
      setIntegrations({
        ...integrations,
        enabled: updatedEnabled,
        keys: updatedKeys
      });
      setSelectedPlugin(null);
    } catch (e) {
      console.error('Failed to save integration details:', e);
    }
  };

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

  const toggleShowKey = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!user) return null;

  const currentPlugin = PLUGINS.find(p => p.id === selectedPlugin);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">
            Workspace Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your personal profile, secure credential keys, and data enrichment plugins.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-900/80 p-0.5 rounded-lg border border-slate-200/50 dark:border-slate-800 font-semibold text-xs text-slate-500">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-md transition-all cursor-pointer ${activeTab === 'profile' ? 'bg-white dark:bg-slate-800 text-slate-850 dark:text-white shadow-sm' : 'hover:text-slate-800'}`}
          >
            <User size={13} className="inline mr-1.5" />
            My Profile
          </button>
          <button 
            onClick={() => setActiveTab('integrations')}
            className={`px-4 py-2 rounded-md transition-all cursor-pointer ${activeTab === 'integrations' ? 'bg-white dark:bg-slate-800 text-slate-850 dark:text-white shadow-sm' : 'hover:text-slate-800'}`}
          >
            <Settings size={13} className="inline mr-1.5" />
            Integrations & Plugins
          </button>
        </div>
      </div>

      {activeTab === 'profile' ? (
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
                    className="opacity-60 bg-slate-50 cursor-not-allowed text-slate-400 dark:text-slate-500"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" isLoading={loadingProfile}>
                    Update Profile Info
                  </Button>
                </div>
              </form>
            </Card>

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
      ) : (
        /* Integrations Hub Panel */
        <div className="space-y-6">
          <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800">
            <Sliders className="text-[#D4AF37] h-5 w-5 shrink-0" />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Field mappings and waterfall order are preset per enrichment job — custom mapping UI is disabled until the backend reads these settings.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLUGINS.map(plugin => {
              const isEnabled = integrations?.enabled[plugin.id] !== false;
              let isConfigured = true;
              
              if (plugin.requires.length > 0 && integrations) {
                isConfigured = plugin.requires.every(k => !!integrations.keys[plugin.id]?.[k]);
              }

              let statusText = 'Connected';
              let badgeColor = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';

              if (!isEnabled) {
                statusText = 'Disabled';
                badgeColor = 'bg-slate-500/10 text-slate-500 border-slate-500/20';
              } else if (!isConfigured) {
                statusText = 'Not Configured';
                badgeColor = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
              }

              return (
                <div key={plugin.id} className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-900 rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold tracking-widest text-[#D4AF37] uppercase bg-[#D4AF37]/5 px-2 py-0.5 rounded border border-[#D4AF37]/10">
                        {plugin.type}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                        {statusText}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-850 dark:text-white text-sm pt-1">{plugin.name}</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      {plugin.desc}
                    </p>
                  </div>

                  <div className="pt-4 flex justify-between items-center border-t border-slate-100 dark:border-slate-900/60 mt-4 text-[10px]">
                    <span className="text-slate-400 font-bold">
                      {plugin.requires.length > 0 ? 'Requires API Credentials' : 'Free / Built-in'}
                    </span>
                    <button 
                      onClick={() => openManagePlugin(plugin.id)}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-lg border border-slate-200/50 dark:border-slate-800/80 transition-colors shrink-0 cursor-pointer"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Settings management modal overlay */}
      {selectedPlugin && currentPlugin && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div>
              <span className="text-[8px] font-extrabold tracking-widest text-[#D4AF37] uppercase bg-[#D4AF37]/5 px-2 py-1 rounded border border-[#D4AF37]/10">
                {currentPlugin.type}
              </span>
              <h3 className="font-bold text-slate-850 dark:text-white text-base mt-2">{currentPlugin.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{currentPlugin.desc}</p>
            </div>

            {/* Toggle Status */}
            <div className="flex justify-between items-center py-2 border-y border-slate-100 dark:border-slate-900">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Enable Plugin</p>
                <p className="text-[10px] text-slate-450">Turn on or off this scraper integration</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={pluginEnabled} 
                  onChange={(e) => setPluginEnabled(e.target.checked)} 
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-slate-200 dark:bg-slate-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
            </div>

            {/* API Keys Configuration */}
            {currentPlugin.requires.length > 0 && (
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                  <Globe size={12} className="mr-1 text-[#D4AF37]" />
                  <span>Configure API Keys</span>
                </p>
                {currentPlugin.requires.map(k => (
                  <div key={k} className="relative">
                    <Input 
                      label={k.replace(/_/g, ' ')}
                      type={showKeys[k] ? 'text' : 'password'}
                      value={editingKeys[k] || ''}
                      onChange={(e) => setEditingKeys(prev => ({ ...prev, [k]: e.target.value }))}
                      placeholder={`Enter ${k.replace(/_/g, ' ')}`}
                      className="pr-10"
                    />
                    <button 
                      type="button"
                      onClick={() => toggleShowKey(k)}
                      className="absolute right-3 top-9 text-slate-400 hover:text-slate-650 cursor-pointer"
                    >
                      {showKeys[k] ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-2">
              <button 
                onClick={() => setSelectedPlugin(null)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-350 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <Button onClick={handleSavePlugin}>
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default ProfileSettings;
