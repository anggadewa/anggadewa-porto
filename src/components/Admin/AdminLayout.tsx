import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { 
    LayoutDashboard, 
    Briefcase, 
    Terminal, 
    LogOut, 
    Home, 
    ChevronRight,
    ShieldCheck,
    Menu,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Projects', path: '/admin/projects', icon: Briefcase },
    { label: 'Skills', path: '/admin/skills', icon: Terminal },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const currentPath = location.pathname;

    return (
        <div className="min-h-screen bg-[#06080B] text-gray-300 flex overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-72 border-r border-gray-800/50 bg-[#0D1117]/80 backdrop-blur-xl flex-col z-50">
                <div className="p-8 pb-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/30 shadow-[0_0_15px_rgba(106,43,255,0.2)]">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black tracking-[0.4em] text-primary/70 uppercase leading-none mb-1">Control Center</span>
                            <span className="text-xs font-black tracking-tighter text-white">Master Admin</span>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {navItems.map((item) => {
                            const isActive = currentPath === item.path || (item.path !== '/admin' && currentPath.startsWith(item.path));
                            return (
                                <Link key={item.path} to={item.path}>
                                    <motion.div
                                        whileHover={{ x: 4 }}
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group",
                                            isActive 
                                                ? "bg-primary/10 border border-primary/20 text-white shadow-[0_0_20px_rgba(106,43,255,0.05)]" 
                                                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className={cn("w-4.5 h-4.5", isActive ? "text-primary" : "text-gray-500")} />
                                            <span className="text-sm font-bold tracking-tight">{item.label}</span>
                                        </div>
                                        {isActive && <ChevronRight className="w-4 h-4 text-primary" />}
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-8 space-y-4">
                    <Link to="/">
                        <Button variant="ghost" className="w-full justify-start gap-3 text-gray-500 hover:text-white px-4 h-12 rounded-xl">
                            <Home className="w-4 h-4" /> View Portfolio
                        </Button>
                    </Link>
                    <Button 
                        onClick={handleLogout}
                        variant="ghost" 
                        className="w-full justify-start gap-3 text-rose-500/70 hover:text-rose-500 hover:bg-rose-500/5 px-4 h-12 rounded-xl"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </Button>
                </div>
            </aside>

            {/* Mobile Header & Content Wrapper */}
            <main className="flex-1 flex flex-col min-w-0 relative h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-20 border-b border-gray-800/50 bg-[#06080B]/50 backdrop-blur-md flex items-center justify-between px-6 lg:px-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <button 
                            className="lg:hidden p-2 text-gray-400"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex items-center gap-2 text-[11px] font-black tracking-widest text-gray-600 uppercase">
                            <span>Admin</span>
                            <ChevronRight className="w-3 h-3 opacity-30" />
                            <span className="text-gray-400 capitalize">{currentPath.split('/').pop() || 'Dashboard'}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-[10px] font-black text-emerald-500 tracking-[0.2em] uppercase mb-0.5">System Active</span>
                            <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase opacity-40">Live Production</span>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPath}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Ambient Background Glows */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />
            </main>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] lg:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.aside 
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-[280px] bg-[#0D1117] border-r border-gray-800 z-[101] lg:hidden p-8 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-12">
                                <ShieldCheck className="w-8 h-8 text-primary" />
                                <button onClick={() => setIsMobileMenuOpen(false)}>
                                    <X className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>
                            <nav className="space-y-4">
                                {navItems.map((item) => {
                                    const isActive = currentPath === item.path || (item.path !== '/admin' && currentPath.startsWith(item.path));
                                    return (
                                        <Link 
                                            key={item.path} 
                                            to={item.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <div className={cn(
                                                "flex items-center gap-4 p-4 rounded-2xl transition-all",
                                                isActive ? "bg-primary/10 border border-primary/20 text-white" : "text-gray-500"
                                            )}>
                                                <item.icon className="w-5 h-5" />
                                                <span className="font-bold">{item.label}</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </nav>
                            <div className="mt-auto space-y-4">
                                <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-4 text-rose-500">
                                    <LogOut className="w-5 h-5" /> Sign Out
                                </Button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
