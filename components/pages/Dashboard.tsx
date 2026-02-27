
import React from 'react';
import { useProducts } from '../../context/ProductContext';
import { useLanguage, useTranslations } from '../../context/LanguageContext';
import { formatCurrency } from '../../utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
    const { products, sales } = useProducts();
    const t = useTranslations();
    const { language } = useLanguage();

    const totalInventoryValue = products.reduce((acc, p) => acc + p.purchasePrice * p.quantity, 0);
    const potentialRevenue = products.reduce((acc, p) => acc + p.salePrice * p.quantity, 0);
    const productVariants = products.length;
    const totalUnits = products.reduce((acc, p) => acc + p.quantity, 0);
    const totalRevenue = sales.reduce((acc, sale) => acc + sale.total, 0);
    
    // Calculate Net Profit using Captured Purchase Prices
    const totalProfit = sales.reduce((acc, sale) => {
        const costPrice = sale.purchasePrice || 0;
        const profitPerUnit = sale.salePrice - costPrice;
        return acc + (profitPerUnit * sale.quantity);
    }, 0);

    const getBestSellingByQuantity = () => {
        if (sales.length === 0) return t.noSalesYet;
        
        // Group by productId and sum quantity
        const qtyById = sales.reduce((acc, sale) => {
            acc[sale.productId] = (acc[sale.productId] || 0) + sale.quantity;
            return acc;
        }, {} as Record<string, number>);
        
        const entries = Object.entries(qtyById);
        if (entries.length === 0) return t.noSalesYet;
        
        const [bestId] = entries.reduce((a, b) => a[1] > b[1] ? a : b);
        const currentProduct = products.find(p => p.id === bestId);
        return currentProduct ? currentProduct.name : (sales.find(s => s.productId === bestId)?.productName || t.noSalesYet);
    };

    const getTopProfitableProduct = () => {
        if (sales.length === 0) return t.noSalesYet;
        
        // Group by productId and sum net profit
        const profitById = sales.reduce((acc, sale) => {
            const costPrice = sale.purchasePrice || 0;
            const profitPerUnit = sale.salePrice - costPrice;
            acc[sale.productId] = (acc[sale.productId] || 0) + (profitPerUnit * sale.quantity);
            return acc;
        }, {} as Record<string, number>);
        
        const entries = Object.entries(profitById);
        if (entries.length === 0) return t.noSalesYet;
        
        const [bestId] = entries.reduce((a, b) => a[1] > b[1] ? a : b);
        const currentProduct = products.find(p => p.id === bestId);
        return currentProduct ? currentProduct.name : (sales.find(s => s.productId === bestId)?.productName || t.noSalesYet);
    };

    const chartData = products.map(p => ({
        name: p.name,
        [t.quantity]: p.quantity,
        [t.value]: p.purchasePrice * p.quantity,
    }));
    
    const StatCard: React.FC<{ title: string; value: string; description: string; accentColor?: string }> = ({ title, value, description, accentColor }) => (
        <div className={`bg-theme-card p-6 rounded-xl border border-theme-border transition-all hover:scale-[1.02]`}>
            <h3 className="text-[10px] font-black text-theme-text-muted uppercase tracking-widest">{title}</h3>
            <p className={`text-2xl font-black mt-2 truncate ${accentColor || 'text-primary-green'}`}>{value}</p>
            <p className="text-[10px] text-theme-text-muted mt-1 opacity-70 font-bold">{description}</p>
        </div>
    );

    const isLight = document.documentElement.style.getPropertyValue('--color-bg') === '#F2F2F7';

    return (
        <div className="space-y-8">
            <h1 className="text-3xl sm:text-4xl font-black text-primary-green tracking-tight">{t.dashboard}</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Row 1: Primary Finance Metrics */}
                <StatCard title={t.totalRevenue} value={formatCurrency(totalRevenue, language, t)} description={t.totalRevenueDesc} />
                <StatCard title={t.totalProfit} value={formatCurrency(totalProfit, language, t)} description={t.totalProfitDesc} />
                <StatCard title={t.potentialRevenue} value={formatCurrency(potentialRevenue, language, t)} description={t.potentialRevenueDesc} />
                <StatCard title={t.inventoryCost} value={formatCurrency(totalInventoryValue, language, t)} description={t.inventoryCostDesc} />
                
                {/* Row 2: Sales Performance Stats */}
                <StatCard title={t.bestSellingProduct} value={getBestSellingByQuantity()} description={t.bestSellingProductDesc} />
                <StatCard title={t.topRevenueProduct} value={getTopProfitableProduct()} description={t.topRevenueProductDesc} />
                <StatCard title={t.productVariants} value={String(productVariants)} description={t.productVariantsDesc} />
                <StatCard title={t.totalUnits} value={String(totalUnits)} description={t.totalUnitsDesc} />
            </div>

            <div className="bg-theme-card p-4 sm:p-6 rounded-2xl border border-theme-border transition-all">
                <h2 className="text-xl font-black text-theme-text mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary-green rounded-full"></span>
                    {t.inventoryOverview}
                </h2>
                <div style={{ width: '100%', height: 450 }}>
                    <ResponsiveContainer>
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 70 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isLight ? "rgba(0,0,0,0.1)" : "rgba(255, 255, 255, 0.1)"} />
                            <XAxis 
                                dataKey="name" 
                                stroke="var(--color-text-muted)" 
                                tick={{ fill: 'var(--color-text-muted)', fontSize: 11, fontWeight: 'bold' }}
                                angle={-30}
                                textAnchor="end"
                                interval={0}
                                tickFormatter={(value) => (value && value.length > 15 ? `${value.substring(0, 12)}...` : value)}
                            />
                            <YAxis yAxisId="left" orientation="left" stroke="var(--color-primary)" tick={{ fill: 'var(--color-primary)', fontSize: 10 }} />
                            <YAxis yAxisId="right" orientation="right" stroke="#FFC107" tick={{ fill: '#FFC107', fontSize: 10 }} />
                            <Tooltip 
                                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                contentStyle={{
                                    backgroundColor: 'var(--color-sidebar)',
                                    borderColor: 'var(--color-border)',
                                    color: 'var(--color-text)',
                                    borderRadius: '16px',
                                    fontWeight: 'bold',
                                    borderWidth: '2px'
                                }}
                                itemStyle={{ color: 'var(--color-text)' }}
                            />
                            <Legend wrapperStyle={{ color: 'var(--color-text)', paddingTop: '20px' }} verticalAlign="top" />
                            <Bar yAxisId="left" dataKey={t.quantity} fill="var(--color-primary)" radius={[6, 6, 0, 0]} barSize={20} />
                            <Bar yAxisId="right" dataKey={t.value} fill="#FFC107" radius={[6, 6, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
