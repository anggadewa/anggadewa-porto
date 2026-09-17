import { useEffect, useRef, useState } from 'react';
import { ExternalLink, FileCheck2, FileClock, FileUp, Loader2, RefreshCcw, UploadCloud } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getAssetUrl } from '@/lib/assets';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ResumeVersion } from '@/types';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function formatBytes(size: number) {
    return new Intl.NumberFormat('id-ID', { style: 'unit', unit: 'kilobyte', maximumFractionDigits: 0 }).format(size / 1024);
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date));
}

function safeFileName(name: string) {
    return name.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-');
}

export default function ResumeManager() {
    const [versions, setVersions] = useState<ResumeVersion[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [activatingId, setActivatingId] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const fetchVersions = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('resume_versions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error loading resume versions:', error);
            alert('Resume module is not ready. Run the SQL setup file in Supabase first.');
        }
        setVersions((data || []) as ResumeVersion[]);
        setLoading(false);
    };

    useEffect(() => {
        fetchVersions();
    }, []);

    const setActive = async (version: ResumeVersion) => {
        if (version.is_active) return;
        setActivatingId(version.id);
        const currentActive = versions.find((item) => item.is_active);

        try {
            if (currentActive) {
                const { error } = await supabase.from('resume_versions').update({ is_active: false }).eq('id', currentActive.id);
                if (error) throw error;
            }

            const { error } = await supabase.from('resume_versions').update({ is_active: true }).eq('id', version.id);
            if (error) {
                if (currentActive) await supabase.from('resume_versions').update({ is_active: true }).eq('id', currentActive.id);
                throw error;
            }

            await fetchVersions();
        } catch (error) {
            console.error('Error activating resume:', error);
            alert('Gagal mengaktifkan CV. Silakan coba lagi.');
        } finally {
            setActivatingId(null);
        }
    };

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
            alert('Hanya file PDF yang dapat diunggah.');
            event.target.value = '';
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            alert('Ukuran file maksimal 10 MB.');
            event.target.value = '';
            return;
        }

        setUploading(true);
        const bucketName = import.meta.env.VITE_STORAGE_BUCKET_NAME || 'portfolio-assets';
        const filePath = `resumes/${Date.now()}-${crypto.randomUUID()}-${safeFileName(file.name)}`;
        const previousActive = versions.find((item) => item.is_active);

        try {
            const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, file, {
                cacheControl: '31536000',
                contentType: 'application/pdf',
                upsert: false,
            });
            if (uploadError) throw uploadError;

            if (previousActive) {
                const { error } = await supabase.from('resume_versions').update({ is_active: false }).eq('id', previousActive.id);
                if (error) throw error;
            }

            const { error: insertError } = await supabase.from('resume_versions').insert({
                file_path: filePath,
                file_name: file.name,
                file_size: file.size,
                is_active: true,
            });
            if (insertError) {
                if (previousActive) await supabase.from('resume_versions').update({ is_active: true }).eq('id', previousActive.id);
                throw insertError;
            }

            await fetchVersions();
            alert('CV berhasil diunggah dan sekarang menjadi versi aktif.');
        } catch (error) {
            console.error('Error uploading resume:', error);
            alert('Gagal mengunggah CV. Periksa konfigurasi Storage dan tabel resume_versions.');
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    const activeResume = versions.find((item) => item.is_active);
    const history = versions.filter((item) => !item.is_active);

    return (
        <div className="space-y-10">
            <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-primary">Portfolio file control</p>
                    <h1 className="mt-2 text-4xl font-black uppercase tracking-tighter text-zinc-900">CV & Resume</h1>
                    <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-zinc-500">Setiap upload disimpan sebagai versi baru. Pengunjung hanya mengunduh versi yang berstatus aktif.</p>
                </div>
                <div>
                    <input ref={inputRef} type="file" accept="application/pdf,.pdf" onChange={handleUpload} className="hidden" id="resume-upload" disabled={uploading} />
                    <label htmlFor="resume-upload">
                        <Button asChild disabled={uploading} className="h-12 cursor-pointer rounded-2xl bg-primary px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-primary/20">
                            <span>{uploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading...</> : <><UploadCloud className="mr-2 h-4 w-4" />Upload CV baru</>}</span>
                        </Button>
                    </label>
                </div>
            </section>

            <section className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white shadow-sm">
                <div className="flex flex-col gap-6 p-7 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="rounded-2xl border border-emerald-100 bg-white p-3 text-emerald-600"><FileCheck2 className="h-6 w-6" /></div>
                        <div>
                            <div className="mb-2 flex flex-wrap items-center gap-2"><Badge className="bg-emerald-600 text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600">Active CV</Badge></div>
                            <h2 className="text-xl font-black text-zinc-900">{activeResume?.file_name || 'Belum ada CV aktif'}</h2>
                            {activeResume && <p className="mt-1 text-xs font-medium text-zinc-500">Diunggah {formatDate(activeResume.created_at)} · {formatBytes(activeResume.file_size)}</p>}
                        </div>
                    </div>
                    {activeResume && <a href={getAssetUrl(activeResume.file_path)} target="_blank" rel="noreferrer"><Button variant="outline" className="h-11 rounded-xl border-emerald-200 bg-white text-[10px] font-black uppercase tracking-widest text-emerald-700 hover:bg-emerald-50"><ExternalLink className="mr-2 h-4 w-4" />Lihat PDF aktif</Button></a>}
                </div>
            </section>

            <section className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex items-center justify-between border-b border-zinc-100 p-7">
                    <div className="flex items-center gap-3"><FileClock className="h-5 w-5 text-primary" /><div><h2 className="text-lg font-black uppercase tracking-tight text-zinc-900">Riwayat CV</h2><p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{history.length} versi sebelumnya</p></div></div>
                    <Button onClick={fetchVersions} variant="ghost" className="h-10 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500"><RefreshCcw className="mr-2 h-3.5 w-3.5" />Refresh</Button>
                </div>
                {loading ? <div className="p-16 text-center text-[10px] font-black uppercase tracking-[0.3em] text-primary">Memuat versi...</div> : history.length === 0 ? <div className="p-16 text-center text-sm font-semibold text-zinc-500">Belum ada versi CV sebelumnya.</div> : <div className="divide-y divide-zinc-100">{history.map((version) => <div key={version.id} className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between"><div><h3 className="font-bold text-zinc-900">{version.file_name}</h3><p className="mt-1 text-xs font-medium text-zinc-400">{formatDate(version.created_at)} · {formatBytes(version.file_size)}</p></div><div className="flex flex-wrap gap-2"><a href={getAssetUrl(version.file_path)} target="_blank" rel="noreferrer"><Button variant="outline" className="h-10 rounded-xl text-[10px] font-black uppercase tracking-widest"><ExternalLink className="mr-1.5 h-3.5 w-3.5" />Lihat</Button></a><Button onClick={() => setActive(version)} disabled={activatingId !== null} className="h-10 rounded-xl bg-primary text-[10px] font-black uppercase tracking-widest text-white">{activatingId === version.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Jadikan aktif'}</Button></div></div>)}</div>}
            </section>
        </div>
    );
}
