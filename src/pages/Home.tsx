import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Terminal, 
    Wifi, 
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
    Globe
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getAssetUrl } from '@/lib/assets';
import { stripHtml } from '@/lib/utils';
import { Project, Skill } from '@/types';
import { Tooltip } from '@/components/ui/tooltip-custom';

export default function Home() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);

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
        <div className="relative min-h-screen bg-[#06080B] text-gray-300 font-mono overflow-x-hidden selection:bg-primary/30 selection:text-primary">
            {/* Scanline Effect */}
            <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                <div className="scanline opacity-[0.05]" />
            </div>

            {/* Background Vibe */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-[#06080B]">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[150px] rounded-full animate-pulse" />
                <div 
                    className="absolute inset-0 opacity-[0.03]" 
                    style={{
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}
                />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                {/* System Header */}
                <header className="sticky top-0 z-40 w-full backdrop-blur-xl border-b border-white/5 py-5 flex justify-between items-center px-4 bg-[#06080B]/60">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                            <span className="text-[9px] font-black tracking-[0.2em] text-emerald-500 uppercase">SYSTEM_ONLINE</span>
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-[9px] text-muted-foreground uppercase tracking-[0.3em] font-bold">
                            <Wifi className="w-3 h-3 text-primary/60" />
                            <span>NODE: ALPHA_DIRECT_STABLE</span>
                        </div>
                    </div>

                    <div className="text-xl font-black tracking-tighter text-white hover:text-primary transition-all duration-300 cursor-default select-none group">
                        .DEW<span className="text-primary group-hover:text-glow transition-all duration-300">()</span>.IS<span className="text-primary group-hover:text-glow transition-all duration-300">()</span>
                    </div>
                </header>

                <main className="py-24 lg:py-40 space-y-48">
                    {/* Hero Protocol */}
                    <section className="relative">
                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="max-w-5xl space-y-12"
                        >
                            <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-4 py-2 bg-primary/5 border border-primary/20 rounded-2xl backdrop-blur-sm">
                                <Binary className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-black tracking-[0.3em] text-primary uppercase terminal-effect">Connection_Handshake: 127.0.0.1</span>
                            </motion.div>

                            <motion.div variants={itemVariants} className="space-y-6">
                                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-none tracking-tight">
                                    GREETINGS, <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-emerald-400 text-glow">OPERATOR.</span>
                                </h1>
                                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed font-sans font-medium">
                                    Compiling high-bandwidth digital visions into production-grade reality. 
                                    As a <span className="text-white border-b-2 border-primary/40 pb-1">Frontend Team Lead</span>, I specialize in crafting fluid system architectures that scale.
                                </p>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex flex-wrap gap-5 pt-6">
                                <Button 
                                    onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="h-16 px-10 rounded-[1.5rem] bg-primary hover:bg-primary/90 text-white text-xs font-black tracking-[0.2em] group border-glow shadow-[0_0_30px_rgba(106,43,255,0.2)]"
                                >
                                    INITIALIZE_VIEW
                                    <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                                </Button>
                                <a href={`${getAssetUrl('cv.pdf')}?v=${Date.now()}`} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" className="h-16 px-10 rounded-[1.5rem] border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-black tracking-[0.2em]">
                                        DOWNLOAD_LOGS (CV)
                                    </Button>
                                </a>
                            </motion.div>
                        </motion.div>
                    </section>

                    {/* Capability Nodes (Skills) */}
                    <section className="space-y-16">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-6"
                        >
                            <div className="h-[2px] w-16 bg-primary shadow-[0_0_10px_rgba(106,43,255,0.8)]" />
                            <h2 className="text-xs font-black tracking-[0.5em] text-primary uppercase">Capability_Protocol_Modules</h2>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {skills.map((skill, idx) => (
                                <motion.div 
                                    key={skill.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group relative"
                                >
                                    <div className="absolute inset-0 bg-primary/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-700" />
                                    <div className="relative p-10 bg-[#0D1117]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] group-hover:border-primary/40 group-hover:translate-y-[-8px] transition-all duration-500">
                                        <div className="flex items-start justify-between mb-10">
                                            <div className="p-4 bg-white/5 rounded-[1.25rem] border border-white/5 group-hover:border-primary/30 group-hover:bg-primary/5 transition duration-500">
                                                {skill.category.toLowerCase().includes('frontend') ? <Cpu className="w-7 h-7 text-primary group-hover:scale-110 transition duration-500" /> : 
                                                 skill.category.toLowerCase().includes('backend') ? <Layers className="w-7 h-7 text-emerald-400 group-hover:scale-110 transition duration-500" /> :
                                                 skill.category.toLowerCase().includes('design') ? <Palette className="w-7 h-7 text-pink-400 group-hover:scale-110 transition duration-500" /> :
                                                 <Database className="w-7 h-7 text-blue-400 group-hover:scale-110 transition duration-500" />}
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <Badge variant="outline" className="text-[9px] tracking-[0.2em] font-black uppercase border-emerald-500/30 text-emerald-500 bg-emerald-500/5 h-6">Active</Badge>
                                                <span className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold">Class: S</span>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tight group-hover:text-glow transition duration-500">{skill.category}</h3>
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
                        </div>
                    </section>

                    {/* Node Gallery (Projects) */}
                    <section id="projects" className="space-y-16 pb-32">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-6"
                        >
                            <div className="h-[2px] w-16 bg-primary shadow-[0_0_10px_rgba(106,43,255,0.8)]" />
                            <h2 className="text-xs font-black tracking-[0.5em] text-primary uppercase">Production_Ready_Nodes</h2>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects.map((project, idx) => (
                                <motion.div 
                                    key={project.id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.15 }}
                                    className="group h-full"
                                >
                                    <Link to={`/projects/${project.slug}`} className="block relative h-full">
                                        <div className="absolute inset-x-2 -inset-y-2 bg-primary/10 rounded-[2rem] blur-[40px] opacity-0 group-hover:opacity-100 transition duration-1000" />
                                        <Card className="relative bg-[#0D1117]/40 backdrop-blur-xl border-white/5 rounded-[2rem] overflow-hidden group-hover:border-primary/40 group-hover:translate-y-[-8px] transition-all duration-500 h-full flex flex-col shadow-2xl">
                                            <div className="aspect-[16/10] overflow-hidden relative border-b border-white/5 shrink-0">
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
                                                    <div className="flex items-center gap-2 text-[9px] text-primary/70 font-black uppercase tracking-[0.2em] terminal-effect">
                                                        <Terminal className="w-3 h-3" />
                                                        ID: {String(project.id).slice(0, 8).toUpperCase()}
                                                    </div>
                                                    
                                                    <Tooltip content={project.title}>
                                                        <h3 className="text-xl font-black text-white tracking-tight uppercase group-hover:text-primary transition duration-300 truncate">
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

                                                <div className="pt-2 flex items-center gap-2 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em] group-hover:text-primary transition-colors duration-300">
                                                    CONNECT <ArrowRight className="w-3 h-3 group-hover:translate-x-1.5 transition-transform duration-300" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </main>

                {/* Root Signature Footer */}
                <footer className="py-24 border-t border-white/5 space-y-24">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-20">
                        <div className="space-y-8 max-w-md">
                            <div className="text-3xl font-black text-white tracking-tighter uppercase">
                                ROOT.SIGNATURE<span className="text-primary animate-pulse">_</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed font-medium font-sans">
                                High-bandwidth architectural logic compiled for modern visionary requirements. 
                                Optimized for performance, obsession, and fidelity.
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
                                <h4 className="text-[10px] font-black text-primary tracking-[0.4em] uppercase">INTERNAL_PORTS</h4>
                                <ul className="space-y-4 text-[11px] font-bold tracking-widest uppercase">
                                    <li><Link to="/" className="text-muted-foreground hover:text-white transition group flex items-center gap-3"><div className="w-1.5 h-1.5 bg-white/10 group-hover:bg-primary group-hover:shadow-[0_0_8px_rgba(106,43,255,0.8)] rounded-full transition-all" /> ROOT_LOG</Link></li>
                                </ul>
                            </div>
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-primary tracking-[0.4em] uppercase">SYSTEM_METRICS</h4>
                                <div className="space-y-4 text-[11px] font-bold tracking-widest uppercase">
                                    <div className="flex items-center gap-3 text-emerald-500/80"><div className="w-1.5 h-1.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] rounded-full" /> LINK: STABLE</div>
                                    <div className="flex items-center gap-3 text-muted-foreground/60"><div className="w-1.5 h-1.5 bg-white/10 rounded-full" /> VER: 1.0.1_DEV</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="text-[10px] font-black text-muted-foreground/60 tracking-[0.3em] uppercase">
                            © {new Date().getFullYear()} DEWA_COMMAND_CENTER // EXECUTING_VISIONARY_LOGIC
                        </div>
                        <div className="text-[10px] text-primary/40 font-black italic tracking-widest uppercase border border-primary/20 px-4 py-2 rounded-full backdrop-blur-sm">
                            NODE_IDENT: ALPHA_7_GLOBAL
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
