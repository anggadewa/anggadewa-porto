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
                className="relative overflow-hidden rounded-[2.5rem] bg-white border border-zinc-200 p-12 lg:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
                <div className="relative z-10 space-y-6">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-[9px] font-black uppercase tracking-[0.2em] shadow-sm">
                        <Activity className="w-3.5 h-3.5 animate-pulse" />
                        Platform Status: Operational
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-black text-zinc-900 tracking-tighter leading-none">
                        Welcome Back, <span className="text-primary italic">Dewa!</span>.
                    </h1>
                    <p className="text-zinc-500 max-w-2xl text-lg font-medium leading-relaxed">
                        Manage your professional digital presence and refine your portfolio showcase.
                        Your project database and skill matrix are fully synchronized and ready for updates.
                    </p>
                </div>

                {/* Ambient Visuals */}
                <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                    <LayoutDashboard className="w-64 h-64 text-zinc-900" />
                </div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
            </motion.section>

            {/* Quick Analytics / Stats Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                <motion.div variants={item}>
                    <Card className="bg-white border-zinc-200 shadow-sm rounded-[2rem] p-8 hover:border-primary/30 hover:shadow-md transition-all group overflow-hidden relative">
                        <div className="relative z-10 flex flex-col gap-6">
                            <div className="p-3 bg-primary/5 rounded-2xl w-fit group-hover:scale-110 transition-transform border border-primary/10">
                                <Briefcase className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">Total Projects</div>
                                <div className="text-4xl font-black text-zinc-900 tracking-tighter">{stats.projects}</div>
                            </div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity">
                            <Briefcase className="w-32 h-32 text-zinc-900" />
                        </div>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="bg-white border-zinc-200 shadow-sm rounded-[2rem] p-8 hover:border-violet-500/30 hover:shadow-md transition-all group overflow-hidden relative">
                        <div className="relative z-10 flex flex-col gap-6">
                            <div className="p-3 bg-violet-50 rounded-2xl w-fit group-hover:scale-110 transition-transform border border-violet-100">
                                <Zap className="w-6 h-6 text-violet-500" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">Skill Domains</div>
                                <div className="text-4xl font-black text-zinc-900 tracking-tighter">{stats.skills}</div>
                            </div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity">
                            <Zap className="w-32 h-32 text-zinc-900" />
                        </div>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="bg-white border-zinc-200 shadow-sm rounded-[2rem] p-8 hover:border-emerald-500/30 hover:shadow-md transition-all group overflow-hidden relative">
                        <div className="relative z-10 flex flex-col gap-6">
                            <div className="p-3 bg-emerald-50 rounded-2xl w-fit group-hover:scale-110 transition-transform border border-emerald-100">
                                <Code2 className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">Technologies</div>
                                <div className="text-4xl font-black text-zinc-900 tracking-tighter">{stats.techStack}</div>
                            </div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity">
                            <Code2 className="w-32 h-32 text-zinc-900" />
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
                <Card className="lg:col-span-1 bg-white border-zinc-200 shadow-sm rounded-[2rem] overflow-hidden">
                    <CardHeader className="p-8 pb-6 border-b border-zinc-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
                                <UploadCloud className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-[11px] font-black tracking-[0.2em] text-zinc-900 uppercase">Resume Manager</h2>
                                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">Update Master PDF</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
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
                                className="w-full h-14 bg-zinc-50 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 text-zinc-600 text-[10px] font-black tracking-[0.2em] uppercase rounded-xl transition-all"
                                disabled={uploadingCV}
                            >
                                {uploadingCV ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-3 animate-spin text-primary" />
                                        Updating File...
                                    </>
                                ) : (
                                    <>
                                        <UploadCloud className="w-4 h-4 mr-3" />
                                        Upload New Resume
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2 p-10 bg-white border border-zinc-200 shadow-sm rounded-[2rem] flex flex-col justify-center space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-[13px] font-black text-zinc-900 uppercase tracking-widest">Quick Portfolio Review</h3>
                    </div>
                    <p className="text-zinc-500 text-sm leading-relaxed max-w-xl">
                        Your portfolio is currently live and optimized. You have <span className="text-zinc-900 font-black">{stats.projects} featured projects</span> being showcased
                        to potential recruiters. Ensure your latest experience is reflected in your uploaded resume for the best conversion.
                    </p>
                    <div className="flex gap-4">
                        <Link to="/admin/projects">
                            <Button variant="link" className="text-primary text-[10px] font-black uppercase tracking-widest p-0 flex items-center gap-2 hover:opacity-80">
                                Manage Projects <ArrowUpRight className="w-3.5 h-3.5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
