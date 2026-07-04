import React, { useState } from 'react';
import type { Invoice } from '../../shared/services/salesRepository';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import { Receipt, Plus, QrCode, Check } from 'lucide-react';

interface InvoicesListProps {
  invoices: Invoice[];
  onCreateInvoice: (invoice: Partial<Invoice>) => Promise<void>;
  onUpdateInvoiceStatus: (id: string, status: 'paid') => Promise<void>;
}

export const InvoicesList: React.FC<InvoicesListProps> = ({
  invoices,
  onCreateInvoice,
  onUpdateInvoiceStatus,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedInv, setSelectedInv] = useState<Invoice | null>(null);

  // Form states
  const [company, setCompany] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !amount) return;
    await onCreateInvoice({
      company,
      amount: parseFloat(amount),
      dueDate: dueDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setModalOpen(false);
    setCompany(''); setAmount(''); setDueDate('');
  };

  const handleSimulatePayment = async () => {
    if (!selectedInv) return;
    await onUpdateInvoiceStatus(selectedInv.id, 'paid');
    setPayModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Table Header actions */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center">
          <Receipt size={15} className="mr-2 text-[#D4AF37]" />
          Corporate Invoices ({invoices.length})
        </h3>
        <Button size="sm" onClick={() => setModalOpen(true)} className="flex items-center space-x-1.5">
          <Plus size={13} />
          <span>New Invoice</span>
        </Button>
      </div>

      {/* Invoice list */}
      <Card className="overflow-hidden p-0 border-slate-200/80 dark:border-slate-800/60 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-bold">
                <th className="py-3 px-4">Invoice Number</th>
                <th className="py-3 px-4">Client Company</th>
                <th className="py-3 px-4">Billing Amount</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">No invoices generated yet.</td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-850/10 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-205">{inv.invoiceNumber}</td>
                    <td className="py-3 px-4 text-slate-500">{inv.company}</td>
                    <td className="py-3 px-4 font-bold text-slate-750 dark:text-slate-200">${inv.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-400">{inv.dueDate}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        inv.status === 'paid' ? 'bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600' : 'bg-amber-100 dark:bg-amber-950/20 text-amber-600'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {inv.status !== 'paid' && (
                        <button
                          onClick={() => { setSelectedInv(inv); setPayModalOpen(true); }}
                          className="px-2 py-1 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 rounded-lg text-[10px] font-bold cursor-pointer transition-all"
                        >
                          Collect Pay
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Collect Pay popup modal with simulated QR Code */}
      {payModalOpen && selectedInv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setPayModalOpen(false)} />
          <Card className="w-full max-w-sm z-10 shadow-2xl relative text-center flex flex-col items-center p-6">
            <h4 className="font-bold text-slate-800 dark:text-white mb-1">Scan & Pay via UPI</h4>
            <p className="text-[10px] text-slate-400 font-semibold mb-4">Invoice {selectedInv.invoiceNumber} • ${selectedInv.amount}</p>
            
            {/* Visual simulated QR code box */}
            <div className="h-44 w-44 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center mb-6 relative">
              <QrCode size={120} className="text-[#0B1F3A] dark:text-[#D4AF37]" />
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none text-[8px] font-bold">UPI GATEWAY</div>
            </div>

            <Button onClick={handleSimulatePayment} className="w-full flex items-center justify-center space-x-1.5">
              <Check size={13} />
              <span>Simulate Pay Complete</span>
            </Button>
          </Card>
        </div>
      )}

      {/* Creation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <Card className="w-full max-w-sm z-10 shadow-2xl relative">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Generate Billing Invoice</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Client Company Name" value={company} onChange={(e) => setCompany(e.target.value)} required />
              <Input label="Invoice Billing Amount ($)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              <Input label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button type="submit" size="sm">Save Invoice</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
};
export default InvoicesList;
