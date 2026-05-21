import { useState, useEffect, useRef, useCallback } from 'react';
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
    Layout,
    FileText,
    ZoomIn,
    ZoomOut,
    RotateCcw
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getAssetUrl } from '@/lib/assets';
import { Project } from '@/types';

export default function ProjectDetail() {
    const { slug } = useParams<{ slug: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    
    // Zoom & Pan state
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const panStart = useRef({ x: 0, y: 0 });

    const resetView = useCallback(() => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    }, []);

    const handleOpenImage = (img: string) => {
        resetView();
        setSelectedImage(img);
    };

    const handleCloseImage = () => {
        setSelectedImage(null);
        resetView();
    };

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 5));
    const handleZoomOut = () => {
        setZoom(prev => {
            const next = Math.max(prev - 0.5, 1);
            if (next === 1) setPan({ x: 0, y: 0 });
            return next;
        });
    };

    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.3 : 0.3;
        setZoom(prev => {
            const next = Math.max(1, Math.min(prev + delta, 5));
            if (next === 1) setPan({ x: 0, y: 0 });
            return next;
        });
    }, []);

    const handleDoubleClick = () => {
        if (zoom > 1) {
            resetView();
        } else {
            setZoom(2.5);
        }
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        if (zoom <= 1) return;
        e.preventDefault();
        setIsDragging(true);
        dragStart.current = { x: e.clientX, y: e.clientY };
        panStart.current = { ...pan };
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        setPan({
            x: panStart.current.x + dx,
            y: panStart.current.y + dy,
        });
    };

    const handlePointerUp = () => {
        setIsDragging(false);
    };

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
        <div className="relative min-h-screen bg-zinc-50 text-zinc-900 pb-32 font-sans selection:bg-primary/20 selection:text-primary">
            {/* Elegant Background Vibe */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full" />
                <div 
                    className="absolute inset-0 opacity-[0.03]" 
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, black 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
                {/* Modern Navigation */}
                <header className="py-12 flex justify-between items-center">
                    <Link to="/#work">
                        <button className="flex items-center gap-3 px-6 py-3.5 bg-white border border-zinc-200 hover:border-primary/40 shadow-sm hover:shadow-lg rounded-full text-xs font-black tracking-widest uppercase text-zinc-600 hover:text-primary transition-all duration-300 group">
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Gallery
                        </button>
                    </Link>
                    <div className="hidden sm:flex items-center gap-3 px-6 py-3 bg-white border border-zinc-200 rounded-full shadow-sm">
                        <Layout className="w-4 h-4 text-primary" />
                        <span className="text-xs font-black tracking-widest text-zinc-800 uppercase">Case Study // {project.slug}</span>
                    </div>
                </header>

                <main className="mt-8 pb-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-20 md:space-y-32"
                    >
                        {/* 1. Hero Section (Centered & Majestic) */}
                        <div className="flex flex-col items-center text-center space-y-8 max-w-5xl mx-auto pt-10">
                            <div className="px-6 py-2 bg-primary/5 border border-primary/10 rounded-full">
                                <span className="text-xs font-black tracking-[0.3em] text-primary uppercase">{project.category || 'Case Study'}</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-zinc-950 tracking-tighter uppercase leading-[0.9]">
                                {project.title}
                            </h1>
                            
                            {/* Sleek Metadata Bar */}
                            <div className="flex flex-wrap justify-center gap-8 md:gap-16 pt-8 pb-4">
                                {[
                                    { label: 'Role', value: project.role || 'Lead Developer' },
                                    { label: 'Timeline', value: project.timeline || '2023 - 2024' },
                                    { label: 'Core Tech', value: project.tech_stack?.[0] || 'Modern Stack' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-2">
                                        <span className="text-[10px] font-black text-zinc-400 tracking-[0.2em] uppercase">{item.label}</span>
                                        <span className="text-sm md:text-base font-black text-zinc-900 uppercase tracking-tight">{item.value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Action Links */}
                            <div className="flex flex-wrap justify-center gap-4 pt-4">
                                {project.link && (
                                    <a href={project.link} target="_blank" rel="noreferrer">
                                        <Button className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-white text-xs font-black tracking-widest group shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-1 uppercase">
                                            Launch Project <ExternalLink className="ml-2 w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
                                        </Button>
                                    </a>
                                )}
                                {project.github_link && (
                                    <a href={project.github_link} target="_blank" rel="noreferrer">
                                        <Button variant="outline" className="h-14 px-8 rounded-full border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900 text-xs font-black tracking-widest group shadow-sm transition-all duration-300 hover:-translate-y-1 uppercase">
                                            Source Code <CodeXml className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                                        </Button>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* 2. Hero Image Gallery */}
                        {project.images && project.images.length > 0 && (
                            <div className="max-w-6xl mx-auto w-full">
                                {/* First image as massive hero */}
                                <div 
                                    onClick={() => handleOpenImage(project.images![0])}
                                    className="relative aspect-video w-full rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border border-zinc-200 shadow-[0_20px_60px_rgba(0,0,0,0.08)] cursor-pointer group bg-zinc-100"
                                >
                                    <img 
                                        src={getAssetUrl(project.images![0])} 
                                        alt="Hero Showcase"
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
                                    />
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                                        <div className="bg-white/90 backdrop-blur-md px-8 py-4 rounded-full border border-white/50 text-xs font-black text-zinc-900 tracking-widest uppercase shadow-2xl scale-95 group-hover:scale-100 transition-all duration-500 flex items-center gap-3">
                                            <ZoomIn className="w-4 h-4" />
                                            Expand View
                                        </div>
                                    </div>
                                </div>

                                {/* Remaining images in a grid below */}
                                {project.images.length > 1 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                                        {project.images.slice(1).map((img, i) => (
                                            <div 
                                                key={i} 
                                                onClick={() => handleOpenImage(img)}
                                                className="relative aspect-[4/3] rounded-[2rem] overflow-hidden border border-zinc-200 shadow-sm cursor-pointer group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-zinc-100"
                                            >
                                                <img 
                                                    src={getAssetUrl(img)} 
                                                    alt={`Showcase ${i + 2}`}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 3. The Story & Documentation (Center column flow to prevent empty side space) */}
                        <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 rounded-[3rem] border border-zinc-200 shadow-[0_20px_60px_rgba(0,0,0,0.04)] relative">
                            <div className="absolute -top-6 left-10 md:left-16 w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30 rotate-3 transition-transform hover:rotate-6">
                                <FileText className="w-6 h-6 text-white -rotate-3" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black tracking-widest text-zinc-900 uppercase mb-10 mt-4">The Story</h3>
                            <div className="prose prose-zinc md:prose-lg prose-p:text-zinc-600 prose-p:leading-[1.8] prose-p:text-[1.05rem] prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight max-w-none">
                                <div dangerouslySetInnerHTML={createHighlightedMarkup(project.description)} />
                            </div>
                        </div>

                        {/* 4. Tech Stack & Features Bento Grid (Ensures no awkward whitespace) */}
                        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-8">
                            
                            {/* Key Features (Left/Wide) */}
                            <div className="md:col-span-7 bg-white p-8 md:p-14 rounded-[3rem] border border-zinc-200 shadow-[0_20px_60px_rgba(0,0,0,0.04)] relative overflow-hidden group hover:border-zinc-300 transition-all duration-500">
                                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[100px] rounded-full group-hover:bg-primary/10 transition-colors duration-700" />
                                <div className="flex items-center gap-5 mb-12 relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <Zap className="w-6 h-6 text-primary" />
                                    </div>
                                    <h4 className="text-lg md:text-xl font-black text-zinc-900 uppercase tracking-[0.2em]">Key Features</h4>
                                </div>
                                <div className="relative z-10">
                                    {project.key_features && project.key_features.length > 0 ? (
                                        <ul className="space-y-8">
                                            {project.key_features.map((feature, i) => (
                                                <li key={i} className="flex gap-6 items-start group/item">
                                                    <div className="shrink-0 w-8 h-8 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center mt-0.5 group-hover/item:border-primary/30 group-hover/item:bg-primary/5 transition-all duration-300">
                                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                                    </div>
                                                    <p className="text-[1.05rem] text-zinc-600 leading-relaxed font-medium">
                                                        {feature}
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-base text-zinc-500 leading-relaxed font-medium italic">
                                            This project features advanced architecture focused on scalable performance and superior user experience.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Tech Stack (Right/Narrow) */}
                            <div className="md:col-span-5 bg-white p-8 md:p-14 rounded-[3rem] border border-zinc-200 shadow-[0_20px_60px_rgba(0,0,0,0.04)] hover:border-zinc-300 transition-all duration-500 group">
                                <div className="flex items-center gap-5 mb-12">
                                    <div className="w-14 h-14 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center group-hover:bg-zinc-100 transition-colors">
                                        <Cpu className="w-6 h-6 text-zinc-900" />
                                    </div>
                                    <h4 className="text-lg md:text-xl font-black text-zinc-900 uppercase tracking-[0.2em]">Tech Stack</h4>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {project.tech_stack?.map((tech, i) => (
                                        <span key={i} className="px-6 py-3.5 bg-zinc-50 border border-zinc-200 rounded-full text-xs font-black uppercase tracking-widest text-zinc-600 hover:text-primary hover:border-primary/30 hover:bg-primary/5 hover:-translate-y-0.5 transition-all cursor-default">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </main>

                {/* Simplified Professional Footer */}
                <footer className="mt-32 py-12 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
                    <div>&copy; {new Date().getFullYear()} Angga Dewa // Built for Excellence</div>
                    <div className="flex items-center gap-6">
                        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                        <span className="opacity-30">//</span>
                        <a href="mailto:anggadewa2016@gmail.com" className="hover:text-primary transition-colors">Contact</a>
                    </div>
                </footer>
            </div>

            {/* Lightbox Modal with Zoom & Pan */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/95 backdrop-blur-3xl"
                        onClick={handleCloseImage}
                    >
                        {/* Top Controls Bar */}
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-2 py-2 shadow-2xl" onClick={e => e.stopPropagation()}>
                            <button
                                onClick={handleZoomIn}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
                                title="Zoom In"
                            >
                                <ZoomIn className="w-5 h-5" />
                            </button>
                            <div className="px-3 text-[10px] font-black text-white/60 tracking-widest uppercase min-w-[60px] text-center">
                                {Math.round(zoom * 100)}%
                            </div>
                            <button
                                onClick={handleZoomOut}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
                                title="Zoom Out"
                            >
                                <ZoomOut className="w-5 h-5" />
                            </button>
                            <div className="w-px h-6 bg-white/20 mx-1" />
                            <button
                                onClick={resetView}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
                                title="Reset View"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                            <div className="w-px h-6 bg-white/20 mx-1" />
                            <button
                                onClick={handleCloseImage}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
                                title="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Zoom hint */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-black text-white/30 tracking-[0.3em] uppercase pointer-events-none">
                            Scroll to Zoom • Double-click to Toggle • Drag to Pan
                        </div>

                        {/* Image Container */}
                        <div 
                            className="relative w-full h-full flex items-center justify-center overflow-hidden p-6 md:p-12"
                            onWheel={handleWheel}
                            onClick={e => e.stopPropagation()}
                        >
                            <img 
                                src={getAssetUrl(selectedImage)} 
                                className="max-w-full max-h-[85vh] object-contain rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-white/10 select-none"
                                alt="High Resolution Preview"
                                draggable={false}
                                onDoubleClick={handleDoubleClick}
                                onPointerDown={handlePointerDown}
                                onPointerMove={handlePointerMove}
                                onPointerUp={handlePointerUp}
                                onPointerCancel={handlePointerUp}
                                style={{
                                    transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                                    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                                    cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

