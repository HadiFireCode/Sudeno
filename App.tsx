
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/pages/Dashboard';
import Products from './components/pages/Products';
import Sales from './components/pages/Sales';
import Debts from './components/pages/Debts';
import Reports from './components/pages/Reports';
import Settings from './components/pages/Settings';
import { ProductProvider } from './context/ProductContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { useLocalStorage } from './hooks/useLocalStorage';

type Page = 'dashboard' | 'products' | 'sales' | 'debts' | 'reports' | 'settings';
type ThemeMode = 'default' | 'light' | 'dark';

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => (
    <header className="md:hidden bg-theme-bg/95 backdrop-blur-md sticky top-0 z-10 flex items-center p-4 border-b border-theme-border">
        <button onClick={onMenuClick} className="text-theme-text p-2 rounded-xl hover:bg-theme-card active:scale-95 transition-all" aria-label="Open menu">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
        </button>
         <h1 className="text-xl font-black text-primary-green tracking-wider mx-auto uppercase pr-8">SUDENO</h1>
    </header>
);

const BottomNav: React.FC<{ currentPage: Page; setCurrentPage: (p: Page) => void }> = ({ currentPage, setCurrentPage }) => (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-theme-sidebar/95 backdrop-blur-lg border-t border-theme-border z-10 flex items-center justify-around p-2 pb-safe">
        {[
            { id: 'dashboard', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
            { id: 'products', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
            { id: 'sales', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1h4v1" /></svg> },
            { id: 'debts', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2" /></svg> }
        ].map(item => (
            <button
                key={item.id}
                onClick={() => setCurrentPage(item.id as Page)}
                className={`p-3 rounded-2xl transition-all active:scale-90 ${currentPage === item.id ? 'text-primary-green bg-primary-green/10' : 'text-theme-text-muted'}`}
            >
                {item.icon}
            </button>
        ))}
    </nav>
);

const SplashScreen: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
    return (
        <div 
            dir="ltr" 
            className={`fixed inset-0 z-[10000] bg-[#001F3F] flex flex-col items-center justify-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <div className="flex flex-col items-center w-full max-w-xs sm:max-w-md">
                {/* Main App Title */}
                <div className="text-center mb-12 animate-fade-up">
                    <h1 className="text-7xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-primary-green to-white tracking-tighter">
                        Sudeno
                    </h1>
                    <p className="mt-4 text-theme-text-muted font-black tracking-[0.2em] uppercase text-sm opacity-40">Finance Tracker</p>
                </div>

                {/* Animated Ring Spinner */}
                <div className="my-16 flex justify-center">
                    <div className="w-12 h-12 border-4 border-primary-green/20 border-t-primary-green rounded-full animate-spin"></div>
                </div>

                {/* Made by PyroBit Branding Section - Fixed order with dir="ltr" on parent */}
                <div className="mt-12 flex items-center gap-4 sm:gap-6 relative">
                    {/* Made by text */}
                    <div className="flex flex-col items-end opacity-0 animate-fade-in delay-700">
                        <span className="text-white text-base sm:text-lg font-black leading-none tracking-tighter">Made</span>
                        <span className="text-white text-xl sm:text-2xl font-black leading-none tracking-tighter lowercase">by</span>
                    </div>

                    {/* Divider Line */}
                    <div className="w-1.5 h-12 sm:h-16 bg-white rounded-full opacity-0 animate-scale-y delay-300"></div>

                    {/* Masked Reveal for PyroBit */}
                    <div className="overflow-hidden">
                        <h2 className="text-4xl sm:text-5xl font-black text-primary-green tracking-tighter opacity-0 animate-pyrobit-reveal delay-1000">
                            PyroBit
                        </h2>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fade-up {
                    from { opacity: 0; transform: translateY(30px); filter: blur(10px); }
                    to { opacity: 1; transform: translateY(0); filter: blur(0); }
                }
                
                @keyframes fade-in {
                    from { opacity: 0; transform: translateX(10px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                @keyframes scale-y {
                    from { opacity: 0; transform: scaleY(0); }
                    to { opacity: 1; transform: scaleY(1); }
                }

                @keyframes pyrobit-reveal {
                    0% { transform: translateX(-100%); opacity: 0; }
                    1% { opacity: 1; }
                    100% { transform: translateX(0); opacity: 1; }
                }

                .animate-fade-up { animation: fade-up 1s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
                .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
                .animate-scale-y { animation: scale-y 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
                .animate-pyrobit-reveal { animation: pyrobit-reveal 0.9s cubic-bezier(0.23, 1, 0.32, 1) forwards; }

                .delay-300 { animation-delay: 300ms; }
                .delay-700 { animation-delay: 700ms; }
                .delay-1000 { animation-delay: 1000ms; }

                .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
            `}</style>
        </div>
    );
};

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [theme, setTheme] = useLocalStorage<ThemeMode>('theme', 'default');
  const { language } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    // Increased duration slightly to allow the animation to finish elegantly
    const timer = setTimeout(() => { setShowSplash(false); }, 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.style.setProperty('--color-bg', '#F2F2F7');
      root.style.setProperty('--color-sidebar', '#FFFFFF');
      root.style.setProperty('--color-card', '#FFFFFF');
      root.style.setProperty('--color-modal', '#FFFFFF');
      root.style.setProperty('--color-border', 'rgba(0,0,0,0.08)');
      root.style.setProperty('--color-text', '#1C1C1E');
      root.style.setProperty('--color-text-muted', '#6E6E73');
      root.style.setProperty('--color-primary', '#009688');
    } else if (theme === 'dark') {
      root.style.setProperty('--color-bg', '#000000');
      root.style.setProperty('--color-sidebar', '#111111');
      root.style.setProperty('--color-card', '#1A1A1A');
      root.style.setProperty('--color-modal', '#111111');
      root.style.setProperty('--color-border', 'rgba(255,255,255,0.08)');
      root.style.setProperty('--color-text', '#FFFFFF');
      root.style.setProperty('--color-text-muted', '#8E8E93');
      root.style.setProperty('--color-primary', '#00BFA6');
    } else {
      root.style.setProperty('--color-bg', '#001F3F');
      root.style.setProperty('--color-sidebar', '#001F3F');
      root.style.setProperty('--color-card', 'rgba(255, 255, 255, 0.04)');
      root.style.setProperty('--color-modal', '#002B59');
      root.style.setProperty('--color-border', 'rgba(255, 255, 255, 0.1)');
      root.style.setProperty('--color-text', '#FFFFFF');
      root.style.setProperty('--color-text-muted', '#9CA3AF');
      root.style.setProperty('--color-primary', '#00BFA6');
    }
  }, [theme]);

  const handleSetCurrentPage = (page: Page) => {
    setCurrentPage(page);
    if (window.innerWidth < 768) { setSidebarOpen(false); }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'products': return <Products />;
      case 'sales': return <Sales />;
      case 'debts': return <Debts />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings theme={theme} setTheme={setTheme} />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="relative flex min-h-screen bg-theme-bg font-sans text-theme-text overflow-x-hidden transition-colors duration-300">
      <SplashScreen isVisible={showSplash} />
      
      {!showSplash && (
        <>
          <Sidebar 
            currentPage={currentPage} 
            setCurrentPage={handleSetCurrentPage} 
            isOpen={isSidebarOpen}
            setIsOpen={setSidebarOpen}
          />
          <div className="flex flex-col flex-1 min-w-0 md:ltr:ml-64 md:rtl:mr-64">
            <Header onMenuClick={() => setSidebarOpen(true)} />
            <main className="flex-1 p-4 sm:p-8">
              <div className="max-w-7xl mx-auto w-full pb-24 md:pb-8">
                {renderPage()}
              </div>
            </main>
            <BottomNav currentPage={currentPage} setCurrentPage={handleSetCurrentPage} />
          </div>
        </>
      )}

      <style>{`
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0, 191, 166, 0.2); border-radius: 10px; }
        body.modal-open { overflow: hidden; }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ProductProvider>
        <AppContent />
      </ProductProvider>
    </LanguageProvider>
  );
};

export default App;
