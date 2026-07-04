import { useState, useEffect, useCallback } from 'react';
import { auditRepository } from '../../shared/services/auditRepository';
import type { AuditReport } from '../../shared/services/auditRepository';

export const useAudit = () => {
  const [audits, setAudits] = useState<AuditReport[]>([]);
  const [activeReport, setActiveReport] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [crawling, setCrawling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchUrl, setSearchUrl] = useState('');

  const loadPastAudits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await auditRepository.fetchAudits();
      setAudits(data);
      if (data.length > 0 && !activeReport) {
        setActiveReport(data[data.length - 1]);
      }
    } catch (err: any) {
      console.warn('Failed to load past audits:', err);
    } finally {
      setLoading(false);
    }
  }, [activeReport]);

  useEffect(() => {
    loadPastAudits();
  }, [loadPastAudits]);

  const triggerAudit = async (targetUrl: string) => {
    if (!targetUrl.trim()) return;
    setCrawling(true);
    setError(null);
    try {
      const result = await auditRepository.runCrawl(targetUrl);
      setActiveReport(result);
      setAudits(prev => {
        const filtered = prev.filter(a => a.id !== result.id);
        return [...filtered, result];
      });
      setSearchUrl('');
    } catch (err: any) {
      setError(err.message || 'Scan failed.');
    } finally {
      setCrawling(false);
    }
  };

  const selectReport = (id: string) => {
    const report = audits.find(a => a.id === id);
    if (report) {
      setActiveReport(report);
    }
  };

  return {
    audits,
    activeReport,
    loading,
    crawling,
    error,
    setError,
    searchUrl,
    setSearchUrl,
    triggerAudit,
    selectReport,
    refreshList: loadPastAudits,
  };
};
export default useAudit;
