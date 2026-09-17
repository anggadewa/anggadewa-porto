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
    LayoutDashboard,
    Boxes,
    FileText,
    Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardHome() {
    const [stats, setStats] = useState({
        projects: 0,
        skills: 0,
        techStack: 0,
        productCases: 0,
        productDocuments: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        const [
            { count: projectCount },
            { data: skillsData },
            { count: productCasesCount },
            { count: productDocumentsCount }
        ] = await Promise.all([
            supabase.from('projects').select('*', { count: 'exact', head: true }),
            supabase.from('skills').select('items'),
            supabase.from('product_case_studies').select('*', { count: 'exact', head: true }),
            supabase.from('product_documents').select('*', { count: 'exact', head: true })
        ]);

        let techCount = 0;
        skillsData?.forEach(skill => {
            if (Array.isArray(skill.items)) techCount += skill.items.length;
        });

        setStats({
            projects: projectCount || 0,
            skills: skillsData?.length || 0,
            techStack: techCount,
            productCases: productCasesCount || 0,
            productDocuments: productDocumentsCount || 0
        });
        setLoading(false);
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
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
                className="relative overflow-hidden rounded-[2.5rem] bg-white border border-zinc-200 p-10 lg:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
                <div className="relative z-10 space-y-6">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-[9px] font-black uppercase tracking-[0.2em] shadow-sm">
                        <Activity className="w-3.5 h-3.5 animate-pulse" />
                        Platform Status: Operational
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-zinc-900 tracking-tighter leading-none">
                        Welcome Back, <span className="text-primary italic">Dewa!</span>
                    </h1>
                    <p className="text-zinc-500 max-w-2xl text-base lg:text-lg font-medium leading-relaxed">
                        Manage your digital presence, developer projects, and product management showcase.
                        Your project database, bootcamp documents, and skill matrix are synchronized.
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {/* Dev Projects */}
                <motion.div variants={item}>
                    <Link to="/admin/projects" className="block group">
                        <Card className="bg-white border-zinc-200 shadow-sm rounded-[2rem] p-7 hover:border-primary/40 hover:shadow-md transition-all overflow-hidden relative">
                            <div className="relative z-10 flex flex-col gap-5">
                                <div className="p-3 bg-primary/5 rounded-2xl w-fit group-hover:scale-110 transition-transform border border-primary/10">
                                    <Briefcase className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Dev Projects</div>
                                    <div className="text-3xl font-black text-zinc-900 tracking-tighter">{stats.projects}</div>
                                </div>
                            </div>
                            <div className="absolute -bottom-4 -right-4 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity">
                                <Briefcase className="w-28 h-28 text-zinc-900" />
                            </div>
                        </Card>
                    </Link>
                </motion.div>

                {/* Product Cases */}
                <motion.div variants={item}>
                    <Link to="/admin/product" className="block group">
                        <Card className="bg-white border-zinc-200 shadow-sm rounded-[2rem] p-7 hover:border-blue-500/40 hover:shadow-md transition-all overflow-hidden relative">
                            <div className="relative z-10 flex flex-col gap-5">
                                <div className="p-3 bg-blue-50 rounded-2xl w-fit group-hover:scale-110 transition-transform border border-blue-100">
                                    <Boxes className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Product Cases</div>
                                    <div className="text-3xl font-black text-zinc-900 tracking-tighter">{stats.productCases}</div>
                                </div>
                            </div>
                            <div className="absolute -bottom-4 -right-4 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity">
                                <Boxes className="w-28 h-28 text-zinc-900" />
                            </div>
                        </Card>
                    </Link>
                </motion.div>

                {/* Bootcamp Documents */}
                <motion.div variants={item}>
                    <Link to="/admin/product/documents" className="block group">
                        <Card className="bg-white border-zinc-200 shadow-sm rounded-[2rem] p-7 hover:border-amber-500/40 hover:shadow-md transition-all overflow-hidden relative">
                            <div className="relative z-10 flex flex-col gap-5">
                                <div className="p-3 bg-amber-50 rounded-2xl w-fit group-hover:scale-110 transition-transform border border-amber-100">
                                    <FileText className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Bootcamp PDFs</div>
                                    <div className="text-3xl font-black text-zinc-900 tracking-tighter">{stats.productDocuments}</div>
                                </div>
                            </div>
                            <div className="absolute -bottom-4 -right-4 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity">
                                <FileText className="w-28 h-28 text-zinc-900" />
                            </div>
                        </Card>
                    </Link>
                </motion.div>

                {/* Tech & Skills */}
                <motion.div variants={item}>
                    <Link to="/admin/skills" className="block group">
                        <Card className="bg-white border-zinc-200 shadow-sm rounded-[2rem] p-7 hover:border-emerald-500/40 hover:shadow-md transition-all overflow-hidden relative">
                            <div className="relative z-10 flex flex-col gap-5">
                                <div className="p-3 bg-emerald-50 rounded-2xl w-fit group-hover:scale-110 transition-transform border border-emerald-100">
                                    <Code2 className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">Skills / Tech</div>
                                    <div className="text-3xl font-black text-zinc-900 tracking-tighter">{stats.techStack}</div>
                                </div>
                            </div>
                            <div className="absolute -bottom-4 -right-4 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity">
                                <Code2 className="w-28 h-28 text-zinc-900" />
                            </div>
                        </Card>
                    </Link>
                </motion.div>
            </motion.div>

            {/* Product Portfolio Control & Resume Management */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
                {/* Product Section Hub Card */}
                <Card className="lg:col-span-2 bg-gradient-to-br from-white to-zinc-50 border-zinc-200 shadow-sm rounded-[2.5rem] p-8 lg:p-10 flex flex-col justify-between space-y-6 relative overflow-hidden">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-xl bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest">
                            <Boxes className="w-3.5 h-3.5" />
                            Product Management Showcase
                        </div>
                        <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Product Portfolio & Bootcamp Center</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed max-w-xl font-medium">
                            Manage case studies transformed from developer projects or built from scratch. Upload and manage your Harisenin.com PM bootcamp deliverables with downloadable PDFs.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                        <Link to="/admin/product/new">
                            <Button className="h-12 rounded-xl bg-primary px-5 text-[10px] font-black uppercase tracking-widest text-white shadow-md shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                                <Plus className="w-3.5 h-3.5 mr-2" />
                                Add Product Case
                            </Button>
                        </Link>
                        <Link to="/admin/product/documents/new">
                            <Button variant="outline" className="h-12 rounded-xl border-zinc-200 bg-white px-5 text-[10px] font-black uppercase tracking-widest text-zinc-700 hover:bg-zinc-100">
                                <UploadCloud className="w-3.5 h-3.5 mr-2" />
                                Upload Bootcamp PDF
                            </Button>
                        </Link>
                        <Link to="/admin/product">
                            <Button variant="ghost" className="h-12 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900">
                                View Cases ({stats.productCases}) <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                        </Link>
                    </div>
                </Card>

                {/* Resume Management */}
                <Card className="lg:col-span-1 bg-white border-zinc-200 shadow-sm rounded-[2.5rem] overflow-hidden flex flex-col justify-between">
                    <CardHeader className="p-8 pb-4 border-b border-zinc-100">
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
                    <CardContent className="p-8 space-y-4">
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                            Upload versi baru, cek PDF aktif, dan pulihkan versi sebelumnya dari satu tempat.
                        </p>
                        <Link to="/admin/resume" className="block">
                            <Button variant="outline" className="w-full h-14 bg-zinc-50 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 text-zinc-600 text-[10px] font-black tracking-[0.2em] uppercase rounded-xl transition-all">
                                <UploadCloud className="w-4 h-4 mr-3" />
                                Manage Resume
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
