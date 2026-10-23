import React, { useState } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { useLibrary } from '../../context/LibraryContext';
import { formatCurrency } from '../../utils/formatters';
import { toast } from 'react-toastify';
import { DollarSign, CreditCard, Banknote, Smartphone, ShieldCheck } from 'lucide-react';

const PayFineModal = ({ isOpen, onClose, fine }) => {
  const { payFine, waiveFine } = useLibrary();
  const [method, setMethod] = useState('Cash');
  const [waiveReason, setWaiveReason] = useState('Administrative or system discretion waiver');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!fine) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (method === 'Waive') {
        await waiveFine(fine.id, waiveReason);
        toast.info(`Fine of ${formatCurrency(fine.amount)} waived for ${fine.memberName}.`);
      } else {
        await payFine(fine.id, method);
        toast.success(
          `Payment of ${formatCurrency(fine.amount)} received via ${method} for ${fine.memberName}!`
        );
      }
      onClose();
    } catch (err) {
      toast.error(err.message || 'Payment processing failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentOptions = [
    { id: 'Cash', label: 'Cash Payment', icon: Banknote, desc: 'Received at circulation counter' },
    { id: 'Card', label: 'Debit / Credit Card', icon: CreditCard, desc: 'POS Terminal' },
    { id: 'UPI / Online', label: 'UPI / Online Transfer', icon: Smartphone, desc: 'Direct digital receipt' },
    { id: 'Waive', label: 'Waive Fine', icon: ShieldCheck, desc: 'Authorized librarian waiver' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Fine Settlement"
      subtitle={`Fine record #${fine.id.slice(0, 10)}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Fine Summary Box */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500">Fine Due Amount:</span>
            <span className="text-xl font-bold text-rose-600">
              {formatCurrency(fine.amount)}
            </span>
          </div>
          <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-200">
            <p>
              <strong>Member:</strong> {fine.memberName} ({fine.membershipId})
            </p>
            <p className="truncate">
              <strong>Book:</strong> {fine.bookTitle}
            </p>
            <p>
              <strong>Overdue Duration:</strong> {fine.daysOverdue} days (at $1.00/day)
            </p>
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Settlement Method
          </label>
          <div className="space-y-2">
            {paymentOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = method === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setMethod(opt.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs ring-1 ring-indigo-600'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{opt.label}</p>
                      <p className="text-[11px] text-slate-500">{opt.desc}</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={opt.id}
                    checked={isSelected}
                    onChange={() => setMethod(opt.id)}
                    className="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {method === 'Waive' && (
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Waiver Justification Reason
            </label>
            <input
              type="text"
              value={waiveReason}
              onChange={(e) => setWaiveReason(e.target.value)}
              className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. First-time student exemption, book returned next morning"
              required
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant={method === 'Waive' ? 'warning' : 'primary'}
            isLoading={isSubmitting}
          >
            {method === 'Waive' ? 'Waive Fine' : `Record Payment (${formatCurrency(fine.amount)})`}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PayFineModal;
