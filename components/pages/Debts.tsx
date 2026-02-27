
import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { Debt } from '../../types';
import { useLanguage, useTranslations } from '../../context/LanguageContext';
import { formatCurrency } from '../../utils';

const DebtModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    debt?: Debt;
}> = ({ isOpen, onClose, debt }) => {
    const { addDebt, updateDebt } = useProducts();
    const t = useTranslations();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        itemsDescription: '',
        amount: '0',
        contactNumber: '',
        note: ''
    });

    React.useEffect(() => {
        if (isOpen) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }

        if (debt) {
            setFormData({
                firstName: debt.firstName,
                lastName: debt.lastName,
                itemsDescription: debt.itemsDescription,
                amount: String(debt.amount),
                contactNumber: debt.contactNumber || '',
                note: debt.note
            });
        } else {
            setFormData({ firstName: '', lastName: '', itemsDescription: '', amount: '0', contactNumber: '', note: '' });
        }

        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [debt, isOpen]);
    
    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.target.value === '0') {
            const name = e.target.name;
            setFormData(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const debtData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            itemsDescription: formData.itemsDescription,
            amount: parseFloat(formData.amount) || 0,
            contactNumber: formData.contactNumber,
            note: formData.note,
        };
        
        if (debt) {
            updateDebt({ ...debt, ...debtData });
        } else {
            addDebt(debtData);
        }
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-3xl flex items-center justify-center z-[99999] px-4 py-2"
            onClick={onClose}
        >
            <div 
                className="bg-theme-card backdrop-blur-md rounded-[2.5rem] border border-theme-border p-6 sm:p-10 w-full max-w-lg shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] relative"
                style={{ 
                  animation: 'modal-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                  backgroundColor: 'var(--color-modal)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-black text-primary-green mb-4 text-center">{debt ? t.editDebt : t.addNewDebt}</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col">
                            <label htmlFor="lastName" className="block text-[9px] font-black text-theme-text-muted mb-1 px-1 text-right uppercase tracking-[0.15em]">{t.lastName}</label>
                            <input type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleChange} required autoComplete="off" className="w-full bg-black/20 border border-theme-border rounded-xl p-3 text-theme-text focus:ring-2 focus:ring-primary-green outline-none transition-all text-right text-sm"/>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="firstName" className="block text-[9px] font-black text-theme-text-muted mb-1 px-1 text-right uppercase tracking-[0.15em]">{t.firstName}</label>
                            <input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleChange} required autoComplete="off" className="w-full bg-black/20 border border-theme-border rounded-xl p-3 text-theme-text focus:ring-2 focus:ring-primary-green outline-none transition-all text-right text-sm"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="itemsDescription" className="block text-[9px] font-black text-theme-text-muted mb-1 px-1 text-right uppercase tracking-[0.15em]">{t.itemsDescription}</label>
                        <input type="text" name="itemsDescription" id="itemsDescription" value={formData.itemsDescription} onChange={handleChange} required autoComplete="off" className="w-full bg-black/20 border border-theme-border rounded-xl p-3 text-theme-text focus:ring-2 focus:ring-primary-green outline-none transition-all text-right text-sm"/>
                    </div>
                     <div>
                        <label htmlFor="amount" className="block text-[9px] font-black text-theme-text-muted mb-1 px-1 text-right uppercase tracking-[0.15em]">{t.amount}</label>
                        <input type="number" name="amount" id="amount" value={formData.amount} onChange={handleChange} onFocus={handleFocus} required min="0" step="0.01" className="w-full bg-black/20 border border-theme-border rounded-xl p-3 text-theme-text focus:ring-2 focus:ring-primary-green outline-none transition-all font-bold text-center text-sm"/>
                    </div>
                    <div>
                        <label htmlFor="contactNumber" className="block text-[9px] font-black text-theme-text-muted mb-1 px-1 text-right uppercase tracking-[0.15em]">{t.contactNumber}</label>
                        <input type="text" name="contactNumber" id="contactNumber" value={formData.contactNumber} onChange={handleChange} autoComplete="off" className="w-full bg-black/20 border border-theme-border rounded-xl p-3 text-theme-text focus:ring-2 focus:ring-primary-green outline-none transition-all text-right text-sm"/>
                    </div>
                    <div>
                        <label htmlFor="note" className="block text-[9px] font-black text-theme-text-muted mb-1 px-1 text-right uppercase tracking-[0.15em]">{t.note}</label>
                        <textarea name="note" id="note" value={formData.note} onChange={handleChange} rows={2} className="w-full bg-black/20 border border-theme-border rounded-xl p-3 text-theme-text focus:ring-2 focus:ring-primary-green outline-none transition-all resize-none text-right text-sm"></textarea>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button type="submit" className="w-full sm:flex-1 bg-primary-green text-dark-blue font-black py-3.5 rounded-xl hover:bg-green-400 active:scale-95 shadow-xl transition-all order-1 sm:order-2">
                            {debt ? t.saveChanges : t.addDebt}
                        </button>
                        <button type="button" onClick={onClose} className="w-full sm:flex-1 bg-theme-border text-theme-text font-bold py-3.5 rounded-xl hover:bg-theme-card active:scale-95 transition-all order-2 sm:order-1">
                            {t.cancel}
                        </button>
                    </div>
                </form>
                <style>{`
                    @keyframes modal-pop { from { opacity: 0; transform: scale(0.9) translateY(40px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                `}</style>
            </div>
        </div>
    );
};


