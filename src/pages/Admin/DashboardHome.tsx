import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import {
    Activity,
    Briefcase,
    Code2,
    Zap,
    ArrowUpRight,
    UploadCloud,
    Loader2,
    LayoutDashboard
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardHome() {
    const [stats, setStats] = useState({
        projects: 0,
        skills: 0,
        techStack: 0
    });
    const [loading, setLoading] = useState(true);
    const [uploadingCV, setUploadingCV] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const handleCVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploadingCV(true);
            const bucketName = import.meta.env.VITE_STORAGE_BUCKET_NAME || 'portfolio-assets';

            const { error } = await supabase.storage
                .from(bucketName)
                .upload('cv.pdf', file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (error) throw error;
            alert('CV Uploaded successfully!');
        } catch (error) {
            console.error('Error uploading CV:', error);
            alert('Failed to upload CV');
        } finally {
            setUploadingCV(false);
            if (event.target) {
                event.target.value = '';
            }
        }
    };

    const fetchStats = async () => {
        setLoading(true);
        const { count: projectCount } = await supabase.from('projects').select('*', { count: 'exact', head: true });
        const { data: skillsData } = await supabase.from('skills').select('items');

        let techCount = 0;
        skillsData?.forEach(skill => {
            if (Array.isArray(skill.items)) techCount += skill.items.length;
        });

        setStats({
            projects: projectCount || 0,
            skills: skillsData?.length || 0,
            techStack: techCount
        });
        setLoading(false);
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-12">
            {/* Professional Welcome Banner */}
            <motion.section
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-primary/10 via-background to-background border border-white/5 p-12 lg:p-16 shadow-2xl"
            >
                <div className="relative z-10 space-y-6">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase tracking-[0.2em]">
                        <Activity className="w-3.5 h-3.5 animate-pulse" />
                        Platform Status: Operational
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none">
                        Welcome Back, <span className="text-primary italic">Dewa!</span>.
                    </h1>
                    <p className="text-gray-400 max-w-2xl text-lg font-medium leading-relaxed opacity-80">
                        Manage your professional digital presence and refine your portfolio showcase.
                        Your project database and skill matrix are fully synchronized and ready for updates.
                    </p>
                </div>

                {/* Ambient Visuals */}
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <LayoutDashboard className="w-64 h-64 text-primary" />
                </div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[140px]" />
            </motion.section>

            {/* Quick Analytics / Stats Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                <motion.div variants={item}>
                    <Card className="bg-[#0D1117]/40 border-white/5 rounded-[2.5rem] p-8 hover:border-primary/30 transition-all group overflow-hidden relative">
                        <div className="relative z-10 flex flex-col gap-6">
                            <div className="p-3 bg-primary/10 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                                <Briefcase className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Total Projects</div>
                                <div className="text-4xl font-black text-white tracking-tighter">{stats.projects}</div>
                            </div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <Briefcase className="w-32 h-32 text-white" />
                        </div>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="bg-[#0D1117]/40 border-white/5 rounded-[2.5rem] p-8 hover:border-violet-500/30 transition-all group overflow-hidden relative">
                        <div className="relative z-10 flex flex-col gap-6">
                            <div className="p-3 bg-violet-500/10 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                                <Zap className="w-6 h-6 text-violet-500" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Skill Domains</div>
                                <div className="text-4xl font-black text-white tracking-tighter">{stats.skills}</div>
                            </div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <Zap className="w-32 h-32 text-white" />
                        </div>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="bg-[#0D1117]/40 border-white/5 rounded-[2.5rem] p-8 hover:border-emerald-500/30 transition-all group overflow-hidden relative">
                        <div className="relative z-10 flex flex-col gap-6">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                                <Code2 className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Technologies</div>
                                <div className="text-4xl font-black text-white tracking-tighter">{stats.techStack}</div>
                            </div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <Code2 className="w-32 h-32 text-white" />
                        </div>
                    </Card>
                </motion.div>
            </motion.div>

            {/* Resume Management */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
                <Card className="lg:col-span-1 bg-[#0D1117]/60 border-white/5 rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-10 pb-6">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 shadow-xl shadow-amber-500/5">
                                <UploadCloud className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xs font-black tracking-[0.3em] text-white uppercase">Resume Manager</h2>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 opacity-60">Update Master PDF</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="px-10 pb-10">
                        <div className="relative">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleCVUpload}
                                disabled={uploadingCV}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                            />
                            <Button
                                variant="outline"
                                className="w-full h-16 bg-white/5 border-white/10 hover:bg-white/10 text-[10px] font-black tracking-[0.3em] uppercase rounded-2xl"
                                disabled={uploadingCV}
                            >
                                {uploadingCV ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-4 animate-spin" />
                                        Updating File...
                                    </>
                                ) : (
                                    <>
                                        <UploadCloud className="w-4 h-4 mr-4" />
                                        Upload New Resume
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2 p-10 bg-white/5 border border-white/5 rounded-[2.5rem] flex flex-col justify-center space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Zap className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-black text-white uppercase tracking-tight">Quick Portfolio Review</h3>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
                        Your portfolio is currently live and optimized. You have <span className="text-white font-bold">{stats.projects} featured projects</span> being showcased
                        to potential recruiters. Ensure your latest experience is reflected in your uploaded resume for the best conversion.
                    </p>
                    <div className="flex gap-4">
                        <Link to="/admin/projects">
                            <Button variant="link" className="text-primary text-[10px] font-black uppercase tracking-widest p-0 flex items-center gap-2">
                                Manage Projects <ArrowUpRight className="w-3.5 h-3.5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
