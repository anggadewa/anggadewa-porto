import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link, useLocation } from 'react-router-dom';
import cvPdf from '@/assets/CV_IT_Angga_Dewantoro_2026.pdf';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Activity,
    Layers,
    ArrowRight,
    Cpu,
    Database,
    Palette,
    Boxes,
    Binary,
    Globe,
    Search,
    Smartphone,
    Map,
    Zap,
    Workflow,
    CodeXml,
    Briefcase,
    MessageCircle,
    Mail,
    User,
    FileText,
    Sparkles,
    GraduationCap,
    Download,
    Compass,
    ChevronDown
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getAssetUrl } from '@/lib/assets';
import { stripHtml, cn } from '@/lib/utils';
import { CertificateRecord, Project, ResumeVersion, Skill } from '@/types';
import { Tooltip } from '@/components/ui/tooltip-custom';
import { ThemeToggle } from '@/components/theme-toggle';
import MiniGame from '@/components/MiniGame';
import CertificateShowcase from '@/components/CertificateShowcase';

// Custom SVG Icons for maximum reliability
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

const getCategoryColors = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('mobile')) return {
        gradient: "from-orange-500/10 to-red-500/10",
        glow: "rgba(249, 115, 22, 0.15)",
        borderGlow: "rgba(249, 115, 22, 0.35)",
        text: "text-orange-600 group-hover:text-orange-500",
        bg: "bg-orange-500/5",
        iconBg: "bg-orange-100/60",
        tagHover: "hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:shadow-[0_8px_20px_rgba(249,115,22,0.3)]",
        border: "hover:border-orange-500/30",
        badge: "bg-orange-50/50 text-orange-600 border-orange-200/60 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500",
        bar: "from-orange-500 to-red-500"
    };
    if (cat.includes('frontend')) return {
        gradient: "from-cyan-500/10 to-blue-500/10",
        glow: "rgba(6, 182, 212, 0.15)",
        borderGlow: "rgba(6, 182, 212, 0.35)",
        text: "text-cyan-600 group-hover:text-cyan-500",
        bg: "bg-cyan-500/5",
        iconBg: "bg-cyan-100/60",
        tagHover: "hover:bg-cyan-500 hover:text-white hover:border-cyan-500 hover:shadow-[0_8px_20px_rgba(6,182,212,0.3)]",
        border: "hover:border-cyan-500/30",
        badge: "bg-cyan-50/50 text-cyan-600 border-cyan-200/60 group-hover:bg-cyan-500 group-hover:text-white group-hover:border-cyan-500",
        bar: "from-cyan-500 to-blue-500"
    };
    if (cat.includes('backend')) return {
        gradient: "from-indigo-500/10 to-purple-500/10",
        glow: "rgba(99, 102, 241, 0.15)",
        borderGlow: "rgba(99, 102, 241, 0.35)",
        text: "text-indigo-600 group-hover:text-indigo-500",
        bg: "bg-indigo-500/5",
        iconBg: "bg-indigo-100/60",
        tagHover: "hover:bg-indigo-500 hover:text-white hover:border-indigo-500 hover:shadow-[0_8px_20px_rgba(99,102,241,0.3)]",
        border: "hover:border-indigo-500/30",
        badge: "bg-indigo-50/50 text-indigo-600 border-indigo-200/60 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-500",
        bar: "from-indigo-500 to-purple-500"
    };
    if (cat.includes('ai')) return {
        gradient: "from-fuchsia-500/15 to-violet-500/15",
        glow: "rgba(217, 70, 239, 0.22)",
        borderGlow: "rgba(217, 70, 239, 0.45)",
        text: "text-fuchsia-600 group-hover:text-fuchsia-500",
        bg: "bg-fuchsia-500/5",
        iconBg: "bg-fuchsia-100/60",
        tagHover: "hover:bg-fuchsia-500 hover:text-white hover:border-fuchsia-500 hover:shadow-[0_8px_20px_rgba(217,70,239,0.35)]",
        border: "hover:border-fuchsia-500/30",
        badge: "bg-fuchsia-50/55 text-fuchsia-600 border-fuchsia-200/60 group-hover:bg-fuchsia-500 group-hover:text-white group-hover:border-fuchsia-500",
        bar: "from-fuchsia-500 to-violet-500"
    };
    if (cat.includes('design') || cat.includes('prototype')) return {
        gradient: "from-rose-500/10 to-pink-500/10",
        glow: "rgba(244, 63, 94, 0.15)",
        borderGlow: "rgba(244, 63, 94, 0.35)",
        text: "text-rose-600 group-hover:text-rose-500",
        bg: "bg-rose-500/5",
        iconBg: "bg-rose-100/60",
        tagHover: "hover:bg-rose-500 hover:text-white hover:border-rose-500 hover:shadow-[0_8px_20px_rgba(244,63,94,0.3)]",
        border: "hover:border-rose-500/30",
        badge: "bg-rose-50/50 text-rose-600 border-rose-200/60 group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500",
        bar: "from-rose-500 to-pink-500"
    };
    if (cat.includes('database')) return {
        gradient: "from-emerald-500/10 to-teal-500/10",
        glow: "rgba(16, 185, 129, 0.15)",
        borderGlow: "rgba(16, 185, 129, 0.35)",
        text: "text-emerald-600 group-hover:text-emerald-500",
        bg: "bg-emerald-500/5",
        iconBg: "bg-emerald-100/60",
        tagHover: "hover:bg-emerald-500 hover:text-white hover:border-emerald-500 hover:shadow-[0_8px_20px_rgba(16,185,129,0.3)]",
        border: "hover:border-emerald-500/30",
        badge: "bg-emerald-50/50 text-emerald-600 border-emerald-200/60 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500",
        bar: "from-emerald-500 to-teal-500"
    };
    if (cat.includes('tool') || cat.includes('method')) return {
        gradient: "from-blue-500/10 to-sky-500/10",
        glow: "rgba(59, 130, 246, 0.15)",
        borderGlow: "rgba(59, 130, 246, 0.35)",
        text: "text-blue-600 group-hover:text-blue-500",
        bg: "bg-blue-500/5",
        iconBg: "bg-blue-100/60",
        tagHover: "hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:shadow-[0_8px_20px_rgba(59,130,246,0.3)]",
        border: "hover:border-blue-500/30",
        badge: "bg-blue-50/50 text-blue-600 border-blue-200/60 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500",
        bar: "from-blue-500 to-sky-500"
    };
    if (cat.includes('architecture')) return {
        gradient: "from-violet-500/10 to-purple-500/10",
        glow: "rgba(139, 92, 246, 0.15)",
        borderGlow: "rgba(139, 92, 246, 0.35)",
        text: "text-violet-600 group-hover:text-violet-500",
        bg: "bg-violet-500/5",
        iconBg: "bg-violet-100/60",
        tagHover: "hover:bg-violet-500 hover:text-white hover:border-violet-500 hover:shadow-[0_8px_20px_rgba(139, 92, 246, 0.3)]",
        border: "hover:border-violet-500/30",
        badge: "bg-violet-50/50 text-violet-600 border-violet-200/60 group-hover:bg-violet-500 group-hover:text-white group-hover:border-violet-500",
        bar: "from-violet-500 to-purple-500"
    };
    if (cat.includes('map') || cat.includes('ocr')) return {
        gradient: "from-teal-500/10 to-green-500/10",
        glow: "rgba(20, 184, 166, 0.15)",
        borderGlow: "rgba(20, 184, 166, 0.35)",
        text: "text-teal-600 group-hover:text-teal-500",
        bg: "bg-teal-500/5",
        iconBg: "bg-teal-100/60",
        tagHover: "hover:bg-teal-500 hover:text-white hover:border-teal-500 hover:shadow-[0_8px_20px_rgba(20, 184, 166, 0.3)]",
        border: "hover:border-teal-500/30",
        badge: "bg-teal-50/50 text-teal-600 border-teal-200/60 group-hover:bg-teal-500 group-hover:text-white group-hover:border-teal-500",
        bar: "from-teal-500 to-green-500"
    };
    return {
        gradient: "from-zinc-500/10 to-neutral-500/10",
        glow: "rgba(115, 115, 115, 0.15)",
        borderGlow: "rgba(115, 115, 115, 0.35)",
        text: "text-zinc-600 group-hover:text-zinc-500",
        bg: "bg-zinc-500/5",
        iconBg: "bg-zinc-100/60",
        tagHover: "hover:bg-zinc-500 hover:text-white hover:border-zinc-500 hover:shadow-[0_8px_20px_rgba(115,115,115,0.3)]",
        border: "hover:border-zinc-500/30",
        badge: "bg-zinc-50/50 text-zinc-600 border-zinc-200/60 group-hover:bg-zinc-500 group-hover:text-white group-hover:border-zinc-500",
        bar: "from-zinc-500 to-neutral-500"
    };
};

