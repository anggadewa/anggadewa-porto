import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { 
    Save, 
    ChevronLeft, 
    X, 
    Loader2, 
    Terminal,
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

        let error;
        if (id) {
            const { error: updateError } = await supabase
                .from('skills')
                .update(formData)
                .eq('id', id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from('skills')
                .insert([formData]);
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
        <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-black tracking-widest text-primary animate-pulse uppercase">Querying_Skill_Node...</span>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto space-y-12 pb-20">
            {/* Form Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Link to="/admin/skills">
                        <Button variant="ghost" size="sm" className="h-12 w-12 rounded-xl text-gray-500 hover:text-white border border-transparent hover:border-gray-800 transition-all">
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                    </Link>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black text-white tracking-tighter uppercase whitespace-nowrap">
                            {id ? 'UPDATE_SKILL' : 'CONFIGURE_SKILL'}
                        </h1>
                        <p className="text-[10px] font-black tracking-[0.3em] text-gray-600 uppercase">Capability_Protocol_Module</p>
                    </div>
                </div>

                <Button 
                    onClick={handleSubmit}
                    disabled={saving}
                    className="h-14 bg-primary hover:bg-primary/90 text-white font-black px-10 rounded-2xl shadow-lg shadow-primary/20 gap-3 border-b-4 border-black/20"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    EXECUTE_SAVE
                </Button>
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0D1117]/60 border border-gray-800/50 rounded-[2.5rem] p-10 lg:p-14 space-y-10"
            >
                <div className="space-y-10">
                    {/* Category Field */}
                    <div className="relative group">
                        <label className="absolute -top-3 left-6 px-2 bg-[#0D1117] text-[10px] font-black text-primary uppercase tracking-[0.2em] z-10">SKILL_CATEGORY</label>
                        <div className="relative">
                            <Layers className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-primary transition-colors" />
                            <Input 
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                className="h-16 pl-16 rounded-2xl bg-gray-900/50 border-gray-800 focus:border-primary/50 text-white font-black text-lg tracking-tight uppercase"
                                required
                                placeholder="Enter category title..."
                            />
                        </div>
                    </div>

                    {/* Skill Tags Field */}
                    <div className="space-y-6">
                        <div className="relative group">
                            <label className="absolute -top-3 left-6 px-2 bg-[#0D1117] text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] z-10">CAPABILITY_NODES</label>
                            <div className="relative">
                                <Terminal className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-primary transition-colors" />
                                <Input 
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyDown={handleAddSkill}
                                    className="h-16 pl-16 rounded-2xl bg-gray-900/50 border-gray-800 focus:border-primary/50 text-white font-black text-sm tracking-widest uppercase"
                                    placeholder="Execute add_skill [Enter]..."
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
                                        <Badge className="bg-primary/10 text-primary border-primary/20 flex items-center gap-3 px-4 py-2 rounded-xl font-black text-[11px] tracking-widest uppercase">
                                            {skill}
                                            <X className="w-4 h-4 cursor-pointer hover:text-white" onClick={() => handleRemoveSkill(skill)} />
                                        </Badge>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Sort Order Field */}
                    <div className="relative group max-w-[200px]">
                        <label className="absolute -top-3 left-6 px-2 bg-[#0D1117] text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] z-10">SEQUENCE_INDEX</label>
                        <div className="relative">
                            <ListOrdered className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                            <Input 
                                type="number"
                                value={formData.sort_order}
                                onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                                className="h-14 pl-14 rounded-xl bg-gray-900/50 border-gray-800 text-white font-mono text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl">
                    <p className="text-[10px] text-gray-500 font-bold leading-relaxed">
                        <span className="text-primary uppercase mr-2">Tip_Node:</span>
                        Skill categories are displayed in the root portfolio organized by the Sequence_Index. Use lower values to prioritize core domain visibility.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
