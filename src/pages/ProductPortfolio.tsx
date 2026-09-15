import { useEffect, useState } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
    ArrowRight,
    BadgeCheck,
    BarChart3,
    BookOpenCheck,
    Brain,
    ChevronDown,
    ClipboardCheck,
    CodeXml,
    FileText,
    Gauge,
    GitBranch,
    Layers3,
    Lightbulb,
    LineChart,
    MessageSquareQuote,
    MousePointer2,
    Route,
    Search,
    Mail,
    Smartphone,
    Target,
    Users,
    Workflow
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import type { EvidenceMode, ProductCaseStudy } from '@/data/productCaseStudies';
import { getAssetUrl } from '@/lib/assets';
import type { ProductDocumentRecord } from '@/types';

const GitHubIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454c.981 0 1.775-.773 1.775-1.729V1.729C24 .774 23.206 0 22.225 0z" />
    </svg>
);

const learningSteps = [
    {
        square: 1,
        title: 'UI/UX Foundation',
        desc: 'Build interface clarity, flow logic, and hierarchy before turning a screen into a product decision.',
        icon: Layers3,
        badge: 'Start'
    },
    {
        square: 7,
        title: 'User Research',
        desc: 'Collect user signals from interviews, feedback, surveys, and real workflow observation.',
        icon: MessageSquareQuote,
        badge: 'Signal'
    },
    {
        square: 14,
        title: 'Problem Framing',
        desc: 'Turn messy findings into clear problem statements, user pain points, and opportunity areas.',
        icon: Target,
        badge: 'Frame'
    },
    {
        square: 22,
        title: 'PRD & User Story',
        desc: 'Translate decisions into requirements, user stories, acceptance criteria, and delivery scope.',
        icon: FileText,
        badge: 'Define'
    },
    {
        square: 29,
        title: 'Prototype & Test',
        desc: 'Shape wireframes, hi-fi flows, and usability scenarios to validate the direction.',
        icon: Workflow,
        badge: 'Validate'
    },
    {
        square: 36,
        title: 'Product Thinker',
        desc: 'Connect research, UX clarity, feasibility, and delivery into decisions that can be shipped and validated.',
        icon: BadgeCheck,
        badge: 'Goal',
        isGoal: true
    }
];

const boardCells = Array.from({ length: 36 }, (_, index) => {
    const rowFromTop = Math.floor(index / 6);
    const col = index % 6;
    const rowFromBottom = 5 - rowFromTop;
    const rowStart = rowFromBottom * 6 + 1;
    return rowFromBottom % 2 === 0 ? rowStart + col : rowStart + (5 - col);
});

const tokenPath = Array.from({ length: 36 }, (_, index) => {
    const square = index + 1;
    const rowFromBottom = Math.floor((square - 1) / 6);
    const positionInRow = (square - 1) % 6;
    const col = rowFromBottom % 2 === 0 ? positionInRow : 5 - positionInRow;
    const rowFromTop = 5 - rowFromBottom;

    return {
        left: `${((col + 0.5) / 6) * 100}%`,
        top: `${((rowFromTop + 0.5) / 6) * 100}%`
    };
});

const milestoneBySquare = new Map(learningSteps.map((step) => [step.square, step]));

const celebrateParticles = [
    { x: -64, y: -52, rotate: -28, color: 'bg-primary' },
    { x: -38, y: -82, rotate: 18, color: 'bg-zinc-950' },
    { x: 0, y: -92, rotate: 48, color: 'bg-emerald-400' },
    { x: 38, y: -78, rotate: -18, color: 'bg-primary' },
    { x: 66, y: -46, rotate: 32, color: 'bg-zinc-950' },
    { x: -72, y: -12, rotate: 12, color: 'bg-emerald-400' },
    { x: 74, y: -8, rotate: -42, color: 'bg-primary' },
    { x: -28, y: -36, rotate: 78, color: 'bg-zinc-950' },
    { x: 26, y: -42, rotate: -68, color: 'bg-emerald-400' }
];

const researchMethods = [
    {
        label: 'User Interview',
        purpose: 'Clarifies the real user problem before defining scope or solution direction.',
        question: 'What problem is painful enough to solve?',
        decision: 'Define problem scope',
        evidence: 'Quotes, pain points, jobs-to-be-done',
        icon: MessageSquareQuote
    },
    {
        label: 'Survey',
        purpose: 'Checks whether a signal appears across enough users to influence priority.',
        question: 'Is this a recurring pattern or one-person feedback?',
        decision: 'Prioritize opportunity',
        evidence: 'Frequency, preference, segment pattern',
        icon: BarChart3
    },
    {
        label: 'Affinity Map',
        purpose: 'Turns scattered feedback into themes that can guide product direction.',
        question: 'Which feedback points are connected?',
        decision: 'Find core insight',
        evidence: 'Insight clusters, themes, opportunity areas',
        icon: Brain
    },
    {
        label: 'Persona',
        purpose: 'Keeps decisions anchored to the user segment, behavior, and constraint.',
        question: 'Who are we designing this for?',
        decision: 'Align user focus',
        evidence: 'User goals, behavior, constraints',
        icon: Target
    },
    {
        label: 'Competitor Analysis',
        purpose: 'Identifies current alternatives, expected patterns, and meaningful gaps.',
        question: 'Where can the experience be clearer or more useful?',
        decision: 'Choose positioning',
        evidence: 'Feature gap, UX pattern, differentiation',
        icon: LineChart
    },
    {
        label: 'Usability Testing',
        purpose: 'Validates whether users can understand the flow and complete the task.',
        question: 'Can users understand and use the solution?',
        decision: 'Improve iteration',
        evidence: 'Task success, friction points, next iteration',
        icon: MousePointer2
    }
];

const productStrengths = [
    {
        title: 'Engineering Reality',
        desc: 'I account for feasibility, edge cases, system constraints, and delivery tradeoffs before shaping a solution.',
        icon: CodeXml
    },
    {
        title: 'UX Clarity',
        desc: 'I turn messy workflows into clearer journeys, interface decisions, and product requirements.',
        icon: MousePointer2
    },
    {
        title: 'Team Delivery',
        desc: 'I keep scope realistic by connecting design intent, engineering effort, and stakeholder needs.',
        icon: Users
    }
];

const productMindsetFlow = [
    { label: 'Research', icon: Search },
    { label: 'Frame', icon: Target },
    { label: 'Prioritize', icon: GitBranch },
    { label: 'Ship', icon: Workflow },
    { label: 'Learn', icon: Lightbulb }
];

const evidenceStyles: Record<EvidenceMode, string> = {
    Outcome: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Validation Outcome': 'bg-blue-50 text-blue-700 border-blue-200',
    'Learning & Next Improvement': 'bg-amber-50 text-amber-700 border-amber-200'
};

const itemVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0 }
};

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <span className="text-[11px] font-black tracking-[0.4em] text-primary uppercase">
            {children}
        </span>
    );
}