const getCategoryMetadata = (category: string, index: number) => {
    const cat = category.toLowerCase();
    const formattedNum = String(index + 1).padStart(2, '0');
    let desc = "Developing custom modular solutions with strict engineering principles.";
    let label = "EXPERT";

    if (cat.includes('mobile')) {
        desc = "Building high-performance cross-platform mobile applications using Flutter, Dart, and React Native.";
        label = "ADVANCED";
    } else if (cat.includes('frontend')) {
        desc = "Developing highly interactive and responsive modern web user interfaces using React, TypeScript, and Laravel.";
        label = "EXPERT";
    } else if (cat.includes('backend')) {
        desc = "Designing robust, highly reliable, and high-performance server architectures using Laravel and Golang.";
        label = "CORE STACK";
    } else if (cat.includes('ai')) {
        desc = "Leveraging Large Language Models (LLMs) and agentic AI to accelerate development and intelligent prototyping.";
        label = "INNOVATOR";
    } else if (cat.includes('design') || cat.includes('prototype')) {
        desc = "Crafting beautiful UI/UX, wireframes, prototypes, and consistent design systems using Figma and Canva.";
        label = "CREATIVE";
    } else if (cat.includes('database')) {
        desc = "Optimizing secure relational and NoSQL data storage engines using PostgreSQL, MySQL, Supabase, and Firebase.";
        label = "OPTIMIZED";
    } else if (cat.includes('tool') || cat.includes('method')) {
        desc = "Optimizing version control (Git), Flutter Version Manager (FVM), and designing technical project architecture.";
        label = "EFFICIENT";
    } else if (cat.includes('architecture')) {
        desc = "Implementing Clean Architecture, efficient state management, and offline-first local network integration.";
        label = "CLEAN CODE";
    } else if (cat.includes('map') || cat.includes('ocr')) {
        desc = "Integrating interactive OpenStreetMap/Leaflet maps and client-side optical character recognition with Tesseract.js.";
        label = "INTEGRATOR";
    }

    return { desc, label, num: formattedNum };
};

