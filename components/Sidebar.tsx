
import React from 'react';
import { useLanguage, useTranslations } from '../context/LanguageContext';

type Page = 'dashboard' | 'products' | 'sales' | 'debts' | 'reports' | 'settings';

interface SidebarProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const NavLink: React.FC<{
    page: Page;
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    children: React.ReactNode;
    icon: React.ReactNode;
}> = ({ page, currentPage, setCurrentPage, children, icon }) => {
    const isActive = currentPage === page;
    return (
        <button
            onClick={() => setCurrentPage(page)}
            className={`flex items-center w-full px-4 py-3 text-left transition-all duration-200 rounded-xl ${
                isActive
                    ? 'bg-primary-green text-white font-bold shadow-lg shadow-primary-green/20 scale-[1.02]'
                    : 'text-theme-text-muted hover:bg-theme-card hover:text-theme-text'
            }`}
        >
            <span className="mr-3 rtl:mr-0 rtl:ml-3">{icon}</span>
            <span className="text-sm font-semibold">{children}</span>
        </button>
    );
};


const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, setIsOpen }) => {
    const t = useTranslations();
    const { toggleLanguage, language } = useLanguage();

    const closedTransform = language === 'fa' ? 'translate-x-full' : '-translate-x-full';

    const sidebarContent = (
        <div className="flex flex-col h-full p-4 bg-theme-sidebar border-r border-theme-border rtl:border-r-0 rtl:border-l">
            <div className="flex items-center justify-between mb-10 px-2">
                 <h1 className="text-2xl font-black text-primary-green tracking-tighter">SUDENO</h1>
                 <button onClick={() => setIsOpen(false)} className="md:hidden text-theme-text p-2 rounded-xl hover:bg-theme-card" aria-label="Close menu">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <nav className="flex-1 space-y-2">
                 <NavLink page="dashboard" currentPage={currentPage} setCurrentPage={setCurrentPage} icon={<DashboardIcon />}>{t.dashboard}</NavLink>
                <NavLink page="products" currentPage={currentPage} setCurrentPage={setCurrentPage} icon={<ProductsIcon />}>{t.products}</NavLink>
                <NavLink page="sales" currentPage={currentPage} setCurrentPage={setCurrentPage} icon={<SalesIcon />}>{t.sales}</NavLink>
                <NavLink page="debts" currentPage={currentPage} setCurrentPage={setCurrentPage} icon={<DebtsIcon />}>{t.debts}</NavLink>
                <NavLink page="reports" currentPage={currentPage} setCurrentPage={setCurrentPage} icon={<ReportsIcon />}>{t.reports}</NavLink>
                <NavLink page="settings" currentPage={currentPage} setCurrentPage={setCurrentPage} icon={<SettingsIcon />}>{t.settings}</NavLink>
            </nav>
            <div className="mt-auto p-2 space-y-2">
                <button
                    onClick={toggleLanguage}
                    className="w-full px-4 py-3 text-center text-theme-text font-bold bg-theme-card rounded-2xl hover:bg-theme-card/80 border border-theme-border transition-all shadow-sm active:scale-95"
                >
                    {t.languageToggle}
                </button>
                <div className="pt-4 border-t border-theme-border/50 text-center">
                    <p className="text-[10px] font-black tracking-[0.2em] text-theme-text-muted uppercase opacity-40 mb-1">Product of</p>
                    <p className="text-sm font-black text-primary-green tracking-tighter">PyroBit Team</p>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile overlay - elevated to the absolute first layer (z-9999) */}
            <div 
                className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            ></div>

            {/* Sidebar - elevated to absolute first layer (z-[9999]) on mobile */}
            <aside className={`fixed top-0 left-0 rtl:left-auto rtl:right-0 h-full w-64 bg-theme-sidebar z-[9999] md:z-50 md:translate-x-0 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : closedTransform}`}>
               {sidebarContent}
            </aside>
        </>
    );
};

// Icons with consistent stroke width
const DashboardIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>);
const ProductsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>);
const SalesIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1h4v1m-4 0h-4v-1h4v1zm0 14v-1h4v1m-4 0h-4v-1h4v1z" /></svg>);
const DebtsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>);
const ReportsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>);
const SettingsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);

export default Sidebar;
