import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, ExternalLink, FileText, Pencil, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getAssetUrl } from '@/lib/assets';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DeleteConfirmDialog from '@/components/Admin/DeleteConfirmDialog';
import type { CertificateRecord } from '@/types';

export default function CertificateList() {
    const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [target, setTarget] = useState<CertificateRecord | null>(null);
    const [deleting, setDeleting] = useState(false);

    const fetchCertificates = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('certificates').select('*').order('audience').order('sort_order').order('created_at', { ascending: false });
        if (error) alert('Certificate module is not ready. Run supabase_certificates.sql first.');
        setCertificates((data || []) as CertificateRecord[]);
        setLoading(false);
    };

    useEffect(() => { fetchCertificates(); }, []);

    const remove = async () => {
        if (!target) return;
        setDeleting(true);
        const { error } = await supabase.from('certificates').delete().eq('id', target.id);
        setDeleting(false);
        if (error) return alert(error.message);
        setCertificates((current) => current.filter((item) => item.id !== target.id));
        setTarget(null);
    };

    return <div className="space-y-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div><p className="text-[10px] font-black uppercase tracking-[0.28em] text-primary">Portfolio proof</p><h1 className="mt-2 text-4xl font-black uppercase tracking-tighter text-zinc-900">Certificates</h1><p className="mt-2 text-sm font-medium text-zinc-500">Credentials for Developer and Product portfolios.</p></div>
            <Link to="new"><Button className="h-12 rounded-2xl bg-primary px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-primary/20"><Plus className="mr-2 h-4 w-4" />Add certificate</Button></Link>
        </div>
        <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            {loading ? <div className="p-20 text-center text-[10px] font-black uppercase tracking-[0.3em] text-primary">Loading certificates...</div> : certificates.length === 0 ? <div className="p-20 text-center"><Award className="mx-auto mb-4 h-9 w-9 text-primary" /><p className="font-bold text-zinc-500">Belum ada sertifikat.</p></div> : <div className="divide-y divide-zinc-100">{certificates.map((certificate) => { const isPdf = certificate.image_path?.toLowerCase().endsWith('.pdf'); return <div key={certificate.id} className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between"><div className="flex min-w-0 items-center gap-4">{certificate.image_path ? isPdf ? <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-600"><FileText className="h-5 w-5" /></div> : <img src={getAssetUrl(certificate.image_path)} alt="" className="h-14 w-20 rounded-xl border border-zinc-100 object-cover" /> : <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Award className="h-5 w-5" /></div>}<div className="min-w-0"><div className="mb-2 flex flex-wrap gap-2"><Badge className={certificate.audience === 'product' ? 'bg-violet-50 text-violet-700 hover:bg-violet-50' : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-50'}>{certificate.audience === 'product' ? 'Product' : 'Developer'}</Badge>{isPdf && <Badge className="bg-rose-50 text-rose-600 hover:bg-rose-50">PDF</Badge>}<Badge className={certificate.is_published ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-100'}>{certificate.is_published ? 'Published' : 'Draft'}</Badge></div><h2 className="truncate text-xl font-black uppercase tracking-tight text-zinc-950">{certificate.title}</h2><p className="mt-1 text-xs font-bold text-zinc-400">{certificate.issuer}{certificate.issued_at ? ` · ${certificate.issued_at}` : ''}</p></div></div><div className="flex gap-2">{certificate.image_path && <a href={getAssetUrl(certificate.image_path)} target="_blank" rel="noreferrer"><Button variant="outline" className="h-10 rounded-xl"><ExternalLink className="h-4 w-4" /></Button></a>}<Link to={`edit/${certificate.id}`}><Button variant="outline" className="h-10 rounded-xl text-[10px] font-black uppercase tracking-widest"><Pencil className="mr-1.5 h-3.5 w-3.5" />Edit</Button></Link><Button onClick={() => setTarget(certificate)} variant="outline" className="h-10 rounded-xl border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100"><Trash2 className="h-4 w-4" /></Button></div></div>; })}</div>}
        </div>
        <DeleteConfirmDialog isOpen={Boolean(target)} onClose={() => setTarget(null)} onConfirm={remove} title="Delete Certificate" description="This removes the certificate card from the portfolio. The uploaded image remains in Storage." itemName={target?.title} isLoading={deleting} />
    </div>;
}
