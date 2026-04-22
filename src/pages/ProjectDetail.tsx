import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
    ChevronLeft, 
    CodeXml, 
    X, 
    Cpu, 
    Zap,
    ExternalLink,
    Calendar,
    User,
    Layers,
    Layout
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
            { word: 'Offline-first', classes: 'text-primary font-bold' },
            { word: 'Enterprise', classes: 'text-primary font-bold' },
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
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                    <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
                <span className="text-sm font-black tracking-[0.2em] text-primary animate-pulse uppercase">Syncing Data...</span>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 p-6">
                <div className="text-9xl font-black text-white/5 tracking-tighter">404</div>
                <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-bold text-foreground uppercase tracking-tight">Project Not Found</h2>
                    <p className="text-muted-foreground text-sm max-w-xs mx-auto italic">The documentation for this project could not be located.</p>
                </div>
                <Link to="/">
                    <Button className="rounded-2xl px-8 h-14 bg-primary hover:bg-primary/90 text-white font-black tracking-[0.2em] text-[10px] uppercase">
                        Return to Hub
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary pb-32">
            {/* Background Vibe */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[150px] rounded-full" />
                <div 
                    className="absolute inset-0 opacity-[0.02]" 
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
                {/* Modern Breadcrumb / Navigation */}
                <header className="py-10 flex justify-between items-center">
                    <Link to="/">
                        <button className="flex items-center gap-4 px-6 py-3 bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground hover:text-primary hover:border-primary/40 transition-all group">
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Gallery
                        </button>
                    </Link>
                    <div className="hidden sm:flex items-center gap-3 px-6 py-2.5 bg-primary/5 rounded-full border border-primary/10">
                        <Layout className="w-3 h-3 text-primary" />
                        <span className="text-[9px] font-black tracking-[0.2em] text-primary uppercase">Case Study // {project.slug}</span>
                    </div>
                </header>

                <main className="mt-12 space-y-24">
                    {/* Project Hero */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-12"
                    >
                        <div className="space-y-6 max-w-4xl">
                            <div className="flex items-center gap-4">
                                <div className="h-[2px] w-12 bg-primary" />
                                <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">{project.category || 'Standard Project'}</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground tracking-tighter uppercase leading-[0.9]">
                                {project.title}
                            </h1>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-6 bg-card/40 backdrop-blur-xl border border-border/40 rounded-3xl space-y-3 group hover:border-primary/40 transition-colors">
                                <div className="p-2 bg-primary/5 rounded-lg w-fit group-hover:bg-primary/10 transition-colors">
                                    <User className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <div className="text-[9px] font-black text-muted-foreground/60 tracking-widest uppercase mb-1">My Role</div>
                                    <div className="text-[11px] font-bold text-foreground uppercase tracking-tight">{project.role || 'Lead Developer'}</div>
                                </div>
                            </div>
                            <div className="p-6 bg-card/40 backdrop-blur-xl border border-border/40 rounded-3xl space-y-3 group hover:border-primary/40 transition-colors">
                                <div className="p-2 bg-emerald-500/5 rounded-lg w-fit group-hover:bg-emerald-500/10 transition-colors">
                                    <Cpu className="w-4 h-4 text-emerald-500" />
                                </div>
                                <div>
                                    <div className="text-[9px] font-black text-muted-foreground/60 tracking-widest uppercase mb-1">Technology</div>
                                    <div className="text-[11px] font-bold text-foreground uppercase tracking-tight">{project.tech_stack?.[0] || 'Modern Stack'}</div>
                                </div>
                            </div>
                            <div className="p-6 bg-card/40 backdrop-blur-xl border border-border/40 rounded-3xl space-y-3 group hover:border-primary/40 transition-colors">
                                <div className="p-2 bg-violet-500/5 rounded-lg w-fit group-hover:bg-violet-500/10 transition-colors">
                                    <Calendar className="w-4 h-4 text-violet-500" />
                                </div>
                                <div>
                                    <div className="text-[9px] font-black text-muted-foreground/60 tracking-widest uppercase mb-1">Timeline</div>
                                    <div className="text-[11px] font-bold text-foreground uppercase tracking-tight">{project.timeline || '2023 - 2024'}</div>
                                </div>
                            </div>
                            <div className="p-6 bg-card/40 backdrop-blur-xl border border-border/40 rounded-3xl space-y-3 group hover:border-primary/40 transition-colors">
                                <div className="p-2 bg-amber-500/5 rounded-lg w-fit group-hover:bg-amber-500/10 transition-colors">
                                    <Layers className="w-4 h-4 text-amber-500" />
                                </div>
                                <div>
                                    <div className="text-[9px] font-black text-muted-foreground/60 tracking-widest uppercase mb-1">Category</div>
                                    <div className="text-[11px] font-bold text-foreground uppercase tracking-tight">{project.category || 'Software'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Project Links */}
                        <div className="flex flex-wrap gap-4 pt-4">
                            {project.link && (
                                <a href={project.link} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                                    <Button className="w-full sm:w-auto h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white text-[11px] font-black tracking-[0.2em] group shadow-xl shadow-primary/20 border-none transition-all hover:-translate-y-1 uppercase">
                                        Launch Project <ExternalLink className="ml-4 w-4 h-4 group-hover:rotate-45 transition-transform" />
                                    </Button>
                                </a>
                            )}
                            {project.github_link && (
                                <a href={project.github_link} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                                    <Button variant="outline" className="w-full sm:w-auto h-16 px-10 rounded-2xl border-border/40 bg-card/40 hover:bg-card/60 text-foreground text-[11px] font-black tracking-[0.2em] group transition-all hover:-translate-y-1 uppercase">
                                        Source Code <CodeXml className="ml-4 w-4 h-4 group-hover:scale-110 transition-transform" />
                                    </Button>
                                </a>
                            )}
                        </div>

                        {/* Showcase Gallery */}
                        {project.images && project.images.length > 0 && (
                            <div className="pt-12">
                                <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-[2.5rem] overflow-hidden shadow-2xl">
                                    <div className="p-4 sm:p-10">
                                        <div className="flex overflow-x-auto gap-8 snap-x snap-mandatory pb-8 scroll-smooth custom-scrollbar">
                                            {project.images.map((img, i) => (
                                                <div 
                                                    key={i} 
                                                    onClick={() => setSelectedImage(img)}
                                                    className="flex-none w-[90%] sm:w-[80%] snap-center relative aspect-video overflow-hidden rounded-3xl border border-border/40 cursor-pointer group/item hover:border-primary/40 transition-all duration-500 shadow-lg"
                                                >
                                                    <img 
                                                        src={getAssetUrl(img)} 
                                                        alt={`Showcase ${i + 1}`}
                                                        className="w-full h-full object-cover transition-all duration-1000 group-hover/item:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                                                        <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/20 text-[10px] font-black text-white tracking-[0.3em] uppercase">
                                                            Expand View
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Project Deep Dive */}
                        <div className="grid lg:grid-cols-3 gap-16 pt-12">
                            <div className="lg:col-span-2 space-y-10">
                                <div className="space-y-6">
                                    <div className="text-[11px] font-black tracking-[0.3em] text-primary uppercase">Documentation</div>
                                    <div className="bg-card/40 backdrop-blur-xl p-8 md:p-16 rounded-[2.5rem] border border-border/40 prose prose-invert prose-p:text-muted-foreground prose-p:leading-relaxed prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight max-w-none shadow-xl">
                                        <div dangerouslySetInnerHTML={createHighlightedMarkup(project.description)} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-12">
                                <div className="space-y-8">
                                    <div className="text-[11px] font-black tracking-[0.3em] text-primary uppercase">Tech Stack</div>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tech_stack?.map((tech, i) => (
                                            <span key={i} className="px-5 py-3 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white hover:border-white/10 transition-all">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-8 bg-primary/5 border border-primary/10 rounded-[2rem] space-y-8">
                                    <div className="flex items-center gap-3">
                                        <Zap className="w-5 h-5 text-primary" />
                                        <h4 className="text-[11px] font-black text-foreground uppercase tracking-widest">Key Features & Insights</h4>
                                    </div>
                                    
                                    {project.key_features && project.key_features.length > 0 ? (
                                        <ul className="space-y-6">
                                            {project.key_features.map((feature, i) => (
                                                <li key={i} className="flex gap-4 group">
                                                    <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-1.5 group-hover:scale-150 transition-transform" />
                                                    <p className="text-[11px] text-muted-foreground leading-relaxed font-medium italic">
                                                        {feature}
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                                            This project pushed the boundaries of my expertise in {project.category || 'modern development'} and reinforced my commitment to high-performance architecture.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </main>

                {/* Simplified Professional Footer */}
                <footer className="mt-40 py-16 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                    <div>&copy; {new Date().getFullYear()} Angga Dewa // Built for Excellence</div>
                    <div className="flex items-center gap-8">
                        <Link to="/" className="hover:text-primary transition-colors tracking-widest">Home</Link>
                        <span className="opacity-20">//</span>
                        <a href="mailto:anggadewa2016@gmail.com" className="hover:text-primary transition-colors tracking-widest">Contact</a>
                    </div>
                </footer>
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-6"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative max-w-7xl w-full flex flex-col items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Button 
                                variant="ghost" 
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-16 right-0 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                            >
                                <X className="w-6 h-6" />
                            </Button>
                            <img 
                                src={getAssetUrl(selectedImage)} 
                                className="w-auto h-auto max-w-full max-h-[80vh] object-contain rounded-3xl shadow-2xl border border-white/10"
                                alt="High Resolution Preview"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
