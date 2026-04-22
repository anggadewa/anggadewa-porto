import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { 
    Plus, 
    Pencil, 
    Trash2, 
    MoreVertical,
    Code2,
    Layers,
    ListOrdered
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface Skill {
    id: number;
    category: string;
    items: string[];
    sort_order: number;
}

export default function SkillList() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('skills')
            .select('*')
            .order('sort_order', { ascending: true });
        
        setSkills(data || []);
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this skill category?')) return;

        const { error } = await supabase
            .from('skills')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Error deleting skill: ' + error.message);
        } else {
            setSkills(skills.filter(s => s.id !== id));
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Technical Skills</h1>
                    <p className="text-sm text-gray-500 font-bold tracking-widest uppercase opacity-70 italic">Define and organize your core expertise</p>
                </div>
                
                <Link to="new">
                    <Button className="h-14 bg-primary hover:bg-primary/90 text-white font-black px-8 rounded-2xl shadow-xl shadow-primary/20 gap-3 border-none uppercase text-[10px] tracking-[0.2em]">
                        <Plus className="w-5 h-5" /> Add Category
                    </Button>
                </Link>
            </div>

            <div className="bg-[#0D1117]/60 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                                    <div className="flex items-center gap-3"><Layers className="w-4 h-4 text-primary" /> Category</div>
                                </th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                                    <div className="flex items-center gap-3"><Code2 className="w-4 h-4 text-primary" /> Technologies</div>
                                </th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                                    <div className="flex items-center gap-3"><ListOrdered className="w-4 h-4 text-primary" /> Priority</div>
                                </th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 text-right">Options</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-24 text-center">
                                        <div className="flex flex-col items-center gap-6">
                                            <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg shadow-primary/20"></div>
                                            <span className="text-[10px] font-black tracking-[0.4em] text-primary animate-pulse uppercase">Syncing Matrix...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : skills.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-24 text-center text-gray-600 uppercase tracking-[0.3em] font-black text-xs italic">
                                        No skill categories identified
                                    </td>
                                </tr>
                            ) : (
                                skills.map((skill) => (
                                    <motion.tr 
                                        key={skill.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="group hover:bg-white/[0.03] transition-colors duration-500"
                                    >
                                        <td className="p-8">
                                            <span className="text-sm font-black text-white group-hover:text-primary transition-colors duration-500 uppercase tracking-tight">
                                                {skill.category}
                                            </span>
                                        </td>
                                        <td className="p-8">
                                            <div className="flex flex-wrap gap-2">
                                                {skill.items.map((item, idx) => (
                                                    <Badge key={idx} className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-lg">
                                                        {item}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-primary/40" />
                                                <span className="text-[10px] font-black text-gray-500 tracking-widest">Level {skill.sort_order}</span>
                                            </div>
                                        </td>
                                        <td className="p-8 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-12 w-12 p-0 text-gray-600 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                                                        <MoreVertical className="w-5 h-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 bg-[#0D1117] border-white/10 rounded-[1.5rem] p-3 z-[60] shadow-2xl backdrop-blur-xl">
                                                    <Link to={`/admin/skills/edit/${skill.id}`}>
                                                        <DropdownMenuItem className="gap-3 rounded-xl py-3.5 cursor-pointer text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-primary/10 hover:text-primary transition-all">
                                                            <Pencil className="w-4 h-4" /> Edit Category
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <DropdownMenuSeparator className="bg-white/5 my-2" />
                                                    <DropdownMenuItem 
                                                        onClick={() => handleDelete(skill.id)}
                                                        className="gap-3 rounded-xl py-3.5 cursor-pointer text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" /> Remove Category
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-8 border-t border-white/5 bg-white/[0.01] flex items-center justify-between text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500 shadow-lg shadow-violet-500/20" />
                        Skill Matrix Synchronized
                    </div>
                </div>
            </div>
        </div>
    );
}