export default function Home() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [activeResume, setActiveResume] = useState<ResumeVersion | null>(null);
    const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [projectSearch, setProjectSearch] = useState('');
    const [skillSearch, setSkillSearch] = useState('');
    const [activeSkillIndex, setActiveSkillIndex] = useState(0);
    const [activeProjectIndex, setActiveProjectIndex] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Dynamic tilt factors for buttery 3D parallax feel
        const tiltX = ((y / rect.height) - 0.5) * -12;
        const tiltY = ((x / rect.width) - 0.5) * 12;

        e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
        e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
        e.currentTarget.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.025, 1.025, 1.025)`;
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const categories = ['All', ...Array.from(new Set(projects.map(p => {
        const c = p.category?.trim().toLowerCase();
        if (c === 'flutter') return 'Flutter';
        if (c === 'react') return 'React';
        if (c === 'figma') return 'Figma';
        return p.category?.trim();
    }).filter(Boolean)))];

    const filteredSkills = skills.filter(skill =>
        skill.category.toLowerCase().includes(skillSearch.toLowerCase()) ||
        skill.items?.some(item => item.toLowerCase().includes(skillSearch.toLowerCase()))
    );

    useEffect(() => {
        setActiveSkillIndex(0);
    }, [skillSearch]);

    useEffect(() => {
        setActiveProjectIndex(0);
    }, [activeCategory]);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data: projectsData } = await supabase
                    .from('projects')
                    .select('*')
                    .order('created_at', { ascending: false });

                const { data: skillsData } = await supabase
                    .from('skills')
                    .select('*')
                    .order('sort_order', { ascending: true });

                // Keep the source PDF as a graceful fallback until the CV module is configured.
                const { data: resumeData, error: resumeError } = await supabase
                    .from('resume_versions')
                    .select('*')
                    .eq('is_active', true)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                const { data: certificateData, error: certificateError } = await supabase
                    .from('certificates')
                    .select('*')
                    .eq('audience', 'developer')
                    .eq('is_published', true)
                    .order('sort_order', { ascending: true })
                    .order('created_at', { ascending: false });

                if (resumeError && resumeError.code !== '42P01') {
                    console.error('Error loading active resume:', resumeError);
                }
                if (certificateError && certificateError.code !== '42P01') console.error('Error loading certificates:', certificateError);

                setProjects(projectsData || []);
                setSkills(skillsData || []);
                setActiveResume((resumeData as ResumeVersion | null) || null);
                setCertificates((certificateData || []) as CertificateRecord[]);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const { hash } = useLocation();

    useEffect(() => {
        if (hash === '#work' && !loading) {
            // Wait for data to load and DOM to expand before scrolling
            setTimeout(() => {
                const element = document.getElementById('work');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 300);
        }
    }, [hash, loading]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="relative min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-primary/30 selection:text-primary">
            {/* Background Vibe */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[150px] rounded-full animate-pulse" />
                <div
                    className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}
                />
            </div>

            <div className="w-full">
                {/* Global Interactive Elements */}
                <div className="fixed left-6 top-1/2 -translate-y-1/2 z-[100] hidden xl:flex flex-col gap-6">
                    {[
                        { icon: GitHubIcon, href: "https://github.com/anggadewa", color: "hover:bg-[#24292e] hover:shadow-[0_0_20px_rgba(36,41,46,0.5)]" },
                        { icon: LinkedInIcon, href: "https://linkedin.com/in/anggadewantorokekasih", color: "hover:bg-[#0077b5] hover:shadow-[0_0_20px_rgba(0,119,181,0.5)]" },
                        { icon: Mail, href: "mailto:anggadewa2016@gmail.com", color: "hover:bg-primary hover:shadow-[0_0_20px_rgba(var(--primary),0.5)]" }
                    ].map((social, i) => (
                        <motion.a
                            key={i}
                            href={social.href}
                            target="_blank"
                            rel="noreferrer"
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className={cn(
                                "w-16 h-16 flex items-center justify-center glass-card rounded-[1.5rem] text-foreground/60 hover:text-white transition-all duration-500 group shadow-2xl border-white/20",
                                social.color
                            )}
                        >
                            <social.icon className="w-6 h-6 group-hover:scale-125 transition-transform duration-500" />
                        </motion.a>
                    ))}
                </div>

                <div className="relative">
                    {/* Navigation Header - Modern Pill */}
                    <header className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-4xl px-6">
                        <nav className={cn(
                            "py-3 px-8 rounded-full flex justify-between items-center transition-all duration-500",
                            isScrolled
                                ? "bg-white/90 backdrop-blur-xl border border-zinc-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
                                : "bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                        )}>
                            <div
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className={cn(
                                    "text-sm font-black tracking-tighter cursor-pointer select-none group transition-colors",
                                    isScrolled ? "text-zinc-950" : "text-white"
                                )}
                            >
                                DEWA<span className={cn(
                                    "italic opacity-60 group-hover:opacity-100 transition-opacity",
                                    isScrolled ? "text-zinc-950" : "text-white"
                                )}>.DEV</span>
                            </div>

                            <div className="hidden md:flex items-center gap-8">
                                {['About', 'Stack', 'Work', 'Contact'].map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
                                        className={cn(
                                            "text-[11px] font-black tracking-widest uppercase transition-all relative group",
                                            isScrolled ? "text-zinc-500 hover:text-zinc-950" : "text-white/70 hover:text-white"
                                        )}
                                    >
                                        {item}
                                        <span className={cn(
                                            "absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full",
                                            isScrolled ? "bg-zinc-950" : "bg-white"
                                        )} />
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-4">
                                <a
                                    href="https://product.anggadewa.my.id" target="_blank" rel="noopener noreferrer"
                                    className={cn(
                                        "hidden sm:flex h-11 items-center gap-2 px-5 rounded-full text-[10px] font-black tracking-[0.18em] uppercase transition-all hover:scale-105 active:scale-95 border",
                                        isScrolled
                                            ? "bg-zinc-950 text-white border-zinc-950 shadow-[0_10px_30px_rgba(0,0,0,0.16)]"
                                            : "bg-white/10 text-white border-white/25 hover:bg-white hover:text-primary backdrop-blur-md"
                                    )}
                                >
                                    <Compass className="w-3.5 h-3.5" />
                                    Product
                                </a>
                                <Button
                                    onClick={() => { window.location.href = 'mailto:anggadewa2016@gmail.com'; }}
                                    className={cn(
                                        "hidden sm:flex h-11 px-8 rounded-full text-[10px] font-black tracking-[0.2em] uppercase transition-all hover:scale-105 active:scale-95",
                                        isScrolled
                                            ? "bg-primary text-white hover:bg-primary/90 shadow-[0_10px_30px_rgba(0,80,255,0.2)]"
                                            : "bg-white text-primary hover:bg-white/90 shadow-[0_10px_30px_rgba(255,255,255,0.3)]"
                                    )}
                                >
                                    Hire Me
                                </Button>
                            </div>
                        </nav>
                    </header>

                    <main className="w-full relative">
                        {/* Hero: Vibrant Bento Style */}
                        <section id="home" className="relative min-h-screen w-screen left-1/2 -translate-x-1/2 flex items-center justify-center overflow-hidden bg-primary px-6 pb-28">
                            {/* Decorative background elements */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:40px_40px] opacity-20" />
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

                            <div className="max-w-7xl mx-auto w-full relative z-10 pb-14 pt-32 md:pt-36">
                                <div className="flex flex-col items-center text-center">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-12"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                        <span className="text-[10px] font-black tracking-[0.2em] text-white uppercase">Available for freelance</span>
                                    </motion.div>

                                    <div className="relative">
                                        <motion.h1
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                            className="text-[15vw] lg:text-[12vw] font-black text-white leading-[0.8] tracking-tighter uppercase select-none"
                                        >
                                            DEWA<br />
                                            <span className="text-transparent stroke-text">PORTFOLIO</span><br />
                                            DEV
                                        </motion.h1>

                                        <motion.div
                                            drag
                                            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                            whileHover={{ scale: 1.05, rotate: -3 }}
                                            initial={{ opacity: 0, y: -10, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ delay: 1.1 }}
                                            className="absolute right-[-8rem] top-[-2.75rem] z-20 hidden w-[21rem] cursor-grab items-center gap-3 rounded-[2rem] border border-white/25 bg-white/10 p-2 pr-4 shadow-[0_18px_55px_rgba(0,0,0,0.18)] backdrop-blur-xl active:cursor-grabbing lg:flex xl:right-[-11rem]"
                                        >
                                            <a
                                                href="https://product.anggadewa.my.id" target="_blank" rel="noopener noreferrer"
                                                className="group inline-flex h-12 shrink-0 items-center gap-3 rounded-[1.5rem] bg-white px-5 text-[10px] font-black uppercase tracking-[0.18em] text-primary shadow-[0_12px_30px_rgba(255,255,255,0.18)] transition-all hover:scale-[1.03] hover:bg-white/95 active:scale-95"
                                            >
                                                <Compass className="w-4 h-4 transition-transform group-hover:rotate-45" />
                                                Product
                                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                            </a>
                                            <span className="text-left text-[8px] font-black uppercase leading-relaxed tracking-[0.18em] text-white/60">
                                                Research, PRD, cases, and validation
                                            </span>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 14 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 1.1 }}
                                            className="mt-8 flex justify-center md:hidden"
                                        >
                                            <a
                                                href="https://product.anggadewa.my.id" target="_blank" rel="noopener noreferrer"
                                                className="group inline-flex h-13 items-center gap-3 rounded-full bg-white px-6 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-primary shadow-[0_18px_45px_rgba(255,255,255,0.2)] transition-all active:scale-95"
                                            >
                                                <Compass className="w-4 h-4" />
                                                Product Area
                                                <ArrowRight className="w-4 h-4" />
                                            </a>
                                        </motion.div>

                                        <motion.div
                                            drag
                                            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                            whileHover={{ scale: 1.05, rotate: 5 }}
                                            initial={{ x: 100, y: -50, opacity: 0 }}
                                            animate={{ x: 120, y: -80, opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                            className="absolute top-1/4 right-0 w-52 p-5 glass-hero rounded-[2.5rem] hidden lg:block cursor-grab active:cursor-grabbing shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center overflow-hidden border border-white/30">
                                                    <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Dewa" alt="Avatar" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <div className="text-[11px] font-black text-white uppercase tracking-widest">Dewa.dev</div>
                                                    <div className="text-[9px] font-bold text-white/60 uppercase">42+ Projects Done</div>
                                                </div>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            drag
                                            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                            whileHover={{ scale: 1.05, rotate: -5 }}
                                            initial={{ x: -100, y: 50, opacity: 0 }}
                                            animate={{ x: -180, y: 30, opacity: 1 }}
                                            transition={{ delay: 0.7 }}
                                            className="absolute bottom-[8%] left-0 w-56 p-5 glass-hero rounded-3xl hidden lg:block cursor-grab active:cursor-grabbing shadow-2xl"
                                        >
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Flutter Dev</span>
                                                    <Zap className="w-4 h-4 text-yellow-300" />
                                                </div>
                                                <div className="h-2 w-full bg-white/15 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: "95%" }}
                                                        transition={{ duration: 1.5, delay: 1 }}
                                                        className="h-full bg-white/90 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                                                    />
                                                </div>
                                                <div className="text-[8px] font-bold text-white/80 uppercase tracking-widest">Cross-Platform Expert</div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>

                            {/* Scroll Indicator - fixed so it's never obscured by hero text */}
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

                        {/* Identity Disclosure (About & Services) */}
                        <section id="about" className="py-24 bg-white">
                            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                                <div className="grid lg:grid-cols-[4fr_5fr] gap-20 lg:gap-32 items-start">
                                    {/* Left Side: Intro */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        className="space-y-12"
                                    >
                                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
                                            Architecting <br />
                                            <span className="text-primary italic">Digital<br />Excellence.</span>
                                        </h2>

                                        <div className="space-y-6 text-lg text-muted-foreground font-medium leading-relaxed max-w-lg">
                                            <p>
                                                I am a Frontend Team Lead and Flutter Developer with over 4 years of experience delivering end-to-end digital products across mobile, desktop, and web platforms.
                                            </p>
                                            <p>
                                                With a proven track record of shipping 7+ production applications, I specialize in managing the full development lifecycle from user research and UI/UX design to deployment and continuous maintenance.
                                            </p>
                                        </div>

                                        <div className="pt-2">
                                            <a
                                                href={activeResume ? getAssetUrl(activeResume.file_path) : cvPdf}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-3 h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white text-xs font-black tracking-widest uppercase transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95"
                                            >
                                                <Download className="w-4 h-4" />
                                                Preview My CV
                                            </a>
                                        </div>

                                        <div className="p-8 md:p-10 bg-zinc-50 border border-zinc-200/60 rounded-[2rem] relative max-w-lg">
                                            <svg className="absolute top-6 left-6 w-12 h-12 text-primary/10" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                            </svg>
                                            <p className="italic font-bold text-base leading-relaxed text-zinc-700 relative z-10 pt-4">
                                                "Committed to implementing AI-assisted development workflows that significantly accelerate delivery while maintaining peak architectural integrity."
                                            </p>
                                        </div>
                                    </motion.div>

                                    {/* Right Side: Timeline & Education */}
                                    <div className="space-y-24">
                                        {/* Experience Timeline Tracker */}
                                        <div className="space-y-12">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center">
                                                    <Briefcase className="w-5 h-5 text-zinc-900" />
                                                </div>
                                                <h3 className="text-2xl font-black uppercase tracking-tight">Experience</h3>
                                            </div>

                                            <div className="relative space-y-12">
                                                {/* Vertical Track Line */}
                                                <div className="absolute top-3 bottom-3 left-[5px] w-[2px] bg-zinc-100" />

                                                {[
                                                    {
                                                        date: "JUN 2024 — PRESENT",
                                                        role: "FRONTEND TEAM LEAD",
                                                        company: "APTAWORKS // JAKARTA",
                                                        desc: "Leading frontend development across multiple concurrent projects. Managing and mentoring a team of up to 6 developers while overseeing technical roadmaps and tech stack decisions.",
                                                        current: true
                                                    },
                                                    {
                                                        date: "MAR 2022 — PRESENT",
                                                        role: "FLUTTER DEVELOPER & UI/UX DESIGNER",
                                                        company: "APTAWORKS // JAKARTA",
                                                        desc: "Responsible for building 4 interconnected applications for Palm Oil manufacturing operations, deployed across 4 companies and 4 factory locations in Medan.",
                                                        current: true
                                                    },
                                                    {
                                                        date: "JAN 2026 — APR 2026",
                                                        role: "ASSISTANT MENTOR (FREELANCE)",
                                                        company: "HARISENIN.COM // REMOTE",
                                                        desc: ""
                                                    },
                                                    {
                                                        date: "FEB 2021 — MAY 2021",
                                                        role: "JUNIOR REACT NATIVE DEVELOPER",
                                                        company: "BALI CIPTA INOVATOR // JAKARTA",
                                                        desc: ""
                                                    },
                                                    {
                                                        date: "OCT 2019 — OCT 2020",
                                                        role: "APPLICATION SUPPORT ENGINEER",
                                                        company: "PT. MITRA INTEGRASI INFORMATIKA // JAKARTA",
                                                        desc: ""
                                                    }
                                                ].map((item, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        whileInView={{ opacity: 1, x: 0 }}
                                                        viewport={{ once: true, margin: "-50px" }}
                                                        transition={{ delay: i * 0.1 }}
                                                        className="relative pl-10 md:pl-12"
                                                    >
                                                        {/* Tracking Node */}
                                                        {item.current ? (
                                                            <div className="absolute left-[-1px] top-1 w-3.5 h-3.5">
                                                                <div className="w-full h-full bg-primary rounded-full relative z-10 ring-4 ring-white" />
                                                                <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75" />
                                                            </div>
                                                        ) : (
                                                            <div className="absolute left-[1px] top-1.5 w-2.5 h-2.5 bg-zinc-300 rounded-full ring-4 ring-white" />
                                                        )}

                                                        <div className="space-y-1.5">
                                                            <div className="text-[10px] font-black tracking-widest text-primary uppercase">{item.date}</div>
                                                            <div>
                                                                <h4 className="text-xl md:text-2xl font-black uppercase tracking-tight text-foreground">{item.role}</h4>
                                                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{item.company}</div>
                                                            </div>
                                                            {item.desc && (
                                                                <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed max-w-md pt-2">
                                                                    {item.desc}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Academic Journey (Full Width of max-w-7xl container) */}
                                <div className="pt-20 border-t border-zinc-100 mt-24">
                                    <div className="flex flex-col space-y-12">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center">
                                                <GraduationCap className="w-5 h-5 text-zinc-900" />
                                            </div>
                                            <h3 className="text-2xl font-black uppercase tracking-tight">Academic Journey</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                                            {/* Card 1: .ST */}
                                            <motion.div
                                                whileHover={{ y: -5 }}
                                                className="group relative overflow-hidden bg-gradient-to-r from-white to-zinc-50/30 border border-zinc-150 p-6 sm:p-8 rounded-[1.5rem] flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 w-full shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all duration-300"
                                            >
                                                <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                                                    <span className="px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 font-black text-sm tracking-widest uppercase flex-shrink-0">
                                                        .ST
                                                    </span>
                                                    <div className="space-y-1">
                                                        <h4 className="text-lg sm:text-xl font-black uppercase leading-tight text-zinc-900 group-hover:text-primary transition-colors duration-300">
                                                            Information Technology
                                                        </h4>
                                                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                                                            Gunadarma University
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:gap-1 text-left sm:text-right w-full sm:w-auto border-t sm:border-none border-zinc-100 pt-4 sm:pt-0 flex-shrink-0">
                                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                                        Graduated 2019
                                                    </span>
                                                    <span className="text-xs font-black text-zinc-800 tracking-wider">
                                                        GPA 3.60 / 4.00
                                                    </span>
                                                </div>
                                            </motion.div>

                                            {/* Card 2: .MM */}
                                            <motion.div
                                                whileHover={{ y: -5 }}
                                                className="group relative overflow-hidden bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 p-6 sm:p-8 rounded-[1.5rem] flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 w-full shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-300"
                                            >
                                                <div className="flex items-start sm:items-center gap-4 sm:gap-5 relative z-10">
                                                    <span className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 border border-white/10 font-black text-sm tracking-widest uppercase flex-shrink-0">
                                                        .MM
                                                    </span>
                                                    <div className="space-y-1">
                                                        <h4 className="text-lg sm:text-xl font-black uppercase leading-tight text-white group-hover:text-primary transition-colors duration-300">
                                                            Magister Management
                                                        </h4>
                                                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                                            Satya Negara Indonesia University
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:gap-1 text-left sm:text-right w-full sm:w-auto border-t sm:border-none border-white/10 pt-4 sm:pt-0 relative z-10 flex-shrink-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-0.5 bg-primary/20 text-primary text-[9px] font-black rounded-md uppercase tracking-widest">
                                                            In Progress
                                                        </span>
                                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                                            Sep 2026 - Present
                                                        </span>
                                                    </div>
                                                    <span className="text-xs font-black text-primary tracking-wider">
                                                        Graduate Program Ongoing
                                                    </span>
                                                </div>
                                                {/* Decorative subtle background glow */}
                                                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/20 transition-all duration-500" />
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Technical Stack */}
                        <section id="stack" className="relative overflow-hidden bg-white px-6 py-24 lg:px-12">
                            <div className="mx-auto max-w-7xl space-y-16">
                                <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                                    <div className="space-y-6">
                                        <span className="block text-[11px] font-black uppercase tracking-[0.4em] text-primary">Technical Stack</span>
                                        <h2 className="max-w-3xl text-5xl font-black uppercase leading-[0.86] tracking-tight text-zinc-950 md:text-7xl">
                                            Stack I use to <br />
                                            <span className="text-primary italic">ship real product.</span>
                                        </h2>
                                    </div>
                                    <div className="flex flex-col gap-5 lg:items-end">
                                        <p className="max-w-xl text-base font-semibold leading-relaxed text-zinc-500 md:text-right md:text-lg">
                                            My stack is shaped by mobile delivery, product UX, backend contracts, and operational reliability, not just tool collecting.
                                        </p>
                                        <div className="relative w-full max-w-md">
                                            <Search className="pointer-events-none absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                                            <input
                                                type="text"
                                                placeholder="Search stack, tool, or capability"
                                                value={skillSearch}
                                                onChange={(e) => setSkillSearch(e.target.value)}
                                                className="h-14 w-full rounded-full border border-zinc-200 bg-white pl-14 pr-5 text-sm font-bold text-zinc-700 outline-none transition-all placeholder:text-zinc-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid items-start gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                                    <div className="space-y-4">
                                        <motion.div
                                        initial={{ opacity: 0, y: 24 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-80px" }}
                                        transition={{ duration: 0.7 }}
                                        className="relative overflow-hidden rounded-[2rem] bg-zinc-950 p-4 text-white shadow-[0_24px_70px_rgba(0,0,0,0.18)]"
                                    >
                                        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="h-3 w-3 rounded-full bg-red-400" />
                                                <span className="h-3 w-3 rounded-full bg-yellow-300" />
                                                <span className="h-3 w-3 rounded-full bg-green-400" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">dewa-dev-stack.ts</span>
                                        </div>

                                        <div className="space-y-4 font-mono text-[13px] leading-relaxed">
                                            <motion.div
                                                initial={{ opacity: 0, x: -16 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.1 }}
                                            >
                                                <span className="text-primary">const</span> role = <span className="text-emerald-300">"Frontend Team Lead"</span>;
                                            </motion.div>
                                            <motion.div
                                                initial={{ opacity: 0, x: -16 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <span className="text-primary">ship</span>({"{"}
                                                <div className="ml-5 space-y-1.5 border-l border-white/10 pl-4">
                                                    <div>mobile: <span className="text-emerald-300">"Flutter, Dart, React Native"</span>,</div>
                                                    <div>frontend: <span className="text-emerald-300">"React, TypeScript, Tailwind"</span>,</div>
                                                    <div>backend: <span className="text-emerald-300">"Laravel, Golang, Supabase"</span>,</div>
                                                    <div>quality: <span className="text-emerald-300">"Architecture, UX, delivery"</span></div>
                                                </div>
                                                {"}"});
                                            </motion.div>
                                        </div>

                                        <div className="mt-6 grid grid-cols-3 overflow-hidden rounded-2xl border border-white/10">
                                            {[
                                                ['5+', 'Years'],
                                                ['42+', 'Projects'],
                                                ['6', 'Team Led']
                                            ].map(([value, label]) => (
                                                <div key={label} className="border-r border-white/10 p-3 last:border-r-0">
                                                    <div className="text-2xl font-black tracking-tight">{value}</div>
                                                    <div className="mt-1 text-[9px] font-black uppercase tracking-[0.2em] text-white/35">{label}</div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                                            <div className="mb-2 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.22em] text-white/35">
                                                <span>Build Pipeline</span>
                                                <span>Live</span>
                                            </div>
                                            <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                                <motion.div
                                                    className="h-full rounded-full bg-primary"
                                                    initial={{ width: "12%" }}
                                                    whileInView={{ width: "92%" }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 1.4, ease: "easeOut" }}
                                                />
                                            </div>
                                        </div>
                                        </motion.div>

                                    </div>

                                    <div className="relative min-h-[500px] overflow-visible pr-8 pt-4">
                                        {filteredSkills.length > 0 ? (() => {
                                            const normalizedIndex = activeSkillIndex % filteredSkills.length;
                                            const orderedSkills = filteredSkills.map((_, order) => filteredSkills[(normalizedIndex + order) % filteredSkills.length]);
                                            const activeSkill = orderedSkills[0];
                                            const meta = getCategoryMetadata(activeSkill.category, normalizedIndex);
                                            const cat = activeSkill.category.toLowerCase();
                                            const Icon = cat.includes('mobile') ? Smartphone :
                                                cat.includes('frontend') ? Globe :
                                                    cat.includes('backend') ? Binary :
                                                        cat.includes('ai') ? Sparkles :
                                                            cat.includes('design') || cat.includes('prototype') ? Palette :
                                                                cat.includes('database') ? Database :
                                                                    cat.includes('tool') || cat.includes('method') ? Workflow :
                                                                        cat.includes('architecture') ? Layers :
                                                                            cat.includes('map') || cat.includes('ocr') ? Map :
                                                                                Zap;

                                            return (
                                                <div className="relative h-full min-h-[500px]">
                                                    {orderedSkills.slice(1, 4).map((skill, layer) => (
                                                        <motion.div
                                                            key={`${skill.id}-${layer}`}
                                                            className="absolute left-8 right-0 top-0 rounded-[2rem] border border-zinc-200 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.08)]"
                                                            initial={false}
                                                            animate={{
                                                                y: 24 + layer * 26,
                                                                x: 28 + layer * 24,
                                                                rotate: 2.5 + layer * 1.5,
                                                                scale: 0.98 - layer * 0.035,
                                                                opacity: 0.86 - layer * 0.18
                                                            }}
                                                            transition={{ duration: 0.45, ease: "easeOut" }}
                                                            style={{ height: 365, zIndex: 3 - layer }}
                                                        >
                                                            <div className="flex h-full flex-col justify-between p-6">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-[10px] font-black uppercase tracking-[0.24em] text-primary/70">
                                                                        Up Next
                                                                    </span>
                                                                    <span className="rounded-full border border-zinc-200 px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-zinc-400">
                                                                        {skill.items?.length || 0} tools
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <div className="text-2xl font-black uppercase leading-none tracking-tight text-zinc-300">
                                                                        {skill.category}
                                                                    </div>
                                                                    <div className="mt-5 h-2 w-24 rounded-full bg-zinc-100" />
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))}

                                                    <AnimatePresence mode="wait">
                                                        <motion.div
                                                            key={activeSkill.id}
                                                            initial={{ opacity: 0, x: 90, rotate: 3, scale: 0.96 }}
                                                            animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
                                                            exit={{ opacity: 0, x: -90, rotate: -4, scale: 0.96 }}
                                                            transition={{ duration: 0.42, ease: "easeOut" }}
                                                            className="relative z-10 overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-[0_30px_80px_rgba(0,0,0,0.1)]"
                                                        >
                                                            <div className="flex items-start justify-between gap-6">
                                                                <div className="flex items-start gap-4">
                                                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 text-white">
                                                                        <Icon className="h-6 w-6" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-[10px] font-black uppercase tracking-[0.24em] text-primary">Tech Index {meta.num}</div>
                                                                        <h3 className="mt-2 text-3xl font-black uppercase leading-none tracking-tight text-zinc-950">{activeSkill.category}</h3>
                                                                    </div>
                                                                </div>
                                                                <div className="rounded-full border border-zinc-200 px-4 py-2 text-[9px] font-black uppercase tracking-[0.18em] text-zinc-500">
                                                                    {activeSkill.items?.length || 0} tools
                                                                </div>
                                                            </div>

                                                            <p className="mt-7 text-base font-semibold leading-relaxed text-zinc-500">
                                                                {meta.desc}
                                                            </p>

                                                            <div className="mt-8 grid gap-3 sm:grid-cols-2">
                                                                {activeSkill.items?.slice(0, 8).map((item, i) => (
                                                                    <motion.div
                                                                        key={item}
                                                                        initial={{ opacity: 0, y: 10 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        transition={{ delay: i * 0.035 }}
                                                                        className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-700"
                                                                    >
                                                                        {item}
                                                                    </motion.div>
                                                                ))}
                                                            </div>

                                                            <div className="mt-8 flex flex-col gap-4 border-t border-zinc-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    {filteredSkills.map((skill, index) => (
                                                                        <button
                                                                            key={skill.id}
                                                                            type="button"
                                                                            onClick={() => setActiveSkillIndex(index)}
                                                                            className={cn(
                                                                                "h-2.5 rounded-full transition-all",
                                                                                index === normalizedIndex ? "w-8 bg-primary" : "w-2.5 bg-zinc-300 hover:bg-zinc-400"
                                                                            )}
                                                                            aria-label={`Show ${skill.category}`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setActiveSkillIndex((current) => (current + 1) % filteredSkills.length)}
                                                                    className="group inline-flex h-12 items-center justify-center gap-3 rounded-full bg-zinc-950 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:-translate-y-0.5 hover:bg-primary hover:shadow-[0_16px_35px_rgba(0,80,255,0.22)]"
                                                                >
                                                                    Next Stack
                                                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        })() : (
                                            <div className="flex min-h-[360px] items-center justify-center rounded-[2rem] border border-dashed border-zinc-300 bg-zinc-50 text-center">
                                                <div>
                                                    <div className="text-lg font-black uppercase text-zinc-950">No stack found</div>
                                                    <p className="mt-2 text-sm font-semibold text-zinc-500">Try another keyword.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Featured Works (Projects) */}
                        <section id="work" className="bg-white px-6 py-24 lg:px-12">
                            <div className="mx-auto max-w-7xl space-y-16">
                                <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
                                    <div className="space-y-6">
                                        <span className="block text-[11px] font-black uppercase tracking-[0.4em] text-primary">Recent Work</span>
                                        <h2 className="text-5xl font-black uppercase leading-[0.9] tracking-tight text-zinc-950 md:text-7xl">
                                            Selected <br />
                                            <span className="text-primary italic">Projects.</span>
                                        </h2>
                                    </div>

                                    <div className="flex flex-wrap gap-2 rounded-[2rem] border border-zinc-200 bg-zinc-50 p-2">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => setActiveCategory(cat!)}
                                                className={cn(
                                                    "h-11 rounded-full px-6 text-[10px] font-black uppercase tracking-widest transition-all",
                                                    activeCategory === cat
                                                        ? "bg-primary text-white shadow-[0_12px_30px_rgba(0,80,255,0.22)]"
                                                        : "text-zinc-500 hover:bg-white hover:text-zinc-950"
                                                )}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {(() => {
                                    const visibleProjects = projects.filter(p => activeCategory === 'All' || p.category?.trim().toLowerCase() === activeCategory.toLowerCase());
                                    const selectedProject = visibleProjects[Math.min(activeProjectIndex, visibleProjects.length - 1)];

                                    if (!selectedProject) {
                                        return (
                                            <div className="rounded-[2rem] border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center">
                                                <div className="text-2xl font-black uppercase text-zinc-950">No project found</div>
                                                <p className="mt-3 text-sm font-semibold text-zinc-500">Try another category.</p>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="grid items-start gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                transition={{ duration: 0.45, ease: "easeOut" }}
                                                className="relative flex min-h-[650px] flex-col overflow-hidden rounded-[2.5rem] bg-zinc-950 p-4 text-white shadow-[0_32px_90px_rgba(0,0,0,0.16)] lg:h-[650px]"
                                            >
                                                <div className="mb-4 flex items-center justify-between px-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="h-3 w-3 rounded-full bg-red-400" />
                                                        <span className="h-3 w-3 rounded-full bg-yellow-300" />
                                                        <span className="h-3 w-3 rounded-full bg-green-400" />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
                                                        Project Preview {String(activeProjectIndex + 1).padStart(2, '0')}
                                                    </span>
                                                </div>

                                                <Link to={`/projects/${selectedProject.slug}`} className="group flex min-h-0 flex-1 flex-col">
                                                    <div className="relative h-[360px] shrink-0 overflow-hidden rounded-[2rem] bg-zinc-900 lg:h-[385px]">
                                                        {selectedProject.thumbnail ? (
                                                            <motion.img
                                                                key={selectedProject.thumbnail}
                                                                src={getAssetUrl(selectedProject.thumbnail)}
                                                                alt={selectedProject.title}
                                                                className="h-full w-full object-cover opacity-90"
                                                                initial={{ scale: 1.025, opacity: 0.82 }}
                                                                animate={{ scale: 1, opacity: 0.9 }}
                                                                transition={{ duration: 0.35, ease: "easeOut" }}
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <Boxes className="h-16 w-16 text-white/20" />
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent" />
                                                        <div className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-[9px] font-black uppercase tracking-widest text-primary">
                                                            {selectedProject.category}
                                                        </div>
                                                        <motion.div
                                                            className="absolute bottom-5 right-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white"
                                                            whileHover={{ rotate: 45, scale: 1.05 }}
                                                        >
                                                            <ArrowRight className="h-6 w-6" />
                                                        </motion.div>
                                                    </div>

                                                    <motion.div
                                                        key={selectedProject.id}
                                                        initial={{ opacity: 0.75, y: 6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.25, ease: "easeOut" }}
                                                        className="grid min-h-[185px] flex-1 gap-6 p-5 md:grid-cols-[1fr_auto] md:items-end"
                                                    >
                                                        <div>
                                                            <div className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-primary">Open Case</div>
                                                            <h3 className="line-clamp-2 text-4xl font-black uppercase leading-none tracking-tight transition-colors group-hover:text-primary md:text-6xl">
                                                                {selectedProject.title}
                                                            </h3>
                                                        </div>
                                                        <div className="flex max-w-md flex-wrap gap-2 md:justify-end">
                                                            {selectedProject.tech_stack?.slice(0, 6).map((tech) => (
                                                                <span key={tech} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[9px] font-black uppercase tracking-[0.16em] text-white/65">
                                                                    {tech}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                </Link>
                                            </motion.div>

                                            <div className="rounded-[2.5rem] border border-zinc-200 bg-zinc-50 p-3">
                                                <div className="mb-3 flex items-center justify-between px-3 py-2">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.24em] text-primary">Project Switcher</span>
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{visibleProjects.length} Works</span>
                                                </div>
                                                <div className="grid max-h-[590px] gap-3 overflow-y-auto pr-1 custom-scrollbar">
                                                    {visibleProjects.map((project, idx) => {
                                                        const isActive = idx === activeProjectIndex;

                                                        return (
                                                            <motion.div
                                                                key={`${project.id}-${activeCategory}`}
                                                                onMouseEnter={() => setActiveProjectIndex(idx)}
                                                                initial={{ opacity: 0, x: 24 }}
                                                                whileInView={{ opacity: 1, x: 0 }}
                                                                viewport={{ once: true }}
                                                                transition={{ duration: 0.35, delay: idx * 0.04 }}
                                                            >
                                                                <Link
                                                                    to={`/projects/${project.slug}`}
                                                                    onFocus={() => setActiveProjectIndex(idx)}
                                                                    className={cn(
                                                                        "group grid w-full grid-cols-[5rem_1fr_auto] items-center gap-4 rounded-[1.4rem] border p-2.5 text-left transition-all duration-300",
                                                                        isActive
                                                                            ? "border-primary bg-white shadow-[0_18px_45px_rgba(0,80,255,0.12)]"
                                                                            : "border-transparent bg-white/70 hover:border-zinc-200 hover:bg-white"
                                                                    )}
                                                                >
                                                                    <div className="relative aspect-[4/3] overflow-hidden rounded-[1rem] bg-zinc-100">
                                                                        {project.thumbnail ? (
                                                                            <img
                                                                                src={getAssetUrl(project.thumbnail)}
                                                                                alt={project.title}
                                                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                                            />
                                                                        ) : (
                                                                            <div className="flex h-full w-full items-center justify-center">
                                                                                <Boxes className="h-7 w-7 text-zinc-300" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">
                                                                                {String(idx + 1).padStart(2, '0')}
                                                                            </span>
                                                                            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-400">
                                                                                {project.category}
                                                                            </span>
                                                                        </div>
                                                                        <div className={cn(
                                                                            "mt-2 line-clamp-2 text-lg font-black uppercase leading-none tracking-tight transition-colors",
                                                                            isActive ? "text-primary" : "text-zinc-950"
                                                                        )}>
                                                                            {project.title}
                                                                        </div>
                                                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                                                            {project.tech_stack?.slice(0, 3).map((tech) => (
                                                                                <span key={tech} className="text-[8px] font-black uppercase tracking-[0.16em] text-zinc-400">
                                                                                    {tech}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                    <div className={cn(
                                                                        "flex h-10 w-10 items-center justify-center rounded-full border transition-all",
                                                                        isActive ? "border-primary bg-primary text-white" : "border-zinc-200 text-zinc-950 group-hover:border-primary group-hover:text-primary"
                                                                    )}>
                                                                        <ArrowRight className="h-4 w-4 -rotate-45 transition-transform group-hover:rotate-0" />
                                                                    </div>
                                                                </Link>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </section>

                        <CertificateShowcase certificates={certificates} audience="developer" />

                        {/* Interactive Mini Game */}
                        <MiniGame />

                    </main>

                    {/* Footer Signature */}
                    <footer id="contact" className="py-40 bg-zinc-950 text-white selection:bg-primary/50">
                        <div className="max-w-7xl mx-auto px-6 lg:px-12">
                            <div className="grid lg:grid-cols-[1.25fr_1fr] gap-16 xl:gap-24 items-center">
                                <div className="space-y-12">
                                    <h2 className="text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[7rem] font-black uppercase tracking-tighter leading-[0.85]">
                                        Let's build <br />
                                        <span className="text-primary italic">something <br />great.</span>
                                    </h2>
                                    <div className="space-y-8">
                                        <p className="text-zinc-400 text-lg font-medium max-w-md italic">
                                            Have a project in mind? Let's collaborate and build something exceptional together.
                                        </p>
                                        <a href="mailto:anggadewa2016@gmail.com" className="inline-block text-2xl md:text-4xl font-black hover:text-primary transition-all border-b-4 border-primary pb-2 tracking-tight">
                                            anggadewa2016@gmail.com
                                        </a>
                                    </div>
                                </div>

                                <div className="bg-zinc-900 p-8 sm:p-16 rounded-[2.5rem] sm:rounded-[4rem] space-y-12 border border-white/5 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] group-hover:bg-primary/20 transition-all" />

                                    <div className="space-y-4">
                                        <span className="text-[11px] font-black tracking-[0.4em] text-primary uppercase block italic">Based in</span>
                                        <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Jakarta, Indonesia</h3>
                                    </div>

                                    <div className="grid grid-cols-2 gap-12">
                                        <div className="space-y-3">
                                            <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest block">Local Time</span>
                                            <p className="text-xl font-black text-white italic tracking-wider">
                                                {currentTime.toTimeString().split(' ')[0]}
                                            </p>
                                        </div>
                                        <div className="space-y-3">
                                            <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest block">Current Status</span>
                                            <p className="text-xl font-black text-white italic">Available for Work</p>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => { window.location.href = 'mailto:anggadewa2016@gmail.com'; }}
                                        className="w-full h-16 sm:h-20 rounded-2xl sm:rounded-[2rem] bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-black tracking-[0.1em] sm:tracking-[0.2em] uppercase shadow-2xl shadow-primary/40 transition-all hover:scale-[1.02] active:scale-95"
                                    >
                                        Start a Conversation
                                    </Button>

                                    <div className="flex gap-4 pt-4">
                                        <a href="https://github.com/anggadewa" target="_blank" rel="noreferrer" className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center hover:bg-white hover:text-black transition-all group/icon">
                                            <GitHubIcon className="w-6 h-6 group-hover/icon:scale-110 transition-transform" />
                                        </a>
                                        <a href="https://linkedin.com/in/anggadewantorokekasih" target="_blank" rel="noreferrer" className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center hover:bg-[#0077b5] hover:text-white transition-all group/icon">
                                            <LinkedInIcon className="w-6 h-6 group-hover/icon:scale-110 transition-transform" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-40 pt-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-12">
                                <div className="text-[11px] font-black text-zinc-600 uppercase tracking-widest">
                                    © {new Date().getFullYear()} DEWA.DEV — Crafted with passion & love
                                </div>
                                <div className="flex gap-12 text-[11px] font-black text-zinc-600 uppercase tracking-widest">
                                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-primary transition-colors">Back to Top</button>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}
