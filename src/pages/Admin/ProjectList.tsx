import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Project } from '@/types';
import { 
    Plus, 
    Pencil, 
    Trash2, 
    ExternalLink, 
    Search, 
    Filter,
    MoreVertical,
    Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getAssetUrl } from '@/lib/assets';
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

export default function ProjectList() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });
        
        setProjects(data || []);
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Error deleting project: ' + error.message);
        } else {
            setProjects(projects.filter(p => p.id !== id));
        }
    };

    const filteredProjects = projects.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Project Portfolio</h1>
                    <p className="text-sm text-gray-500 font-bold tracking-widest uppercase opacity-70 italic">Manage and showcase your best work</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-primary transition-colors" />
                        <Input 
                            placeholder="Search projects..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-14 w-full lg:w-72 bg-[#0D1117]/60 border-white/5 focus:border-primary/50 rounded-2xl font-bold text-xs tracking-widest transition-all shadow-inner"
                        />
                    </div>
                    <Link to="new">
                        <Button className="h-14 bg-primary hover:bg-primary/90 text-white font-black px-8 rounded-2xl shadow-xl shadow-primary/20 gap-3 border-none uppercase text-[10px] tracking-[0.2em]">
                            <Plus className="w-5 h-5" /> Add Project
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="bg-[#0D1117]/60 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Preview</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Project Details</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Category</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Status</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 text-right">Options</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-24 text-center">
                                        <div className="flex flex-col items-center gap-6">
                                            <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg shadow-primary/20"></div>
                                            <span className="text-[10px] font-black tracking-[0.4em] text-primary animate-pulse uppercase">Syncing Database...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredProjects.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-24 text-center text-gray-600 uppercase tracking-[0.3em] font-black text-xs italic">
                                        No matching projects found
                                    </td>
                                </tr>
                            ) : (
                                filteredProjects.map((project) => (
                                    <motion.tr 
                                        key={project.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="group hover:bg-white/[0.03] transition-colors duration-500"
                                    >
                                        <td className="p-8">
                                            {project.thumbnail ? (
                                                <div className="w-20 h-12 rounded-xl overflow-hidden border border-white/10 bg-[#06080B] shadow-2xl transform group-hover:scale-110 transition-all duration-700">
                                                    <img 
                                                        src={getAssetUrl(project.thumbnail)}
                                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                                        alt=""
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-20 h-12 rounded-xl bg-white/5 border border-white/5 border-dashed flex items-center justify-center">
                                                    <span className="text-[8px] font-black text-gray-700 uppercase">No Image</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-8">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-black text-white group-hover:text-primary transition-colors duration-500 uppercase tracking-tight">{project.title}</span>
                                                <span className="text-[9px] text-gray-600 font-bold tracking-widest uppercase opacity-60">ID #{project.id}</span>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <Badge variant="outline" className="border-white/10 bg-white/5 text-[9px] font-black tracking-[0.2em] uppercase px-4 py-1.5 text-gray-400 group-hover:border-primary/30 group-hover:text-primary transition-all">
                                                {project.category}
                                            </Badge>
                                        </td>
                                        <td className="p-8">
                                            <div className="flex items-center gap-2">
                                                {project.is_featured ? (
                                                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-black uppercase tracking-[0.2em]">
                                                        <Star className="w-3 h-3 fill-amber-500 shadow-xl" />
                                                        Featured
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-gray-600 text-[9px] font-black uppercase tracking-[0.2em]">
                                                        Standard
                                                    </div>
                                                )}
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
                                                    <Link to={`/projects/${project.slug}`} target="_blank">
                                                        <DropdownMenuItem className="gap-3 rounded-xl py-3.5 cursor-pointer text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-primary/10 hover:text-primary transition-all">
                                                            <ExternalLink className="w-4 h-4" /> View Showcase
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <DropdownMenuSeparator className="bg-white/5 my-2" />
                                                    <Link to={`edit/${project.id}`}>
                                                        <DropdownMenuItem className="gap-3 rounded-xl py-3.5 cursor-pointer text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-primary/10 hover:text-primary transition-all">
                                                            <Pencil className="w-4 h-4" /> Modify Details
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <DropdownMenuItem 
                                                        onClick={() => handleDelete(project.id)}
                                                        className="gap-3 rounded-xl py-3.5 cursor-pointer text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" /> Remove Entry
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
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" />
                        Showing {filteredProjects.length} Verified Entries
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" size="sm" className="h-10 px-6 border-white/5 bg-transparent text-gray-600 hover:text-white hover:bg-white/5 disabled:opacity-20 rounded-xl transition-all" disabled>Previous</Button>
                        <Button variant="outline" size="sm" className="h-10 px-6 border-white/5 bg-transparent text-gray-600 hover:text-white hover:bg-white/5 disabled:opacity-20 rounded-xl transition-all" disabled>Next</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
