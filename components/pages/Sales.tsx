
import React, { useState, useMemo } from 'react';
import { useProducts } from '../../context/ProductContext';
import { useLanguage, useTranslations } from '../../context/LanguageContext';
import { toPersianDigits } from '../../utils';

const Sales: React.FC = () => {
    const { products, recordSale } = useProducts();
    const t = useTranslations();
    const { language } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [saleQuantities, setSaleQuantities] = useState<Record<string, string>>({});
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleQuantityChange = (productId: string, value: string, maxQuantity: number) => {
        const numValue = parseInt(value, 10);
        if (value === '' || (numValue >= 0 && numValue <= maxQuantity)) {
            setSaleQuantities(prev => ({ ...prev, [productId]: value }));
        }
    };

    const handleConfirmSale = () => {
        // Fix: Cast Object.entries to ensure quantityStr is treated as a string for parseInt
        const itemsToSell = (Object.entries(saleQuantities) as [string, string][])
            .map(([productId, quantityStr]) => ({
                productId,
                quantity: parseInt(quantityStr, 10) || 0,
            }))
            .filter(item => item.quantity > 0);

        if (itemsToSell.length === 0) {
            setNotification({ type: 'error', message: t.saleErrorNoItems });
            return;
        }

        const result = recordSale(itemsToSell);
        const message = t[result.messageKey as keyof typeof t] || 'An unknown error occurred.';

        setNotification({
            type: result.success ? 'success' : 'error',
            message,
        });

        if (result.success) {
            setSaleQuantities({});
        }

        setTimeout(() => setNotification(null), 5000); 
    };

    const filteredProducts = useMemo(() =>
        products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        ), [products, searchTerm]);

    // Fix: Cast Object.values to string[] to resolve unknown type issues during reduce and parseInt
    const totalItemsToSell = (Object.values(saleQuantities) as string[]).reduce((sum, qty) => sum + (parseInt(qty, 10) || 0), 0);
    const hasItemsToSell = totalItemsToSell > 0;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary-green">{t.sellProducts}</h1>
            
            <div className="sticky top-[73px] md:top-0 z-10 bg-theme-bg py-4 transition-colors duration-300">
                 <div className="relative w-full max-w-sm">
                    <span className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 flex items-center pl-3 rtl:pl-0 rtl:pr-3 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-theme-text-muted" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder={t.searchProductsPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-theme-card border border-theme-border rounded-lg py-2 pl-10 pr-4 rtl:pl-4 rtl:pr-10 text-theme-text focus:ring-primary-green focus:border-primary-green placeholder-theme-text-muted transition-all"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <div key={product.id} className="bg-theme-card p-4 rounded-lg border border-theme-border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all">
                            <div className="flex-1 text-center sm:text-left">
                                <p className="font-semibold text-theme-text">{product.name}</p>
                                <p className="text-sm text-theme-text-muted">
                                    {product.quantity === 0 ? (
                                        <span className="text-red-500 font-bold uppercase tracking-wider">{t.unavailable}</span>
                                    ) : (
                                        <>
                                            {t.currentStock}: <span className="font-medium text-accent-yellow">{language === 'fa' ? toPersianDigits(product.quantity) : product.quantity}</span>
                                        </>
                                    )}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <label htmlFor={`qty-${product.id}`} className="text-sm text-theme-text-muted">{t.quantityToSell}:</label>
                                <input
                                    type="number"
                                    id={`qty-${product.id}`}
                                    value={saleQuantities[product.id] || ''}
                                    onChange={(e) => handleQuantityChange(product.id, e.target.value, product.quantity)}
                                    min="0"
                                    max={product.quantity}
                                    disabled={product.quantity === 0}
                                    className="w-24 bg-theme-bg border border-theme-border rounded-md p-2 text-theme-text text-center focus:ring-primary-green focus:border-primary-green disabled:opacity-50 transition-all"
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-8 text-theme-text-muted bg-theme-card rounded-lg border border-theme-border">
                        {searchTerm ? t.noProductsMatch : t.noProducts}
                    </div>
                )}
            </div>
            
            {notification && (
                <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 sm:left-auto sm:right-5 sm:translate-x-0 z-50 p-4 rounded-lg text-white shadow-2xl ${notification.type === 'success' ? 'bg-primary-green' : 'bg-red-500'}`}>
                    {notification.message}
                </div>
            )}

            <div className="sticky bottom-0 bg-theme-bg/80 backdrop-blur-sm py-4 mt-6 border-t border-theme-border flex justify-end transition-colors duration-300">
                <button
                    onClick={handleConfirmSale}
                    disabled={!hasItemsToSell}
                    className="bg-primary-green text-white dark:text-dark-blue font-bold py-3 px-6 rounded-lg hover:bg-green-400 transition-all disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center shadow-lg active:scale-95"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 rtl:mr-0 rtl:ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {t.confirmSale}
                </button>
            </div>
        </div>
    );
};

export default Sales;
