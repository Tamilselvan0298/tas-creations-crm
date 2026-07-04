import { useState, useEffect } from 'react';
import { companyRepository } from '../../shared/services/companyRepository';
import type { CompanyProfile } from '../../shared/types';

export const useCompanies = () => {
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const data = await companyRepository.list();
      setCompanies(data);
    } catch (e) {
      console.warn('Failed to load companies database:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleAddCompany = async (profile: Partial<CompanyProfile>) => {
    try {
      const entry: any = {
        name: profile.name || 'New Company',
        phone: profile.phone || '',
        email: profile.email || '',
        website: profile.website || '',
        category: profile.category || 'Other',
        employeesCount: profile.employeesCount || 1,
        annualRevenue: profile.annualRevenue || 0,
        description: profile.description || '',
        socialLinks: profile.socialLinks || {},
        address: profile.address || {},
        coordinates: profile.coordinates || {},
        createdAt: new Date(),
      };
      const newComp = await companyRepository.create(entry);
      setCompanies(prev => [newComp, ...prev]);
    } catch (e) {
      console.error('Failed to create company:', e);
    }
  };

  const handleDeleteCompany = async (id: string) => {
    try {
      await companyRepository.delete(id);
      setCompanies(prev => prev.filter(c => c.id !== id));
      if (selectedCompany?.id === id) {
        setSelectedCompany(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return {
    companies,
    selectedCompany,
    setSelectedCompany,
    loading,
    addCompany: handleAddCompany,
    deleteCompany: handleDeleteCompany,
    refreshCompanies: loadCompanies,
  };
};
export default useCompanies;
