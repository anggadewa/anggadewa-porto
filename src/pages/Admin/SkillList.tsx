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
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tighter uppercase">Technical Skills</h1>
                    <p className="text-sm text-zinc-400 font-bold tracking-widest uppercase italic">Define and organize your core expertise</p>
                </div>
                
                <Link to="new">
                    <Button className="h-14 bg-primary hover:bg-primary/90 text-white font-black px-8 rounded-2xl shadow-lg shadow-primary/20 gap-3 border-none uppercase text-[10px] tracking-[0.2em] transition-all hover:-translate-y-0.5">
                        <Plus className="w-5 h-5" /> Add Category
                    </Button>
                </Link>
            </div>

            <div className="bg-white border border-zinc-200 rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-100 bg-zinc-50/50">
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                                    <div className="flex items-center gap-3"><Layers className="w-4 h-4 text-primary" /> Category</div>
                                </th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                                    <div className="flex items-center gap-3"><Code2 className="w-4 h-4 text-primary" /> Technologies</div>
                                </th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                                    <div className="flex items-center gap-3"><ListOrdered className="w-4 h-4 text-primary" /> Priority</div>
                                </th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 text-right">Options</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-24 text-center">
                                        <div className="flex flex-col items-center gap-6">
                                            <div className="w-14 h-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-lg shadow-primary/10"></div>
                                            <span className="text-[10px] font-black tracking-[0.4em] text-primary animate-pulse uppercase">Syncing Matrix...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : skills.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-24 text-center text-zinc-400 uppercase tracking-[0.3em] font-black text-xs italic">
                                        No skill categories identified
                                    </td>
                                </tr>
                            ) : (
                                skills.map((skill) => (
                                    <motion.tr 
                                        key={skill.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="group hover:bg-zinc-50/80 transition-colors duration-500"
                                    >
                                        <td className="p-8">
                                            <span className="text-sm font-black text-zinc-900 group-hover:text-primary transition-colors duration-500 uppercase tracking-tight">
                                                {skill.category}
                                            </span>
                                        </td>
                                        <td className="p-8">
                                            <div className="flex flex-wrap gap-2">
                                                {skill.items.map((item, idx) => (
                                                    <Badge key={idx} className="bg-primary/5 text-primary border-primary/10 text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-lg">
                                                        {item}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-primary/40" />
                                                <span className="text-[10px] font-black text-zinc-500 tracking-widest">Level {skill.sort_order}</span>
                                            </div>
                                        </td>
                                        <td className="p-8 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-12 w-12 p-0 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-2xl transition-all">
                                                        <MoreVertical className="w-5 h-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 bg-white border-zinc-200 rounded-[1.5rem] p-3 z-[60] shadow-xl">
                                                    <Link to={`/admin/skills/edit/${skill.id}`}>
                                                        <DropdownMenuItem className="gap-3 rounded-xl py-3.5 cursor-pointer text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-primary/5 hover:text-primary transition-all">
                                                            <Pencil className="w-4 h-4" /> Edit Category
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <DropdownMenuSeparator className="bg-zinc-100 my-2" />
                                                    <DropdownMenuItem 
                                                        onClick={() => handleDelete(skill.id)}
                                                        className="gap-3 rounded-xl py-3.5 cursor-pointer text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all"
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

                <div className="p-8 border-t border-zinc-100 bg-zinc-50/30 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.4)]" />
                        Skill Matrix Synchronized
                    </div>
                </div>
            </div>
        </div>
    );
}
