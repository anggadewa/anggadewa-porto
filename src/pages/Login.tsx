import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Terminal, Lock, User, Eye, EyeOff, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) throw signInError;
            navigate('/admin');
        } catch (err: any) {
            setError(err.message || 'Access Denied: Invalid Credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#06080B] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
            {/* Dynamic Background Grid/Dots */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_0)] [background-size:24px_24px] opacity-10 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-[480px] z-10"
            >
                <Card className="bg-[#0D1117]/90 backdrop-blur-2xl border-white/10 shadow-3xl overflow-hidden rounded-[2.5rem] ring-1 ring-white/5">
                    <CardContent className="p-12 sm:p-16 space-y-12">
                        {/* Header Section */}
                        <div className="space-y-10">
                            <div className="flex items-center justify-between">
                                <motion.div 
                                    className="flex items-center gap-4"
                                    initial={{ x: -10 }}
                                    animate={{ x: 0 }}
                                >
                                    <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-[0_0_20px_rgba(106,43,255,0.15)]">
                                        <Lock className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="text-[10px] font-black tracking-[0.4em] text-primary/70 uppercase">Identity Manager</span>
                                </motion.div>
                                <div className="text-[9px] text-gray-600 font-black tracking-widest bg-white/5 py-1.5 px-4 rounded-full border border-white/5 uppercase">
                                    Cloud Auth
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <h1 className="text-4xl font-black tracking-tighter text-white leading-tight">
                                    Control Center
                                </h1>
                                <p className="text-gray-500 text-sm font-medium pr-4 leading-relaxed italic">
                                    Please sign in to manage your professional portfolio.
                                </p>
                            </div>
                        </div>

                        {/* Form Section */}
                        <form onSubmit={handleLogin} className="space-y-10">
                            <div className="space-y-8">
                                {/* Email Field */}
                                <div className="space-y-4 group">
                                    <label className="text-[10px] text-gray-600 font-black uppercase tracking-widest flex items-center gap-3 pl-2 mb-1 group-focus-within:text-primary transition-colors">
                                        <User className="w-4 h-4" /> Email Address
                                    </label>
                                    <div className="relative">
                                        <input 
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-white/[0.02] border-2 border-white/5 h-16 px-8 rounded-2xl transition-all duration-500 text-white placeholder:text-gray-800 focus:border-primary/50 focus:bg-white/[0.04] outline-none text-base font-bold tracking-tight"
                                            placeholder="admin@porto.com"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-4 group">
                                    <label className="text-[10px] text-gray-600 font-black uppercase tracking-widest flex items-center gap-3 pl-2 mb-1 group-focus-within:text-primary transition-colors">
                                        <ShieldCheck className="w-4 h-4" /> Password
                                    </label>
                                    <div className="relative">
                                        <input 
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-white/[0.02] border-2 border-white/5 h-16 pl-8 pr-16 rounded-2xl transition-all duration-500 text-white placeholder:text-gray-800 focus:border-primary/50 focus:bg-white/[0.04] outline-none text-base font-bold tracking-tight"
                                            placeholder="••••••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-700 hover:text-primary hover:bg-primary/5 p-2 rounded-xl transition-all duration-300"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="text-[11px] text-rose-500 bg-rose-500/5 p-5 rounded-2xl border border-rose-500/20 flex items-start gap-4 shadow-sm"
                                    >
                                        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 shrink-0 animate-pulse" />
                                        <p className="font-bold leading-relaxed">{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-black h-16 rounded-2xl transition-all duration-500 shadow-2xl shadow-primary/20 active:scale-[0.98] disabled:opacity-50 tracking-[0.3em] text-[11px] uppercase border-none"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-4">
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        <span className="animate-pulse">Authenticating...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <ShieldCheck className="w-5 h-5" />
                                        <span>Sign In</span>
                                        <ChevronRight className="w-4 h-4 opacity-40 ml-2" />
                                    </div>
                                )}
                            </Button>
                        </form>
                        
                        <div className="pt-8 border-t border-white/5">
                            <p className="text-center text-[9px] text-gray-700 font-black tracking-[0.4em] uppercase opacity-60">
                                Premium Portfolio Management
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
