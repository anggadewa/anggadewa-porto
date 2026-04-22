import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { 
    Save, 
    ChevronLeft, 
    X, 
    Loader2, 
    Plus,
    Layers,
    ListOrdered
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function SkillForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        category: '',
        items: [] as string[],
        sort_order: 0
    });

    const [skillInput, setSkillInput] = useState('');

    useEffect(() => {
        if (id) {
            fetchSkill();
        }
    }, [id]);

    const fetchSkill = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('skills')
            .select('*')
            .eq('id', id)
            .single();
        
        if (data) {
            setFormData(data);
        }
        setLoading(false);
    };

    const handleAddSkill = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            if (!formData.items.includes(skillInput.trim())) {
                setFormData(prev => ({ ...prev, items: [...prev.items, skillInput.trim()] }));
            }
            setSkillInput('');
        }
    };

    const handleRemoveSkill = (skill: string) => {
        setFormData(prev => ({ ...prev, items: prev.items.filter(s => s !== skill) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const { id: _, created_at: __, ...updatePayload } = formData as any;
        
        let error;
        if (id) {
            const { error: updateError } = await supabase
                .from('skills')
                .update(updatePayload)
                .eq('id', id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from('skills')
                .insert([updatePayload]);
            error = insertError;
        }

        if (error) {
            alert('Error saving skill: ' + error.message);
        } else {
            navigate('/admin/skills');
        }
        setSaving(false);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 gap-6">
            <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg shadow-primary/20"></div>
            <span className="text-[10px] font-black tracking-[0.4em] text-primary animate-pulse uppercase">Syncing Matrix...</span>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto space-y-12 pb-32">
            {/* Form Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <Link to="/admin/skills">
                        <Button variant="ghost" size="sm" className="h-14 w-14 rounded-2xl text-gray-500 hover:text-white bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                    </Link>
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
                            {id ? 'Update Category' : 'Define Category'}
                        </h1>
                        <p className="text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase opacity-60 italic">Configure skill groupings and visibility</p>
                    </div>
                </div>

                <Button 
                    onClick={handleSubmit}
                    disabled={saving}
                    className="h-16 bg-primary hover:bg-primary/90 text-white font-black px-12 rounded-2xl shadow-2xl shadow-primary/20 gap-4 border-none text-[11px] tracking-[0.2em] uppercase transition-all hover:-translate-y-1"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Category
                </Button>
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0D1117]/60 border border-white/5 rounded-[2.5rem] p-10 lg:p-14 space-y-12 shadow-2xl"
            >
                <div className="space-y-12">
                    {/* Category Field */}
                    <div className="relative group">
                        <label className="absolute -top-3 left-6 px-3 bg-[#0D1117] text-[10px] font-black text-primary uppercase tracking-[0.2em] z-10">Category Name</label>
                        <div className="relative">
                            <Layers className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-primary transition-colors" />
                            <Input 
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                className="h-16 pl-16 rounded-2xl bg-white/[0.02] border-white/5 focus:border-primary/50 text-white font-black text-lg tracking-tight placeholder:text-gray-800"
                                required
                                placeholder="e.g. Backend Development"
                            />
                        </div>
                    </div>

                    {/* Skill Tags Field */}
                    <div className="space-y-8">
                        <div className="relative group">
                            <label className="absolute -top-3 left-6 px-3 bg-[#0D1117] text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] z-10">Technologies & Tools</label>
                            <div className="relative">
                                <Plus className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                                <Input 
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyDown={handleAddSkill}
                                    className="h-16 pl-16 rounded-2xl bg-white/[0.02] border-white/5 focus:border-primary/50 text-white font-bold text-sm tracking-widest placeholder:text-gray-800"
                                    placeholder="Press Enter to add tool..."
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <AnimatePresence>
                                {formData.items.map((skill, i) => (
                                    <motion.div
                                        layout
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        key={i}
                                    >
                                        <Badge className="bg-primary/10 text-primary border-primary/20 flex items-center gap-3 px-5 py-2.5 rounded-xl font-black text-[11px] tracking-widest uppercase">
                                            {skill}
                                            <X className="w-4 h-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleRemoveSkill(skill)} />
                                        </Badge>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Sort Order Field */}
                    <div className="relative group max-w-[240px]">
                        <label className="absolute -top-3 left-6 px-3 bg-[#0D1117] text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] z-10">Display Priority</label>
                        <div className="relative">
                            <ListOrdered className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                            <Input 
                                type="number"
                                value={formData.sort_order}
                                onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                                className="h-16 pl-16 rounded-2xl bg-white/[0.02] border-white/5 text-white font-black text-sm tracking-widest"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-primary/5 border border-primary/10 rounded-[2rem] space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-lg shadow-primary/20" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Usage Tip</span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-bold leading-relaxed italic uppercase tracking-wider opacity-80">
                        Categories are displayed in the portfolio based on their Priority. Lower values appear first in your skill matrix.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
