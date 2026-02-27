
import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { Product } from '../../types';
import ProductModal from '../ProductModal';
import { useLanguage, useTranslations } from '../../context/LanguageContext';
import { formatCurrency } from '../../utils';

const Products: React.FC = () => {
    const { products, deleteProduct } = useProducts();
    const t = useTranslations();
    const { language } = useLanguage();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddProduct = () => {
        setSelectedProduct(undefined);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteProduct = (id: string) => {
        if (window.confirm(t.deleteConfirmation)) {
            deleteProduct(id);
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 items-start sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl sm:text-4xl font-black text-primary-green tracking-tight">{t.productsTitle}</h1>
                <button 
                    onClick={handleAddProduct}
                    className="w-full sm:w-auto bg-primary-green text-dark-blue font-black py-3 px-8 rounded-2xl hover:bg-green-400 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                >
                    <span className="text-2xl leading-none font-light">+</span>
                    {t.addProduct}
                </button>
            </div>
            
            <div className="relative w-full max-w-md">
                <span className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 flex items-center pl-4 rtl:pl-0 rtl:pr-4 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-theme-text-muted" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                </span>
                <input
                    type="text"
                    placeholder={t.searchProductsPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-theme-card border border-theme-border rounded-2xl py-4 pl-12 pr-4 rtl:pl-4 rtl:pr-12 text-theme-text focus:ring-2 focus:ring-primary-green outline-none transition-all placeholder-theme-text-muted"
                />
            </div>

            {/* Mobile Card View - Centered Name and Quantity */}
            <div className="grid grid-cols-1 gap-4 sm:hidden">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <div key={product.id} className="bg-theme-card border border-theme-border p-5 rounded-3xl shadow-sm space-y-4">
                            {/* Header: Actions (Left) and Centered Name */}
                            <div className="relative flex items-center justify-center min-h-[40px]">
                                <div className="absolute left-0 flex gap-2">
                                    <button onClick={() => handleDeleteProduct(product.id)} className="p-2 bg-red-500/10 text-red-500 rounded-xl active:scale-90 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                                    </button>
                                    <button onClick={() => handleEditProduct(product)} className="p-2 bg-accent-yellow/10 text-accent-yellow rounded-xl active:scale-90 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                                    </button>
                                </div>
                                <h3 className="text-xl font-black text-theme-text px-12 text-center">{product.name}</h3>
                            </div>
                            
                            {/* Separator Line */}
                            <div className="w-full h-[1.5px] bg-theme-border/60"></div>

                            {/* Body Section */}
                            <div className="flex flex-col gap-6">
                                {/* Top: Centered Quantity */}
                                <div className="flex flex-col items-center w-full">
                                    <p className="text-[11px] font-bold text-theme-text-muted uppercase tracking-wider">{t.quantity}</p>
                                    <div className="inline-flex flex-col items-center">
                                        <p className="text-3xl font-black text-primary-green leading-tight">{product.quantity}</p>
                                        <div className="w-12 h-0.5 bg-primary-green/60 mt-0.5"></div>
                                    </div>
                                </div>

                                {/* Bottom: Side-by-Side Prices */}
                                <div className="flex justify-between items-end">
                                    {/* Sale Price Column */}
                                    <div className="text-center flex-1">
                                        <p className="text-[11px] font-bold text-theme-text-muted mb-1">{t.salePrice}</p>
                                        <p className="text-lg font-black text-primary-green leading-none">{formatCurrency(product.salePrice, language, t)}</p>
                                    </div>

                                    {/* Purchase Price Column */}
                                    <div className="text-center flex-1">
                                        <p className="text-[11px] font-bold text-theme-text-muted mb-1">{t.purchasePrice}</p>
                                        <p className="text-lg font-black text-primary-green leading-none">{formatCurrency(product.purchasePrice, language, t)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-10 bg-theme-card border border-theme-border rounded-3xl opacity-60">
                         {searchTerm ? t.noProductsMatch : t.noProducts}
                    </div>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block bg-theme-card/20 rounded-[2rem] border border-theme-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left rtl:text-right border-collapse">
                        <thead>
                            <tr className="bg-[#1a2b4b]/50 border-b border-theme-border">
                                <th className="p-6 font-black text-white text-base tracking-wide">{t.productName}</th>
                                <th className="p-6 font-black text-white text-base tracking-wide">{t.quantity}</th>
                                <th className="p-6 font-black text-white text-base tracking-wide">{t.purchasePrice}</th>
                                <th className="p-6 font-black text-white text-base tracking-wide">{t.salePrice}</th>
                                <th className="p-6 font-black text-white text-base tracking-wide text-right rtl:text-left">{t.actions}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-theme-border/30">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(product => (
                                    <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-6 font-bold text-theme-text text-lg">{product.name}</td>
                                        <td className="p-6 font-medium text-theme-text">{product.quantity}</td>
                                        <td className="p-6 font-medium text-theme-text">{formatCurrency(product.purchasePrice, language, t)}</td>
                                        <td className="p-6 font-medium text-theme-text">{formatCurrency(product.salePrice, language, t)}</td>
                                        <td className="p-6 text-right rtl:text-left">
                                            <div className="flex justify-end rtl:justify-start space-x-3 rtl:space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEditProduct(product)} className="text-accent-yellow p-2 hover:bg-accent-yellow/10 rounded-xl transition-all active:scale-90">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                                </button>
                                                <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 p-2 hover:bg-red-500/10 rounded-xl transition-all active:scale-90">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center p-20 text-theme-text-muted font-medium italic text-lg opacity-60">
                                        {searchTerm ? t.noProductsMatch : t.noProducts}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} product={selectedProduct} />
        </div>
    );
};

export default Products;
