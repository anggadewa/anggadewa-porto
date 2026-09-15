import { useEffect, useState } from 'react';
import type React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Loader2, Plus, Save, Sparkles, X, Briefcase, ExternalLink, Image as ImageIcon, Trash2, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { getAssetUrl } from '@/lib/assets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ProductCaseStudyRecord, ProductEvidenceMode, Project } from '@/types';

type ProductCaseFormData = Omit<Partial<ProductCaseStudyRecord>, 'deliverables'> & {
    deliverables: string[];
    images?: string[] | null;
    approach_images?: string[] | null;
    output_images?: string[] | null;
    outcome_images?: string[] | null;
};

type UploadSectionType = 'thumbnail' | 'gallery' | 'approach' | 'output' | 'outcome';

const evidenceModes: ProductEvidenceMode[] = ['Outcome', 'Validation Outcome', 'Learning & Next Improvement'];

const emptyForm: ProductCaseFormData = {
    project_id: null,
    title: '',
    slug: '',
    category: '',
    summary: '',
    role: '',
    timeline: 'Real Product Study',
    mode: 'Learning & Next Improvement',
    visual: '',
    thumbnail: null,
    images: [],
    approach_images: [],
    output_images: [],
    outcome_images: [],
    context: '',
    problem: '',
    insight: '',
    approach: '',
    output: '',
    outcome: '',
    deliverables: [],
    sort_order: 1,
    is_published: true
};

