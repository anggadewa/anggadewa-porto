import { Award, BadgeCheck, ExternalLink, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAssetUrl } from '@/lib/assets';
import type { CertificateRecord } from '@/types';

interface CertificateShowcaseProps {
    certificates: CertificateRecord[];
    audience: 'developer' | 'product';
}

export default function CertificateShowcase({ certificates, audience }: CertificateShowcaseProps) {
    const isProduct = audience === 'product';
    const label = isProduct ? 'Product Development' : 'Professional Development';
    const intro = isProduct
        ? 'Selected learning milestones that strengthen how I research, define, and validate product decisions.'
        : 'Selected learning milestones that support how I design, build, and deliver digital products.';

    if (certificates.length === 0) return null;

    return (
        <section id="certificates" className="bg-white px-6 py-24 lg:px-12">
            <div className="mx-auto max-w-7xl space-y-12">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-6">
                        <span className="block text-[11px] font-black uppercase tracking-[0.4em] text-primary">{label}</span>
                        <h2 className="text-5xl font-black uppercase leading-[0.9] tracking-tight text-zinc-950 md:text-7xl">
                            Certificates <br />
                            <span className="text-primary italic">& Credentials.</span>
                        </h2>
                    </div>
                    <p className="max-w-md text-base font-medium leading-relaxed text-zinc-500 md:pb-1">{intro}</p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {certificates.map((certificate, index) => (
                        <motion.article key={certificate.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="group relative overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-[0_12px_36px_rgba(0,0,0,0.035)] transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
                            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/5 blur-3xl transition-all group-hover:bg-primary/15" />
                            <div className="relative">
                                {certificate.image_path && certificate.image_path.toLowerCase().endsWith('.pdf') ? (
                                    <div className="mb-6 flex aspect-[16/10] flex-col items-center justify-center gap-3 rounded-[1.35rem] border border-rose-100 bg-gradient-to-br from-rose-50 via-white to-violet-50 text-rose-600">
                                        <FileText className="h-12 w-12" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">PDF credential</span>
                                    </div>
                                ) : certificate.image_path ? (
                                    <div className="mb-6 aspect-[16/10] overflow-hidden rounded-[1.35rem] border border-zinc-100 bg-zinc-50">
                                        <img src={getAssetUrl(certificate.image_path)} alt={`Certificate ${certificate.title}`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                                    </div>
                                ) : (
                                    <div className="mb-6 flex aspect-[16/10] items-center justify-center rounded-[1.35rem] border border-primary/10 bg-gradient-to-br from-primary/10 via-white to-violet-50 text-primary"><Award className="h-12 w-12" /></div>
                                )}
                                <div className="mb-3 flex items-center justify-between gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400"><span>{certificate.issuer}</span><BadgeCheck className="h-4 w-4 shrink-0 text-primary" /></div>
                                <h3 className="text-2xl font-black uppercase leading-[0.95] tracking-tight text-zinc-950">{certificate.title}</h3>
                                <div className="mt-5 flex items-center justify-between gap-4 border-t border-zinc-100 pt-4 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-400">
                                    <span>{certificate.issued_at ? new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(new Date(`${certificate.issued_at}T00:00:00`)) : 'Credential'}</span>
                                    {(certificate.credential_url || certificate.image_path?.toLowerCase().endsWith('.pdf')) && <a href={certificate.credential_url || getAssetUrl(certificate.image_path)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-primary transition-colors hover:text-zinc-950">{certificate.image_path?.toLowerCase().endsWith('.pdf') ? 'Open PDF' : 'View'} <ExternalLink className="h-3.5 w-3.5" /></a>}
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
