import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Activity,
    Layers,
    Link as LinkIcon,
    Mail,
    ArrowRight,
    Cpu,
    Database,
    Palette,
    Boxes,
    Binary,
    Globe,
    Search
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getAssetUrl } from '@/lib/assets';
import { stripHtml } from '@/lib/utils';
import { Project, Skill } from '@/types';
import { Tooltip } from '@/components/ui/tooltip-custom';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [projectSearch, setProjectSearch] = useState('');
    const [skillSearch, setSkillSearch] = useState('');

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

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                {/* System Header */}
                <header className="sticky top-0 z-40 w-full backdrop-blur-xl border-b border-border/40 py-4 flex justify-between items-center px-4 bg-background/60">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                            <span className="text-[9px] font-black tracking-[0.2em] text-emerald-500 uppercase">Available for Hire</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-xl font-black tracking-tighter text-foreground hover:text-primary transition-all duration-300 cursor-default select-none group">
                            .DEW<span className="text-primary group-hover:text-glow transition-all duration-300">()</span>.IS<span className="text-primary group-hover:text-glow transition-all duration-300">()</span>
                        </div>
                        <div className="h-6 w-[1px] bg-border/40" />
                        <ThemeToggle />
                    </div>
                </header>

                <main className="py-24 lg:py-40 space-y-48">
                    {/* Hero Protocol */}
                    <section className="relative">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="space-y-12"
                            >
                                <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-4 py-2 bg-primary/5 border border-primary/20 rounded-2xl backdrop-blur-sm">
                                    <Binary className="w-4 h-4 text-primary" />
                                    <span className="text-[10px] font-black tracking-[0.3em] text-primary uppercase">Fullstack Developer & Team Lead</span>
                                </motion.div>

                                <motion.div variants={itemVariants} className="space-y-10">
                                    <div className="space-y-4">
                                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground tracking-tighter leading-[1.1] uppercase">
                                            Angga <span className="text-primary">Dewa.</span>
                                        </h1>
                                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed font-medium">
                                            Frontend Team Lead with over 5 years of experience in architecting
                                            scalable web applications. I specialize in bridging the gap between
                                            complex technical requirements and seamless user experiences,
                                            leading engineering teams to deliver high-performance solutions
                                            using React, Flutter, and modern cloud ecosystems.
                                        </p>
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
                                    <Button
                                        onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-black tracking-[0.2em] group shadow-lg shadow-primary/20"
                                    >
                                        EXPLORE PROJECTS
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                    <a href={`${getAssetUrl('cv.pdf')}?v=${Date.now()}`} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" className="h-14 px-8 rounded-2xl border-border bg-card/5 hover:bg-card/10 text-foreground text-xs font-black tracking-[0.2em]">
                                            VIEW RESUME
                                        </Button>
                                    </a>
                                </motion.div>
                            </motion.div>

                            {/* Isometric UI Stack Animation */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="hidden lg:flex relative h-[600px] items-center justify-center"
                                style={{ perspective: "1000px" }}
                            >
                                <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full" />

                                <motion.div
                                    className="relative w-full h-full flex items-center justify-center"
                                    initial={{ rotateX: 55, rotateZ: -35 }}
                                    style={{ transformStyle: "preserve-3d" }}
                                >
                                    {/* Layer 1: Base System Grid */}
                                    <motion.div
                                        initial={{ z: 0 }}
                                        animate={{ z: [0, 10, 0] }}
                                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute w-80 h-80 rounded-3xl bg-primary/5 border border-primary/20 backdrop-blur-sm overflow-hidden"
                                    >
                                        <div className="absolute inset-0 opacity-30 bg-grid-white/[0.05]" />
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            <div className="w-2 h-2 rounded-full bg-primary/40" />
                                            <div className="w-2 h-2 rounded-full bg-primary/20" />
                                        </div>
                                    </motion.div>

                                    {/* Layer 2: Dashboard UI Layer */}
                                    <motion.div
                                        initial={{ z: 40 }}
                                        animate={{ z: [40, 60, 40] }}
                                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                        className="absolute w-72 h-48 rounded-2xl bg-card/40 border border-white/10 backdrop-blur-md shadow-2xl p-6 space-y-4"
                                    >
                                        <div className="h-2 w-1/2 bg-primary/30 rounded-full" />
                                        <div className="grid grid-cols-4 gap-2 items-end h-20">
                                            {[40, 70, 45, 90].map((h, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${h}%` }}
                                                    transition={{ duration: 2, delay: i * 0.2 }}
                                                    className="bg-primary/40 rounded-t-sm"
                                                />
                                            ))}
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-1.5 w-full bg-white/5 rounded-full" />
                                            <div className="h-1.5 w-2/3 bg-white/5 rounded-full" />
                                        </div>
                                    </motion.div>

                                    {/* Layer 3: Floating Component Layer */}
                                    <motion.div
                                        initial={{ z: 90, x: 0 }}
                                        animate={{ z: [90, 120, 90], x: [0, 10, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                        className="absolute top-10 left-10 w-40 h-16 rounded-xl bg-primary/20 border border-primary/30 backdrop-blur-lg shadow-xl flex items-center gap-3 px-4"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
                                            <Activity className="w-4 h-4 text-primary-foreground" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="h-1.5 w-16 bg-primary/40 rounded-full" />
                                            <div className="h-1 w-10 bg-primary/20 rounded-full" />
                                        </div>
                                    </motion.div>

                                    {/* Decorative Floating Nodes */}
                                    {[...Array(4)].map((_, i) => (
                                        <motion.div
                                            key={`node-${i}`}
                                            animate={{
                                                z: [150 + i * 20, 180 + i * 20, 150 + i * 20],
                                                opacity: [0.3, 0.6, 0.3]
                                            }}
                                            transition={{
                                                duration: 3 + i,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                            className="absolute w-2 h-2 rounded-full bg-primary"
                                            style={{
                                                top: i * 25 + "%",
                                                left: i * 20 + "%",
                                            }}
                                        />
                                    ))}
                                </motion.div>
                            </motion.div>
                        </div>
                    </section>

                    {/* Capability Nodes (Skills) */}
                    <section className="space-y-16">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-6"
                            >
                                <div className="h-[2px] w-16 bg-primary shadow-[0_0_10px_rgba(106,43,255,0.4)]" />
                                <h2 className="text-sm font-black tracking-[0.4em] text-primary uppercase">Technical Expertise</h2>
                            </motion.div>

                            <div className="relative group max-w-sm w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search skills..."
                                    value={skillSearch}
                                    onChange={(e) => setSkillSearch(e.target.value)}
                                    className="w-full bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl py-3 pl-12 pr-6 text-xs font-medium focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence mode="popLayout">
                                {skills
                                    .filter(skill =>
                                        skill.category.toLowerCase().includes(skillSearch.toLowerCase()) ||
                                        skill.items?.some(item => item.toLowerCase().includes(skillSearch.toLowerCase()))
                                    )
                                    .map((skill, idx) => (
                                        <motion.div
                                            key={skill.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group relative"
                                        >
                                            <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-700" />
                                            <div className="relative p-10 bg-card/40 backdrop-blur-xl border border-border/40 rounded-[2.5rem] group-hover:border-primary/40 group-hover:translate-y-[-8px] transition-all duration-500">
                                                <div className="flex items-start justify-between mb-10">
                                                    <div className="p-4 bg-muted/50 rounded-[1.25rem] border border-border/40 group-hover:border-primary/30 group-hover:bg-primary/5 transition duration-500">
                                                        {skill.category.toLowerCase().includes('frontend') ? <Cpu className="w-7 h-7 text-primary group-hover:scale-110 transition duration-500" /> :
                                                            skill.category.toLowerCase().includes('backend') ? <Layers className="w-7 h-7 text-emerald-400 group-hover:scale-110 transition duration-500" /> :
                                                                skill.category.toLowerCase().includes('design') ? <Palette className="w-7 h-7 text-pink-400 group-hover:scale-110 transition duration-500" /> :
                                                                    <Database className="w-7 h-7 text-blue-400 group-hover:scale-110 transition duration-500" />}
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <Badge variant="outline" className="text-[9px] tracking-[0.2em] font-black uppercase border-emerald-500/30 text-emerald-500 bg-emerald-500/5 h-6">Expertise</Badge>
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-black text-foreground mb-6 uppercase tracking-tight group-hover:text-primary transition duration-500">{skill.category}</h3>
                                                <div className="flex flex-wrap gap-2.5">
                                                    {skill.items?.map((item, i) => (
                                                        <span key={i} className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-wider text-muted-foreground group-hover:text-white group-hover:border-white/10 transition duration-300">
                                                            {item}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                            </AnimatePresence>
                        </div>
                    </section>

                    <section id="projects" className="space-y-16 pb-32">
                        <div className="flex flex-col gap-10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="flex items-center gap-6"
                                >
                                    <div className="h-[2px] w-16 bg-primary shadow-[0_0_10px_rgba(106,43,255,0.4)]" />
                                    <h2 className="text-sm font-black tracking-[0.4em] text-primary uppercase">Featured Projects</h2>
                                </motion.div>

                                <div className="relative group max-w-sm w-full">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Search projects..."
                                        value={projectSearch}
                                        onChange={(e) => setProjectSearch(e.target.value)}
                                        className="w-full bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl py-3 pl-12 pr-6 text-xs font-medium focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all"
                                    />
                                </div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="flex flex-wrap gap-2"
                            >
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat!)}
                                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${activeCategory === cat
                                                ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20'
                                                : 'bg-card/40 border-border/40 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence mode="popLayout">
                                {projects
                                    .filter(p => activeCategory === 'All' || p.category?.trim().toLowerCase() === activeCategory.toLowerCase())
                                    .filter(p =>
                                        p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
                                        p.description?.toLowerCase().includes(projectSearch.toLowerCase()) ||
                                        p.tech_stack?.some(tech => tech.toLowerCase().includes(projectSearch.toLowerCase()))
                                    )
                                    .map((project, idx) => (
                                        <motion.div
                                            key={project.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: idx * 0.05 }}
                                            className="group h-full"
                                        >
                                            <Link to={`/projects/${project.slug}`} className="block relative h-full">
                                                <div className="absolute inset-x-2 -inset-y-2 bg-primary/5 rounded-[2rem] blur-[40px] opacity-0 group-hover:opacity-100 transition duration-1000" />
                                                <Card className="relative bg-card/40 backdrop-blur-xl border-border/40 rounded-[2rem] overflow-hidden group-hover:border-primary/40 group-hover:translate-y-[-8px] transition-all duration-500 h-full flex flex-col shadow-2xl">
                                                    <div className="aspect-[16/10] overflow-hidden relative border-b border-border/40 shrink-0">
                                                        {project.thumbnail ? (
                                                            <img
                                                                src={getAssetUrl(project.thumbnail)}
                                                                alt={project.title}
                                                                className="w-full h-full object-cover transition duration-700 group-hover:scale-105 opacity-70 group-hover:opacity-100 grayscale-[50%] group-hover:grayscale-0"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                                                <Boxes className="w-12 h-12 text-white/5 group-hover:text-primary/30 transition duration-500" />
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-transparent to-transparent opacity-60" />
                                                        <div className="absolute top-4 left-4 flex gap-2">
                                                            <Badge className="bg-primary/80 hover:bg-primary text-[8px] uppercase tracking-[0.2em] font-black border-none h-6 px-3 shadow-lg shadow-primary/20">{project.category || 'Standard'}</Badge>
                                                        </div>
                                                    </div>
                                                    <CardContent className="p-6 flex flex-col flex-1 space-y-5">
                                                        <div className="space-y-3">

                                                            <Tooltip content={project.title}>
                                                                <h3 className="text-xl font-black text-foreground tracking-tight uppercase group-hover:text-primary transition duration-300 truncate">
                                                                    {project.title}
                                                                </h3>
                                                            </Tooltip>

                                                            {project.description && (
                                                                <p className="text-[11px] text-muted-foreground font-medium leading-relaxed line-clamp-2 italic">
                                                                    {stripHtml(project.description)}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="flex flex-wrap gap-2 mt-auto">
                                                            {project.tech_stack?.slice(0, 3).map((tech, i) => (
                                                                <span key={i} className="text-[9px] font-black text-white/40 uppercase tracking-widest border border-white/5 px-2 py-1 rounded-md bg-white/[0.02]">
                                                                    {tech}
                                                                </span>
                                                            ))}
                                                            {project.tech_stack && project.tech_stack.length > 3 && (
                                                                <span className="text-[9px] font-black text-primary/40 uppercase tracking-widest px-1 py-1">
                                                                    +{project.tech_stack.length - 3}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="pt-2 flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] group-hover:text-primary transition-colors duration-300">
                                                            EXPLORE PROJECT <ArrowRight className="w-3 h-3 group-hover:translate-x-1.5 transition-transform duration-300" />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        </motion.div>
                                    ))}
                            </AnimatePresence>
                        </div>
                    </section>
                </main>

                {/* Root Signature Footer */}
                <footer className="py-24 border-t border-border/40 space-y-24">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-20">
                        <div className="space-y-8 max-w-md">
                            <div className="text-3xl font-black text-foreground tracking-tighter uppercase">
                                Let's Connect<span className="text-primary animate-pulse">.</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
                            </p>
                            <div className="flex gap-6">
                                <a href="https://github.com/anggadewa" target="_blank" rel="noreferrer" className="p-4 bg-white/5 rounded-[1.25rem] border border-white/5 hover:border-primary/40 hover:bg-primary/10 transition-all duration-500 group shadow-lg">
                                    <LinkIcon className="w-6 h-6 text-muted-foreground group-hover:text-white group-hover:scale-110 transition-all" />
                                </a>
                                <a href="https://linkedin.com/in/anggadewantorokekasih" target="_blank" rel="noreferrer" className="p-4 bg-white/5 rounded-[1.25rem] border border-white/5 hover:border-primary/40 hover:bg-primary/10 transition-all duration-500 group shadow-lg">
                                    <Globe className="w-6 h-6 text-muted-foreground group-hover:text-white group-hover:scale-110 transition-all" />
                                </a>
                                <a href="mailto:anggadewa2016@gmail.com" className="p-4 bg-white/5 rounded-[1.25rem] border border-white/5 hover:border-primary/40 hover:bg-primary/10 transition-all duration-500 group shadow-lg">
                                    <Mail className="w-6 h-6 text-muted-foreground group-hover:text-white group-hover:scale-110 transition-all" />
                                </a>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-16 lg:gap-32">
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-primary tracking-[0.4em] uppercase">Navigation</h4>
                                <ul className="space-y-4 text-[11px] font-bold tracking-widest uppercase">
                                    <li>
                                        <button
                                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                            className="text-muted-foreground hover:text-primary transition group flex items-center gap-3 uppercase"
                                        >
                                            <div className="w-1.5 h-1.5 bg-muted group-hover:bg-primary transition-all rounded-full" />
                                            Home
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-primary tracking-[0.4em] uppercase">Status</h4>
                                <div className="space-y-4 text-[11px] font-bold tracking-widest uppercase">
                                    <div className="flex items-center gap-3 text-muted-foreground/60"><div className="w-1.5 h-1.5 bg-muted rounded-full" /> Version: 2.0.0</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="text-[10px] font-black text-muted-foreground/60 tracking-[0.3em] uppercase">
                            © {new Date().getFullYear()} Angga Dewa. All rights reserved.
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
