import React, { useState } from 'react';
import type { Quote, QuoteItem } from '../../shared/services/salesRepository';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import { FileSpreadsheet, Plus, Trash2 } from 'lucide-react';

interface QuotationsListProps {
  quotes: Quote[];
  onCreateQuote: (quote: Partial<Quote>) => Promise<void>;
}

export const QuotationsList: React.FC<QuotationsListProps> = ({
  quotes,
  onCreateQuote,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [company, setCompany] = useState('');
  
  // Dynamic Quote items list builders
  const [items, setItems] = useState<QuoteItem[]>([
    { name: 'Website Design & Development', price: 1500 }
  ]);
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('');
  const [discount, setDiscount] = useState('100');
  const [gstPercent, setGstPercent] = useState('18');

  const addCustomItem = () => {
    if (!customItemName.trim() || !customItemPrice.trim()) return;
    setItems(prev => [...prev, { name: customItemName, price: parseFloat(customItemPrice) }]);
    setCustomItemName('');
    setCustomItemPrice('');
  };

  const removeItem = (idx: number) => {
    setItems(prev => prev.filter((_, i) => i !== idx));
  };

  // Computations
  const subtotal = items.reduce((acc, it) => acc + it.price, 0);
  const discountOffset = parseFloat(discount) || 0;
  const gstRate = parseFloat(gstPercent) || 0;
  const afterDiscount = Math.max(0, subtotal - discountOffset);
  const gstTax = Math.round(afterDiscount * (gstRate / 100));
  const finalTotal = afterDiscount + gstTax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || items.length === 0) return;
    await onCreateQuote({
      company,
      items,
      discount: discountOffset,
      gstPercent: gstRate,
      total: finalTotal,
    });
    setModalOpen(false);
    // Reset Form
    setCompany(''); setItems([{ name: 'Website Design & Development', price: 1500 }]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Table Header actions */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center">
          <FileSpreadsheet size={15} className="mr-2 text-[#D4AF37]" />
          Quotations Builder ({quotes.length})
        </h3>
        <Button size="sm" onClick={() => setModalOpen(true)} className="flex items-center space-x-1.5">
          <Plus size={13} />
          <span>New Quotation</span>
        </Button>
      </div>

      {/* Quote lists */}
      <Card className="overflow-hidden p-0 border-slate-200/80 dark:border-slate-800/60 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-bold">
                <th className="py-3 px-4">Client Company</th>
                <th className="py-3 px-4">Total Price</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">GST Rate</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {quotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">No quotation profiles drafted yet.</td>
                </tr>
              ) : (
                quotes.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-850/10 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-205">{q.company}</td>
                    <td className="py-3 px-4 font-bold text-[#D4AF37]">${q.total.toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-500">${q.discount}</td>
                    <td className="py-3 px-4 text-slate-500">{q.gstPercent}%</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {q.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400">{new Date(q.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Creation popup modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <Card className="w-full max-w-lg z-10 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Draft Itemized Quotation</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Client Company Name" value={company} onChange={(e) => setCompany(e.target.value)} required />

              {/* Items checklist */}
              <div className="space-y-2.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Quoted Line Items</span>
                <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800">
                  {items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs text-slate-650 dark:text-slate-200">
                      <span className="font-semibold">{it.name}</span>
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-[#D4AF37]">${it.price}</span>
                        <button type="button" onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-600 cursor-pointer">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Custom Item form row */}
                <div className="flex gap-2">
                  <input type="text" placeholder="Line item name" value={customItemName} onChange={(e) => setCustomItemName(e.target.value)} className="text-xs p-1.5 flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none" />
                  <input type="number" placeholder="Price ($)" value={customItemPrice} onChange={(e) => setCustomItemPrice(e.target.value)} className="text-xs p-1.5 w-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none" />
                  <Button type="button" size="sm" onClick={addCustomItem}>Add</Button>
                </div>
              </div>

              {/* Discount/GST configurations */}
              <div className="grid grid-cols-2 gap-4">
                <Input label="Discount Deduction ($)" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                <Input label="GST Tax Percentage (%)" type="number" value={gstPercent} onChange={(e) => setGstPercent(e.target.value)} />
              </div>

              {/* Total Summary */}
              <div className="p-4 bg-slate-100/50 dark:bg-slate-950 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-400">Subtotal</span><span className="font-semibold text-slate-700 dark:text-slate-200">${subtotal}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Discount</span><span className="font-semibold text-red-500">-${discountOffset}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">GST Tax ({gstPercent}%)</span><span className="font-semibold text-slate-700 dark:text-slate-200">${gstTax}</span></div>
                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-850 font-bold text-sm"><span className="text-slate-700 dark:text-white">Estimated Total</span><span className="text-[#D4AF37]">${finalTotal}</span></div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button type="submit" size="sm">Save Quote</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
};
export default QuotationsList;