const Debts: React.FC = () => {
    const { debts, deleteDebt } = useProducts();
    const t = useTranslations();
    const { language } = useLanguage();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDebt, setSelectedDebt] = useState<Debt | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddDebt = () => {
        setSelectedDebt(undefined);
        setIsModalOpen(true);
    };

    const handleEditDebt = (debt: Debt) => {
        setSelectedDebt(debt);
        setIsModalOpen(true);
    };

    const handleDeleteDebt = (id: string) => {
        if (window.confirm(t.deleteConfirmation)) {
            deleteDebt(id);
        }
    };

    const filteredDebts = debts.filter(debt =>
        `${debt.firstName} ${debt.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 items-start sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl sm:text-4xl font-black text-primary-green tracking-tight">{t.debtsTitle}</h1>
                <button 
                    onClick={handleAddDebt}
                    className="w-full sm:w-auto bg-primary-green text-dark-blue font-black py-3 px-8 rounded-2xl hover:bg-green-400 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                >
                    <span className="text-2xl leading-none font-light">+</span>
                    {t.addDebt}
                </button>
            </div>

            <div className="relative w-full max-w-md">
                <span className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 flex items-center pl-4 rtl:pl-0 rtl:pr-4 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-theme-text-muted" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                </span>
                <input
                    type="text"
                    placeholder={t.searchDebtsPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-theme-card border border-theme-border rounded-2xl py-4 pl-12 pr-4 rtl:pl-4 rtl:pr-12 text-theme-text focus:ring-2 focus:ring-primary-green outline-none transition-all placeholder-theme-text-muted text-right"
                />
            </div>

             <div className="grid grid-cols-1 gap-4 sm:hidden">
                {filteredDebts.length > 0 ? (
                    filteredDebts.map(debt => (
                        <div key={debt.id} className="bg-theme-card border border-theme-border p-5 rounded-3xl shadow-sm space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-black text-theme-text leading-tight">{`${debt.firstName} ${debt.lastName}`}</h3>
                                    <p className="text-xs text-theme-text-muted mt-1 font-bold">{debt.contactNumber || t.noContact}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEditDebt(debt)} className="p-2 bg-accent-yellow/10 text-accent-yellow rounded-xl active:scale-90 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                                    </button>
                                    <button onClick={() => handleDeleteDebt(debt.id)} className="p-2 bg-red-500/10 text-red-500 rounded-xl active:scale-90 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                                    </button>
                                </div>
                            </div>
                            <div className="border-t border-theme-border/20 pt-4 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-theme-text-muted uppercase tracking-wider">{t.amount}</span>
                                    <span className="text-xl font-black text-primary-green">{formatCurrency(debt.amount, language, t)}</span>
                                </div>
                                <p className="text-sm font-medium text-theme-text line-clamp-2">{debt.itemsDescription}</p>
                                {debt.note && <p className="text-xs italic text-theme-text-muted mt-2 border-l-2 border-primary-green pl-3">{debt.note}</p>}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-10 bg-theme-card border border-theme-border rounded-3xl opacity-60">
                         {searchTerm ? t.noDebtsMatch : t.noDebts}
                    </div>
                )}
            </div>

             <div className="hidden sm:block bg-theme-card/30 rounded-[2rem] border border-theme-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-right border-collapse">
                        <thead>
                             <tr className="bg-theme-sidebar/40 border-b border-theme-border text-center">
                                <th className="p-6 font-black text-theme-text text-base tracking-wide">{t.debtorName}</th>
                                <th className="p-6 font-black text-theme-text text-base tracking-wide">{t.amount}</th>
                                <th className="p-6 font-black text-theme-text text-base tracking-wide">{t.items}</th>
                                <th className="p-6 font-black text-theme-text text-base tracking-wide">{t.actions}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-theme-border/30">
                            {filteredDebts.length > 0 ? (
                                filteredDebts.map(debt => (
                                    <tr key={debt.id} className="hover:bg-theme-card/50 transition-colors group text-center">
                                        <td className="p-6 font-bold text-theme-text text-lg whitespace-nowrap">{`${debt.firstName} ${debt.lastName}`}</td>
                                        <td className="p-6 font-bold text-primary-green">{formatCurrency(debt.amount, language, t)}</td>
                                        <td className="p-6 font-medium text-theme-text">{debt.itemsDescription}</td>
                                        <td className="p-6">
                                            <div className="flex justify-center space-x-3 rtl:space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEditDebt(debt)} className="text-accent-yellow p-2 hover:bg-accent-yellow/10 rounded-xl transition-all active:scale-90">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                                </button>
                                                <button onClick={() => handleDeleteDebt(debt.id)} className="text-red-500 p-2 hover:bg-red-500/10 rounded-xl transition-all active:scale-90">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center p-20 text-theme-text-muted font-medium italic text-lg opacity-60">
                                        {searchTerm ? t.noDebtsMatch : t.noDebts}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <DebtModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} debt={selectedDebt} />
        </div>
    );
};

export default Debts;
