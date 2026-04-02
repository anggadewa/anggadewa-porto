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
        thumbnail: null,
        images: [],
        tech_stack: [],
        is_featured: false
    });

    const [techInput, setTechInput] = useState('');

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const projectData = {
            ...formData,
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
        <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-black tracking-widest text-primary animate-pulse uppercase">Initializing_Project_Node...</span>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20">
            {/* Form Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Link to="/admin/projects">
                        <Button variant="ghost" size="sm" className="h-12 w-12 rounded-xl text-gray-500 hover:text-white border border-transparent hover:border-gray-800 transition-all">
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                    </Link>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black text-white tracking-tighter uppercase whitespace-nowrap">
                            {id ? 'EDIT_NODE' : 'BOOT_NEW_PROJECT'}
                        </h1>
                        <p className="text-[10px] font-black tracking-[0.3em] text-gray-600 uppercase">Project_Module_Control</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button 
                        onClick={handleSubmit}
                        disabled={saving}
                        className="h-14 bg-primary hover:bg-primary/90 text-white font-black px-10 rounded-2xl shadow-lg shadow-primary/20 gap-3 border-b-4 border-black/20"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        SAVE_SYSTEM_CHANGES
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Fields Area */}
                <div className="lg:col-span-8 space-y-10">
                    {/* Primary Info Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#0D1117]/60 border border-gray-800/50 rounded-[2.5rem] p-10 lg:p-14 space-y-10"
                    >
                        <div className="space-y-8">
                            {/* Title Field */}
                            <div className="relative group">
                                <label className="absolute -top-3 left-6 px-2 bg-[#0D1117] text-[10px] font-black text-primary uppercase tracking-[0.2em] z-10">PROJECT_TITLE</label>
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
                                        className="h-16 pl-16 rounded-2xl bg-gray-900/50 border-gray-800 focus:border-primary/50 text-white font-black text-lg"
                                        required
                                        placeholder="Enter node title..."
                                    />
                                </div>
                            </div>

                            {/* Slug Field */}
                            <div className="relative group">
                                <label className="absolute -top-3 left-6 px-2 bg-[#0D1117] text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] z-10">SYSTEM_SLUG (Auto)</label>
                                <div className="relative opacity-60">
                                    <Link2 className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700" />
                                    <Input 
                                        value={formData.slug}
                                        readOnly
                                        className="h-16 pl-16 rounded-2xl bg-gray-900/30 border-gray-800/50 text-gray-500 font-mono text-sm tracking-tight cursor-not-allowed"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Description Field */}
                            <div className="relative group">
                                <label className="absolute -top-3 left-6 px-2 bg-[#0D1117] text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] z-10">CORE_DESCRIPTION (HTML/Markdown)</label>
                                <textarea 
                                    value={formData.description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full h-80 rounded-2xl bg-gray-900/50 border border-gray-800 focus:border-primary/50 p-6 pt-8 text-gray-300 font-mono text-sm leading-relaxed outline-none transition-all resize-none custom-scrollbar"
                                    placeholder="Execute project summary write_module..."
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Gallery Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#0D1117]/60 border border-gray-800/50 rounded-[2.5rem] p-10 lg:p-14 space-y-10"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <LayoutPanelTop className="w-5 h-5 text-blue-500" />
                                </div>
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">GALLERY_ASSETS</h3>
                            </div>
                            <Button 
                                type="button" 
                                variant="ghost" 
                                className="h-10 text-xs font-black text-primary uppercase gap-2 hover:bg-primary/10"
                                onClick={() => document.getElementById('gallery-upload')?.click()}
                            >
                                <Plus className="w-4 h-4" /> UPLINK_DATA
                            </Button>
                        </div>

                        <input id="gallery-upload" type="file" multiple className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'gallery')} />
                        
                        <div className="grid grid-cols-2 gap-6">
                            {formData.images?.map((img, i) => (
                                <motion.div 
                                    layout
                                    key={i} 
                                    className="relative aspect-video rounded-2xl overflow-hidden border border-gray-800 group shadow-2xl"
                                >
                                    <img src={getAssetUrl(img)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-gradient-to-t from-black/80 to-transparent">
                                        <button 
                                            type="button"
                                            onClick={() => handleRemoveImage(img, 'gallery')}
                                            className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-full text-rose-500 hover:bg-rose-500 hover:text-white transition-all transform hover:scale-110"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                            <button 
                                type="button"
                                onClick={() => document.getElementById('gallery-upload')?.click()}
                                className="aspect-video rounded-2xl border-2 border-dashed border-gray-800 flex flex-col items-center justify-center gap-3 text-gray-600 hover:text-primary hover:border-primary/30 transition-all bg-white/5"
                            >
                                <Plus className="w-8 h-8" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Add_Gallery_Asset</span>
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Sidebar Configuration */}
                <div className="lg:col-span-4 space-y-10">
                    {/* Settings Side Card */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-[#0D1117]/60 border border-gray-800/50 rounded-[2.5rem] p-10 space-y-10"
                    >
                        <div className="space-y-8">
                            {/* Category Field */}
                            <div className="relative group">
                                <label className="absolute -top-3 left-6 px-2 bg-[#0D1117] text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] z-10">NODE_CLASS</label>
                                <div className="relative">
                                    <LayoutPanelTop className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                    <Input 
                                        value={formData.category}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                        className="h-14 pl-14 rounded-xl bg-gray-900/50 border-gray-800 text-white font-black text-xs tracking-widest uppercase"
                                        placeholder="e.g. SYSTEM_ALPHA"
                                    />
                                </div>
                            </div>

                            {/* Tech Stack Tags */}
                            <div className="space-y-4">
                                <div className="relative group">
                                    <label className="absolute -top-3 left-6 px-2 bg-[#0D1117] text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] z-10">TECH_MODULES</label>
                                    <div className="relative">
                                        <Code2 className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                        <Input 
                                            value={techInput}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTechInput(e.target.value)}
                                            onKeyDown={handleAddTech}
                                            className="h-14 pl-14 rounded-xl bg-gray-900/50 border-gray-800 text-white font-black text-xs tracking-widest uppercase"
                                            placeholder="Press Enter..."
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
                                                <Badge className="bg-primary/10 text-primary border-primary/20 flex items-center gap-2 px-3 py-1.5 rounded-lg font-black text-[10px] tracking-widest uppercase">
                                                    {tech}
                                                    <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => handleRemoveTech(tech)} />
                                                </Badge>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Status Toggles */}
                            <div className="pt-4 border-t border-gray-800/50 space-y-4">
                                <button 
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, is_featured: !prev.is_featured }))}
                                    className={cn(
                                        "w-full h-14 px-6 rounded-xl border flex items-center justify-between transition-all duration-500",
                                        formData.is_featured 
                                            ? "bg-amber-500/10 border-amber-500/30 text-amber-500" 
                                            : "bg-gray-900/50 border-gray-800 text-gray-500"
                                    )}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Featured_Core</span>
                                    <Star className={cn("w-5 h-5", formData.is_featured && "fill-amber-500")} />
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Thumbnail Side Card */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#0D1117]/60 border border-gray-800/50 rounded-[2.5rem] p-10 space-y-8"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <ImageIcon className="w-5 h-5 text-emerald-500" />
                            </div>
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">MASTER_THUMBNAIL</h3>
                        </div>

                        <div className={cn(
                            "relative aspect-square rounded-[2rem] overflow-hidden border-2 border-dashed transition-all duration-500",
                            formData.thumbnail ? "border-emerald-500/50" : "border-gray-800 bg-gray-900/30"
                        )}>
                            {formData.thumbnail ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full group">
                                    <img src={getAssetUrl(formData.thumbnail)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button 
                                            type="button"
                                            onClick={() => handleRemoveImage(formData.thumbnail!, 'thumbnail')}
                                            className="bg-rose-500 p-3 rounded-full text-white shadow-xl transform active:scale-95 transition-transform"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <button 
                                    type="button" 
                                    onClick={() => document.getElementById('thumb-upload')?.click()}
                                    className="w-full h-full flex flex-col items-center justify-center gap-4 text-gray-600 hover:text-emerald-500 transition-all font-mono group"
                                >
                                    <div className="w-16 h-16 rounded-3xl bg-gray-800/50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                        <Plus className="w-8 h-8" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Select_Node_Cover</span>
                                </button>
                            )}
                        </div>
                        <input id="thumb-upload" type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'thumbnail')} />

                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                            <span className="text-[9px] font-black text-emerald-500/70 tracking-widest uppercase block mb-1">Status: OK</span>
                            <span className="text-[9px] text-gray-500 leading-tight block">Recommended resolution: 1200x800px. High priority node cover.</span>
                        </div>
                    </motion.div>
                </div>
            </form>
        </div>
    );
}
