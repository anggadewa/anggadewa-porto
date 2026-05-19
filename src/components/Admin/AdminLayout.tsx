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
        <div className="min-h-screen bg-zinc-50 text-zinc-900 flex overflow-hidden selection:bg-primary/20 selection:text-primary" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-[280px] border-r border-zinc-200 bg-white flex-col z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                <div className="p-8 pb-12">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-10 h-10 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-center shadow-sm">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black tracking-[0.3em] text-zinc-400 uppercase leading-none mb-1">Control Center</span>
                            <span className="text-sm font-black tracking-tight text-zinc-900">Master Admin</span>
                        </div>
                    </div>

                    <nav className="space-y-3">
                        {navItems.map((item) => {
                            const isActive = currentPath === item.path || (item.path !== '/admin' && currentPath.startsWith(item.path));
                            return (
                                <Link key={item.path} to={item.path}>
                                    <motion.div
                                        whileHover={{ x: 4 }}
                                        className={cn(
                                            "flex items-center justify-between px-4 py-3.5 rounded-[1rem] transition-all duration-300 group",
                                            isActive 
                                                ? "bg-primary/5 border border-primary/20 text-primary shadow-[0_4px_12px_rgba(106,43,255,0.05)]" 
                                                : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 border border-transparent"
                                        )}
                                    >
                                        <div className="flex items-center gap-3.5">
                                            <item.icon className={cn("w-4.5 h-4.5", isActive ? "text-primary" : "text-zinc-400 group-hover:text-zinc-600")} />
                                            <span className="text-[13px] font-bold tracking-wide">{item.label}</span>
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
                        <Button variant="ghost" className="w-full justify-start gap-3.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 px-4 h-12 rounded-[1rem]">
                            <Home className="w-4.5 h-4.5" /> <span className="text-[13px] font-bold">View Portfolio</span>
                        </Button>
                    </Link>
                    <Button 
                        onClick={handleLogout}
                        variant="ghost" 
                        className="w-full justify-start gap-3.5 text-rose-500/80 hover:text-rose-600 hover:bg-rose-50 px-4 h-12 rounded-[1rem]"
                    >
                        <LogOut className="w-4.5 h-4.5" /> <span className="text-[13px] font-bold">Sign Out</span>
                    </Button>
                </div>
            </aside>

            {/* Mobile Header & Content Wrapper */}
            <main className="flex-1 flex flex-col min-w-0 relative h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-20 border-b border-zinc-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 lg:px-10 shrink-0 z-40">
                    <div className="flex items-center gap-4">
                        <button 
                            className="lg:hidden p-2.5 text-zinc-500 hover:bg-zinc-100 rounded-xl transition-colors"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3 text-[10px] font-black tracking-widest text-zinc-400 uppercase">
                            <span>Admin</span>
                            <ChevronRight className="w-3 h-3 opacity-40" />
                            <span className="text-zinc-800">{currentPath.split('/').pop() || 'Dashboard'}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-[9px] font-black text-emerald-600 tracking-[0.2em] uppercase mb-0.5 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> System Active
                            </span>
                            <span className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase">Live Production</span>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 relative z-10">
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

                {/* Ambient Background Glows (Subtle for Light Mode) */}
                <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
                <div 
                    className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10" 
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, black 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}
                />
            </main>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-[100] lg:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.aside 
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-[280px] bg-white border-r border-zinc-200 z-[101] lg:hidden p-8 flex flex-col shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-12">
                                <div className="w-10 h-10 bg-primary/5 rounded-xl border border-primary/10 flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5 text-primary" />
                                </div>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors">
                                    <X className="w-5 h-5 text-zinc-500" />
                                </button>
                            </div>
                            <nav className="space-y-3">
                                {navItems.map((item) => {
                                    const isActive = currentPath === item.path || (item.path !== '/admin' && currentPath.startsWith(item.path));
                                    return (
                                        <Link 
                                            key={item.path} 
                                            to={item.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <div className={cn(
                                                "flex items-center gap-4 p-4 rounded-[1rem] transition-all",
                                                isActive ? "bg-primary/5 border border-primary/20 text-primary" : "text-zinc-500 hover:bg-zinc-50 border border-transparent"
                                            )}>
                                                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-zinc-400")} />
                                                <span className="font-bold text-[13px]">{item.label}</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </nav>
                            <div className="mt-auto space-y-4">
                                <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-4 text-rose-500 hover:bg-rose-50 rounded-[1rem] h-12">
                                    <LogOut className="w-5 h-5" /> <span className="font-bold text-[13px]">Sign Out</span>
                                </Button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