function FloatingCard({
    className,
    icon: Icon,
    label,
    title
}: {
    className?: string;
    icon: React.ElementType;
    label: string;
    title: string;
}) {
    const dragControls = useDragControls();

    return (
        <motion.div
            drag
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onPointerDown={(event) => dragControls.start(event)}
            whileHover={{ scale: 1.05, rotate: -4 }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
            transition={{
                opacity: { duration: 0.7 },
                scale: { duration: 0.7 },
                y: { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
            }}
            className={cn('absolute z-20 hidden cursor-grab select-none touch-none rounded-[2rem] border border-white/25 bg-white/15 p-5 text-white shadow-2xl backdrop-blur-2xl active:cursor-grabbing lg:block', className)}
        >
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                    <Icon className="h-5 w-5" />
                </div>
                <div>
                    <div className="text-[9px] font-black uppercase tracking-[0.25em] text-white/60">{label}</div>
                    <div className="text-sm font-black uppercase tracking-tight">{title}</div>
                </div>
            </div>
        </motion.div>
    );
}

function ProductCaseLoadingGrid() {
    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading product case studies">
            {Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="relative min-h-[340px] overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-[0_22px_70px_rgba(0,0,0,0.05)]"
                >
                    <motion.div
                        className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/85 to-transparent"
                        initial={{ x: '-120%' }}
                        animate={{ x: '260%' }}
                        transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut', delay: index * 0.08 }}
                    />
                    <div className="relative flex h-full flex-col justify-between">
                        <div>
                            <div className="mb-5 flex items-center justify-between">
                                <div className="h-3 w-10 rounded-full bg-zinc-100" />
                                <div className="h-6 w-28 rounded-full bg-zinc-100" />
                            </div>
                            <div className="mb-5 aspect-[16/10] overflow-hidden rounded-[1.25rem] border border-zinc-100 bg-zinc-100">
                                <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#f4f4f5,#ffffff,#eef2ff)]">
                                    <Workflow className="h-8 w-8 text-primary/25" />
                                </div>
                            </div>
                            <div className="h-7 w-3/4 rounded-full bg-zinc-100" />
                            <div className="mt-4 space-y-2">
                                <div className="h-3 w-full rounded-full bg-zinc-100" />
                                <div className="h-3 w-11/12 rounded-full bg-zinc-100" />
                                <div className="h-3 w-2/3 rounded-full bg-zinc-100" />
                            </div>
                        </div>
                        <div className="mt-6 space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="h-16 rounded-2xl bg-zinc-50" />
                                <div className="h-16 rounded-2xl bg-zinc-50" />
                            </div>
                            <div className="h-12 rounded-full bg-zinc-950/10" />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

function DevPortfolioCard() {
    const dragControls = useDragControls();

    return (
        <motion.div
            drag
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onPointerDown={(event) => dragControls.start(event)}
            whileHover={{ scale: 1.05, rotate: 4 }}
            initial={{ x: -100, y: 50, opacity: 0 }}
            animate={{ x: 0, y: [0, -8, 0], opacity: 1 }}
            transition={{
                x: { delay: 0.75, duration: 0.7 },
                opacity: { delay: 0.75, duration: 0.7 },
                y: { delay: 1.2, duration: 3.2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute bottom-[10%] left-[5%] hidden w-60 cursor-grab select-none touch-none rounded-[2rem] border border-white/25 bg-white/15 p-5 text-white shadow-2xl backdrop-blur-2xl active:cursor-grabbing lg:block"
        >
            <Link to="/" className="group block">
                <div className="flex items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/30 bg-white/20">
                            <CodeXml className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="text-[13px] font-black uppercase tracking-widest">DEWA.DEV</div>
                            <div className="text-[10px] font-bold uppercase text-white/60">Frontend • Mobile • UI/UX</div>
                        </div>
                    </div>
                    <ArrowRight className="h-4 w-4 -rotate-45 transition-transform group-hover:rotate-0" />
                </div>
            </Link>
        </motion.div>
    );
}

export default function ProductPortfolio() {
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [openedFoldCount, setOpenedFoldCount] = useState(1);
    const [hoveredMilestone, setHoveredMilestone] = useState<(typeof learningSteps)[number] | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [caseStudies, setCaseStudies] = useState<ProductCaseStudy[]>([]);
    const [casesLoading, setCasesLoading] = useState(true);
    const [documents, setDocuments] = useState<ProductDocumentRecord[]>([]);
    const [documentsLoading, setDocumentsLoading] = useState(true);
    const productCaseBase = typeof window !== 'undefined' && window.location.hostname.startsWith('product.') ? '/cases' : '/product/cases';
    const devPortfolioPath = typeof window !== 'undefined' && window.location.hostname.startsWith('product.') ? 'https://dewa.dev' : '/';

    useEffect(() => {
        const targetId = location.hash.replace('#', '');
        if (!targetId) {
            window.scrollTo({ top: 0, behavior: 'auto' });
            return;
        }

        window.requestAnimationFrame(() => {
            document.getElementById(targetId)?.scrollIntoView({ behavior: 'auto', block: 'start' });
        });
    }, [location.hash, location.pathname]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const timer = window.setInterval(() => setCurrentTime(new Date()), 1000);
        return () => window.clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchProductContent = async () => {
            setCasesLoading(true);
            setDocumentsLoading(true);
            const [{ data: caseData, error: caseError }, { data: documentData, error: documentError }] = await Promise.all([
                supabase
                    .from('product_case_studies')
                    .select('*')
                    .eq('is_published', true)
                    .order('sort_order', { ascending: true })
                    .order('created_at', { ascending: false }),
                supabase
                    .from('product_documents')
                    .select('*')
                    .eq('is_published', true)
                    .order('sort_order', { ascending: true })
                    .order('created_at', { ascending: false })
            ]);

            if (!caseError && caseData?.length) {
                setCaseStudies(caseData as ProductCaseStudy[]);
            } else {
                setCaseStudies([]);
            }

            if (!documentError && documentData?.length) {
                setDocuments(documentData as ProductDocumentRecord[]);
            } else {
                setDocuments([]);
            }

            setCasesLoading(false);
            setDocumentsLoading(false);
        };

        fetchProductContent();
    }, []);

    return (
        <div className="min-h-screen overflow-x-hidden bg-white text-zinc-950 selection:bg-primary/20 selection:text-primary">
            <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]" />
                <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-emerald-400/10 blur-[120px]" />
                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
                        backgroundSize: '54px 54px'
                    }}
                />
            </div>

            <div className="fixed left-6 top-1/2 z-[100] hidden -translate-y-1/2 flex-col gap-6 xl:flex">
                {[
                    { icon: GitHubIcon, href: "https://github.com/anggadewa", color: "hover:bg-[#24292e] hover:shadow-[0_0_20px_rgba(36,41,46,0.5)]" },
                    { icon: LinkedInIcon, href: "https://linkedin.com/in/anggadewantorokekasih", color: "hover:bg-[#0077b5] hover:shadow-[0_0_20px_rgba(0,119,181,0.5)]" },
                    { icon: Mail, href: "mailto:anggadewa2016@gmail.com", color: "hover:bg-primary hover:shadow-[0_0_20px_rgba(var(--primary),0.5)]" }
                ].map((social, index) => (
                    <motion.a
                        key={social.href}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className={cn(
                            "flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-white/20 bg-white/70 text-foreground/60 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:text-white",
                            social.color
                        )}
                    >
                        <social.icon className="h-6 w-6 transition-transform duration-500 group-hover:scale-125" />
                    </motion.a>
                ))}
            </div>

            <header className="fixed left-1/2 top-8 z-[100] w-full max-w-4xl -translate-x-1/2 px-6">
                <nav className={cn(
                    "flex items-center justify-between rounded-full px-8 py-3 transition-all duration-500",
                    isScrolled
                        ? "border border-zinc-200 bg-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-xl"
                        : "border border-white/20 bg-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-md"
                )}>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className={cn(
                            "cursor-pointer select-none text-sm font-black tracking-tighter transition-colors",
                            isScrolled ? "text-zinc-950" : "text-white"
                        )}
                    >
                        DEWA<span className="italic opacity-70">.PRODUCT</span>
                    </button>
                    <div className="hidden items-center gap-8 md:flex">
                        {['About', 'Journey', 'Cases', 'Documents'].map((item) => (
                            <button
                                key={item}
                                onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
                                className={cn(
                                    "group relative text-[11px] font-black uppercase tracking-widest transition-all",
                                    isScrolled ? "text-zinc-500 hover:text-zinc-950" : "text-white/70 hover:text-white"
                                )}
                            >
                                {item}
                                <span className={cn(
                                    "absolute -bottom-1 left-0 h-0.5 w-0 transition-all group-hover:w-full",
                                    isScrolled ? "bg-zinc-950" : "bg-white"
                                )} />
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            className={cn(
                                "hidden h-11 items-center gap-2 rounded-full border px-5 text-[11px] font-black uppercase tracking-[0.18em] transition-all hover:scale-105 active:scale-95 sm:flex",
                                isScrolled
                                    ? "border-zinc-200 bg-zinc-950 text-white shadow-[0_10px_30px_rgba(0,0,0,0.16)] hover:bg-zinc-900"
                                    : "border-white/25 bg-white/10 text-white backdrop-blur-md hover:bg-white hover:text-primary"
                            )}
                        >
                            <CodeXml className="h-3.5 w-3.5" />
                            Dev
                        </Link>
                        <Button
                            onClick={() => { window.location.href = 'mailto:anggadewa2016@gmail.com'; }}
                            className={cn(
                                "hidden h-11 rounded-full px-8 text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 sm:flex",
                                isScrolled
                                    ? "bg-primary text-white shadow-[0_10px_30px_rgba(0,80,255,0.2)] hover:bg-primary/90"
                                    : "bg-white text-primary shadow-[0_10px_30px_rgba(255,255,255,0.3)] hover:bg-white/90"
                            )}
                        >
                            Hire Me
                        </Button>
                    </div>
                </nav>
            </header>

            <main>
                <section className="relative flex min-h-screen items-center overflow-hidden bg-primary px-6 pb-28 pt-28 text-white">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:44px_44px] opacity-25" />
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-zinc-950/15 to-transparent" />
                    <FloatingCard icon={Search} label="Research" title="User Insight" className="left-[8%] top-[26%]" />
                    <FloatingCard icon={FileText} label="Output" title="PRD & Flow" className="right-[7%] top-[25%]" />
                    <FloatingCard icon={Gauge} label="Evidence" title="Validation" className="bottom-[10%] right-[7%]" />
                    <DevPortfolioCard />

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {},
                            visible: { transition: { staggerChildren: 0.1 } }
                        }}
                        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center pb-12 text-center"
                    >
                        <motion.div variants={itemVariants} className="mb-12 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
                            <div className="h-2 w-2 rounded-full bg-green-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Available for freelance</span>
                        </motion.div>
                        <motion.h1 variants={itemVariants} className="max-w-[95vw] text-[19vw] font-black uppercase leading-[0.78] tracking-tighter md:text-[13vw] lg:text-[11rem] xl:text-[12rem]">
                            Product
                            <span className="block text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.55)]">Thinking</span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className="mt-12 max-w-4xl text-lg font-semibold leading-relaxed text-white/80 md:text-2xl">
                            I connect user insight, UX clarity, and engineering reality into product decisions that can be shipped, tested, and improved.
                        </motion.p>
                        <motion.div variants={itemVariants} className="mt-10 flex flex-col gap-4 sm:flex-row">
                            <Button
                                onClick={() => document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' })}
                                className="h-16 rounded-full bg-white px-10 text-[11px] font-black uppercase tracking-[0.22em] text-primary shadow-[0_18px_45px_rgba(255,255,255,0.22)] hover:bg-white/90"
                            >
                                View Case Studies
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                            <Button
                                onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })}
                                variant="outline"
                                className="h-16 rounded-full border-white/25 bg-white/10 px-10 text-[11px] font-black uppercase tracking-[0.22em] text-white backdrop-blur-md hover:bg-white hover:text-primary"
                            >
                                Learning Journey
                            </Button>
                        </motion.div>
                    </motion.div>
                    <motion.button
                        type="button"
                        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                        initial={{ opacity: 0, x: "-50%", y: 8 }}
                        animate={{ opacity: 1, x: "-50%", y: 0 }}
                        transition={{ delay: 2.5 }}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.96 }}
                        className="absolute bottom-7 left-1/2 z-[40] flex flex-col items-center gap-4 text-white/70 transition-colors hover:text-white"
                    >
                        <span className="text-[7px] font-black uppercase tracking-[0.55em]">Scroll to Explore</span>
                        <span className="relative flex h-14 w-7 items-start justify-center rounded-full border border-white/25 bg-white/10 p-1 shadow-[0_14px_45px_rgba(0,0,0,0.12)] backdrop-blur-xl">
                            <motion.span
                                animate={{ y: [0, 24, 0], opacity: [1, 0.3, 1] }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                                className="h-2 w-2 rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,0.85)]"
                            />
                            <ChevronDown className="absolute bottom-1.5 h-3.5 w-3.5" />
                        </span>
                    </motion.button>
                </section>

                <section id="about" className="relative overflow-hidden bg-white px-6 py-20">
                    <div
                        className="absolute inset-0 pointer-events-none opacity-[0.035]"
                        style={{
                            backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
                            backgroundSize: '48px 48px',
                            backgroundPosition: 'center top'
                        }}
                    />

                    <div className="relative mx-auto max-w-7xl space-y-12 xl:pl-20">
                        <motion.div
                            initial={{ opacity: 0, x: -28 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.7 }}
                            className="space-y-8 pt-8"
                        >
                            <SectionLabel>About</SectionLabel>
                            <h2 className="max-w-5xl text-5xl font-black uppercase leading-[0.9] tracking-tighter md:text-6xl xl:text-7xl">
                                From building screens to shaping <span className="text-primary italic">product decisions.</span>
                            </h2>
                            <div className="grid max-w-6xl gap-5 text-base font-semibold leading-relaxed text-zinc-500 md:grid-cols-2 md:text-lg">
                                <p>
                                    I come from frontend, mobile, and UI/UX work, where I learned how product decisions become real user-facing experiences.
                                </p>
                                <p>
                                    I am now strengthening that foundation with Product Management: framing user problems, translating research into requirements, and validating whether a solution is worth building.
                                </p>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="grid max-w-3xl grid-cols-3 gap-3"
                            >
                                {[
                                    ['5+', 'Years Building'],
                                    ['7+', 'Products Shipped'],
                                    ['3', 'Product Angles']
                                ].map(([value, label]) => (
                                    <div key={label} className="rounded-[1.5rem] border border-zinc-100 bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.035)]">
                                        <div className="text-3xl font-black tracking-tighter text-zinc-950">{value}</div>
                                        <div className="mt-1 text-[9px] font-black uppercase tracking-widest text-zinc-400">{label}</div>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>

                        <div className="relative grid min-w-0 max-w-full gap-6 overflow-hidden pt-2 lg:grid-cols-2">
                            <motion.div
                                initial={{ opacity: 0, y: 28 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-80px" }}
                                transition={{ duration: 0.7 }}
                                className="relative h-full max-w-full overflow-hidden rounded-[2rem] border border-zinc-200 bg-zinc-950 p-6 text-white shadow-[0_10px_24px_rgba(0,0,0,0.06)] md:p-8"
                            >
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] [background-size:32px_32px]" />
                                <div className="relative space-y-6">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Product Edge</div>
                                            <h3 className="mt-2 text-3xl font-black uppercase leading-tight tracking-tight md:text-[2.6rem]">Technical Product Thinker</h3>
                                        </div>
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                                            <Brain className="h-6 w-6" />
                                        </div>
                                    </div>

                                    <div className="grid gap-3 pt-1">
                                        {productStrengths.map(({ title, desc, icon: Icon }, index) => (
                                            <motion.div
                                                key={title}
                                                initial={{ opacity: 0, x: 24 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: index * 0.08 }}
                                                whileHover={{ x: 8 }}
                                                className="group rounded-[1.35rem] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl transition-all hover:bg-white/[0.1]"
                                            >
                                                <div className="flex gap-4">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-primary">
                                                        <Icon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="mb-1 text-[9px] font-black uppercase tracking-[0.24em] text-white/35">0{index + 1}</div>
                                                        <h4 className="text-base font-black uppercase tracking-tight">{title}</h4>
                                                        <p className="mt-1 text-[13px] font-medium leading-relaxed text-white/55">{desc}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.25 }}
                                className="relative z-10 w-full max-w-full overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-4"
                            >
                                <div className="mb-4 flex items-center justify-between gap-4 px-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">How I Think</span>
                                    <button
                                        type="button"
                                        onClick={() => setOpenedFoldCount((current) => current >= productMindsetFlow.length ? 1 : current + 1)}
                                        className="rounded-full bg-zinc-950 px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-primary"
                                    >
                                        {openedFoldCount >= productMindsetFlow.length ? 'Refold' : 'Unfold Next'}
                                    </button>
                                </div>
                                <div className="relative min-h-[330px] overflow-hidden rounded-[1.5rem] bg-zinc-50 p-5">
                                    <div className="mb-4 flex items-center justify-between gap-4 rounded-[1.25rem] border border-dashed border-zinc-200 bg-white px-4 py-3">
                                        <span className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-400">
                                            Click the button or folded tabs to open the process map
                                        </span>
                                        <span className="text-[10px] font-black uppercase tracking-[0.24em] text-primary">
                                            {openedFoldCount}/5 open
                                        </span>
                                    </div>
                                    <div className="relative mx-auto flex min-h-[290px] w-full max-w-full items-center overflow-x-auto overflow-y-hidden overscroll-x-contain px-2 py-8 custom-scrollbar">
                                        <div className="flex min-w-max items-stretch [perspective:1600px]">
                                            {productMindsetFlow.map(({ label, icon: Icon }, index) => {
                                                const isOpen = index < openedFoldCount;
                                                const canOpen = index === openedFoldCount;
                                                const descriptions = [
                                                    'Start from user signals, feedback, and workflow observation.',
                                                    'Turn scattered findings into a clear product problem.',
                                                    'Choose the next move based on risk, impact, and effort.',
                                                    'Translate decisions into a shippable product scope.',
                                                    'Validate the result, capture learning, and plan the next iteration.'
                                                ];
                                                return (
                                                    <motion.div
                                                        key={label}
                                                        animate={{
                                                            width: isOpen ? 210 : 54,
                                                            rotateY: isOpen ? 0 : -14,
                                                            opacity: isOpen || canOpen ? 1 : 0.72
                                                        }}
                                                        transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
                                                        onClick={() => {
                                                            if (canOpen) setOpenedFoldCount(index + 1);
                                                        }}
                                                        className={cn(
                                                            "relative h-[260px] shrink-0 origin-left overflow-hidden border-y border-r border-zinc-200 bg-white first:rounded-l-[1.75rem] first:border-l last:rounded-r-[1.75rem] shadow-[0_8px_18px_rgba(0,0,0,0.035)]",
                                                            canOpen && "cursor-pointer ring-2 ring-primary/20"
                                                        )}
                                                    >
                                                        <motion.div
                                                            animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -12 }}
                                                            transition={{ duration: 0.28 }}
                                                            className="flex h-full w-[210px] flex-col justify-between p-5"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_14px_30px_rgba(0,80,255,0.22)]">
                                                                    <Icon className="h-5 w-5" />
                                                                </div>
                                                                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-300">
                                                                    Fold {String(index + 1).padStart(2, '0')}
                                                                </span>
                                                            </div>

                                                            <div>
                                                                <h4 className="text-3xl font-black uppercase leading-none tracking-tighter text-zinc-950">
                                                                    {label}
                                                                </h4>
                                                                <p className="mt-4 text-sm font-semibold leading-relaxed text-zinc-500">
                                                                    {descriptions[index]}
                                                                </p>
                                                            </div>
                                                        </motion.div>

                                                        {!isOpen && (
                                                            <div className="absolute inset-0 flex flex-col items-center justify-between bg-white px-2 py-5">
                                                                <span className="text-[9px] font-black uppercase tracking-[0.22em] text-zinc-300 [writing-mode:vertical-rl]">
                                                                    Fold {String(index + 1).padStart(2, '0')}
                                                                </span>
                                                                <div className={cn(
                                                                    "flex h-9 w-9 items-center justify-center rounded-2xl text-white",
                                                                    canOpen ? "bg-primary" : "bg-zinc-300"
                                                                )}>
                                                                    <Icon className="h-4 w-4" />
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="absolute right-0 top-0 h-full w-px bg-zinc-200" />
                                                        <div className="absolute right-0 top-0 h-full w-7 bg-gradient-to-l from-zinc-200/35 to-transparent" />
                                                        <motion.div
                                                            initial={{ opacity: 0.5 }}
                                                            whileInView={{ opacity: 0 }}
                                                            viewport={{ once: true }}
                                                            transition={{ delay: 0.35 + index * 0.22, duration: 0.4 }}
                                                            className="absolute inset-0 bg-zinc-950/10"
                                                        />
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
	                </section>

                <section className="relative overflow-hidden border-y border-zinc-200 bg-zinc-950 px-6 py-20 text-white">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:40px_40px]" />
                    <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center xl:pl-20">
                        <motion.div
                            initial={{ opacity: 0, x: -28 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.65 }}
                            className="space-y-7"
                        >
	                            <SectionLabel>Beyond Product</SectionLabel>
	                            <h2 className="max-w-3xl text-4xl font-black uppercase leading-[0.92] tracking-tighter md:text-6xl">
	                                Built from engineering, growing into <span className="text-primary italic">product leadership.</span>
	                            </h2>
	                            <p className="max-w-2xl text-base font-semibold leading-relaxed text-white/60 md:text-lg">
	                                My product work is grounded in five years of building real interfaces, leading frontend delivery, and translating messy requirements into shipped systems. For the deeper career story, open my developer portfolio.
	                            </p>

	                            <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
	                                {[
	                                    ['Experience', 'Frontend leadership, delivery ownership, and cross-team collaboration'],
	                                    ['Education', 'Information Technology foundation with management study in progress'],
	                                    ['Engineering', 'Mobile, web, backend, UI systems, and release-ready implementation']
	                                ].map(([title, desc], index) => (
                                    <motion.div
                                        key={title}
                                        initial={{ opacity: 0, y: 14 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.08 }}
                                        className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-4"
                                    >
                                        <div className="text-[10px] font-black uppercase tracking-[0.24em] text-primary">0{index + 1}</div>
                                        <div className="mt-3 text-sm font-black uppercase tracking-tight">{title}</div>
                                        <p className="mt-2 text-xs font-semibold leading-relaxed text-white/45">{desc}</p>
                                    </motion.div>
                                ))}
                            </div>

	                            <Link to={devPortfolioPath} className="inline-flex pt-5">
	                                <Button className="group h-14 rounded-full bg-white px-8 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-950 hover:bg-primary hover:text-white">
	                                    View Full Developer Profile
	                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
	                                </Button>
	                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 28 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="relative min-h-[430px]"
                        >
                            <div className="absolute right-0 top-4 w-[82%] rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.22)]">
                                <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="h-3 w-3 rounded-full bg-red-400" />
                                        <span className="h-3 w-3 rounded-full bg-yellow-300" />
                                        <span className="h-3 w-3 rounded-full bg-green-400" />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-[0.24em] text-white/35">dewa-dev.tsx</span>
                                </div>
                                <div className="space-y-3 font-mono text-sm text-white/75">
	                                    <div><span className="text-primary">profile</span>.base = "Frontend Team Lead";</div>
	                                    <div><span className="text-primary">profile</span>.craft = "Mobile, Web, UI/UX";</div>
	                                    <div><span className="text-primary">profile</span>.direction = "Product Thinking";</div>
                                </div>
                                <motion.div
                                    className="mt-7 h-2 overflow-hidden rounded-full bg-white/10"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                >
                                    <motion.div
                                        className="h-full rounded-full bg-primary"
                                        initial={{ width: "18%" }}
                                        whileInView={{ width: "88%" }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1.35, ease: "easeOut" }}
                                    />
                                </motion.div>
                            </div>

                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute left-0 top-24 w-[48%] rounded-[2rem] border border-white/10 bg-white p-5 text-zinc-950 shadow-[0_24px_70px_rgba(0,0,0,0.2)]"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
                                    <CodeXml className="h-5 w-5" />
                                </div>
	                                <div className="mt-8 text-[10px] font-black uppercase tracking-[0.24em] text-primary">Dev Portfolio</div>
	                                <div className="mt-2 text-3xl font-black uppercase leading-none tracking-tight">Experience, stack, delivery.</div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute bottom-2 right-12 w-[42%] rounded-[2rem] border border-white/10 bg-primary p-5 text-white shadow-[0_24px_70px_rgba(0,80,255,0.22)]"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                                    <Brain className="h-5 w-5" />
                                </div>
	                                <div className="mt-8 text-[10px] font-black uppercase tracking-[0.24em] text-white/70">Product Side</div>
	                                <div className="mt-2 text-3xl font-black uppercase leading-none tracking-tight">Signals, scope, validation.</div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                <section id="journey" className="relative scroll-mt-28 overflow-hidden bg-white px-6 py-24">
                    <div
                        className="absolute inset-0 pointer-events-none opacity-[0.035]"
                        style={{
                            backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
                            backgroundSize: '48px 48px',
                            backgroundPosition: 'center top'
                        }}
                    />
                    <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-18">
                        <motion.div
                            initial={{ opacity: 0, x: -24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <SectionLabel>Learning Journey</SectionLabel>
                            <h2 className="max-w-2xl text-4xl font-black uppercase leading-[0.92] tracking-tighter md:text-6xl xl:text-7xl">
                                A focused path from <span className="text-primary italic">builder</span> to product thinker.
                            </h2>
                            <div className="max-w-lg space-y-3 text-base font-medium leading-relaxed text-zinc-500 md:text-lg">
                                <p>
                                    Through the Harisenin.com UI/UX & Product Management Bootcamp, I practice the end-to-end PM workflow: research, problem framing, requirements, prototyping, and validation.
                                </p>
                                <p>
                                    The focus is to combine my builder background with stronger product judgment, balancing user needs, business context, and engineering feasibility.
                                </p>
                            </div>
                            <div className="grid max-w-lg grid-cols-3 gap-3 pt-1">
                                {[
                                    ['6', 'Learning Gates'],
                                    ['5', 'PM Artifacts'],
                                    ['1', 'Product Goal']
                                ].map(([value, label]) => (
                                    <motion.div
                                        key={label}
                                        initial={{ opacity: 0, y: 14 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className="rounded-[1.15rem] border border-zinc-100 bg-white p-3 shadow-[0_14px_40px_rgba(0,0,0,0.035)] md:p-4"
                                    >
                                        <div className="text-2xl font-black tracking-tighter text-zinc-950 md:text-3xl">{value}</div>
                                        <div className="mt-1 text-[7px] font-black uppercase tracking-[0.2em] text-zinc-400 md:text-[8px]">{label}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.7 }}
                            className="relative overflow-visible rounded-[2.3rem] border border-zinc-200 bg-white p-5 md:p-7"
                        >
                            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Bootcamp Map</div>
                                    <h3 className="mt-2 text-3xl font-black uppercase leading-none tracking-tight text-zinc-950 md:text-4xl">
                                        Product path board
                                    </h3>
                                </div>
                                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-zinc-950 px-4 py-2 text-[9px] font-black uppercase tracking-[0.22em] text-white">
                                    <span className="h-2 w-2 rounded-full bg-primary" />
                                    Goal: Product Thinker
                                </div>
                            </div>

                            <div className="relative overflow-visible rounded-[2rem] border border-zinc-100 bg-zinc-50 p-4 md:p-6">
                                <div className="mx-auto max-w-[820px]">
                                    <div className="relative aspect-square overflow-visible rounded-[1.8rem] border border-zinc-200 bg-white p-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7)]">
                                        <div className="absolute inset-2 overflow-visible rounded-[1.35rem]">
                                            <svg
                                                className={cn(
                                                    "pointer-events-none absolute inset-0 z-30 h-full w-full transition-opacity duration-200",
                                                    hoveredMilestone ? "opacity-20" : "opacity-100"
                                                )}
                                                viewBox="0 0 100 100"
                                                preserveAspectRatio="none"
                                            >
                                                <motion.path
                                                    d="M18 82 C30 66 22 50 38 37 C47 30 58 31 65 17"
                                                    fill="none"
                                                    stroke="rgb(9,9,11)"
                                                    strokeWidth="1.7"
                                                    strokeLinecap="round"
                                                    initial={{ pathLength: 0 }}
                                                    whileInView={{ pathLength: 1 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 1.2, delay: 0.4 }}
                                                />
                                                <motion.path
                                                    d="M50 79 C60 65 74 66 80 50 C86 35 78 28 91 16"
                                                    fill="none"
                                                    stroke="rgb(0,80,255)"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                    strokeDasharray="3 3"
                                                    initial={{ pathLength: 0 }}
                                                    whileInView={{ pathLength: 1 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 1.2, delay: 0.7 }}
                                                />
                                                <motion.g
                                                    initial={{ opacity: 0, y: 8 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: 0.55 }}
                                                >
                                                    <path d="M13 87 L34 64" stroke="rgb(9,9,11)" strokeWidth="1.6" strokeLinecap="round" />
                                                    <path d="M19 90 L40 67" stroke="rgb(9,9,11)" strokeWidth="1.6" strokeLinecap="round" />
                                                    <path d="M18 82 L25 89 M23 77 L30 84 M28 72 L35 79" stroke="rgb(9,9,11)" strokeWidth="1.2" strokeLinecap="round" />
                                                </motion.g>
                                                <motion.g
                                                    initial={{ opacity: 0, y: 8 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: 0.8 }}
                                                >
                                                    <path d="M72 63 L88 38" stroke="rgb(0,80,255)" strokeWidth="1.8" strokeLinecap="round" />
                                                    <path d="M78 66 L94 41" stroke="rgb(0,80,255)" strokeWidth="1.8" strokeLinecap="round" />
                                                    <path d="M76 57 L84 62 M80 51 L88 56 M84 45 L92 50" stroke="rgb(0,80,255)" strokeWidth="1.2" strokeLinecap="round" />
                                                </motion.g>
                                            </svg>

                                            <motion.div
                                                className="pointer-events-none absolute z-40 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-[5px] border-white bg-primary shadow-[0_14px_34px_rgba(0,80,255,0.3)]"
                                                initial={{ left: tokenPath[0].left, top: tokenPath[0].top, opacity: 0, scale: 0.8 }}
                                                animate={{
                                                    left: tokenPath.map((point) => point.left),
                                                    top: tokenPath.map((point) => point.top),
                                                    opacity: 1,
                                                    scale: 1
                                                }}
                                                transition={{ duration: 12, ease: "linear", repeat: Infinity, repeatDelay: 1 }}
                                                style={{ transform: 'translate(-50%, -50%)' }}
                                            >
                                                <img
                                                    src="https://api.dicebear.com/7.x/notionists/svg?seed=Dewa"
                                                    alt="Dewa avatar"
                                                    className="h-full w-full object-cover"
                                                />
                                            </motion.div>

                                            <motion.div
                                                className="pointer-events-none absolute z-50 h-20 w-20 rounded-full border border-primary/30 bg-primary/10"
                                                style={{
                                                    left: tokenPath[35].left,
                                                    top: tokenPath[35].top,
                                                    transform: 'translate(-50%, -50%)'
                                                }}
                                                animate={{
                                                    opacity: [0, 0, 0.85, 0],
                                                    scale: [0.45, 0.45, 1.5, 1.9]
                                                }}
                                                transition={{
                                                    duration: 13,
                                                    ease: "easeOut",
                                                    repeat: Infinity,
                                                    times: [0, 0.88, 0.93, 1]
                                                }}
                                            />

                                            <div
                                                className="pointer-events-none absolute z-[60]"
                                                style={{
                                                    left: tokenPath[35].left,
                                                    top: tokenPath[35].top,
                                                    transform: 'translate(-50%, -50%)'
                                                }}
                                            >
                                                {celebrateParticles.map((particle, index) => (
                                                    <motion.span
                                                        key={`${particle.x}-${particle.y}`}
                                                        className={cn("absolute h-2 w-1.5 rounded-sm", particle.color)}
                                                        animate={{
                                                            opacity: [0, 0, 1, 0],
                                                            x: [0, 0, particle.x],
                                                            y: [0, 0, particle.y],
                                                            rotate: [0, 0, particle.rotate],
                                                            scale: [0.4, 0.4, 1, 0.7]
                                                        }}
                                                        transition={{
                                                            duration: 13,
                                                            ease: "easeOut",
                                                            repeat: Infinity,
                                                            times: [0, 0.88, 0.92, 1],
                                                            delay: index * 0.015
                                                        }}
                                                    />
                                                ))}
                                            </div>

                                            <div className="relative z-20 grid h-full w-full grid-cols-6 grid-rows-6 gap-1">
                                                {boardCells.map((square, index) => {
                                                    const milestone = milestoneBySquare.get(square);
                                                    const Icon = milestone?.icon;
                                                    const rowTone = Math.floor(index / 6) % 2 === 0;

                                                    return (
                                                        <motion.div
                                                            key={square}
                                                            onMouseEnter={() => milestone && setHoveredMilestone(milestone)}
                                                            onMouseLeave={() => milestone && setHoveredMilestone(null)}
                                                            initial={{ opacity: 0, scale: 0.92 }}
                                                            whileInView={{ opacity: 1, scale: 1 }}
                                                            viewport={{ once: true }}
                                                            transition={{ delay: index * 0.012 }}
                                                            className={cn(
                                                                "group relative overflow-visible rounded-xl border p-2 hover:z-[80]",
                                                                milestone?.isGoal
                                                                    ? "border-primary bg-primary text-white"
                                                                    : milestone
                                                                        ? "border-zinc-950 bg-zinc-950 text-white"
                                                                        : rowTone
                                                                            ? "border-zinc-100 bg-white text-zinc-400"
                                                                            : "border-zinc-100 bg-zinc-100 text-zinc-400"
                                                            )}
                                                        >
                                                            {milestone?.isGoal && (
                                                                <motion.div
                                                                    className="pointer-events-none absolute inset-0 rounded-xl bg-white/30"
                                                                    animate={{ opacity: [0, 0, 0.45, 0], scale: [1, 1, 1.08, 1] }}
                                                                    transition={{ duration: 13, repeat: Infinity, times: [0, 0.88, 0.93, 1] }}
                                                                />
                                                            )}
                                                            <div className={cn(
                                                                "text-[10px] font-black leading-none",
                                                                milestone ? "text-current" : "text-zinc-400"
                                                            )}>
                                                                {square}
                                                            </div>
                                                            {milestone && Icon && (
                                                                <>
                                                                    <div className="absolute inset-x-1 bottom-1">
                                                                        <div className="mb-1 flex h-7 w-7 items-center justify-center rounded-lg bg-white/15">
                                                                            <Icon className="h-3.5 w-3.5" />
                                                                        </div>
                                                                        <div className="line-clamp-2 text-[7px] font-black uppercase leading-tight tracking-[0.08em] md:text-[8px]">
                                                                            {milestone.title}
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                            {hoveredMilestone && (() => {
                                                const Icon = hoveredMilestone.icon;
                                                const point = tokenPath[hoveredMilestone.square - 1];
                                                const shouldOpenDown = hoveredMilestone.square > 24;

                                                return (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: shouldOpenDown ? -8 : 8, scale: 0.96 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        className="pointer-events-none absolute z-[120] w-72 rounded-2xl border border-zinc-200 bg-white p-4 text-left text-zinc-950 shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
                                                        style={{
                                                            left: point.left,
                                                            top: point.top,
                                                            transform: `translateX(-50%) ${shouldOpenDown ? 'translateY(2.25rem)' : 'translateY(calc(-100% - 1rem))'}`
                                                        }}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className={cn(
                                                                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white",
                                                                hoveredMilestone.isGoal ? "bg-primary" : "bg-zinc-950"
                                                            )}>
                                                                <Icon className="h-4 w-4" />
                                                            </div>
                                                            <div>
                                                                <div className="text-[8px] font-black uppercase tracking-[0.22em] text-primary">#{hoveredMilestone.square} {hoveredMilestone.badge}</div>
                                                                <div className="mt-1 text-sm font-black uppercase leading-tight">{hoveredMilestone.title}</div>
                                                                <p className="mt-2 text-xs font-semibold leading-relaxed text-zinc-500">{hoveredMilestone.desc}</p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
                <section className="relative overflow-hidden bg-[#08090d] px-6 py-24 text-white">
                    <div className="absolute left-0 top-0 h-full w-1 bg-primary" />
                    <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
                    <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
                    <div className="absolute inset-x-0 top-32 h-px bg-white/[0.06]" />
                    <div className="absolute inset-x-0 bottom-32 h-px bg-white/[0.06]" />
                    <div className="relative mx-auto max-w-7xl space-y-16">
                        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                            <div className="space-y-5">
                                <SectionLabel>Research First</SectionLabel>
                                <h2 className="max-w-4xl text-5xl font-black uppercase leading-[0.9] tracking-tighter md:text-7xl">
                                    Evidence before product decisions.
                                </h2>
                            </div>
                            <div className="space-y-7">
                                <p className="max-w-xl text-base font-medium leading-relaxed text-zinc-400 md:text-lg">
                                    I use research to reduce guesswork: define the user signal, shape the insight, then decide scope, priority, and validation.
                                </p>
                                <div className="space-y-3 border-l border-white/10 pl-5">
                                    {[
                                        ['01', 'Capture signal', 'Feedback, interview, observation'],
                                        ['02', 'Shape insight', 'Pattern, pain point, opportunity'],
                                        ['03', 'Make decision', 'Scope, priority, validation']
                                    ].map(([number, title, detail], index) => (
                                        <motion.div
                                            key={title}
                                            initial={{ opacity: 0, x: 14 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.08 }}
                                            className="group relative flex items-center gap-4"
                                        >
                                            <span className="absolute -left-[1.72rem] h-2.5 w-2.5 rounded-full border border-primary bg-zinc-950 transition-transform group-hover:scale-125" />
                                            <div className="text-[9px] font-black uppercase tracking-[0.24em] text-primary">{number}</div>
                                            <div className="h-px w-8 bg-white/15 transition-colors group-hover:bg-primary" />
                                            <div>
                                                <div className="text-sm font-black uppercase tracking-tight text-white md:text-base">{title}</div>
                                                <div className="mt-0.5 text-xs font-semibold text-zinc-500">{detail}</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {researchMethods.map(({ label, purpose, question, decision, evidence, icon: Icon }, index) => (
                                <motion.div
                                    key={label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.035 }}
                                    className="group relative min-h-[250px] overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#121317] p-5 transition-all duration-300 hover:border-primary/50 hover:bg-[#17191f]"
                                >
                                    <div className="absolute right-4 top-4 text-[10px] font-black uppercase tracking-[0.24em] text-white/20">
                                        {String(index + 1).padStart(2, '0')}
                                    </div>
                                    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-tight">{label}</h3>
                                    <p className="mt-3 text-sm font-semibold leading-relaxed text-zinc-400">{purpose}</p>
                                    <div className="mt-5 space-y-2 border-t border-white/10 pt-4">
                                        <div>
                                            <div className="text-[8px] font-black uppercase tracking-[0.22em] text-primary">Key Question</div>
                                            <div className="mt-1 text-xs font-bold leading-relaxed text-white/80">{question}</div>
                                        </div>
                                        <div className="grid grid-cols-[0.9fr_1.1fr] gap-2 pt-1">
                                            <div className="rounded-xl bg-zinc-950/70 p-3">
                                                <div className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500">Decision</div>
                                                <div className="mt-1 text-[11px] font-bold leading-relaxed text-white/75">{decision}</div>
                                            </div>
                                            <div className="rounded-xl bg-zinc-950/70 p-3">
                                                <div className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500">Evidence</div>
                                                <div className="mt-1 text-[11px] font-bold leading-relaxed text-white/75">{evidence}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="cases" className="bg-white px-6 py-24">
                    <div className="mx-auto max-w-7xl space-y-12">
                        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                            <div className="space-y-5">
                                <SectionLabel>Selected Work</SectionLabel>
                                <h2 className="max-w-4xl text-5xl font-black uppercase leading-[0.9] tracking-tighter md:text-7xl">
                                    Applied product case studies.
                                </h2>
                            </div>
                            <p className="max-w-md text-base font-medium leading-relaxed text-zinc-500">
                                Product work framed around context, problem, research signal, decision path, deliverables, and learning.
                            </p>
                        </div>

                        {casesLoading ? (
                            <ProductCaseLoadingGrid />
                        ) : caseStudies.length === 0 ? (
                            <div className="rounded-[1.75rem] border border-dashed border-zinc-200 bg-zinc-50 p-10 text-center">
                                <div className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">No Published Cases</div>
                                <p className="mt-3 text-sm font-bold text-zinc-500">Product case studies will appear here after they are published.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {caseStudies.map((study, index) => (
                                <motion.article
                                    key={study.title}
                                    initial={{ opacity: 0, y: 18 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group flex min-h-[340px] flex-col justify-between rounded-[1.75rem] border border-zinc-200 bg-white p-5 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_22px_70px_rgba(0,0,0,0.08)]"
                                >
                                    <div>
                                        <div className="mb-5 flex items-center justify-between gap-3">
                                            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-primary">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <Badge className={cn('rounded-full border px-3 py-1 text-[8px] font-black uppercase tracking-widest', evidenceStyles[study.mode])}>
                                                {study.mode}
                                            </Badge>
                                        </div>
                                        {study.thumbnail ? (
                                            <div className="mb-5 relative aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-zinc-950 border border-zinc-200/60 shadow-sm">
                                                <img
                                                    src={getAssetUrl(study.thumbnail)}
                                                    alt={study.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent" />
                                                <div className="absolute bottom-3 left-3 text-[9px] font-black uppercase tracking-[0.24em] text-white/90">
                                                    {study.category}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mb-5 rounded-[1.25rem] bg-zinc-950 p-5 text-white">
                                                <div className="text-[9px] font-black uppercase tracking-[0.24em] text-white/35">{study.category}</div>
                                                <div className="mt-8 text-3xl font-black uppercase leading-none tracking-tighter text-white/20">
                                                    {study.visual}
                                                </div>
                                            </div>
                                        )}
                                        <h3 className="text-2xl font-black uppercase leading-tight tracking-tight">{study.title}</h3>
                                        <p className="mt-3 line-clamp-3 text-sm font-medium leading-relaxed text-zinc-500">{study.summary}</p>
                                    </div>

                                    <div className="mt-6 space-y-4">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="rounded-2xl bg-zinc-50 p-3">
                                                <div className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Type</div>
                                                <div className="mt-1 text-xs font-black text-zinc-800">{study.timeline}</div>
                                            </div>
                                            <div className="rounded-2xl bg-zinc-50 p-3">
                                                <div className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Artifacts</div>
                                                <div className="mt-1 text-xs font-black text-zinc-800">{study.deliverables.length} items</div>
                                            </div>
                                        </div>
                                        <Link
                                            to={`${productCaseBase}/${study.slug}`}
                                            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-primary"
                                        >
                                            View Case Study
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </div>
                                </motion.article>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <section id="documents" className="bg-zinc-50 px-6 py-24">
                    <div className="mx-auto max-w-7xl space-y-12">
                        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                            <div className="space-y-5">
                                <SectionLabel>Bootcamp Missions</SectionLabel>
                                <h2 className="max-w-3xl text-5xl font-black uppercase leading-[0.9] tracking-tighter md:text-7xl">
                                    Structured PM deliverables.
                                </h2>
                            </div>
                            <p className="max-w-md text-base font-medium leading-relaxed text-zinc-500">
                                Harisenin.com missions covering research, problem framing, PRD, user flow, prototype direction, usability testing, and validation notes. PDFs will be available for review and download.
                            </p>
                        </div>

                        {documentsLoading ? (
                            <div className="grid gap-3" aria-label="Loading product documents">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -18 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.04 }}
                                        className="relative grid overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-white p-4 md:grid-cols-[auto_1fr_auto] md:items-center"
                                    >
                                        <motion.div
                                            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/85 to-transparent"
                                            initial={{ x: '-140%' }}
                                            animate={{ x: '340%' }}
                                            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut', delay: index * 0.08 }}
                                        />
                                        <div className="relative flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-primary/10" />
                                            <div className="h-3 w-8 rounded-full bg-zinc-100" />
                                        </div>
                                        <div className="relative mt-4 space-y-3 md:mt-0">
                                            <div className="h-5 w-2/3 rounded-full bg-zinc-100" />
                                            <div className="h-3 w-full rounded-full bg-zinc-100" />
                                            <div className="h-3 w-4/5 rounded-full bg-zinc-100" />
                                        </div>
                                        <div className="relative mt-4 h-4 w-20 rounded-full bg-zinc-100 md:mt-0" />
                                    </motion.div>
                                ))}
                            </div>
                        ) : documents.length === 0 ? (
                            <div className="rounded-[1.75rem] border border-dashed border-zinc-200 bg-white p-10 text-center">
                                <div className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">No Published Documents</div>
                                <p className="mt-3 text-sm font-bold text-zinc-500">Product documents will appear here after they are published.</p>
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {documents.map((document, index) => {
                                    const filePath = document.file_path;

                                    return (
                                    <motion.div
                                        key={document.title}
                                        initial={{ opacity: 0, x: -18 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.04 }}
                                        className="group grid gap-4 rounded-[1.5rem] border border-zinc-200 bg-white p-4 transition-all hover:border-primary/30 hover:shadow-[0_18px_55px_rgba(0,0,0,0.055)] md:grid-cols-[auto_1fr_auto] md:items-center"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-300">
                                                {String(index + 1).padStart(2, '0')}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-xl font-black uppercase leading-tight tracking-tight">{document.title}</h3>
                                                <Badge className="rounded-full bg-zinc-100 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:bg-zinc-100">
                                                    {document.type}
                                                </Badge>
                                            </div>
                                            <p className="mt-2 max-w-3xl text-sm font-medium leading-relaxed text-zinc-500">{document.description}</p>
                                        </div>
                                        {filePath ? (
                                            <a
                                                href={getAssetUrl(filePath)}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400 transition-colors hover:text-primary"
                                            >
                                                View PDF
                                            </a>
                                        ) : (
                                            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-300">
                                                Coming Soon
                                            </div>
                                        )}
                                    </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <footer id="contact" className="bg-zinc-950 px-6 py-40 text-white selection:bg-primary/50">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-16 lg:grid-cols-[1.25fr_1fr] lg:items-center xl:gap-24">
                        <div className="space-y-12">
                            <h2 className="text-6xl font-black uppercase leading-[0.85] tracking-tighter md:text-7xl lg:text-[5.5rem] xl:text-[7rem]">
                                Let&apos;s shape <br />
                                <span className="text-primary italic">better <br />products.</span>
                            </h2>
                            <div className="space-y-8">
                                <p className="max-w-md text-lg font-medium italic text-zinc-400">
                                    Open to product, UI/UX, and delivery conversations that need clear thinking, practical execution, and user-centered decisions.
                                </p>
                                <a href="mailto:anggadewa2016@gmail.com" className="inline-block border-b-4 border-primary pb-2 text-2xl font-black tracking-tight transition-all hover:text-primary md:text-4xl">
                                    anggadewa2016@gmail.com
                                </a>
                            </div>
                        </div>

                        <div className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-zinc-900 p-8 sm:rounded-[4rem] sm:p-16">
                            <div className="absolute right-0 top-0 h-64 w-64 bg-primary/10 blur-[100px] transition-all group-hover:bg-primary/20" />

                            <div className="relative space-y-12">
                                <div className="space-y-4">
                                    <span className="block text-[11px] font-black uppercase italic tracking-[0.4em] text-primary">Based in</span>
                                    <h3 className="text-4xl font-black uppercase tracking-tighter text-white">Jakarta, Indonesia</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-12">
                                    <div className="space-y-3">
                                        <span className="block text-[11px] font-black uppercase tracking-widest text-zinc-500">Local Time</span>
                                        <p className="text-xl font-black italic tracking-wider text-white">
                                            {currentTime.toTimeString().split(' ')[0]}
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <span className="block text-[11px] font-black uppercase tracking-widest text-zinc-500">Current Status</span>
                                        <p className="text-xl font-black italic text-white">Available for Work</p>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => { window.location.href = 'mailto:anggadewa2016@gmail.com'; }}
                                    className="h-16 w-full rounded-2xl text-xs font-black uppercase tracking-[0.1em] shadow-2xl shadow-primary/40 transition-all hover:scale-[1.02] active:scale-95 sm:h-20 sm:rounded-[2rem] sm:text-sm sm:tracking-[0.2em]"
                                >
                                    Start a Conversation
                                </Button>

                                <div className="flex gap-4 pt-4">
                                    <a href="https://github.com/anggadewa" target="_blank" rel="noreferrer" className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800 transition-all hover:bg-white hover:text-black">
                                        <GitHubIcon className="h-6 w-6 transition-transform hover:scale-110" />
                                    </a>
                                    <a href="https://linkedin.com/in/anggadewantorokekasih" target="_blank" rel="noreferrer" className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800 transition-all hover:bg-[#0077b5] hover:text-white">
                                        <LinkedInIcon className="h-6 w-6 transition-transform hover:scale-110" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-40 flex flex-col items-center justify-between gap-12 border-t border-white/10 pt-16 md:flex-row">
                        <div className="text-[11px] font-black uppercase tracking-widest text-zinc-600">
                            © {new Date().getFullYear()} DEWA.PRODUCT — Product thinking, research, and delivery
                        </div>
                        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-[11px] font-black uppercase tracking-widest text-zinc-600 transition-colors hover:text-primary">
                            Back to Top
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
