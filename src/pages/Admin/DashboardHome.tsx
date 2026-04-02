import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
    Activity, 
    Briefcase, 
    Terminal, 
    Code2, 
    Cpu, 
    Zap,
    ArrowUpRight,
    UploadCloud,
    Loader2
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
        <div className="space-y-10">
            {/* Welcome Banner */}
            <motion.section 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-blue-900/10 to-transparent border border-white/5 p-10 lg:p-14"
            >
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-6">
                        <Activity className="w-3 h-3 animate-pulse" />
                        System_Live_Status
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter mb-4 leading-tight">
                        Greetings, <span className="text-primary italic">Operator</span>. <br />
                        Base_Station_Alpha is Under_Command.
                    </h1>
                    <p className="text-gray-400 max-w-xl text-lg font-medium leading-relaxed">
                        Welcome to the neural core of your portfolio. All subsystems are operational. 
                        Data integrity verified. You have full root access to all project nodes.
                    </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 p-10 opacity-30">
                    <Cpu className="w-48 h-48 text-primary/20" />
                </div>
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px]" />
            </motion.section>


            {/* Quick Actions (CV Upload) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                <Card className="bg-[#0D1117]/60 border-gray-800/50 rounded-[2rem]">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
                                <UploadCloud className="w-5 h-5" />
                            </div>
                            <h2 className="text-sm font-black tracking-[0.2em] text-white uppercase">System_File: CV</h2>
                        </div>
                        <p className="text-[11px] text-gray-500 tracking-widest uppercase font-bold">Override active curriculum vitae</p>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
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
                                className="w-full h-14 bg-white/5 border-white/10 hover:bg-white/10 text-xs font-black tracking-widest uppercase"
                                disabled={uploadingCV}
                            >
                                {uploadingCV ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-3 animate-spin" />
                                        UPLOADING_NODE...
                                    </>
                                ) : (
                                    <>
                                        <UploadCloud className="w-4 h-4 mr-3" />
                                        SELECT_PDF_FILE
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Recent Activity / System Log Style */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-[#0D1117]/40 border border-gray-800/50 rounded-[2rem] p-8 lg:p-10"
            >
                <div className="flex items-center gap-2 mb-8">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <h2 className="text-xs font-black tracking-[0.3em] text-gray-400 uppercase">System_Log_Summary</h2>
                </div>
                
                <div className="space-y-4 font-mono text-[13px]">
                    <div className="flex items-start gap-4">
                        <span className="text-gray-600 shrink-0">[23:07:02]</span>
                        <span className="text-emerald-500">Session_Authenticated:</span>
                        <span className="text-gray-400 leading-relaxed italic">User AU granted full administrative privileges via secure terminal handshake.</span>
                    </div>
                    <div className="flex items-start gap-4">
                        <span className="text-gray-600 shrink-0">[23:06:55]</span>
                        <span className="text-blue-500">DB_Checksum:</span>
                        <span className="text-gray-400 leading-relaxed">Supabase project 'DewaPortoWeb' connection established. latency: 42ms. status: OPTIMAL.</span>
                    </div>
                    <div className="flex items-start gap-4">
                        <span className="text-gray-600 shrink-0">[23:06:45]</span>
                        <span className="text-primary">UI_Engine:</span>
                        <span className="text-gray-400 leading-relaxed">Vite dev server running at <a href="http://localhost:5173" className="text-primary hover:underline">http://localhost:5173</a>. HMR enabled.</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
