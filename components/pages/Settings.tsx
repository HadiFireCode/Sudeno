
import React from 'react';
import { useTranslations } from '../../context/LanguageContext';
import { useProducts } from '../../context/ProductContext';

interface ThemeOptionProps {
    id: string;
    title: string;
    description: string;
    isActive: boolean;
    onToggle: () => void;
    icon: React.ReactNode;
}

const ThemeToggle: React.FC<{ isActive: boolean; onToggle: () => void }> = ({ isActive, onToggle }) => (
    <button 
        onClick={onToggle}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none ${isActive ? 'bg-primary-green shadow-[0_0_15px_rgba(0,191,166,0.3)]' : 'bg-gray-300 dark:bg-gray-700'}`}
    >
        <span 
            className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${isActive ? 'ltr:translate-x-6 rtl:-translate-x-6' : 'ltr:translate-x-1 rtl:-translate-x-1'}`}
        />
    </button>
);

const ThemeCard: React.FC<ThemeOptionProps> = ({ title, description, isActive, onToggle, icon }) => (
    <div 
        className={`flex items-center justify-between p-5 rounded-3xl transition-all border cursor-pointer ${isActive ? 'border-primary-green bg-theme-card shadow-lg' : 'border-theme-border bg-theme-card hover:bg-theme-card/80'}`}
        onClick={onToggle}
        role="button"
    >
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${isActive ? 'bg-primary-green text-white font-bold' : 'bg-gray-100 dark:bg-gray-800 text-theme-text-muted'}`}>
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-theme-text text-lg leading-tight">{title}</h3>
                <p className="text-sm text-theme-text-muted font-medium">{description}</p>
            </div>
        </div>
        <ThemeToggle isActive={isActive} onToggle={onToggle} />
    </div>
);

const Settings: React.FC<{ theme: string; setTheme: (theme: any) => void }> = ({ theme, setTheme }) => {
    const t = useTranslations();
    const { clearAllData } = useProducts();
    const [showAbout, setShowAbout] = React.useState(false);

    const handleClearData = () => {
        if (window.confirm(t.clearDataConfirmation)) {
            clearAllData();
            alert('All data has been cleared.');
        }
    };

    return (
        <div className="space-y-8 max-w-2xl mx-auto pb-12 animate-fade-in-content">
            <h1 className="text-4xl font-black text-theme-text tracking-tight mb-2">{t.settings}</h1>
            
            {/* Theme Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4 px-2">
                    <span className="w-1.5 h-6 bg-primary-green rounded-full"></span>
                    <h2 className="text-xl font-bold text-theme-text opacity-90">{t.themeSettings}</h2>
                </div>
                
                <div className="space-y-3">
                    <ThemeCard 
                        id="default"
                        title={t.defaultTheme}
                        description={t.defaultThemeDesc}
                        isActive={theme === 'default'}
                        onToggle={() => setTheme('default')}
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>}
                    />
                    
                    <ThemeCard 
                        id="light"
                        title={t.lightMode}
                        description={t.lightModeDesc}
                        isActive={theme === 'light'}
                        onToggle={() => setTheme('light')}
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>}
                    />
                    
                    <ThemeCard 
                        id="dark"
                        title={t.darkMode}
                        description={t.darkModeDesc}
                        isActive={theme === 'dark'}
                        onToggle={() => setTheme('dark')}
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
                    />
                </div>
            </div>

            {/* About Section */}
            <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2 mb-4 px-2">
                    <span className="w-1.5 h-6 bg-accent-yellow rounded-full"></span>
                    <h2 className="text-xl font-bold text-theme-text opacity-90">{t.aboutUs}</h2>
                </div>
                
                <div 
                    onClick={() => setShowAbout(true)}
                    className="bg-theme-card border border-theme-border p-5 rounded-3xl flex items-center justify-between gap-4 shadow-sm cursor-pointer hover:bg-theme-card/80 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-accent-yellow/10 text-accent-yellow group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-theme-text text-lg leading-tight">{t.aboutUsTitle}</h3>
                            <p className="text-sm text-theme-text-muted font-medium">{t.brandName} Team</p>
                        </div>
                    </div>
                    <svg className="w-5 h-5 text-theme-text-muted ltr:rotate-0 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>

            {/* Clear Data Section */}
            <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2 mb-4 px-2">
                    <span className="w-1.5 h-6 bg-red-500 rounded-full"></span>
                    <h2 className="text-xl font-bold text-theme-text opacity-90">{t.dangerZone}</h2>
                </div>
                
                <div className="bg-theme-card border border-theme-border p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                    <p className="text-theme-text-muted font-medium text-center sm:text-left">{t.clearDataConfirmation}</p>
                    <button 
                        onClick={handleClearData}
                        className="w-full sm:w-auto bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-2.5 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-sm"
                    >
                        {t.clearAllData}
                    </button>
                </div>
            </div>

            {/* About Modal */}
            {showAbout && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-black/40 backdrop-blur-md animate-fade-in"
                        onClick={() => setShowAbout(false)}
                    />
                    <div className="relative w-full max-w-md bg-theme-modal border border-theme-border rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-up">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 rounded-3xl bg-primary-green/10 text-primary-green">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <button 
                                    onClick={() => setShowAbout(false)}
                                    className="p-2 rounded-xl hover:bg-theme-card text-theme-text-muted transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <h2 className="text-3xl font-black text-theme-text mb-2 tracking-tight">{t.aboutUsTitle}</h2>
                            <p className="text-primary-green font-bold mb-6">{t.creators}</p>
                            
                            <div className="space-y-4 text-theme-text-muted font-medium leading-relaxed">
                                <p>{t.aboutUsDesc}</p>
                                <div className="p-4 bg-theme-card/50 border border-theme-border rounded-2xl text-sm italic">
                                    {t.copyrightNotice}
                                </div>
                            </div>

                            <button 
                                onClick={() => setShowAbout(false)}
                                className="w-full mt-8 bg-primary-green text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-primary-green/20 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                {t.ok}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .animate-fade-in-content {
                    animation: fade-in-content 0.5s ease-out forwards;
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
                .animate-scale-up {
                    animation: scale-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
                @keyframes fade-in-content {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scale-up {
                    from { opacity: 0; transform: scale(0.9) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default Settings;
