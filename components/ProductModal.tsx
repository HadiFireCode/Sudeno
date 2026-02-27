
import React, { useState, useEffect, useCallback } from 'react';
import { Product } from '../types';
import { useProducts } from '../context/ProductContext';
import { useTranslations } from '../context/LanguageContext';
import { formatWithCommas, stripCommas, fromPersianDigits, safeParseInt, safeParseFloat, normalizePersian } from '../utils';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: Product;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product }) => {
    const { addProduct, updateProduct, products } = useProducts();
    const t = useTranslations();
    
    // Using strings to allow for live formatting (commas)
    const [formData, setFormData] = useState({
        name: '',
        quantity: '',
        purchasePrice: '',
        salePrice: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isShaking, setIsShaking] = useState(false);
    const [showPriceError, setShowPriceError] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('modal-open');
            if (product) {
                setFormData({
                    name: product.name,
                    quantity: String(product.quantity),
                    purchasePrice: formatWithCommas(String(product.purchasePrice)),
                    salePrice: formatWithCommas(String(product.salePrice))
                });
            } else {
                setFormData({ name: '', quantity: '', purchasePrice: '', salePrice: '' });
            }
            setErrors({});
            setShowPriceError(false);
        } else {
            document.body.classList.remove('modal-open');
        }
        
        return () => document.body.classList.remove('modal-open');
    }, [product, isOpen]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, name: e.target.value }));
        if (errors.name) setErrors(prev => { const n = {...prev}; delete n.name; return n; });
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Normalize Persian digits and strip commas for processing
        const normalized = fromPersianDigits(value);
        
        if (name === 'quantity') {
            // Only allow digits for quantity
            const onlyDigits = normalized.replace(/[^\d]/g, '');
            setFormData(prev => ({ ...prev, [name]: onlyDigits }));
        } else {
            // Price fields: format with commas as user types
            const formatted = formatWithCommas(normalized);
            setFormData(prev => ({ ...prev, [name]: formatted }));
        }
        
        if (errors[name]) setErrors(prev => { const n = {...prev}; delete n[name]; return n; });
    };

    const triggerShake = () => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        const trimmedName = formData.name.trim();

        if (!trimmedName) {
            newErrors.name = t.fieldRequired;
        } else {
            // Check for duplicate names (case-insensitive and normalized)
            const normalizedInput = normalizePersian(trimmedName);
            const isDuplicate = products.some(p => {
                // If we are editing, ignore the current product
                if (product && p.id === product.id) return false;
                return normalizePersian(p.name) === normalizedInput;
            });

            if (isDuplicate) {
                newErrors.name = t.productNameExists;
            }
        }

        if (!formData.quantity) newErrors.quantity = t.fieldRequired;
        if (!formData.purchasePrice) newErrors.purchasePrice = t.fieldRequired;
        if (!formData.salePrice) newErrors.salePrice = t.fieldRequired;

        const pPrice = safeParseFloat(formData.purchasePrice);
        const sPrice = safeParseFloat(formData.salePrice);

        if (pPrice <= 0 && formData.purchasePrice) newErrors.purchasePrice = t.invalidPrice;
        if (sPrice <= 0 && formData.salePrice) newErrors.salePrice = t.invalidPrice;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validate()) {
            triggerShake();
            return;
        }

        const pPrice = safeParseFloat(formData.purchasePrice);
        const sPrice = safeParseFloat(formData.salePrice);

        if (pPrice > sPrice) {
            setShowPriceError(true);
            return;
        }

        const productData = {
            name: formData.name.trim(),
            quantity: safeParseInt(formData.quantity),
            purchasePrice: pPrice,
            salePrice: sPrice
        };
        
        if (product) {
            updateProduct({ ...product, ...productData });
        } else {
            addProduct(productData);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-3xl flex items-center justify-center z-[99999] px-4 py-6"
            onClick={onClose}
        >
            <div 
                className={`bg-theme-card backdrop-blur-md rounded-[2.5rem] border border-theme-border p-8 sm:p-10 w-full max-w-md shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] relative max-h-[90vh] overflow-y-auto ${isShaking ? 'animate-shake' : ''}`}
                style={{ 
                  animation: !isShaking ? 'modal-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' : '',
                  backgroundColor: 'var(--color-modal)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Price Error Overlay */}
                {showPriceError && (
                    <div className="absolute inset-0 z-[20] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center rounded-[2.5rem] animate-fade-in">
                        <div className="bg-red-500/20 p-6 rounded-full mb-6 text-red-500 shadow-lg ring-2 ring-red-500/20">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h3 className="text-white text-3xl font-black mb-4">{t.priceWarningTitle}</h3>
                        <p className="text-white/70 text-lg mb-10 leading-relaxed">{t.priceWarning}</p>
                        <button onClick={() => setShowPriceError(false)} className="w-full bg-primary-green text-dark-blue font-black py-5 rounded-3xl active:scale-95 shadow-2xl transition-all text-xl">{t.ok}</button>
                    </div>
                )}

                <h2 className="text-3xl font-black text-primary-green mb-10 text-center tracking-tight">{product ? t.editProduct : t.addNewProduct}</h2>
                
                <form onSubmit={handleSubmit} className="space-y-7">
                    {/* Product Name */}
                    <div className="relative group">
                        <label htmlFor="name" className="block text-[10px] font-black text-theme-text-muted mb-2 uppercase tracking-[0.2em] px-1">{t.productName}</label>
                        <input 
                            type="text" 
                            name="name" 
                            id="name" 
                            value={formData.name} 
                            onChange={handleNameChange} 
                            autoComplete="off" 
                            className={`w-full bg-white/5 border-2 ${errors.name ? 'border-red-500/50 bg-red-500/5' : 'border-theme-border group-hover:border-primary-green/50'} rounded-3xl p-5 text-theme-text focus:border-primary-green focus:ring-4 focus:ring-primary-green/20 outline-none transition-all text-lg font-bold`}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-2 px-2 font-black animate-slide-down">{errors.name}</p>}
                    </div>

                    {/* Quantity */}
                    <div className="relative group">
                        <label htmlFor="quantity" className="block text-[10px] font-black text-theme-text-muted mb-2 uppercase tracking-[0.2em] px-1">{t.quantity}</label>
                        <input 
                            type="text" 
                            inputMode="numeric"
                            name="quantity" 
                            id="quantity" 
                            value={formData.quantity} 
                            onChange={handleNumberChange} 
                            className={`w-full bg-white/5 border-2 ${errors.quantity ? 'border-red-500/50 bg-red-500/5' : 'border-theme-border group-hover:border-primary-green/50'} rounded-3xl p-5 text-theme-text focus:border-primary-green focus:ring-4 focus:ring-primary-green/20 outline-none transition-all text-lg font-bold`}
                        />
                         {errors.quantity && <p className="text-red-500 text-xs mt-2 px-2 font-black animate-slide-down">{errors.quantity}</p>}
                    </div>

                    {/* Prices Grid */}
                    <div className="grid grid-cols-2 gap-5">
                        <div className="relative group">
                            <label htmlFor="purchasePrice" className="block text-[10px] font-black text-theme-text-muted mb-2 uppercase tracking-[0.2em] px-1">{t.purchasePrice}</label>
                            <input 
                                type="text" 
                                inputMode="numeric"
                                name="purchasePrice" 
                                id="purchasePrice" 
                                value={formData.purchasePrice} 
                                onChange={handleNumberChange} 
                                className={`w-full bg-white/5 border-2 ${errors.purchasePrice ? 'border-red-500/50 bg-red-500/5' : 'border-theme-border group-hover:border-primary-green/50'} rounded-3xl p-5 text-theme-text focus:border-primary-green focus:ring-4 focus:ring-primary-green/20 outline-none transition-all text-lg font-bold text-center`}
                            />
                            {errors.purchasePrice && <p className="text-red-500 text-[10px] mt-2 px-1 font-black leading-tight">{errors.purchasePrice}</p>}
                        </div>
                        <div className="relative group">
                            <label htmlFor="salePrice" className="block text-[10px] font-black text-theme-text-muted mb-2 uppercase tracking-[0.2em] px-1">{t.salePrice}</label>
                            <input 
                                type="text" 
                                inputMode="numeric"
                                name="salePrice" 
                                id="salePrice" 
                                value={formData.salePrice} 
                                onChange={handleNumberChange} 
                                className={`w-full bg-white/5 border-2 ${errors.salePrice ? 'border-red-500/50 bg-red-500/5' : 'border-theme-border group-hover:border-primary-green/50'} rounded-3xl p-5 text-theme-text focus:border-primary-green focus:ring-4 focus:ring-primary-green/20 outline-none transition-all text-lg font-bold text-center`}
                            />
                            {errors.salePrice && <p className="text-red-500 text-[10px] mt-2 px-1 font-black leading-tight">{errors.salePrice}</p>}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-8">
                        <button type="submit" className="w-full sm:flex-1 bg-primary-green text-dark-blue font-black py-5 rounded-3xl hover:bg-green-400 active:scale-95 shadow-2xl shadow-primary-green/20 transition-all order-1 sm:order-2 text-xl">{product ? t.saveChanges : t.addProduct}</button>
                        <button type="button" onClick={onClose} className="w-full sm:flex-1 bg-white/5 text-theme-text font-bold py-5 rounded-3xl hover:bg-white/10 active:scale-95 border-2 border-theme-border transition-all order-2 sm:order-1 text-lg">{t.cancel}</button>
                    </div>
                </form>

                <style>{`
                    @keyframes modal-pop { 
                        from { opacity: 0; transform: scale(0.9) translateY(40px); } 
                        to { opacity: 1; transform: scale(1) translateY(0); } 
                    }
                    @keyframes shake {
                        0%, 100% { transform: translateX(0); }
                        25% { transform: translateX(-8px); }
                        50% { transform: translateX(8px); }
                        75% { transform: translateX(-8px); }
                    }
                    @keyframes slide-down {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes fade-in {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
                    .animate-slide-down { animation: slide-down 0.3s ease-out forwards; }
                    .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                `}</style>
            </div>
        </div>
    );
};

export default ProductModal;
