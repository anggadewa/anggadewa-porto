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
    Download
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getAssetUrl } from '@/lib/assets';
import { stripHtml, cn } from '@/lib/utils';
import { Project, Skill } from '@/types';
import { Tooltip } from '@/components/ui/tooltip-custom';
import { ThemeToggle } from '@/components/theme-toggle';
import MiniGame from '@/components/MiniGame';

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
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [projectSearch, setProjectSearch] = useState('');
    const [skillSearch, setSkillSearch] = useState('');
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

                setProjects(projectsData || []);
                setSkills(skillsData || []);
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
                        { icon: Smartphone, href: "https://wa.me/6285172459708", color: "hover:bg-[#25D366] hover:shadow-[0_0_20px_rgba(37,211,102,0.5)]" },
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
                    <header className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-6">
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

                            <div className="hidden md:flex items-center gap-10">
                                {['Work', 'About', 'Stack', 'Contact'].map((item) => (
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
                                <Button
                                    onClick={() => window.open('https://wa.me/6285172459708', '_blank')}
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
                        <section id="home" className="relative min-h-screen w-screen left-1/2 -translate-x-1/2 flex items-center justify-center overflow-hidden bg-primary px-6">
                            {/* Decorative background elements */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:40px_40px] opacity-20" />
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

                            <div className="max-w-7xl mx-auto w-full relative z-10 pt-20">
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
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2.5 }}
                                className="fixed bottom-[4px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-[100] pointer-events-none"
                            >
                                <span className="text-[7px] font-black text-white/70 uppercase tracking-[0.6em]">Scroll to Explore</span>
                                <div className="w-[1px] h-10 bg-gradient-to-b from-white/60 to-transparent" />
                            </motion.div>
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
                                                href={cvPdf}
                                                download="CV_IT_Angga_Dewantoro_2026.pdf"
                                                className="inline-flex items-center gap-3 h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white text-xs font-black tracking-widest uppercase transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95"
                                            >
                                                <Download className="w-4 h-4" />
                                                Download My CV
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
                                                        <span className="px-2 py-0.5 bg-primary/20 text-primary text-[9px] font-black rounded-md uppercase tracking-widest animate-pulse">
                                                            Upcoming
                                                        </span>
                                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                                            Sep 2026
                                                        </span>
                                                    </div>
                                                    <span className="text-xs font-black text-primary tracking-wider">
                                                        Enrollment Phase
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

                        {/* Technical Stack (Bento Style) */}
                        <section id="stack" className="py-24 bg-zinc-50/50">
                            <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-24">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                                    <div className="space-y-6">
                                        <span className="text-[11px] font-black tracking-[0.4em] text-primary uppercase block">Technical Stack</span>
                                        <h2 className="text-6xl font-black text-foreground uppercase tracking-tight leading-[0.9]">
                                            The tools I use to <br />
                                            <span className="text-primary italic">bring ideas to life.</span>
                                        </h2>
                                    </div>
                                    <div className="relative group max-w-sm w-full">
                                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Filter expertise..."
                                            value={skillSearch}
                                            onChange={(e) => setSkillSearch(e.target.value)}
                                            className="w-full bg-white border-2 border-zinc-100 rounded-[2rem] py-5 pl-14 pr-8 text-sm font-bold focus:outline-none focus:border-primary/20 focus:ring-8 focus:ring-primary/5 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {skills
                                        .filter(skill =>
                                            skill.category.toLowerCase().includes(skillSearch.toLowerCase()) ||
                                            skill.items?.some(item => item.toLowerCase().includes(skillSearch.toLowerCase()))
                                        )
                                        .map((skill, idx) => {
                                            const colors = getCategoryColors(skill.category);
                                            const meta = getCategoryMetadata(skill.category, idx);
                                            return (
                                                <motion.div
                                                    key={skill.id}
                                                    initial={{ opacity: 0, y: 30 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                                                    onMouseMove={handleMouseMove}
                                                    onMouseLeave={handleMouseLeave}
                                                    style={{
                                                        transition: 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s',
                                                        transformStyle: 'preserve-3d'
                                                    }}
                                                    className="group relative p-[1.5px] rounded-[2rem] bg-zinc-100/80 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.012)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.04)] transition-all duration-300 z-10"
                                                >
                                                    {/* Dynamic Mouse Spotlight Glow for the Border */}
                                                    <div
                                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
                                                        style={{
                                                            background: `radial-gradient(150px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${colors.borderGlow}, transparent)`
                                                        }}
                                                    />

                                                    {/* Inner Card Body */}
                                                    <div className="relative bg-white/95 backdrop-blur-xl rounded-[1.9rem] p-7 flex flex-col justify-between gap-6 min-h-[250px] h-full overflow-hidden z-10">
                                                        {/* Blueprint Dot Grid Pattern Background */}
                                                        <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_1.2px,transparent_1.2px)] [background-size:16px_16px] opacity-[0.25] group-hover:opacity-[0.45] transition-opacity duration-500 pointer-events-none z-0" />

                                                        {/* Decorative top ambient color blur */}
                                                        <div className={cn("absolute -top-10 -left-10 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none bg-gradient-to-br z-0", colors.gradient)} />

                                                        {/* Top Section */}
                                                        <div className="flex flex-col gap-4 z-10" style={{ transform: 'translateZ(10px)' }}>
                                                            {/* Header Row */}
                                                            <div className="flex items-center justify-between gap-4">
                                                                <div className="flex items-center gap-3.5">
                                                                    <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm border border-zinc-100/80", colors.iconBg)}>
                                                                        {skill.category.toLowerCase().includes('mobile') ? <Smartphone className={cn("w-5 h-5 transition-all duration-500 group-hover:rotate-12", colors.text)} /> :
                                                                            skill.category.toLowerCase().includes('frontend') ? <Globe className={cn("w-5 h-5 transition-all duration-500 group-hover:rotate-12", colors.text)} /> :
                                                                                skill.category.toLowerCase().includes('backend') ? <Binary className={cn("w-5 h-5 transition-all duration-500 group-hover:rotate-12", colors.text)} /> :
                                                                                    skill.category.toLowerCase().includes('ai') ? <Sparkles className={cn("w-5 h-5 transition-all duration-500 group-hover:rotate-12", colors.text)} /> :
                                                                                        skill.category.toLowerCase().includes('design') || skill.category.toLowerCase().includes('prototype') ? <Palette className={cn("w-5 h-5 transition-all duration-500 group-hover:rotate-12", colors.text)} /> :
                                                                                            skill.category.toLowerCase().includes('database') ? <Database className={cn("w-5 h-5 transition-all duration-500 group-hover:rotate-12", colors.text)} /> :
                                                                                                skill.category.toLowerCase().includes('tool') || skill.category.toLowerCase().includes('method') ? <Workflow className={cn("w-5 h-5 transition-all duration-500 group-hover:rotate-12", colors.text)} /> :
                                                                                                    skill.category.toLowerCase().includes('architecture') ? <Layers className={cn("w-5 h-5 transition-all duration-500 group-hover:rotate-12", colors.text)} /> :
                                                                                                        skill.category.toLowerCase().includes('map') || skill.category.toLowerCase().includes('ocr') ? <Map className={cn("w-5 h-5 transition-all duration-500 group-hover:rotate-12", colors.text)} /> :
                                                                                                            <Zap className={cn("w-5 h-5 transition-all duration-500 group-hover:rotate-12", colors.text)} />}
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <h4 className="text-[14px] font-black text-zinc-800 tracking-tight uppercase group-hover:text-zinc-950 transition-colors duration-300">{skill.category}</h4>
                                                                        <span className="text-[9px] font-black tracking-widest text-zinc-400 uppercase">Tech Index {meta.num} • {meta.label}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[8px] font-black tracking-widest text-zinc-300">TOTAL</span>
                                                                    <span className={cn("text-[9px] font-black tracking-wider py-0.5 px-2.5 rounded-md uppercase border transition-all duration-300", colors.badge)}>
                                                                        {skill.items?.length || 0} Tech
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Elegant Dynamic Progress Bar */}
                                                            <div className="relative w-full h-[3px] bg-zinc-100 overflow-hidden rounded-full">
                                                                <div
                                                                    className={cn("absolute top-0 left-0 h-full w-12 bg-gradient-to-r transition-all duration-700 ease-out group-hover:w-full", colors.bar)}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Description Copy */}
                                                        <p className="z-10 text-[11px] font-bold text-zinc-500/90 leading-relaxed pl-1" style={{ transform: 'translateZ(12px)' }}>
                                                            {meta.desc}
                                                        </p>

                                                        {/* Skill Tags */}
                                                        <div className="flex flex-wrap gap-2 pt-1 z-10" style={{ transform: 'translateZ(15px)' }}>
                                                            {skill.items?.map((item, i) => (
                                                                <span
                                                                    key={i}
                                                                    className={cn(
                                                                        "px-3.5 py-1.5 bg-white border border-zinc-150 rounded-xl text-[9px] font-black uppercase tracking-wider text-zinc-500 cursor-default shadow-sm transition-all duration-300",
                                                                        colors.tagHover
                                                                    )}
                                                                >
                                                                    {item}
                                                                </span>
                                                            ))}
                                                        </div>

                                                        {/* Decorative bottom-right glow inside card */}
                                                        <div className={cn("absolute -right-10 -bottom-10 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none bg-gradient-to-br z-0", colors.gradient)} />
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                </div>
                            </div>
                        </section>

                        {/* Featured Works (Projects) */}
                        <section id="work" className="py-24 bg-white">
                            <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-32">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                                    <div className="space-y-6">
                                        <span className="text-[11px] font-black tracking-[0.4em] text-primary uppercase block">Recent Work</span>
                                        <h2 className="text-6xl font-black text-foreground uppercase tracking-tight leading-[0.9]">Selected <br /><span className="text-primary italic">Projects.</span></h2>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => setActiveCategory(cat!)}
                                                className={cn(
                                                    "px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                                                    activeCategory === cat
                                                        ? "bg-primary text-white shadow-2xl shadow-primary/30 scale-105"
                                                        : "bg-white border-2 border-zinc-100 text-muted-foreground hover:border-primary/20"
                                                )}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {projects
                                        .filter(p => activeCategory === 'All' || p.category?.trim().toLowerCase() === activeCategory.toLowerCase())
                                        .map((project, idx) => (
                                            <motion.div
                                                key={project.id}
                                                initial={{ opacity: 0, y: 30 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="group cursor-pointer"
                                            >
                                                <Link to={`/projects/${project.slug}`} className="block p-3 bg-white border border-zinc-150 rounded-[2.5rem] hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] hover:border-zinc-200 transition-all duration-500 hover:-translate-y-1">
                                                    <div className="aspect-[4/3] rounded-[2rem] overflow-hidden relative border border-black/5 mb-6">
                                                        {project.thumbnail ? (
                                                            <img
                                                                src={getAssetUrl(project.thumbnail)}
                                                                alt={project.title}
                                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-zinc-50 flex items-center justify-center">
                                                                <Boxes className="w-12 h-12 text-zinc-200" />
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-700" />

                                                        {/* Floating Badge */}
                                                        <div className="absolute top-4 left-4">
                                                            <Badge className="bg-white/90 backdrop-blur-md text-primary border-none text-[9px] font-black tracking-widest uppercase py-1.5 px-3 rounded-full shadow-sm">
                                                                {project.category}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="px-4 pb-4 flex justify-between items-center">
                                                        <div className="space-y-1.5 pr-4">
                                                            <h3 className="text-xl font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                                                                {project.title}
                                                            </h3>
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                {project.tech_stack?.slice(0, 3).map((tech, i) => (
                                                                    <span key={i} className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                                                        {tech}{i < 2 && i < project.tech_stack!.length - 1 ? " • " : ""}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="w-12 h-12 shrink-0 rounded-full border border-zinc-200 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500 shadow-sm">
                                                            <ArrowRight className="w-5 h-5 text-foreground group-hover:text-white transition-all -rotate-45 group-hover:rotate-0" />
                                                        </div>
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                </div>
                            </div>
                        </section>

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
                                        onClick={() => window.open('https://wa.me/6285172459708', '_blank')}
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
                                    © {new Date().getFullYear()} DEWA.DEV — Crafted with passion & Vibe Coding
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
