import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Terminal, Home, AlertCircle, Cpu } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="relative min-h-screen bg-background text-foreground font-sans overflow-hidden flex flex-col items-center justify-center p-6 text-center">
            {/* Background Vibe */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-rose-500/5 blur-[150px] rounded-full animate-pulse" />
            </div>

            <div className="relative z-10 space-y-12 max-w-2xl">
                {/* Visual Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="p-5 bg-rose-500/10 rounded-3xl border border-rose-500/20 shadow-2xl relative group">
                        <AlertCircle className="w-16 h-16 text-rose-500" />
                    </div>
                    
                    <div className="space-y-2">
                        <h1 className="text-8xl md:text-9xl font-black text-foreground tracking-tighter">
                            404
                        </h1>
                        <p className="text-[10px] font-black tracking-[0.5em] text-rose-500 uppercase">Page Not Found</p>
                    </div>
                </motion.div>

                {/* Status Message */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-3xl p-8 space-y-6 text-left"
                >
                    <div className="flex items-center gap-3 text-rose-400">
                        <Terminal className="w-4 h-4" />
                        <span className="text-xs font-black tracking-widest uppercase">System Output</span>
                    </div>

                    <div className="space-y-3 text-sm">
                        <p className="text-muted-foreground leading-relaxed">
                            The requested address could not be found. It might have been moved or deleted.
                        </p>
                    </div>
                </motion.div>

                {/* Actions */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
                >
                    <Link to="/">
                        <Button className="h-16 px-10 rounded-2xl bg-primary text-primary-foreground hover:opacity-90 text-xs font-black tracking-[0.2em] group gap-3 shadow-2xl transition-all active:scale-95">
                            <Home className="w-4 h-4" />
                            BACK TO HOME
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
