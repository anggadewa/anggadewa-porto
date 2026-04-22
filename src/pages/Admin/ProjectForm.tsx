import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Project } from '@/types';
import { 
    Save, 
    ChevronLeft, 
    Image as ImageIcon, 
    X, 
    Loader2, 
    Plus,
    Code2,
    LayoutPanelTop,
    Type,
    Link2,
    Calendar,
    Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getAssetUrl } from '@/lib/assets';
import { cn } from '@/lib/utils';

interface ProjectFormProps {
    onSave?: () => void;
}

export default function ProjectForm({ onSave }: ProjectFormProps) {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState<Partial<Project>>({
        title: '',
        slug: '',
        category: '',
        description: '',
        role: '',
        timeline: '',
        key_features: [],
        thumbnail: null,
        images: [],
        tech_stack: [],
        is_featured: false
    });

    const [techInput, setTechInput] = useState('');
    const [featureInput, setFeatureInput] = useState('');

    useEffect(() => {
        if (id) {
            fetchProject();
        }
    }, [id]);

    const fetchProject = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();
        
        if (data) {
            setFormData(data);
        }
        setLoading(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'thumbnail' | 'gallery') => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setSaving(true);
        const folder = type === 'thumbnail' ? 'thumbnails' : 'gallery';
        const bucketName = import.meta.env.VITE_STORAGE_BUCKET_NAME || 'portfolio-assets';

        for (const file of Array.from(files)) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `projects/${folder}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file);

            if (uploadError) {
                alert('Error uploading: ' + uploadError.message);
                continue;
            }

            if (type === 'thumbnail') {
                setFormData(prev => ({ ...prev, thumbnail: filePath }));
            } else {
                setFormData(prev => ({ ...prev, images: [...(prev.images || []), filePath] }));
            }
        }
        setSaving(false);
    };

    const handleRemoveImage = (path: string, type: 'thumbnail' | 'gallery') => {
        if (type === 'thumbnail') {
            setFormData(prev => ({ ...prev, thumbnail: null }));
        } else {
            setFormData(prev => ({ ...prev, images: (prev.images || []).filter(img => img !== path) }));
        }
    };

    const handleAddTech = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && techInput.trim()) {
            e.preventDefault();
            if (!(formData.tech_stack || []).includes(techInput.trim())) {
                setFormData(prev => ({ ...prev, tech_stack: [...(prev.tech_stack || []), techInput.trim()] }));
            }
            setTechInput('');
        }
    };

    const handleRemoveTech = (tech: string) => {
        setFormData(prev => ({ ...prev, tech_stack: (prev.tech_stack || []).filter(t => t !== tech) }));
    };

    const handleAddFeature = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && featureInput.trim()) {
            e.preventDefault();
            if (!(formData.key_features || []).includes(featureInput.trim())) {
                setFormData(prev => ({ ...prev, key_features: [...(prev.key_features || []), featureInput.trim()] }));
            }
            setFeatureInput('');
        }
    };

    const handleRemoveFeature = (feature: string) => {
        setFormData(prev => ({ ...prev, key_features: (prev.key_features || []).filter(f => f !== feature) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const { id: _, created_at: __, ...updatePayload } = formData;
        const projectData = {
            ...updatePayload,
            updated_at: new Date().toISOString()
        };

        let error;
        if (id) {
            const { error: updateError } = await supabase
                .from('projects')
                .update(projectData)
                .eq('id', id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from('projects')
                .insert([projectData]);
            error = insertError;
        }

        if (error) {
            alert('Error saving project: ' + error.message);
        } else {
            if (onSave) onSave();
            navigate('/admin/projects');
        }
        setSaving(false);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 gap-6">
            <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg shadow-primary/20"></div>
            <span className="text-[10px] font-black tracking-[0.4em] text-primary animate-pulse uppercase">Syncing Database...</span>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-32">
            {/* Form Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <Link to="/admin/projects">
                        <Button variant="ghost" size="sm" className="h-14 w-14 rounded-2xl text-gray-500 hover:text-white bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                    </Link>
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
                            {id ? 'Modify Project' : 'Create Project'}
                        </h1>
                        <p className="text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase opacity-60 italic">Configure project documentation and media assets</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button 
                        onClick={handleSubmit}
                        disabled={saving}
                        className="h-16 bg-primary hover:bg-primary/90 text-white font-black px-12 rounded-2xl shadow-2xl shadow-primary/20 gap-4 border-none text-[11px] tracking-[0.2em] uppercase transition-all hover:-translate-y-1"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Publish Changes
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#0D1117]/60 border border-white/5 rounded-[2.5rem] p-10 lg:p-14 space-y-12 shadow-2xl"
                    >
                        <div className="space-y-10">
                            {/* Title Field */}
                            <div className="relative group">
                                <label className="absolute -top-3 left-6 px-3 bg-[#0D1117] text-[10px] font-black text-primary uppercase tracking-[0.2em] z-10">Project Title</label>
                                <div className="relative">
                                    <Type className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-primary transition-colors" />
                                    <Input 
                                        value={formData.title}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const title = e.target.value;
                                            setFormData(prev => ({ 
                                                ...prev, 
                                                title, 
                                                slug: title.toLowerCase().replace(/\s+/g, '-')
                                            }));
                                        }}
                                        className="h-16 pl-16 rounded-2xl bg-white/[0.02] border-white/5 focus:border-primary/50 text-white font-black text-lg tracking-tight placeholder:text-gray-800"
                                        required
                                        placeholder="e.g. Modern E-Commerce Platform"
                                    />
                                </div>
                            </div>

                            {/* Role & Timeline Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="relative group">
                                    <label className="absolute -top-3 left-6 px-3 bg-[#0D1117] text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] z-10">Your Role</label>
                                    <div className="relative">
                                        <Code2 className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-primary transition-colors" />
                                        <Input 
                                            value={formData.role || ''}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                                            className="h-16 pl-16 rounded-2xl bg-white/[0.02] border-white/5 focus:border-primary/50 text-white font-bold text-sm uppercase tracking-widest placeholder:text-gray-800"
                                            placeholder="e.g. Lead Fullstack"
                                        />
                                    </div>
                                </div>
                                <div className="relative group">
                                    <label className="absolute -top-3 left-6 px-3 bg-[#0D1117] text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] z-10">Timeline</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-primary transition-colors" />
                                        <Input 
                                            value={formData.timeline || ''}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                                            className="h-16 pl-16 rounded-2xl bg-white/[0.02] border-white/5 focus:border-primary/50 text-white font-bold text-sm uppercase tracking-widest placeholder:text-gray-800"
                                            placeholder="e.g. 2023 - 2024"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Description Field */}
                            <div className="relative group">
                                <label className="absolute -top-3 left-6 px-3 bg-[#0D1117] text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] z-10">Project Overview (HTML Supported)</label>
                                <textarea 
                                    value={formData.description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full h-80 rounded-3xl bg-white/[0.02] border border-white/5 focus:border-primary/50 p-8 pt-10 text-gray-300 text-sm leading-relaxed outline-none transition-all resize-none custom-scrollbar shadow-inner"
                                    placeholder="Provide a comprehensive breakdown of the project goals, challenges, and solutions..."
                                />
                            </div>

                            {/* Key Features List */}
                            <div className="space-y-6">
                                <div className="relative group">
                                    <label className="absolute -top-3 left-6 px-3 bg-[#0D1117] text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] z-10">Key Features & Highlights</label>
                                    <div className="relative">
                                        <Plus className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                                        <Input 
                                            value={featureInput}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFeatureInput(e.target.value)}
                                            onKeyDown={handleAddFeature}
                                            className="h-16 pl-16 rounded-2xl bg-white/[0.02] border-white/5 focus:border-primary/50 text-white font-bold text-sm tracking-widest placeholder:text-gray-800"
                                            placeholder="Add a key feature and press Enter..."
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <AnimatePresence>
                                        {formData.key_features?.map((feature, i) => (
                                            <motion.div
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                exit={{ x: 20, opacity: 0 }}
                                                key={i}
                                                className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl group/item"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-lg shadow-primary/20" />
                                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest italic">{feature}</span>
                                                </div>
                                                <X className="w-4 h-4 text-gray-600 cursor-pointer hover:text-rose-500 transition-colors" onClick={() => handleRemoveFeature(feature)} />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Gallery Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#0D1117]/60 border border-white/5 rounded-[2.5rem] p-10 lg:p-14 space-y-10 shadow-2xl"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl">
                                    <LayoutPanelTop className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Visual Assets</h3>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 opacity-60 italic">Project gallery images</p>
                                </div>
                            </div>
                            <Button 
                                type="button" 
                                variant="ghost" 
                                className="h-12 px-6 rounded-xl text-[10px] font-black text-primary uppercase gap-3 bg-primary/5 hover:bg-primary/10 transition-all"
                                onClick={() => document.getElementById('gallery-upload')?.click()}
                            >
                                <Plus className="w-4 h-4" /> Upload Media
                            </Button>
                        </div>

                        <input id="gallery-upload" type="file" multiple className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'gallery')} />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {formData.images?.map((img, i) => (
                                <motion.div 
                                    layout
                                    key={i} 
                                    className="relative aspect-video rounded-[2rem] overflow-hidden border border-white/5 group shadow-2xl"
                                >
                                    <img src={getAssetUrl(img)} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt="" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button 
                                            type="button"
                                            onClick={() => handleRemoveImage(img, 'gallery')}
                                            className="bg-rose-500 p-4 rounded-full text-white hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-rose-500/40"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                            <button 
                                type="button"
                                onClick={() => document.getElementById('gallery-upload')?.click()}
                                className="aspect-video rounded-[2rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-4 text-gray-700 hover:text-primary hover:border-primary/20 transition-all bg-white/[0.02]"
                            >
                                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center shadow-inner">
                                    <Plus className="w-8 h-8" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add Gallery Image</span>
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Settings Sidebar */}
                <div className="lg:col-span-4 space-y-10">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-[#0D1117]/60 border border-white/5 rounded-[2.5rem] p-10 space-y-12 shadow-2xl"
                    >
                        <div className="space-y-10">
                            {/* Category Field */}
                            <div className="relative group">
                                <label className="absolute -top-3 left-6 px-3 bg-[#0D1117] text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] z-10">Project Category</label>
                                <div className="relative">
                                    <LayoutPanelTop className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                    <Input 
                                        value={formData.category}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                        className="h-16 pl-14 rounded-2xl bg-white/[0.02] border-white/5 focus:border-primary/50 text-white font-black text-[11px] tracking-[0.2em] uppercase"
                                        placeholder="e.g. MOBILE APP"
                                    />
                                </div>
                            </div>

                            {/* Tech Stack Tags */}
                            <div className="space-y-6">
                                <div className="relative group">
                                    <label className="absolute -top-3 left-6 px-3 bg-[#0D1117] text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] z-10">Tech Stack Modules</label>
                                    <div className="relative">
                                        <Code2 className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                        <Input 
                                            value={techInput}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTechInput(e.target.value)}
                                            onKeyDown={handleAddTech}
                                            className="h-16 pl-14 rounded-2xl bg-white/[0.02] border-white/5 focus:border-primary/50 text-white font-black text-[11px] tracking-[0.2em] uppercase"
                                            placeholder="Add tech & press Enter"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <AnimatePresence>
                                        {formData.tech_stack?.map((tech, i) => (
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.8, opacity: 0 }}
                                                key={i}
                                            >
                                                <Badge className="bg-primary/10 text-primary border-primary/20 flex items-center gap-3 px-4 py-2 rounded-xl font-black text-[10px] tracking-widest uppercase">
                                                    {tech}
                                                    <X className="w-3.5 h-3.5 cursor-pointer hover:text-white transition-colors" onClick={() => handleRemoveTech(tech)} />
                                                </Badge>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Status Toggles */}
                            <div className="pt-6 border-t border-white/5 space-y-4">
                                <button 
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, is_featured: !prev.is_featured }))}
                                    className={cn(
                                        "w-full h-16 px-8 rounded-2xl border flex items-center justify-between transition-all duration-700 shadow-xl",
                                        formData.is_featured 
                                            ? "bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-amber-500/5" 
                                            : "bg-white/[0.02] border-white/5 text-gray-700"
                                    )}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Featured Showcase</span>
                                    <Star className={cn("w-6 h-6 transition-all duration-700", formData.is_featured && "fill-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]")} />
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Cover Image Selection */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#0D1117]/60 border border-white/5 rounded-[2.5rem] p-10 space-y-10 shadow-2xl"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl">
                                <ImageIcon className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">Master Cover</h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 opacity-60 italic">Project thumbnail</p>
                            </div>
                        </div>

                        <div className={cn(
                            "relative aspect-[4/3] rounded-[2rem] overflow-hidden border-2 border-dashed transition-all duration-700 shadow-inner",
                            formData.thumbnail ? "border-emerald-500/30" : "border-white/5 bg-white/[0.02]"
                        )}>
                            {formData.thumbnail ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full group">
                                    <img src={getAssetUrl(formData.thumbnail)} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:grayscale-[0.5]" alt="" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button 
                                            type="button"
                                            onClick={() => handleRemoveImage(formData.thumbnail!, 'thumbnail')}
                                            className="bg-rose-500 p-5 rounded-full text-white shadow-2xl shadow-rose-500/40 transform active:scale-95 transition-all"
                                        >
                                            <X className="w-8 h-8" />
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <button 
                                    type="button" 
                                    onClick={() => document.getElementById('thumb-upload')?.click()}
                                    className="w-full h-full flex flex-col items-center justify-center gap-5 text-gray-700 hover:text-emerald-500 transition-all group"
                                >
                                    <div className="w-20 h-20 rounded-[1.5rem] bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-inner">
                                        <Plus className="w-10 h-10" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Select Cover Node</span>
                                </button>
                            )}
                        </div>
                        <input id="thumb-upload" type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'thumbnail')} />

                        <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[1.5rem] space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-black text-emerald-500/70 tracking-widest uppercase">Asset Requirements</span>
                            </div>
                            <span className="text-[9px] text-gray-500 leading-relaxed block italic font-medium">Recommended: 1200x800px. High priority project showcase cover.</span>
                        </div>
                    </motion.div>
                </div>
            </form>
        </div>
    );
}
