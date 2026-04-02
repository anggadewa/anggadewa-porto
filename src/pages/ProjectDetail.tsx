import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    ChevronLeft, 
    Terminal as TerminalIcon, 
    X, 
    Maximize2, 
    Activity, 
    Wifi, 
    Cpu, 
    Zap,
    ExternalLink,
    Code2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getAssetUrl } from '@/lib/assets';
import { Project } from '@/types';

export default function ProjectDetail() {
    const { slug } = useParams<{ slug: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    
    useEffect(() => {
        async function fetchProject() {
            if (!slug) return;
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('slug', slug)
                    .single();
                
                if (error) throw error;
                setProject(data);
            } catch (error) {
                console.error('Error fetching project:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProject();
    }, [slug]);

    const createHighlightedMarkup = (htmlContent: string) => {
        if (!htmlContent) return { __html: '' };
        let highlighted = htmlContent;
        const keywordsToHighlight = [
            { word: 'Offline-first', classes: 'text-emerald-400 font-bold border-b border-emerald-400/30' },
            { word: 'Enterprise', classes: 'text-primary font-bold border-b border-primary/30' },
            { word: 'Supabase', classes: 'text-emerald-500 font-bold' },
            { word: 'React', classes: 'text-blue-400 font-bold' }
        ];

        keywordsToHighlight.forEach(({ word, classes }) => {
            const regex = new RegExp(`\\b(${word})\\b(?!([^<]+)?>)`, 'gi');
            highlighted = highlighted.replace(regex, `<span class="${classes}">$&</span>`);
        });
        return { __html: highlighted };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#06080B] flex flex-col items-center justify-center font-mono text-primary gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin shadow-[0_0_15px_rgba(106,43,255,0.5)]" />
                <span className="animate-pulse tracking-[0.3em] font-black uppercase text-xs">BOOTING_NODE_DATA...</span>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-[#06080B] flex flex-col items-center justify-center font-mono text-gray-400 gap-6">
                <div className="text-8xl font-black text-white/5 tracking-tighter">404</div>
                <div className="space-y-2 text-center text-xs tracking-widest uppercase font-bold">
                    <p className="text-red-500">CRITICAL_ERROR: PROTECTED_FILE_NOT_FOUND</p>
                    <p className="text-muted-foreground">The requested node is currently offline or revoked.</p>
                </div>
                <Link to="/">
                    <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-primary hover:text-white transition-all duration-300 rounded-[1.25rem] px-8 h-12 uppercase text-[10px] font-black tracking-widest">
                        BACK_TO_ROOT
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-[#06080B] text-gray-300 font-mono overflow-x-hidden selection:bg-primary/30 selection:text-primary pb-20">
            {/* Scanline Effect */}
            <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                <div className="scanline opacity-[0.05]" />
            </div>

            {/* Background Vibe */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-[#06080B]">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[150px] rounded-full" />
                <div 
                    className="absolute inset-0 opacity-[0.02]" 
                    style={{
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            <div className="relative max-w-5xl mx-auto px-6 lg:px-8">
                {/* System Header */}
                <header className="py-10 flex justify-between items-center">
                    <Link to="/">
                        <Button variant="ghost" className="h-12 px-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/40 text-[10px] font-black tracking-[0.3em] uppercase text-muted-foreground hover:text-white transition-all group">
                            <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            EXTERNAL_ROOT
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                        <span className="text-[9px] font-black tracking-[0.2em] text-emerald-500 uppercase">LINK_STABLE: {project.slug.toUpperCase()}</span>
                    </div>
                </header>

                <main className="mt-16 space-y-16">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-10"
                    >
                        <div className="space-y-6">
                            <div className="flex flex-wrap items-center gap-4 text-[10px] text-primary font-black tracking-[0.3em] uppercase italic terminal-effect">
                                <span className="flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/20 rounded-lg">
                                    <Cpu className="w-3.5 h-3.5" />
                                    MODULE_NODE
                                </span>
                                <span className="text-muted-foreground/40 font-normal">SRC: ./REPOS/{project.slug.toUpperCase()}.DAT</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] text-glow">
                                {project.title}
                            </h1>
                            
                            <div className="flex flex-wrap gap-3">
                                <Badge className="bg-primary/90 hover:bg-primary text-[10px] uppercase tracking-[0.2em] font-black h-8 px-5 shadow-[0_0_20px_rgba(106,43,255,0.3)] border-none">
                                    {project.category || 'SYSTEM'}
                                </Badge>
                                {project.tech_stack?.map((tech, i) => (
                                    <Badge key={i} variant="outline" className="bg-[#0D1117]/60 backdrop-blur-md border-white/10 text-muted-foreground font-black text-[10px] h-8 px-5 uppercase tracking-widest">
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Node Gallery (Multi Image) */}
                        {project.images && project.images.length > 0 && (
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-emerald-500/30 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000" />
                                <div className="relative p-2 bg-[#0D1117]/80 backdrop-blur-2xl border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
                                    <div className="flex items-center justify-between px-8 py-5 border-b border-white/5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500/40" />
                                            <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
                                            <div className="w-2 h-2 rounded-full bg-emerald-500/40" />
                                            <span className="ml-4 text-[10px] tracking-[0.4em] text-muted-foreground uppercase font-black">Visual_Buffer.tsx</span>
                                        </div>
                                        <Activity className="w-4 h-4 text-primary animate-pulse" />
                                    </div>
                                    
                                    <div className="p-4 sm:p-8">
                                        <div className="flex overflow-x-auto gap-6 snap-x snap-mandatory pb-6 scroll-smooth custom-scrollbar">
                                            {project.images.map((img, i) => (
                                                <div 
                                                    key={i} 
                                                    onClick={() => setSelectedImage(img)}
                                                    className="flex-none w-[90%] sm:w-[80%] snap-center relative aspect-video overflow-hidden rounded-[2rem] border border-white/5 cursor-pointer group/item hover:border-primary/40 transition-all duration-500"
                                                >
                                                    <img 
                                                        src={getAssetUrl(img)} 
                                                        alt={`Node view ${i + 1}`}
                                                        className="w-full h-full object-cover transition-all duration-1000 group-hover/item:scale-110 grayscale group-hover/item:grayscale-0 opacity-80 group-hover/item:opacity-100"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/item:opacity-100 transition-all flex items-center justify-center">
                                                        <div className="flex items-center gap-3 bg-primary/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-primary/30 text-[11px] font-black text-white tracking-[0.2em] shadow-2xl">
                                                            <Maximize2 className="w-4 h-4 text-primary" />
                                                            EXEC_PREVIEW
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-center items-center gap-3 pt-2">
                                            <Zap className="w-3 h-3 text-emerald-400" />
                                            <span className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.3em]">
                                                Use_H_Scroll to navigate data nodes
                                            </span>
                                            <Zap className="w-3 h-3 text-emerald-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Project Links */}
                        <div className="flex flex-wrap gap-4 pt-10">
                            {project.link && (
                                <a href={project.link} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                                    <Button className="w-full h-16 px-10 rounded-[1.5rem] bg-primary hover:bg-primary/90 text-white text-[11px] font-black tracking-[0.3em] group border-glow shadow-[0_0_30px_rgba(106,43,255,0.2)]">
                                        LINK_DEPLOYMENT <ExternalLink className="ml-3 w-4 h-4 group-hover:rotate-45 transition-transform" />
                                    </Button>
                                </a>
                            )}
                            {project.github_link && (
                                <a href={project.github_link} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                                    <Button variant="outline" className="w-full h-16 px-10 rounded-[1.5rem] border-white/10 bg-white/5 hover:bg-white/10 text-white text-[11px] font-black tracking-[0.3em] group">
                                        ACCESS_SOURCE <Code2 className="ml-3 w-4 h-4 group-hover:scale-125 transition-transform" />
                                    </Button>
                                </a>
                            )}
                        </div>

                        {/* Lightbox / Preview Modal */}
                        <AnimatePresence>
                            {selectedImage && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6 md:p-12"
                                    onClick={() => setSelectedImage(null)}
                                >
                                    <motion.div 
                                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                        animate={{ scale: 1, opacity: 1, y: 0 }}
                                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                        className="relative max-w-7xl w-full h-full flex flex-col items-center justify-center pointer-events-none"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="w-full text-[10px] font-black text-primary tracking-[0.5em] uppercase mb-8 border-b border-primary/20 pb-4 flex justify-between items-center pointer-events-auto">
                                            <span>Full_Buffer_Visual_Node</span>
                                            <Button 
                                                variant="ghost" 
                                                onClick={() => setSelectedImage(null)}
                                                className="hover:bg-primary/20 hover:text-white rounded-xl h-10 px-6 border border-white/5 hover:border-primary/40 uppercase tracking-widest text-[10px] font-black transition-all"
                                            >
                                                TERMINATE.EXIT()
                                            </Button>
                                        </div>
                                        
                                        <div className="relative w-full max-h-full flex items-center justify-center">
                                            <img 
                                                src={getAssetUrl(selectedImage)} 
                                                className="w-auto h-auto max-w-full max-h-[75vh] object-contain rounded-[2rem] shadow-[0_0_100px_rgba(106,43,255,0.2)] border border-white/10 pointer-events-auto"
                                                alt="Preview Node"
                                            />
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Core Documentation (Description) */}
                        <div className="space-y-10 pt-10">
                            <div className="flex items-center gap-4">
                                <div className="h-[2px] w-12 bg-primary/40 shadow-[0_0_10px_rgba(106,43,255,0.5)]" />
                                <h3 className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Core_Module_Documentation</h3>
                            </div>
                            <div className="bg-[#0D1117]/80 backdrop-blur-2xl p-10 sm:p-16 rounded-[3rem] border border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary/40 group-hover:bg-primary transition duration-500 shadow-[0_0_15px_rgba(106,43,255,0.5)]" />
                                <div className="prose prose-lg prose-invert prose-p:text-gray-400 prose-p:leading-relaxed prose-p:font-medium prose-p:font-sans prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-strong:text-white prose-strong:border-b prose-strong:border-primary/20 max-w-none">
                                    <div dangerouslySetInnerHTML={createHighlightedMarkup(project.description)} />
                                </div>
                            </div>
                        </div>

                    </motion.div>
                </main>

                {/* Footer Signature */}
                <footer className="mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em]">
                        DATA_NODE_STATUS: STABLE // REV_{new Date().getFullYear()}
                    </div>
                    <div className="text-[10px] text-primary/40 font-black italic border border-primary/20 px-5 py-2 rounded-full">
                        EXECUTED_BY_DEWA_ROOT
                    </div>
                </footer>
            </div>
        </div>
    );
}
