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
            <div className="min-h-screen bg-[#06080B] flex flex-col items-center justify-center gap-6">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                    <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
                <span className="text-sm font-medium tracking-[0.2em] text-primary animate-pulse uppercase">Loading Project...</span>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-[#06080B] flex flex-col items-center justify-center gap-6 p-6">
                <div className="text-9xl font-black text-white/5 tracking-tighter">404</div>
                <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Project Not Found</h2>
                    <p className="text-muted-foreground text-sm max-w-xs mx-auto">The project you're looking for doesn't exist or has been moved.</p>
                </div>
                <Link to="/">
                    <Button className="rounded-2xl px-8 h-14 bg-primary hover:bg-primary/90 text-white font-bold tracking-widest text-[11px]">
                        GO BACK HOME
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-[#06080B] text-gray-300 selection:bg-primary/30 selection:text-primary pb-24">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-[#06080B]">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[150px] rounded-full" />
                <div 
                    className="absolute inset-0 opacity-[0.03]" 
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            <div className="relative max-w-5xl mx-auto px-6 lg:px-8">
                {/* Navigation Header */}
                <header className="py-12 flex justify-between items-center">
                    <Link to="/">
                        <Button variant="ghost" className="h-14 px-8 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/40 text-[11px] font-black tracking-[0.2em] uppercase text-muted-foreground hover:text-white transition-all group">
                            <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3 px-6 py-2.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-black tracking-[0.2em] text-emerald-500 uppercase">Active Project</span>
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
                            <div className="flex items-center gap-3 text-[11px] text-primary font-bold tracking-[0.2em] uppercase opacity-80">
                                <Code2 className="w-4 h-4" />
                                Project Overview
                            </div>

                            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85]">
                                {project.title}
                            </h1>
                            
                            <div className="flex flex-wrap gap-2.5 pt-2">
                                <Badge className="bg-primary/90 hover:bg-primary text-[10px] uppercase tracking-widest font-black h-9 px-6 rounded-xl shadow-lg shadow-primary/20 border-none">
                                    {project.category || 'Featured'}
                                </Badge>
                                {project.tech_stack?.map((tech, i) => (
                                    <Badge key={i} variant="outline" className="bg-white/5 backdrop-blur-md border-white/10 text-muted-foreground font-bold text-[10px] h-9 px-6 rounded-xl uppercase tracking-widest">
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Node Gallery (Multi Image) */}
                        {project.images && project.images.length > 0 && (
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-emerald-500/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-40 transition duration-1000" />
                                <div className="relative bg-card/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                                    <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
                                            <span className="ml-4 text-[10px] tracking-[0.2em] text-muted-foreground uppercase font-black opacity-60">Project Gallery</span>
                                        </div>
                                        <Activity className="w-4 h-4 text-primary/40" />
                                    </div>
                                    
                                    <div className="p-4 sm:p-10">
                                        <div className="flex overflow-x-auto gap-8 snap-x snap-mandatory pb-8 scroll-smooth custom-scrollbar">
                                            {project.images.map((img, i) => (
                                                <div 
                                                    key={i} 
                                                    onClick={() => setSelectedImage(img)}
                                                    className="flex-none w-[85%] sm:w-[75%] snap-center relative aspect-video overflow-hidden rounded-3xl border border-white/10 cursor-pointer group/item hover:border-primary/40 transition-all duration-500"
                                                >
                                                    <img 
                                                        src={getAssetUrl(img)} 
                                                        alt={`Preview ${i + 1}`}
                                                        className="w-full h-full object-cover transition-all duration-1000 group-hover/item:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                                                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/20 text-[11px] font-black text-white tracking-[0.2em] shadow-2xl">
                                                            <Maximize2 className="w-4 h-4 text-primary" />
                                                            VIEW IMAGE
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-center items-center gap-3">
                                            <div className="h-[1px] w-8 bg-white/10" />
                                            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-40">
                                                Scroll to explore
                                            </span>
                                            <div className="h-[1px] w-8 bg-white/10" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Project Links */}
                        <div className="flex flex-wrap gap-4 pt-12">
                            {project.link && (
                                <a href={project.link} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                                    <Button className="w-full h-20 px-12 rounded-3xl bg-primary hover:bg-primary/90 text-white text-[12px] font-black tracking-[0.2em] group shadow-xl shadow-primary/20 border-none transition-all hover:-translate-y-1">
                                        LIVE PREVIEW <ExternalLink className="ml-4 w-5 h-5 group-hover:rotate-45 transition-transform" />
                                    </Button>
                                </a>
                            )}
                            {project.github_link && (
                                <a href={project.github_link} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                                    <Button variant="outline" className="w-full h-20 px-12 rounded-3xl border-white/10 bg-white/5 hover:bg-white/10 text-white text-[12px] font-black tracking-[0.2em] group transition-all hover:-translate-y-1">
                                        VIEW SOURCE <Code2 className="ml-4 w-5 h-5 group-hover:scale-110 transition-transform" />
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
                                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-3xl p-6 md:p-12"
                                    onClick={() => setSelectedImage(null)}
                                >
                                    <motion.div 
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.95, opacity: 0 }}
                                        className="relative max-w-7xl w-full h-full flex flex-col items-center justify-center pointer-events-none"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="w-full flex justify-end mb-6 pointer-events-auto">
                                            <Button 
                                                variant="ghost" 
                                                onClick={() => setSelectedImage(null)}
                                                className="w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
                                            >
                                                <X className="w-6 h-6 text-white" />
                                            </Button>
                                        </div>
                                        
                                        <div className="relative w-full max-h-full flex items-center justify-center pointer-events-auto">
                                            <img 
                                                src={getAssetUrl(selectedImage)} 
                                                className="w-auto h-auto max-w-full max-h-[80vh] object-contain rounded-3xl shadow-2xl border border-white/10"
                                                alt="Gallery Preview"
                                            />
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Project Description */}
                        <div className="space-y-12 pt-12">
                            <div className="flex items-center gap-6">
                                <div className="h-[1px] flex-1 bg-white/10" />
                                <h3 className="text-[11px] font-black tracking-[0.3em] text-primary uppercase opacity-80">Project Documentation</h3>
                                <div className="h-[1px] flex-1 bg-white/10" />
                            </div>
                            <div className="bg-card/40 backdrop-blur-2xl p-10 sm:p-20 rounded-[3rem] border border-white/10 relative overflow-hidden group shadow-2xl">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/20 group-hover:bg-primary/60 transition duration-500" />
                                <div className="prose prose-lg prose-invert prose-p:text-gray-400 prose-p:leading-relaxed prose-p:font-medium prose-p:font-sans prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-strong:text-white prose-strong:border-b prose-strong:border-primary/20 max-w-none">
                                    <div dangerouslySetInnerHTML={createHighlightedMarkup(project.description)} />
                                </div>
                            </div>
                        </div>

                    </motion.div>
                </main>

                {/* Footer */}
                <footer className="mt-40 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-muted-foreground/60">
                    <div className="text-[11px] font-bold uppercase tracking-[0.2em]">
                        &copy; {new Date().getFullYear()} Angga Dewa
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] bg-white/5 px-6 py-2 rounded-full border border-white/5">
                        Frontend Team Lead
                    </div>
                </footer>
            </div>
        </div>
    );
}
