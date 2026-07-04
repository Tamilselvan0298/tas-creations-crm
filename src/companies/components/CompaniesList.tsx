import React, { useState } from 'react';
import { useCompanies } from '../hooks/useCompanies';
import { CompanyDetailModal } from './CompanyDetailModal';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import { Building2, Plus, Trash2, Eye } from 'lucide-react';

export const CompaniesList: React.FC = () => {
  const {
    companies,
    selectedCompany,
    setSelectedCompany,
    loading,
    addCompany,
    deleteCompany,
  } = useCompanies();

  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [category, setCategory] = useState('Software');
  const [employees, setEmployees] = useState('10');
  const [desc, setDesc] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await addCompany({
      name,
      website,
      category,
      employeesCount: parseInt(employees, 10) || 10,
      description: desc,
    });
    setModalOpen(false);
    // Reset Form
    setName(''); setWebsite(''); setCategory('Software'); setEmployees('10'); setDesc('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100 flex items-center">
            <Building2 size={20} className="mr-2.5 text-[#D4AF37]" />
            <span>Company Directory Ledger</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse registered prospect accounts, review category industries, and trigger quick SEO audits.
          </p>
        </div>

        <Button size="sm" onClick={() => setModalOpen(true)} className="flex items-center space-x-1.5 shrink-0">
          <Plus size={13} />
          <span>New Company</span>
        </Button>
      </div>

      {/* Directory Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent mx-auto mb-2"></div>
          <span>Syncing company profiles...</span>
        </div>
      ) : (
        <Card className="overflow-hidden p-0 border-slate-200/80 dark:border-slate-800/60 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-300 font-bold">
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4">Industry</th>
                  <th className="py-3 px-4">Website</th>
                  <th className="py-3 px-4">Employees</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {companies.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-450 dark:text-slate-400">No company profiles found.</td>
                  </tr>
                ) : (
                  companies.map((comp) => (
                    <tr key={comp.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-850/10 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">{comp.name}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300">
                          {comp.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-300">{comp.website || 'N/A'}</td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-300">{comp.employeesCount}</td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 max-w-[200px] truncate">{comp.description || 'N/A'}</td>
                      <td className="py-3 px-4 text-center flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => setSelectedCompany(comp)}
                          className="p-1 rounded text-slate-450 dark:text-slate-400 hover:text-[#D4AF37] dark:hover:text-[#D4AF37] hover:bg-slate-50 dark:hover:bg-slate-800/35 transition-colors cursor-pointer"
                          title="View Profile"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => deleteCompany(comp.id)}
                          className="p-1 rounded text-slate-450 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-800/35 transition-colors cursor-pointer"
                          title="Delete Company"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Detail overlay */}
      {selectedCompany && (
        <CompanyDetailModal company={selectedCompany} onClose={() => setSelectedCompany(null)} />
      )}

      {/* Creation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <Card className="w-full max-w-sm z-10 shadow-2xl relative">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Add Company Profile</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Company Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input label="Website Domain" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="e.g. acme.com" />
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Industry</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="text-xs py-2 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    <option value="Software">Software</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Food">Food</option>
                    <option value="Retail">Retail</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <Input label="Employees count" type="number" value={employees} onChange={(e) => setEmployees(e.target.value)} />
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description details</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Outline corporate operations..."
                  className="text-xs p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-slate-700 dark:text-slate-250 h-16"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button type="submit" size="sm">Save Company</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
};
export default CompaniesList;
