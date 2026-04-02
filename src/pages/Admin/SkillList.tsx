import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { 
    Plus, 
    Pencil, 
    Trash2, 
    MoreVertical,
    Terminal,
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
        <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Skill_Registry</h1>
                    <p className="text-sm text-gray-500 font-bold tracking-widest uppercase opacity-70">Capability_Control_Center</p>
                </div>
                
                <Link to="new">
                    <Button className="h-12 bg-primary hover:bg-primary/90 text-white font-black px-6 rounded-xl shadow-lg shadow-primary/20 gap-2">
                        <Plus className="w-5 h-5" /> NEW_SKILL_NODE
                    </Button>
                </Link>
            </div>

            <div className="bg-[#0D1117]/60 border border-gray-800/50 rounded-[2rem] overflow-hidden backdrop-blur-xl">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-800/50 bg-white/5">
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                                    <div className="flex items-center gap-2"><Layers className="w-3 h-3" /> Category</div>
                                </th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                                    <div className="flex items-center gap-2"><Terminal className="w-3 h-3" /> Skills_Node</div>
                                </th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                                    <div className="flex items-center gap-2"><ListOrdered className="w-3 h-3" /> Order</div>
                                </th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/30">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-xs font-black tracking-widest text-primary animate-pulse uppercase">Querying_Skills...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : skills.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-20 text-center text-gray-500 uppercase tracking-widest font-black text-xs">
                                        No_Skills_Modules_Found
                                    </td>
                                </tr>
                            ) : (
                                skills.map((skill) => (
                                    <motion.tr 
                                        key={skill.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="group hover:bg-white/5 transition-colors duration-300"
                                    >
                                        <td className="p-6">
                                            <span className="text-sm font-black text-white group-hover:text-primary transition-colors duration-300 uppercase tracking-tight">
                                                {skill.category}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-wrap gap-2">
                                                {skill.items.map((item, idx) => (
                                                    <Badge key={idx} className="bg-primary/5 text-primary/70 border-primary/20 text-[9px] font-black tracking-widest uppercase px-2 py-0.5">
                                                        {item}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <Badge variant="outline" className="border-gray-800 text-[10px] font-mono text-gray-500">
                                                ORD_{skill.sort_order.toString().padStart(2, '0')}
                                            </Badge>
                                        </td>
                                        <td className="p-6 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-10 w-10 p-0 text-gray-500 hover:text-white hover:bg-gray-800/50 rounded-xl">
                                                        <MoreVertical className="w-5 h-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 bg-[#0D1117] border-gray-800 rounded-xl p-2 z-[60]">
                                                    <Link to={`/admin/skills/edit/${skill.id}`}>
                                                        <DropdownMenuItem className="gap-3 rounded-lg py-2.5 cursor-pointer text-gray-300 hover:bg-primary/10 hover:text-primary">
                                                            <Pencil className="w-4 h-4" /> update_skill
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <DropdownMenuSeparator className="bg-gray-800" />
                                                    <DropdownMenuItem 
                                                        onClick={() => handleDelete(skill.id)}
                                                        className="gap-3 rounded-lg py-2.5 cursor-pointer text-rose-500 hover:bg-rose-500/10 hover:text-rose-500"
                                                    >
                                                        <Trash2 className="w-4 h-4" /> purge_node
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
            </div>
        </div>
    );
}
