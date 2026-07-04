import { useState, useEffect } from 'react';
import { salesRepository } from '../../shared/services/salesRepository';
import type { Proposal, Quote, Invoice } from '../../shared/services/salesRepository';

export const useSales = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  const loadSalesData = async () => {
    setLoading(true);
    try {
      const [pList, qList, iList] = await Promise.all([
        salesRepository.listProposals(),
        salesRepository.listQuotes(),
        salesRepository.listInvoices(),
      ]);
      setProposals(pList);
      setQuotes(qList);
      setInvoices(iList);
    } catch (e) {
      console.warn('Failed to load sales database lists:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSalesData();
  }, []);

  const handleCreateProposal = async (proposal: Partial<Proposal>) => {
    try {
      const newProp = await salesRepository.createProposal(proposal);
      setProposals(prev => [newProp, ...prev]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSignProposal = async (id: string, signature: string) => {
    try {
      await salesRepository.signProposal(id, signature);
      setProposals(prev =>
        prev.map(p => p.id === id ? { ...p, status: 'signed', signature } : p)
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateQuote = async (quote: Partial<Quote>) => {
    try {
      const newQuote = await salesRepository.createQuote(quote);
      setQuotes(prev => [newQuote, ...prev]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateInvoice = async (invoice: Partial<Invoice>) => {
    try {
      const newInv = await salesRepository.createInvoice(invoice);
      setInvoices(prev => [newInv, ...prev]);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePayInvoice = async (id: string, status: 'paid') => {
    try {
      await salesRepository.createInvoice({ id, status });
      setInvoices(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    } catch (e) {
      console.error(e);
    }
  };

  const generateAiProposal = async (company: string, goal: string) => {
    return await salesRepository.generateAiProposal(company, goal);
  };

  return {
    proposals,
    quotes,
    invoices,
    loading,
    createProposal: handleCreateProposal,
    signProposal: handleSignProposal,
    createQuote: handleCreateQuote,
    createInvoice: handleCreateInvoice,
    payInvoice: handlePayInvoice,
    generateAiProposal,
    refreshData: loadSalesData,
  };
};
export default useSales;
