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
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tighter uppercase">Project Portfolio</h1>
                    <p className="text-sm text-zinc-400 font-bold tracking-widest uppercase italic">Manage and showcase your best work</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                        <Input 
                            placeholder="Search projects..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-14 w-full lg:w-72 bg-white border-zinc-200 focus:border-primary/50 focus:ring-primary/20 rounded-2xl font-bold text-xs tracking-widest transition-all shadow-sm text-zinc-900"
                        />
                    </div>
                    <Link to="new">
                        <Button className="h-14 bg-primary hover:bg-primary/90 text-white font-black px-8 rounded-2xl shadow-lg shadow-primary/20 gap-3 border-none uppercase text-[10px] tracking-[0.2em] transition-all hover:-translate-y-0.5">
                            <Plus className="w-5 h-5" /> Add Project
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-100 bg-zinc-50/50">
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Preview</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Project Details</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Category</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Status</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 text-right">Options</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-24 text-center">
                                        <div className="flex flex-col items-center gap-6">
                                            <div className="w-14 h-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-lg shadow-primary/10"></div>
                                            <span className="text-[10px] font-black tracking-[0.4em] text-primary animate-pulse uppercase">Syncing Database...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredProjects.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-24 text-center text-zinc-400 uppercase tracking-[0.3em] font-black text-xs italic">
                                        No matching projects found
                                    </td>
                                </tr>
                            ) : (
                                filteredProjects.map((project) => (
                                    <motion.tr 
                                        key={project.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="group hover:bg-zinc-50/80 transition-colors duration-500"
                                    >
                                        <td className="p-8">
                                            {project.thumbnail ? (
                                                <div className="w-20 h-12 rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100 shadow-md transform group-hover:scale-110 group-hover:shadow-xl transition-all duration-700">
                                                    <img 
                                                        src={getAssetUrl(project.thumbnail)}
                                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                                        alt=""
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-20 h-12 rounded-xl bg-zinc-50 border border-zinc-200 border-dashed flex items-center justify-center">
                                                    <span className="text-[8px] font-black text-zinc-400 uppercase">No Image</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-8">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-sm font-black text-zinc-900 group-hover:text-primary transition-colors duration-500 uppercase tracking-tight">{project.title}</span>
                                                <span className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase">ID #{project.id}</span>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <Badge variant="outline" className="border-zinc-200 bg-zinc-50 text-[9px] font-black tracking-[0.2em] uppercase px-4 py-1.5 text-zinc-500 group-hover:border-primary/30 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                                                {project.category}
                                            </Badge>
                                        </td>
                                        <td className="p-8">
                                            <div className="flex items-center gap-2">
                                                {project.is_featured ? (
                                                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-[9px] font-black uppercase tracking-[0.2em] shadow-sm">
                                                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                                        Featured
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em]">
                                                        Standard
                                                    </div>
                                                )}
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
                                                    <Link to={`/projects/${project.slug}`} target="_blank">
                                                        <DropdownMenuItem className="gap-3 rounded-xl py-3.5 cursor-pointer text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-primary/5 hover:text-primary transition-all">
                                                            <ExternalLink className="w-4 h-4" /> View Showcase
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <DropdownMenuSeparator className="bg-zinc-100 my-2" />
                                                    <Link to={`edit/${project.id}`}>
                                                        <DropdownMenuItem className="gap-3 rounded-xl py-3.5 cursor-pointer text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-primary/5 hover:text-primary transition-all">
                                                            <Pencil className="w-4 h-4" /> Modify Details
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <DropdownMenuItem 
                                                        onClick={() => handleDelete(project.id)}
                                                        className="gap-3 rounded-xl py-3.5 cursor-pointer text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all"
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

                <div className="p-8 border-t border-zinc-100 bg-zinc-50/30 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                        Showing {filteredProjects.length} Verified Entries
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" size="sm" className="h-10 px-6 border-zinc-200 bg-white text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 disabled:opacity-30 rounded-xl transition-all shadow-sm" disabled>Previous</Button>
                        <Button variant="outline" size="sm" className="h-10 px-6 border-zinc-200 bg-white text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 disabled:opacity-30 rounded-xl transition-all shadow-sm" disabled>Next</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
