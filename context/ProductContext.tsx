
import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Product, Sale, Debt } from '../types';

interface ProductContextType {
    products: Product[];
    sales: Sale[];
    debts: Debt[];
    addProduct: (productData: Omit<Product, 'id'>) => void;
    updateProduct: (productData: Product) => void;
    deleteProduct: (id: string) => void;
    recordSale: (items: { productId: string; quantity: number }[]) => { success: boolean; messageKey: string };
    addDebt: (debtData: Omit<Debt, 'id'>) => void;
    updateDebt: (debtData: Debt) => void;
    deleteDebt: (id: string) => void;
    clearAllData: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [products, setProducts] = useLocalStorage<Product[]>('products', []);
    const [sales, setSales] = useLocalStorage<Sale[]>('sales', []);
    const [debts, setDebts] = useLocalStorage<Debt[]>('debts', []);

    const addProduct = (productData: Omit<Product, 'id'>) => {
        const newProduct = { ...productData, id: crypto.randomUUID() };
        setProducts(prev => [...prev, newProduct]);
    };

    const updateProduct = (productData: Product) => {
        setProducts(prev => prev.map(p => p.id === productData.id ? productData : p));
    };

    const deleteProduct = (id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const recordSale = (items: { productId: string; quantity: number }[]) => {
        let success = true;
        let messageKey = 'saleSuccess';
        
        const currentProducts = JSON.parse(JSON.stringify(products));

        for (const item of items) {
            const product = currentProducts.find((p: Product) => p.id === item.productId);
            if (!product) {
                success = false;
                messageKey = 'saleErrorProductNotFound';
                break;
            }
            if (product.quantity < item.quantity) {
                success = false;
                messageKey = 'saleErrorInsufficientStock';
                break;
            }
        }
        
        if (success) {
            const newSales: Sale[] = [];
            setProducts(prev => {
                const newProductsState = [...prev];
                for (const item of items) {
                     const productIndex = newProductsState.findIndex(p => p.id === item.productId);
                     if (productIndex === -1) continue; 
                     const product = newProductsState[productIndex];
                     newProductsState[productIndex] = { ...product, quantity: product.quantity - item.quantity };

                     newSales.push({
                        id: crypto.randomUUID(),
                        productId: product.id,
                        productName: product.name,
                        quantity: item.quantity,
                        purchasePrice: product.purchasePrice, // Capture cost at sale time
                        salePrice: product.salePrice,
                        total: product.salePrice * item.quantity,
                        date: new Date().toISOString(),
                    });
                }
                return newProductsState;
            });
            setSales(prev => [...prev, ...newSales]);
        }

        return { success, messageKey };
    };

    const addDebt = (debtData: Omit<Debt, 'id'>) => {
        const newDebt = { ...debtData, id: crypto.randomUUID() };
        setDebts(prev => [...prev, newDebt]);
    };

    const updateDebt = (debtData: Debt) => {
        setDebts(prev => prev.map(d => d.id === debtData.id ? debtData : d));
    };

    const deleteDebt = (id: string) => {
        setDebts(prev => prev.filter(d => d.id !== id));
    };

    const clearAllData = () => {
        setProducts([]);
        setSales([]);
        setDebts([]);
    };

    return (
        <ProductContext.Provider value={{ products, sales, debts, addProduct, updateProduct, deleteProduct, recordSale, addDebt, updateDebt, deleteDebt, clearAllData }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};