export default function ProductCaseForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<ProductCaseFormData>(emptyForm);
    const [deliverableInput, setDeliverableInput] = useState('');
    const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string>('');
    const [loading, setLoading] = useState(Boolean(id));
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            const { data } = await supabase
                .from('projects')
                .select('*')
                .order('title', { ascending: true });
            if (data) {
                setAvailableProjects(data as Project[]);
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        if (!id) return;

        const fetchCase = async () => {
            setLoading(true);
            const { data } = await supabase
                .from('product_case_studies')
                .select('*')
                .eq('id', id)
                .single();

            if (data) {
                setFormData({
                    ...(data as ProductCaseStudyRecord),
                    deliverables: Array.isArray(data.deliverables) ? data.deliverables : [],
                    images: Array.isArray(data.images) ? data.images : [],
                    approach_images: Array.isArray(data.approach_images) ? data.approach_images : [],
                    output_images: Array.isArray(data.output_images) ? data.output_images : [],
                    outcome_images: Array.isArray(data.outcome_images) ? data.outcome_images : []
                });
                if (data.project_id) {
                    setSelectedProjectId(String(data.project_id));
                }
            }
            setLoading(false);
        };

        fetchCase();
    }, [id]);

    const updateField = <K extends keyof ProductCaseFormData>(key: K, value: ProductCaseFormData[K]) => {
        setFormData((current) => ({ ...current, [key]: value }));
    };

    const handleProjectSelect = (projIdStr: string) => {
        setSelectedProjectId(projIdStr);
        if (!projIdStr) {
            updateField('project_id', null);
            return;
        }
        const projId = Number(projIdStr);
        updateField('project_id', projId);
    };

    const [uploadingImage, setUploadingImage] = useState(false);

    const handleAutoFillFromProject = () => {
        if (!selectedProjectId) return;
        const project = availableProjects.find((p) => p.id === Number(selectedProjectId));
        if (!project) return;

        const confirmFill = !formData.title || window.confirm('Auto-fill will update title, slug, category, summary, role, timeline, visual, thumbnail, and images from the selected project. Proceed?');
        if (!confirmFill) return;

        const cleanVisual = project.title.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);

        setFormData((prev) => ({
            ...prev,
            project_id: project.id,
            title: project.title,
            slug: project.slug,
            category: project.category,
            summary: project.description,
            role: project.role || 'Product Thinker, UI/UX, Lead',
            timeline: project.timeline || 'Real Product Study',
            visual: prev.visual || cleanVisual || project.title.slice(0, 8).toUpperCase(),
            thumbnail: prev.thumbnail || project.thumbnail,
            images: prev.images && prev.images.length > 0 ? prev.images : (project.images || []),
            output_images: prev.output_images && prev.output_images.length > 0 ? prev.output_images : (project.images || [])
        }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: UploadSectionType) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingImage(true);
        const folder = type === 'thumbnail' ? 'thumbnails' : type;
        const bucketName = import.meta.env.VITE_STORAGE_BUCKET_NAME || 'portfolio-assets';

        for (const file of Array.from(files)) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `product/${folder}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file);

            if (uploadError) {
                alert('Error uploading: ' + uploadError.message);
                continue;
            }

            if (type === 'thumbnail') {
                updateField('thumbnail', filePath);
            } else if (type === 'approach') {
                setFormData((prev) => ({
                    ...prev,
                    approach_images: [...(prev.approach_images || []), filePath]
                }));
            } else if (type === 'output') {
                setFormData((prev) => ({
                    ...prev,
                    output_images: [...(prev.output_images || []), filePath]
                }));
            } else if (type === 'outcome') {
                setFormData((prev) => ({
                    ...prev,
                    outcome_images: [...(prev.outcome_images || []), filePath]
                }));
            } else {
                setFormData((prev) => ({
                    ...prev,
                    images: [...(prev.images || []), filePath]
                }));
            }
        }
        setUploadingImage(false);
        e.target.value = '';
    };

    const handleRemoveImage = (path: string, type: UploadSectionType) => {
        if (type === 'thumbnail') {
            updateField('thumbnail', null);
        } else if (type === 'approach') {
            setFormData((prev) => ({
                ...prev,
                approach_images: (prev.approach_images || []).filter((img) => img !== path)
            }));
        } else if (type === 'output') {
            setFormData((prev) => ({
                ...prev,
                output_images: (prev.output_images || []).filter((img) => img !== path)
            }));
        } else if (type === 'outcome') {
            setFormData((prev) => ({
                ...prev,
                outcome_images: (prev.outcome_images || []).filter((img) => img !== path)
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                images: (prev.images || []).filter((img) => img !== path)
            }));
        }
    };

    const addDeliverable = () => {
        const value = deliverableInput.trim();
        if (!value || formData.deliverables.includes(value)) return;
        updateField('deliverables', [...formData.deliverables, value]);
        setDeliverableInput('');
    };

    const removeDeliverable = (value: string) => {
        updateField('deliverables', formData.deliverables.filter((item) => item !== value));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSaving(true);

        const { id: _, project: __, created_at: ___, updated_at: ____, ...payload } = formData;
        const finalPayload = {
            ...payload,
            project_id: formData.project_id ? Number(formData.project_id) : null,
            slug: formData.slug || formData.title?.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            visual: formData.visual || formData.title,
            updated_at: new Date().toISOString()
        };

        const { error } = id
            ? await supabase.from('product_case_studies').update(finalPayload).eq('id', id)
            : await supabase.from('product_case_studies').insert([finalPayload]);

        setSaving(false);

        if (error) {
            alert(error.message);
            return;
        }

        navigate('/admin/product');
    };

    if (loading) {
        return (
            <div className="flex justify-center py-32">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            </div>
        );
    }

    const linkedProject = availableProjects.find((p) => p.id === formData.project_id);

    return (
        <div className="mx-auto max-w-6xl space-y-10 pb-24">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div className="flex items-center gap-5">
                    <Link to="/admin/product">
                        <Button variant="ghost" className="h-12 w-12 rounded-2xl border border-zinc-200 bg-white p-0 text-zinc-500">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter text-zinc-900">{id ? 'Edit Case Study' : 'New Case Study'}</h1>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">Product portfolio detail content</p>
                    </div>
                </div>
                <Button onClick={handleSubmit} disabled={saving} className="h-14 rounded-2xl bg-primary px-8 text-[10px] font-black uppercase tracking-[0.22em] text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Case
                </Button>
            </div>

            {/* Project Selection / Auto-fill Helper Banner */}
            <div className="rounded-[2rem] border border-primary/20 bg-gradient-to-r from-primary/5 via-violet-500/5 to-transparent p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                            <Briefcase className="h-3.5 w-3.5" />
                            <span>Link Existing Developer Project</span>
                        </div>
                        <h3 className="text-lg font-black text-zinc-900">Transform a Development Project into a Product Case Study</h3>
                        <p className="text-sm font-medium text-zinc-500 max-w-2xl">
                            Select one of your existing dev projects to link it and auto-populate basic details (title, category, role, summary), then focus on writing the product problem, insights, and validation outcomes.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <select
                            value={selectedProjectId}
                            onChange={(e) => handleProjectSelect(e.target.value)}
                            className="h-12 rounded-xl border border-zinc-200 bg-white px-4 text-xs font-bold text-zinc-800 shadow-sm outline-none focus:border-primary"
                        >
                            <option value="">-- Standalone / No Linked Project --</option>
                            {availableProjects.map((proj) => (
                                <option key={proj.id} value={proj.id}>
                                    {proj.title} ({proj.category})
                                </option>
                            ))}
                        </select>
                        <Button
                            type="button"
                            onClick={handleAutoFillFromProject}
                            disabled={!selectedProjectId}
                            className="h-12 rounded-xl bg-zinc-900 px-5 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-zinc-800 disabled:opacity-50"
                        >
                            <Sparkles className="h-3.5 w-3.5 mr-2 text-primary" />
                            Auto-fill from Project
                        </Button>
                    </div>
                </div>

                {linkedProject && (
                    <div className="mt-4 flex items-center gap-3 pt-4 border-t border-primary/10">
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[9px] font-black uppercase tracking-wider">
                            Currently Linked: {linkedProject.title}
                        </Badge>
                        <a
                            href={`/projects/${linkedProject.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-400 hover:text-primary transition-colors"
                        >
                            Preview project page <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                    <Field label="Title">
                        <Input
                            value={formData.title || ''}
                            onChange={(event) => {
                                const title = event.target.value;
                                updateField('title', title);
                                if (!id) {
                                    updateField('slug', title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
                                }
                            }}
                            required
                            className="h-14 rounded-2xl bg-zinc-50 font-bold"
                            placeholder="e.g. Apta Sounding"
                        />
                    </Field>
                    <div className="grid gap-6 md:grid-cols-2">
                        <Field label="Slug">
                            <Input value={formData.slug || ''} onChange={(event) => updateField('slug', event.target.value)} required className="h-14 rounded-2xl bg-zinc-50 font-bold" placeholder="e.g. apta-sounding" />
                        </Field>
                        <Field label="Category">
                            <Input value={formData.category || ''} onChange={(event) => updateField('category', event.target.value)} required className="h-14 rounded-2xl bg-zinc-50 font-bold" placeholder="e.g. Operational Workflow" />
                        </Field>
                    </div>
                    <Field label="Summary">
                        <textarea value={formData.summary || ''} onChange={(event) => updateField('summary', event.target.value)} required className="h-28 w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm font-semibold outline-none focus:border-primary/50" placeholder="Brief value proposition and product purpose..." />
                    </Field>

                    {/* 00. Hero Mockup / Cover Image */}
                    <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-black uppercase tracking-wider text-zinc-900 flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4 text-primary" />
                                    Hero Mockup / Cover Image (Thumbnail)
                                </h4>
                                <p className="text-xs font-medium text-zinc-500 mt-1">
                                    Gambar visual utama / mockup aplikasi yang tampil di header paling atas dan kartu portofolio.
                                </p>
                            </div>
                            {uploadingImage && (
                                <div className="flex items-center gap-2 text-xs font-bold text-primary">
                                    <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                                </div>
                            )}
                        </div>

                        {formData.thumbnail ? (
                            <div className="relative group w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                                <img
                                    src={getAssetUrl(formData.thumbnail)}
                                    alt="Thumbnail preview"
                                    className="h-48 w-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(formData.thumbnail!, 'thumbnail')}
                                    className="absolute top-2 right-2 rounded-xl bg-red-600/90 text-white p-2 text-xs font-bold shadow hover:bg-red-700 transition-colors"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                <label className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 bg-white px-5 text-xs font-bold text-zinc-700 hover:border-primary hover:text-primary transition-colors">
                                    <Upload className="h-4 w-4" />
                                    <span>Upload Hero Mockup</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e, 'thumbnail')}
                                        className="hidden"
                                    />
                                </label>
                                <div className="flex-1">
                                    <Input
                                        value={formData.thumbnail || ''}
                                        onChange={(e) => updateField('thumbnail', e.target.value)}
                                        placeholder="Atau paste URL cover mockup langsung..."
                                        className="h-12 rounded-xl bg-white text-xs font-semibold"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 01. Context */}
                    <Field label="01. CONTEXT">
                        <textarea
                            value={formData.context || ''}
                            onChange={(event) => updateField('context', event.target.value)}
                            required
                            className="h-32 w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm font-semibold leading-relaxed outline-none focus:border-primary/50"
                            placeholder="Background context, business environment, target users, and constraints..."
                        />
                    </Field>

                    {/* 02. Problem */}
                    <Field label="02. PROBLEM">
                        <textarea
                            value={formData.problem || ''}
                            onChange={(event) => updateField('problem', event.target.value)}
                            required
                            className="h-32 w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm font-semibold leading-relaxed outline-none focus:border-primary/50"
                            placeholder="User pain points, bottlenecks, friction points, and quantitative or qualitative evidence..."
                        />
                    </Field>

                    {/* 03. Research Insight */}
                    <Field label="03. RESEARCH INSIGHT">
                        <textarea
                            value={formData.insight || ''}
                            onChange={(event) => updateField('insight', event.target.value)}
                            required
                            className="h-32 w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm font-semibold leading-relaxed outline-none focus:border-primary/50"
                            placeholder="Key research findings, behavioral patterns, survey metrics, or user quotes..."
                        />
                    </Field>

                    {/* 04. Approach + Flowchart / Wireframe Upload */}
                    <div className="space-y-2">
                        <Field label="04. APPROACH">
                            <textarea
                                value={formData.approach || ''}
                                onChange={(event) => updateField('approach', event.target.value)}
                                required
                                className="h-32 w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm font-semibold leading-relaxed outline-none focus:border-primary/50"
                                placeholder="Methodology, decision framework, user flow mapping, and prioritization logic..."
                            />
                        </Field>
                        <SectionVisualUploader
                            title="Approach Visuals (Flowchart / User Journey / Wireframe)"
                            desc="Upload diagram alur logika, flowchart navigasi, atau sketsa wireframe awal."
                            badge="Flowchart / Wireframe"
                            type="approach"
                            images={formData.approach_images}
                            onUpload={handleFileUpload}
                            onRemove={handleRemoveImage}
                        />
                    </div>

                    {/* 05. Output + UI Screens / Prototypes Upload */}
                    <div className="space-y-2">
                        <Field label="05. OUTPUT">
                            <textarea
                                value={formData.output || ''}
                                onChange={(event) => updateField('output', event.target.value)}
                                required
                                className="h-32 w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm font-semibold leading-relaxed outline-none focus:border-primary/50"
                                placeholder="Tangible deliverables, PRD specifications, design components, and interactive prototypes..."
                            />
                        </Field>
                        <SectionVisualUploader
                            title="Output Visuals (High-Fidelity UI Screens & Interactive Mockups)"
                            desc="Upload screenshot tampilan UI aplikasi yang sudah jadi, komponen utama, atau interaksi mockup."
                            badge="Final UI Screens"
                            type="output"
                            images={formData.output_images}
                            onUpload={handleFileUpload}
                            onRemove={handleRemoveImage}
                        />
                    </div>

                    {/* 06. Outcome + Usability Testing / Metrics Charts Upload */}
                    <div className="space-y-2">
                        <Field label={`06. ${(formData.mode || 'Outcome').toUpperCase()}`}>
                            <textarea
                                value={formData.outcome || ''}
                                onChange={(event) => updateField('outcome', event.target.value)}
                                required
                                className="h-32 w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm font-semibold leading-relaxed outline-none focus:border-primary/50"
                                placeholder="Impact metrics, Usability Testing before/after validation, or key learnings and future roadmap..."
                            />
                        </Field>
                        <SectionVisualUploader
                            title="Outcome Visuals (Testing Charts / Before vs After / Metrics)"
                            desc="Upload grafik hasil Usability Testing (SUS Score, task completion), atau diagram metrik dampak (opsional)."
                            badge="Validation / Metrics"
                            type="outcome"
                            images={formData.outcome_images}
                            onUpload={handleFileUpload}
                            onRemove={handleRemoveImage}
                        />
                    </div>

                    {/* Extra Gallery / Other Artifacts (Optional) */}
                    <div className="pt-2">
                        <SectionVisualUploader
                            title="Extra Visual Artifacts (Optional Gallery)"
                            desc="Gambar pendukung tambahan lain yang ingin dimasukkan ke galeri umum."
                            badge="Additional Screens"
                            type="gallery"
                            images={formData.images}
                            onUpload={handleFileUpload}
                            onRemove={handleRemoveImage}
                        />
                    </div>
                </motion.div>

                <motion.aside initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="h-fit space-y-6 rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                    <div className="grid gap-5">
                        <Field label="Role">
                            <Input value={formData.role || ''} onChange={(event) => updateField('role', event.target.value)} className="h-12 rounded-2xl bg-zinc-50 font-bold" placeholder="e.g. Product Thinker, UI/UX" />
                        </Field>
                        <Field label="Timeline / Type">
                            <Input value={formData.timeline || ''} onChange={(event) => updateField('timeline', event.target.value)} className="h-12 rounded-2xl bg-zinc-50 font-bold" placeholder="e.g. Real Product Study" />
                        </Field>
                        <Field label="Visual Marker">
                            <Input value={formData.visual || ''} onChange={(event) => updateField('visual', event.target.value)} className="h-12 rounded-2xl bg-zinc-50 font-bold uppercase" placeholder="e.g. SOUNDING" />
                        </Field>
                        <Field label="Sort Order">
                            <Input type="number" value={formData.sort_order || 1} onChange={(event) => updateField('sort_order', Number(event.target.value))} className="h-12 rounded-2xl bg-zinc-50 font-bold" />
                        </Field>
                    </div>

                    <div className="space-y-3">
                        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400">Evidence Mode</div>
                        <div className="grid gap-2">
                            {evidenceModes.map((mode) => (
                                <button key={mode} type="button" onClick={() => updateField('mode', mode)} className={cn('rounded-2xl border px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest transition-all', formData.mode === mode ? 'border-primary bg-primary text-white shadow-md shadow-primary/20' : 'border-zinc-200 bg-zinc-50 text-zinc-500 hover:bg-zinc-100')}>
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400">Deliverables</div>
                        <div className="flex gap-2">
                            <Input value={deliverableInput} onChange={(event) => setDeliverableInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addDeliverable(); } }} className="h-12 rounded-2xl bg-zinc-50 font-bold" placeholder="PRD, Flow, User Story..." />
                            <Button type="button" onClick={addDeliverable} className="h-12 rounded-2xl px-4">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.deliverables.map((item) => (
                                <Badge key={item} className="gap-2 rounded-xl bg-primary/10 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary/10">
                                    {item}
                                    <X onClick={() => removeDeliverable(item)} className="h-3 w-3 cursor-pointer hover:text-rose-500" />
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <button type="button" onClick={() => updateField('is_published', !formData.is_published)} className={cn('flex h-14 w-full items-center justify-between rounded-2xl border px-5 text-[10px] font-black uppercase tracking-[0.22em] transition-all', formData.is_published ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-zinc-200 bg-zinc-50 text-zinc-500')}>
                        Published
                        <span className="font-black">{formData.is_published ? 'Yes' : 'No'}</span>
                    </button>
                </motion.aside>
            </form>
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

function SectionVisualUploader({
    title,
    desc,
    badge,
    type,
    images,
    onUpload,
    onRemove
}: {
    title: string;
    desc: string;
    badge: string;
    type: UploadSectionType;
    images?: string[] | null;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>, type: UploadSectionType) => void;
    onRemove: (path: string, type: UploadSectionType) => void;
}) {
    return (
        <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black uppercase tracking-wider text-zinc-900">{title}</span>
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-[8px] font-black uppercase tracking-widest">{badge}</Badge>
                    </div>
                    <p className="text-[11px] font-medium text-zinc-500 mt-0.5">{desc}</p>
                </div>
                <label className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 text-[10px] font-black uppercase tracking-wider text-white hover:bg-zinc-800 transition-colors w-fit shrink-0">
                    <Plus className="h-3 w-3" />
                    <span>Upload</span>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => onUpload(e, type)}
                        className="hidden"
                    />
                </label>
            </div>

            {images && images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-1">
                    {images.map((img, idx) => (
                        <div key={idx} className="relative group overflow-hidden rounded-xl border border-zinc-200 bg-white aspect-[16/10] shadow-sm">
                            <img
                                src={getAssetUrl(img)}
                                alt={`${title} ${idx + 1}`}
                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                            <button
                                type="button"
                                onClick={() => onRemove(img, type)}
                                className="absolute top-1.5 right-1.5 rounded-lg bg-red-600/90 text-white p-1.5 shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                            >
                                <Trash2 className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-zinc-200 bg-white/60 p-2.5 text-center text-[11px] text-zinc-400 italic">
                    Belum ada visual untuk section ini (opsional).
                </div>
            )}
        </div>
    );
}
