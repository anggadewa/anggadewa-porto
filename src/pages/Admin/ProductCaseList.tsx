import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Pencil, Plus, Trash2, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DeleteConfirmDialog from '@/components/Admin/DeleteConfirmDialog';
import type { ProductCaseStudyRecord } from '@/types';

export default function ProductCaseList() {
    const [cases, setCases] = useState<ProductCaseStudyRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState<ProductCaseStudyRecord | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchCases();
    }, []);

    const fetchCases = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('product_case_studies')
            .select('*, project:projects(id, title, slug)')
            .order('sort_order', { ascending: true })
            .order('created_at', { ascending: false });

        setCases((data || []) as ProductCaseStudyRecord[]);
        setLoading(false);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;

        setIsDeleting(true);
        const { error } = await supabase.from('product_case_studies').delete().eq('id', deleteTarget.id);
        setIsDeleting(false);

        if (error) {
            alert(error.message);
            return;
        }

        setCases((current) => current.filter((item) => item.id !== deleteTarget.id));
        setDeleteTarget(null);
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-zinc-900">Product Content</h1>
                    <p className="mt-2 text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">
                        Case studies ({cases.length}) and PM bootcamp deliverables
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link to="/admin/product/documents">
                        <Button variant="outline" className="h-12 rounded-2xl border-zinc-200 bg-white px-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:bg-zinc-50 shadow-sm">
                            <FileText className="h-4 w-4 mr-2 text-primary" />
                            Bootcamp Documents
                        </Button>
                    </Link>
                    <Link to="new">
                        <Button className="h-12 rounded-2xl bg-primary px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                            <Plus className="h-4 w-4 mr-2" />
                            New Case Study
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                {loading ? (
                    <div className="p-20 text-center text-[10px] font-black uppercase tracking-[0.3em] text-primary">Loading product cases...</div>
                ) : cases.length === 0 ? (
                    <div className="p-20 text-center">
                        <p className="text-sm font-bold text-zinc-500">No product case studies yet.</p>
                        <Link to="new" className="mt-5 inline-flex text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                            Create the first case <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-100">
                        {cases.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className="grid gap-5 p-6 transition-colors hover:bg-zinc-50/80 lg:grid-cols-[1fr_auto] lg:items-center"
                            >
                                <div className="min-w-0">
                                    <div className="mb-3 flex flex-wrap items-center gap-2">
                                        <Badge className="rounded-full bg-primary/10 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-primary hover:bg-primary/10">
                                            #{String(item.sort_order).padStart(2, '0')}
                                        </Badge>
                                        <Badge variant="outline" className="rounded-full px-3 py-1 text-[8px] font-black uppercase tracking-widest text-zinc-500">
                                            {item.category}
                                        </Badge>
                                        <Badge className={item.is_published ? 'rounded-full bg-emerald-50 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-emerald-700 hover:bg-emerald-50' : 'rounded-full bg-zinc-100 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-zinc-500 hover:bg-zinc-100'}>
                                            {item.is_published ? 'Published' : 'Draft'}
                                        </Badge>
                                        {item.project && (
                                            <Badge variant="outline" className="rounded-full border-violet-200 bg-violet-50/50 text-violet-700 px-3 py-1 text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                                <Briefcase className="h-2.5 w-2.5" />
                                                Project: {item.project.title}
                                            </Badge>
                                        )}
                                    </div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-950">{item.title}</h2>
                                    <p className="mt-2 max-w-3xl text-sm font-medium leading-relaxed text-zinc-500">{item.summary}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Link to={`edit/${item.id}`}>
                                        <Button variant="outline" className="h-11 rounded-xl border-zinc-200 bg-white text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:bg-zinc-50">
                                            <Pencil className="h-4 w-4 mr-1.5" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        onClick={() => setDeleteTarget(item)}
                                        variant="outline"
                                        className="h-11 rounded-xl border-rose-100 bg-rose-50 text-[10px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-100"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1.5" />
                                        Delete
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Custom Delete Confirmation Modal */}
            <DeleteConfirmDialog
                isOpen={Boolean(deleteTarget)}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Product Case Study"
                description="Are you sure you want to delete this case study? This will remove its detail page and artifacts from the public product portfolio."
                itemName={deleteTarget?.title}
                isLoading={isDeleting}
            />
        </div>
    );
}
