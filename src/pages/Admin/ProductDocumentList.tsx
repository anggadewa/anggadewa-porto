import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { getAssetUrl } from '@/lib/assets';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DeleteConfirmDialog from '@/components/Admin/DeleteConfirmDialog';
import type { ProductDocumentRecord } from '@/types';

export default function ProductDocumentList() {
    const [documents, setDocuments] = useState<ProductDocumentRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState<ProductDocumentRecord | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('product_documents')
            .select('*')
            .order('sort_order', { ascending: true })
            .order('created_at', { ascending: false });
        setDocuments((data || []) as ProductDocumentRecord[]);
        setLoading(false);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;

        setIsDeleting(true);
        const { error } = await supabase.from('product_documents').delete().eq('id', deleteTarget.id);
        setIsDeleting(false);

        if (error) {
            alert(error.message);
            return;
        }

        setDocuments((current) => current.filter((item) => item.id !== deleteTarget.id));
        setDeleteTarget(null);
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                <div>
                    <Link to="/admin/product" className="mb-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-primary hover:opacity-80 transition-opacity">
                        <ArrowLeft className="h-4 w-4" />
                        Back to case studies
                    </Link>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-zinc-900">Product Documents</h1>
                    <p className="mt-2 text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">Bootcamp missions and downloadable PDFs</p>
                </div>
                <Link to="new">
                    <Button className="h-12 rounded-2xl bg-primary px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                        <Plus className="h-4 w-4 mr-2" />
                        New Document
                    </Button>
                </Link>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                {loading ? (
                    <div className="p-20 text-center text-[10px] font-black uppercase tracking-[0.3em] text-primary">Loading documents...</div>
                ) : documents.length === 0 ? (
                    <div className="p-20 text-center text-sm font-bold text-zinc-500">No product documents yet.</div>
                ) : (
                    <div className="divide-y divide-zinc-100">
                        {documents.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className="grid gap-5 p-6 transition-colors hover:bg-zinc-50 lg:grid-cols-[1fr_auto] lg:items-center"
                            >
                                <div>
                                    <div className="mb-3 flex flex-wrap items-center gap-2">
                                        <Badge className="rounded-full bg-primary/10 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-primary hover:bg-primary/10">
                                            #{String(item.sort_order).padStart(2, '0')}
                                        </Badge>
                                        <Badge variant="outline" className="rounded-full px-3 py-1 text-[8px] font-black uppercase tracking-widest text-zinc-500">
                                            {item.type}
                                        </Badge>
                                        <Badge className={item.is_published ? 'rounded-full bg-emerald-50 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-emerald-700 hover:bg-emerald-50' : 'rounded-full bg-zinc-100 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-zinc-500 hover:bg-zinc-100'}>
                                            {item.is_published ? 'Published' : 'Draft'}
                                        </Badge>
                                    </div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-950">{item.title}</h2>
                                    <p className="mt-2 max-w-3xl text-sm font-medium leading-relaxed text-zinc-500">{item.description}</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {item.file_path && (
                                        <a href={getAssetUrl(item.file_path)} target="_blank" rel="noreferrer">
                                            <Button variant="outline" className="h-11 rounded-xl border-zinc-200 bg-white text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:bg-zinc-50">
                                                <ExternalLink className="h-4 w-4 mr-1.5" />
                                                PDF
                                            </Button>
                                        </a>
                                    )}
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
                title="Delete Bootcamp Mission Document"
                description="Are you sure you want to delete this document? Any attached PDF link will also be removed from the bootcamp missions list."
                itemName={deleteTarget?.title}
                isLoading={isDeleting}
            />
        </div>
    );
}
