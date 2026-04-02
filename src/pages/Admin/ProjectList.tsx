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
        <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Project_Repository</h1>
                    <p className="text-sm text-gray-500 font-bold tracking-widest uppercase opacity-70">Source_Node_Control</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                        <Input 
                            placeholder="Find_Node..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 h-12 w-full lg:w-64 bg-[#0D1117]/60 border-gray-800 focus:border-primary/50 rounded-xl font-bold text-xs tracking-widest"
                        />
                    </div>
                    <Link to="new">
                        <Button className="h-12 bg-primary hover:bg-primary/90 text-white font-black px-6 rounded-xl shadow-lg shadow-primary/20 gap-2">
                            <Plus className="w-5 h-5" /> NEW_DATA_SET
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="bg-[#0D1117]/60 border border-gray-800/50 rounded-[2rem] overflow-hidden backdrop-blur-xl">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-800/50 bg-white/5">
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Thumbnail</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Node_Title</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Category</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Visibility</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/30">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-xs font-black tracking-widest text-primary animate-pulse uppercase">Syncing_Nodes...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredProjects.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center text-gray-500 uppercase tracking-widest font-black text-xs">
                                        No_Nodes_Detected_In_Search
                                    </td>
                                </tr>
                            ) : (
                                filteredProjects.map((project) => (
                                    <motion.tr 
                                        key={project.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="group hover:bg-white/5 transition-colors duration-300"
                                    >
                                        <td className="p-6">
                                            {project.thumbnail ? (
                                                <div className="w-16 h-10 rounded-lg overflow-hidden border border-gray-800 bg-[#06080B] shadow-inner transform group-hover:scale-105 transition-transform duration-500">
                                                    <img 
                                                        src={getAssetUrl(project.thumbnail)}
                                                        className="w-full h-full object-cover"
                                                        alt=""
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-16 h-10 rounded-lg bg-gray-900 border border-gray-800 border-dashed" />
                                            )}
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-white group-hover:text-primary transition-colors duration-300">{project.title}</span>
                                                <span className="text-[10px] text-gray-600 font-mono italic">UID_{project.id.toString().padStart(4, '0')}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <Badge variant="outline" className="border-gray-800 bg-gray-900/50 text-[10px] font-black tracking-widest uppercase px-3 py-1 text-gray-400">
                                                {project.category}
                                            </Badge>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2">
                                                {project.is_featured ? (
                                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                                                        <Star className="w-3 h-3 fill-amber-500" />
                                                        Featured
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                                                        Standard
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-10 w-10 p-0 text-gray-500 hover:text-white hover:bg-gray-800/50 rounded-xl">
                                                        <MoreVertical className="w-5 h-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 bg-[#0D1117] border-gray-800 rounded-xl p-2 z-[60]">
                                                    <Link to={`/projects/${project.slug}`} target="_blank">
                                                        <DropdownMenuItem className="gap-3 rounded-lg py-2.5 cursor-pointer text-gray-300 hover:bg-primary/10 hover:text-primary">
                                                            <ExternalLink className="w-4 h-4" /> root_access
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <DropdownMenuSeparator className="bg-gray-800" />
                                                    <Link to={`edit/${project.id}`}>
                                                        <DropdownMenuItem className="gap-3 rounded-lg py-2.5 cursor-pointer text-gray-300 hover:bg-primary/10 hover:text-primary">
                                                            <Pencil className="w-4 h-4" /> edit_module
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <DropdownMenuItem 
                                                        onClick={() => handleDelete(project.id)}
                                                        className="gap-3 rounded-lg py-2.5 cursor-pointer text-rose-500 hover:bg-rose-500/10 hover:text-rose-500"
                                                    >
                                                        <Trash2 className="w-4 h-4" /> wipe_data
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

                <div className="p-6 border-t border-gray-800/50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-600">
                    <div>Showing {filteredProjects.length} Systems Found</div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8 border-gray-800 text-gray-500 disabled:opacity-30 rounded-lg" disabled>Prev</Button>
                        <Button variant="outline" size="sm" className="h-8 border-gray-800 text-gray-500 disabled:opacity-30 rounded-lg" disabled>Next</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
