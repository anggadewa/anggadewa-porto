import { useEffect, useState } from 'react';
import type React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ExternalLink, FileText, Loader2, Save, Trash2, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { getAssetUrl } from '@/lib/assets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import DeleteConfirmDialog from '@/components/Admin/DeleteConfirmDialog';
import type { ProductDocumentRecord } from '@/types';

const emptyForm: Partial<ProductDocumentRecord> = {
    title: '',
    type: 'Practice',
    description: '',
    file_path: null,
    sort_order: 1,
    is_published: true
};

const suggestedTypes = ['Foundation', 'Practice', 'Intermediate', 'Advanced', 'Final Project'];

export default function ProductDocumentForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Partial<ProductDocumentRecord>>(emptyForm);
    const [loading, setLoading] = useState(Boolean(id));
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isRemovePdfDialogOpen, setIsRemovePdfDialogOpen] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchDocument = async () => {
            setLoading(true);
            const { data } = await supabase
                .from('product_documents')
                .select('*')
                .eq('id', id)
                .single();
            if (data) setFormData(data as ProductDocumentRecord);
            setLoading(false);
        };

        fetchDocument();
    }, [id]);

    const updateField = <K extends keyof ProductDocumentRecord>(key: K, value: ProductDocumentRecord[K]) => {
        setFormData((current) => ({ ...current, [key]: value }));
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
            alert('Please select a valid PDF file.');
            return;
        }

        setUploading(true);
        const bucketName = import.meta.env.VITE_STORAGE_BUCKET_NAME || 'portfolio-assets';
        const sanitizedName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
        const fileName = `${Date.now()}-${sanitizedName}`;
        const filePath = `product/documents/${fileName}`;

        const { error } = await supabase.storage.from(bucketName).upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
        });

        setUploading(false);

        if (error) {
            alert(`Failed to upload PDF: ${error.message}`);
            return;
        }

        updateField('file_path', filePath);
        // Reset file input
        event.target.value = '';
    };

    const handleRemoveFile = () => {
        updateField('file_path', null);
        setIsRemovePdfDialogOpen(false);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSaving(true);

        const { id: _, created_at: __, updated_at: ___, ...payload } = formData;
        const finalPayload = {
            ...payload,
            updated_at: new Date().toISOString()
        };

        const { error } = id
            ? await supabase.from('product_documents').update(finalPayload).eq('id', id)
            : await supabase.from('product_documents').insert([finalPayload]);

        setSaving(false);

        if (error) {
            alert(error.message);
            return;
        }

        navigate('/admin/product/documents');
    };

    if (loading) {
        return (
            <div className="flex justify-center py-32">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl space-y-10 pb-24">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div className="flex items-center gap-5">
                    <Link to="/admin/product/documents">
                        <Button variant="ghost" className="h-12 w-12 rounded-2xl border border-zinc-200 bg-white p-0 text-zinc-500">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter text-zinc-900">{id ? 'Edit Mission Document' : 'New Mission Document'}</h1>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">Bootcamp deliverable PDF metadata</p>
                    </div>
                </div>
                <Button onClick={handleSubmit} disabled={saving || uploading} className="h-14 rounded-2xl bg-primary px-8 text-[10px] font-black uppercase tracking-[0.22em] text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Document
                </Button>
            </div>

            <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                <Field label="Document Title">
                    <Input
                        value={formData.title || ''}
                        onChange={(event) => updateField('title', event.target.value)}
                        required
                        className="h-14 rounded-2xl bg-zinc-50 font-bold"
                        placeholder="e.g. Mission 3 - User Flow & Requirements"
                    />
                </Field>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400">Document Type / Level</span>
                        <Input
                            value={formData.type || ''}
                            onChange={(event) => updateField('type', event.target.value)}
                            required
                            className="h-14 rounded-2xl bg-zinc-50 font-bold"
                            placeholder="e.g. Practice, Foundation, Advanced"
                        />
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {suggestedTypes.map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => updateField('type', type)}
                                    className={cn(
                                        "rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-wider transition-all",
                                        formData.type === type
                                            ? "bg-primary text-white"
                                            : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                                    )}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Field label="Sort Order">
                        <Input
                            type="number"
                            value={formData.sort_order || 1}
                            onChange={(event) => updateField('sort_order', Number(event.target.value))}
                            className="h-14 rounded-2xl bg-zinc-50 font-bold"
                        />
                    </Field>
                </div>

                <Field label="Description & Learning Scope">
                    <textarea
                        value={formData.description || ''}
                        onChange={(event) => updateField('description', event.target.value)}
                        required
                        className="h-32 w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm font-semibold leading-relaxed outline-none focus:border-primary/50"
                        placeholder="What problem does this mission solve, which artifacts are produced, and what key PM skills are practiced..."
                    />
                </Field>

                {/* PDF File Management Card */}
                <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/80 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400">Bootcamp PDF Asset</div>
                                <h4 className="text-sm font-black text-zinc-900">PDF Deliverable File</h4>
                            </div>
                        </div>
                        {formData.file_path && (
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[9px] font-black uppercase tracking-wider">
                                File Attached
                            </Badge>
                        )}
                    </div>

                    {formData.file_path ? (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-4">
                            <div className="min-w-0 flex-1">
                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">File Path / URL:</span>
                                <p className="mt-1 break-all text-xs font-bold text-zinc-800">{formData.file_path}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <a
                                    href={getAssetUrl(formData.file_path)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-zinc-200 bg-zinc-50 text-[10px] font-black uppercase tracking-wider text-zinc-700 hover:bg-zinc-100 transition-colors"
                                >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    Preview PDF
                                </a>
                                <Button
                                    type="button"
                                    onClick={() => setIsRemovePdfDialogOpen(true)}
                                    variant="outline"
                                    className="h-10 px-3 rounded-xl border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-zinc-200 bg-white p-6 text-center">
                            <p className="text-xs font-semibold text-zinc-400">No PDF uploaded yet for this mission.</p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                        <div className="w-full sm:w-auto">
                            <label className="inline-flex h-12 w-full sm:w-auto cursor-pointer items-center justify-center gap-3 rounded-2xl bg-zinc-950 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-zinc-800 transition-colors">
                                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                                {formData.file_path ? 'Replace PDF File' : 'Upload PDF Document'}
                                <input type="file" accept="application/pdf,.pdf" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                            </label>
                        </div>
                        <div className="text-[10px] font-medium text-zinc-400 text-center sm:text-right">
                            Accepts .pdf files (stored in Supabase <code className="font-bold">portfolio-assets</code> bucket)
                        </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-200">
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Or Paste Direct File Path / URL:</span>
                        <Input
                            value={formData.file_path || ''}
                            onChange={(e) => updateField('file_path', e.target.value || null)}
                            placeholder="product/documents/filename.pdf or https://..."
                            className="mt-1 h-11 rounded-xl bg-white text-xs font-mono text-zinc-700"
                        />
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => updateField('is_published', !formData.is_published)}
                    className={cn(
                        'flex h-14 w-full items-center justify-between rounded-2xl border px-6 text-[10px] font-black uppercase tracking-[0.22em] transition-all',
                        formData.is_published ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-zinc-200 bg-zinc-50 text-zinc-500'
                    )}
                >
                    Published
                    <span className="font-black">{formData.is_published ? 'Yes' : 'No'}</span>
                </button>
            </motion.form>

            <DeleteConfirmDialog
                isOpen={isRemovePdfDialogOpen}
                onClose={() => setIsRemovePdfDialogOpen(false)}
                onConfirm={handleRemoveFile}
                title="Detach PDF File"
                description="Are you sure you want to remove this attached PDF from the document metadata? You can upload a new one anytime."
                itemName={formData.file_path || undefined}
            />
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400">{label}</span>
            {children}
        </label>
    );
}
