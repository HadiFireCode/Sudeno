
import React from 'react';
import { useProducts } from '../../context/ProductContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useLanguage, useTranslations } from '../../context/LanguageContext';
import { formatCurrency, toPersianDigits } from '../../utils';

const Reports: React.FC = () => {
    const { products } = useProducts();
    const t = useTranslations();
    const { language } = useLanguage();

    const totalInventoryValue = products.reduce((acc, p) => acc + p.purchasePrice * p.quantity, 0);
    const potentialRevenue = products.reduce((acc, p) => acc + p.salePrice * p.quantity, 0);
    const potentialProfit = potentialRevenue - totalInventoryValue;
    const profitMargin = potentialRevenue > 0 ? (potentialProfit / potentialRevenue) * 100 : 0;

    const pieData = products.map(p => ({
        name: p.name,
        value: p.salePrice * p.quantity,
    }));
    
    const getDynamicColor = (index: number) => {
        const hue = (index * 137.5) % 360;
        return `hsl(${hue}, 75%, 60%)`;
    };

    return (
        <div className="space-y-8 animate-fade-in-content">
            <h1 className="text-3xl sm:text-4xl font-black text-primary-green tracking-tight">{t.reports}</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-theme-card p-8 rounded-3xl border border-theme-border text-center shadow-sm">
                    <h3 className="text-sm font-bold text-theme-text-muted uppercase tracking-widest">{t.potentialProfit}</h3>
                    <p className="text-3xl font-black text-primary-green mt-3">{formatCurrency(potentialProfit, language, t)}</p>
                    <div className="w-12 h-1 bg-accent-yellow my-4 mx-auto rounded-full opacity-50"></div>
                </div>
                <div className="bg-theme-card p-8 rounded-3xl border border-theme-border text-center shadow-sm">
                    <h3 className="text-sm font-bold text-theme-text-muted uppercase tracking-widest">{t.profitMargin}</h3>
                    <p className="text-3xl font-black text-primary-green mt-3">{language === 'fa' ? `${toPersianDigits(profitMargin.toFixed(2))}%` : `${profitMargin.toFixed(2)}%`}</p>
                    <div className="w-12 h-1 bg-accent-yellow my-4 mx-auto rounded-full opacity-50"></div>
                </div>
                <div className="bg-theme-card p-8 rounded-3xl border border-theme-border text-center shadow-sm">
                    <h3 className="text-sm font-bold text-theme-text-muted uppercase tracking-widest">{t.totalRevenuePotential}</h3>
                    <p className="text-3xl font-black text-primary-green mt-3">{formatCurrency(potentialRevenue, language, t)}</p>
                    <div className="w-12 h-1 bg-accent-yellow my-4 mx-auto rounded-full opacity-50"></div>
                </div>
            </div>

            <div className="bg-theme-card p-6 sm:p-10 rounded-3xl border border-theme-border shadow-sm">
                <h2 className="text-xl font-bold text-theme-text mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary-green rounded-full"></span>
                    {t.revenueByProduct}
                </h2>
                <div style={{ width: '100%', height: 450 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                outerRadius={140}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ percent }) => {
                                    const safePercent = typeof percent === 'number' ? percent : 0;
                                    if (safePercent < 0.03) {
                                        return '';
                                    }
                                    const percentage = (safePercent * 100).toFixed(0);
                                    return `${language === 'fa' ? toPersianDigits(percentage) : percentage}%`;
                                }}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getDynamicColor(index)} stroke="rgba(0,0,0,0.1)" strokeWidth={2} />
                                ))}
                            </Pie>
                            <Tooltip
                                 contentStyle={{
                                    backgroundColor: 'var(--color-sidebar)',
                                    borderColor: 'var(--color-border)',
                                    color: 'var(--color-text)',
                                    borderRadius: '16px',
                                    fontWeight: 'bold'
                                }}
                                formatter={(value: number) => formatCurrency(value, language, t)}
                            />
                            <Legend 
                                wrapperStyle={{ paddingTop: '30px' }}
                                verticalAlign="bottom"
                                formatter={(value) => <span className="text-theme-text font-bold text-sm">{value && value.length > 20 ? `${value.substring(0, 18)}...` : value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Reports;
