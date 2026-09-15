import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowUpRight,
    ChevronLeft,
    ExternalLink,
    Maximize2,
    RotateCcw,
    Workflow,
    ZoomIn,
    ZoomOut,
    X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { getAssetUrl } from '@/lib/assets';
import type { ProductCaseStudy } from '@/data/productCaseStudies';

const evidenceBadgeStyles: Record<string, string> = {
    Outcome: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    'Validation Outcome': 'border-blue-200 bg-blue-50 text-blue-700',
    'Learning & Next Improvement': 'border-amber-200 bg-amber-50 text-amber-700'
};

function splitNarrative(text: string) {
    if (!text) return { intro: '', points: [] };

    const matches = Array.from(text.matchAll(/(?:^|\n)\s*(\d+)\.\s+/g));
    if (matches.length === 0) return { intro: text.trim(), points: [] };

    const intro = text.slice(0, matches[0].index ?? 0).trim();
    const points = matches.map((match, index) => {
        const start = (match.index ?? 0) + match[0].length;
        const end = index + 1 < matches.length ? matches[index + 1].index ?? text.length : text.length;
        return text.slice(start, end).trim();
    }).filter(Boolean);

    return { intro, points };
}

function readableLabel(value: string) {
    return value
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function DetailLoadingState({ productHomePath }: { productHomePath: string }) {
    return (
        <main className="min-h-screen bg-[#f7f7f5] text-zinc-950">
            <div className="fixed inset-x-0 top-0 z-50 border-b border-zinc-200 bg-white px-5 py-4">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
                    <Link to={productHomePath} className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-zinc-500 transition-colors hover:text-primary">
                        <ChevronLeft className="h-4 w-4" />
                        Product Hub
                    </Link>
                    <div className="h-9 w-40 rounded-full bg-zinc-100" />
                </div>
            </div>

            <section className="px-6 pb-16 pt-32">
                <div className="mx-auto max-w-6xl">
                    <div className="relative overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)] md:p-12">
                        <motion.div
                            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/90 to-transparent"
                            initial={{ x: '-140%' }}
                            animate={{ x: '340%' }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <div className="relative space-y-12">
                            <div className="flex justify-center">
                                <div className="h-10 w-36 rounded-full bg-primary/10" />
                            </div>
                            <div className="mx-auto max-w-4xl space-y-5 text-center">
                                <div className="mx-auto h-16 w-4/5 rounded-full bg-zinc-100 md:h-24" />
                                <div className="mx-auto h-4 w-3/4 rounded-full bg-zinc-100" />
                                <div className="mx-auto h-4 w-1/2 rounded-full bg-zinc-100" />
                            </div>
                            <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div key={index} className="rounded-2xl bg-zinc-50 p-4">
                                        <div className="h-3 w-16 rounded-full bg-zinc-100" />
                                        <div className="mt-3 h-4 w-4/5 rounded-full bg-zinc-200/70" />
                                    </div>
                                ))}
                            </div>
                            <div className="aspect-[16/8] overflow-hidden rounded-[2rem] border border-zinc-100 bg-zinc-100">
                                <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#f4f4f5,#ffffff,#eef2ff)]">
                                    <Workflow className="h-12 w-12 text-primary/25" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default function ProductCaseDetail() {
    const { slug } = useParams<{ slug: string }>();
    const normalizedSlug = slug ? slug.replace(/-/g, '_') : '';
    const productHomePath = typeof window !== 'undefined' && window.location.hostname.startsWith('product.') ? '/#cases' : '/product#cases';
    const [study, setStudy] = useState<ProductCaseStudy | null>(null);
    const [loading, setLoading] = useState(true);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const panStart = useRef({ x: 0, y: 0 });

    const resetView = useCallback(() => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    }, []);

    const openLightbox = (image: string) => {
        resetView();
        setLightboxImage(image);
    };

    const closeLightbox = () => {
        setLightboxImage(null);
        resetView();
    };

    const handleZoomIn = () => setZoom((current) => Math.min(current + 0.5, 5));

    const handleZoomOut = () => {
        setZoom((current) => {
            const next = Math.max(current - 0.5, 1);
            if (next === 1) setPan({ x: 0, y: 0 });
            return next;
        });
    };

    const handleWheel = useCallback((event: React.WheelEvent) => {
        event.preventDefault();
        const delta = event.deltaY > 0 ? -0.3 : 0.3;
        setZoom((current) => {
            const next = Math.max(1, Math.min(current + delta, 5));
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

    const handlePointerDown = (event: React.PointerEvent) => {
        if (zoom <= 1) return;
        event.preventDefault();
        setIsDragging(true);
        dragStart.current = { x: event.clientX, y: event.clientY };
        panStart.current = { ...pan };
        (event.target as HTMLElement).setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: React.PointerEvent) => {
        if (!isDragging) return;
        const dx = event.clientX - dragStart.current.x;
        const dy = event.clientY - dragStart.current.y;
        setPan({
            x: panStart.current.x + dx,
            y: panStart.current.y + dy
        });
    };

    const handlePointerUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        const fetchStudy = async () => {
            if (!slug) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('product_case_studies')
                .select('*, project:projects(id, title, slug, thumbnail, category, tech_stack)')
                .or(`slug.eq.${slug},slug.eq.${normalizedSlug}`)
                .eq('is_published', true)
                .maybeSingle();

            if (!error && data) {
                setStudy(data as ProductCaseStudy);
            } else {
                setStudy(null);
            }

            setLoading(false);
        };

        fetchStudy();
    }, [slug, normalizedSlug]);

    const sections = useMemo(() => {
        if (!study) return [];

        return [
            {
                id: 'context',
                eyebrow: 'Background',
                title: 'Why this product mattered',
                body: study.context,
                images: study.thumbnail ? [study.thumbnail] : []
            },
            {
                id: 'problem',
                eyebrow: 'Problem',
                title: 'The friction I needed to solve',
                body: study.problem,
                images: []
            },
            {
                id: 'insight',
                eyebrow: 'Research Signal',
                title: 'What I learned from users and workflow reality',
                body: study.insight,
                images: []
            },
            {
                id: 'approach',
                eyebrow: 'Process',
                title: 'How I translated insight into product direction',
                body: study.approach,
                images: study.approach_images || []
            },
            {
                id: 'output',
                eyebrow: 'Deliverables',
                title: 'What was produced and handed off',
                body: study.output,
                images: study.output_images || []
            },
            {
                id: 'outcome',
                eyebrow: 'Outcome',
                title: 'What changed and what I would validate next',
                body: study.outcome,
                images: study.outcome_images || []
            }
        ];
    }, [study]);

    if (loading) {
        return <DetailLoadingState productHomePath={productHomePath} />;
    }

    if (!study) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-white px-6 text-zinc-950">
                <div className="max-w-xl text-center">
                    <div className="text-[10px] font-black uppercase tracking-[0.32em] text-primary">Case Not Found</div>
                    <h1 className="mt-5 text-5xl font-black uppercase tracking-tight">Product case not found.</h1>
                    <Link to={productHomePath} className="mt-8 inline-flex rounded-full bg-zinc-950 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                        Back to Product Portfolio
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f7f7f5] text-zinc-950">
            <div className="fixed inset-x-0 top-0 z-50 border-b border-zinc-200 bg-white px-5 py-4">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
                    <Link to={productHomePath} className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-zinc-500 transition-colors hover:text-primary">
                        <ChevronLeft className="h-4 w-4" />
                        Product Hub
                    </Link>
                    <div className="hidden items-center gap-5 md:flex">
                        {sections.map((item, index) => (
                            <a key={item.id} href={`#${item.id}`} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-zinc-400 transition-colors hover:text-zinc-950">
                                <span className="text-primary">{String(index + 1).padStart(2, '0')}</span>
                                <span>{item.eyebrow}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <section className="px-6 pb-24 pt-32 md:pt-40">
                <div className="mx-auto max-w-6xl space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-10"
                    >
                        <div className="max-w-5xl">
                            <div className="mb-8 flex flex-wrap items-center gap-3">
                                <Badge className="rounded-full border border-primary/20 bg-primary/10 px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.16em] text-primary hover:bg-primary/10">
                                    {study.category}
                                </Badge>
                                <Badge className={cn('rounded-full border px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.16em]', evidenceBadgeStyles[study.mode])}>
                                    {study.mode}
                                </Badge>
                            </div>
                            <h1 className="text-6xl font-black uppercase leading-[0.86] tracking-tighter md:text-8xl">
                                {study.title}
                            </h1>
                            <p className="mt-10 max-w-4xl text-xl font-semibold leading-relaxed text-zinc-600 md:text-2xl">
                                {study.summary}
                            </p>
                        </div>

                        <div className="grid gap-3 rounded-[2rem] border border-zinc-200 bg-white p-4 shadow-[0_18px_60px_rgba(0,0,0,0.04)] md:grid-cols-4">
                            {[
                                ['Role', study.role],
                                ['Timeline', study.timeline],
                                ['Focus', study.category],
                                ['Deliverables', `${study.deliverables?.length || 0} items`]
                            ].map(([label, value]) => (
                                <div key={label} className="rounded-[1.4rem] bg-zinc-50 p-5">
                                    <div className="text-[11px] font-black uppercase tracking-[0.14em] text-zinc-400">{label}</div>
                                    <div className="mt-3 text-base font-black uppercase leading-snug text-zinc-950">{value}</div>
                                </div>
                            ))}
                        </div>

                        {study.project && (
                            <Link
                                to={`/projects/${study.project.slug}`}
                                className="block rounded-[2rem] border border-zinc-950 bg-zinc-950 p-6 text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(0,0,0,0.18)]"
                            >
                                <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                                    <div>
                                        <div className="text-[13px] font-black uppercase tracking-[0.16em] text-primary">
                                            Developer Implementation
                                        </div>
                                        <div className="mt-3 text-2xl font-black uppercase leading-tight tracking-tight">
                                            {study.project.title}
                                        </div>
                                        <div className="mt-3 max-w-2xl text-base font-semibold leading-relaxed text-white/60">
                                            View the engineering build, stack, implementation details, and shipped system behind this product case.
                                        </div>
                                    </div>
                                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-zinc-950">
                                        <ArrowUpRight className="h-5 w-5" />
                                    </span>
                                </div>
                            </Link>
                        )}
                    </motion.div>
                </div>
            </section>

            <section className="border-y border-zinc-200 bg-white px-6 py-10">
                <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
                    {[
                        ['Signal', 'What evidence shaped the decision?'],
                        ['Decision', 'What product direction was chosen?'],
                        ['Validation', 'What outcome or next test matters?']
                    ].map(([title, desc], index) => (
                        <div key={title} className="border-l border-zinc-200 pl-5">
                            <div className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">0{index + 1}</div>
                            <div className="mt-2 text-2xl font-black uppercase tracking-tight">{title}</div>
                            <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-500">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <article className="px-6 py-20 md:py-28">
                <div className="mx-auto max-w-6xl space-y-32">
                    {sections.map((section, index) => (
                        <EditorialSection
                            key={section.id}
                            index={index}
                            section={section}
                            deliverables={section.id === 'output' ? study.deliverables : []}
                            onImageClick={openLightbox}
                        />
                    ))}
                </div>
            </article>

            <section className="border-t border-zinc-200 bg-zinc-950 px-6 py-20 text-white">
                <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.32em] text-primary">Next Read</div>
                        <h2 className="mt-4 text-4xl font-black uppercase tracking-tighter md:text-6xl">
                            Back to product case studies.
                        </h2>
                    </div>
                    <Link to={productHomePath}>
                        <Button className="h-14 rounded-full bg-white px-8 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-950 hover:bg-primary hover:text-white">
                            View All Cases
                            <ExternalLink className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </section>

            <AnimatePresence>
                {lightboxImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/95 backdrop-blur-3xl"
                        onClick={closeLightbox}
                    >
                        <div
                            className="absolute left-1/2 top-6 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-2 py-2 shadow-2xl backdrop-blur-xl"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <button
                                className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-all hover:bg-white/10 hover:text-white"
                                title="Zoom In"
                                onClick={handleZoomIn}
                            >
                                <ZoomIn className="h-5 w-5" />
                            </button>
                            <div className="min-w-[60px] px-3 text-center text-[10px] font-black uppercase tracking-widest text-white/60">
                                {Math.round(zoom * 100)}%
                            </div>
                            <button
                                className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-all hover:bg-white/10 hover:text-white"
                                title="Zoom Out"
                                onClick={handleZoomOut}
                            >
                                <ZoomOut className="h-5 w-5" />
                            </button>
                            <div className="mx-1 h-6 w-px bg-white/20" />
                            <button
                                className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-all hover:bg-white/10 hover:text-white"
                                title="Reset View"
                                onClick={resetView}
                            >
                                <RotateCcw className="h-4 w-4" />
                            </button>
                            <div className="mx-1 h-6 w-px bg-white/20" />
                            <button
                                className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-all hover:bg-white/10 hover:text-white"
                                title="Close"
                                onClick={closeLightbox}
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                            Scroll to Zoom | Double-click to Toggle | Drag to Pan
                        </div>

                        <div
                            className="relative flex h-full w-full items-center justify-center overflow-hidden p-6 md:p-12"
                            onWheel={handleWheel}
                            onClick={(event) => event.stopPropagation()}
                        >
                            <img
                                src={getAssetUrl(lightboxImage)}
                                alt="High Resolution Preview"
                                className="max-h-[85vh] max-w-full select-none rounded-3xl border border-white/10 object-contain shadow-[0_30px_100px_rgba(0,0,0,0.5)]"
                                draggable={false}
                                onDoubleClick={handleDoubleClick}
                                onPointerDown={handlePointerDown}
                                onPointerMove={handlePointerMove}
                                onPointerUp={handlePointerUp}
                                onPointerCancel={handlePointerUp}
                                style={{
                                    transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                                    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                                    cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

type CaseSection = {
    id: string;
    eyebrow: string;
    title: string;
    body: string;
    images: string[];
};

function EditorialSection({
    index,
    section,
    deliverables,
    onImageClick
}: {
    index: number;
    section: CaseSection;
    deliverables: string[];
    onImageClick: (image: string) => void;
}) {
    const narrative = splitNarrative(section.body);

    return (
        <motion.section
            id={section.id}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="scroll-mt-24"
        >
            <div className="space-y-16">
                <header className="rounded-[2rem] border border-zinc-200 bg-white p-6 md:p-8">
                    <div className="grid gap-8 md:grid-cols-[120px_1fr] md:items-start">
                        <div className="flex items-center gap-4 md:block">
                            <div className="text-5xl font-black leading-none tracking-tighter text-primary md:text-6xl">
                                {String(index + 1).padStart(2, '0')}
                            </div>
                            <div className="mt-0 md:mt-5">
                                <div className="text-[13px] font-black uppercase tracking-[0.14em] text-zinc-400">
                                    {section.eyebrow}
                                </div>
                                <div className="mt-2 h-1 w-12 bg-primary" />
                            </div>
                        </div>
                        <div>
                            <div className="mb-5 text-[12px] font-black uppercase tracking-[0.22em] text-primary">
                                Product Case Section
                            </div>
                            <h2 className="max-w-4xl text-5xl font-black uppercase leading-[0.88] tracking-tighter text-zinc-950 md:text-7xl">
                                {section.title}
                            </h2>
                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-4xl space-y-10">
                    {narrative.intro && (
                        <p className="max-w-4xl text-xl font-semibold leading-relaxed text-zinc-700 md:text-2xl">
                            {narrative.intro}
                        </p>
                    )}

                    {narrative.points.length > 0 && (
                        <div className="space-y-5">
                            {narrative.points.map((point, pointIndex) => (
                                <div key={pointIndex} className="grid gap-4 border-t border-zinc-200 pt-5 md:grid-cols-[80px_1fr]">
                                    <div className="text-2xl font-black tracking-tight text-zinc-300 md:text-3xl">
                                        {String(pointIndex + 1).padStart(2, '0')}
                                    </div>
                                    <p className="text-base font-medium leading-relaxed text-zinc-700 md:text-lg">
                                        {point}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {deliverables.length > 0 && (
                        <div className="flex flex-wrap gap-2 border-y border-zinc-200 py-5">
                            {deliverables.map((item) => (
                                <span key={item} className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                                    {item}
                                </span>
                            ))}
                        </div>
                    )}

                    {section.images.length > 0 && (
                        <div className={cn('grid gap-5', section.images.length > 1 ? 'md:grid-cols-2' : '')}>
                            {section.images.map((image, imageIndex) => (
                                <figure key={`${image}-${imageIndex}`} className={cn('group', section.id === 'output' ? 'max-w-sm' : '')}>
                                    <button
                                        type="button"
                                        onClick={() => onImageClick(image)}
                                        className={cn(
                                            'relative block w-full overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition-all hover:border-primary/40',
                                            section.id === 'output' ? 'aspect-[9/18]' : 'aspect-[16/10]'
                                        )}
                                    >
                                        <img
                                            src={getAssetUrl(image)}
                                            alt={`${readableLabel(section.id)} evidence ${imageIndex + 1}`}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                        />
                                        <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-950 shadow-lg opacity-0 transition-opacity group-hover:opacity-100">
                                            <Maximize2 className="h-4 w-4" />
                                        </span>
                                    </button>
                                    <figcaption className="mt-3 text-[11px] font-black uppercase tracking-[0.12em] text-zinc-400">
                                        {readableLabel(section.id)} evidence {String(imageIndex + 1).padStart(2, '0')}
                                    </figcaption>
                                </figure>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.section>
    );
}
