import {
    BadgeCheck,
    BookOpenCheck,
    ClipboardCheck,
    FileText,
    Layers3,
    Search,
    Workflow,
    type LucideIcon
} from 'lucide-react';
import type { ProductDocumentRecord } from '@/types';

export type ProductDocumentFallback = Omit<ProductDocumentRecord, 'id' | 'file_path' | 'sort_order' | 'is_published' | 'created_at' | 'updated_at'> & {
    icon: LucideIcon;
};

export const fallbackProductDocuments: ProductDocumentFallback[] = [
    {
        title: 'Mission 1: 10 Usability Heuristics & Heuristic Evaluation',
        type: 'Foundation',
        description: 'Rangkuman 10 prinsip Usability Heuristics (Nielsen Norman Group) dan evaluasi heuristik langsung pada aplikasi SIGNAL (Samsat Digital Nasional) v2.1.1 dengan severity rating 0-4 dan rekomendasi perbaikan UX.',
        icon: Search
    },
    {
        title: 'Mission 2: User Stories, Epics & Feature Priority',
        type: 'Practice',
        description: 'Pemetaan 10 User Stories dari user voices ke 3 Epics (FitConnect, FitTrack, NutriFit) pada aplikasi Go-Gym, serta analisis fitur prioritas utama berbasis empathy-drive, human touch, dan product logic.',
        icon: FileText
    },
    {
        title: 'Mission 3: UI Design Comparison & Usability Rationale',
        type: 'Practice',
        description: 'Analisis kritis komparasi desain UI A/B ("Do You See Any Difference?") membedah visibilitas status bar, kontras warna bubble chat, alignment interaktif, konvensi tombol end call, dan price tag clarity.',
        icon: Layers3
    },
    {
        title: 'Mission Intermediate 2: MediEase Smart Appointment',
        type: 'Intermediate',
        description: 'End-to-end PM deliverable untuk aplikasi healthtech MediEase: Research Plan (26 responden), Competitive Benchmarking vs Halodoc, User Persona (Rani), UVP, North Star Metric, dan Lean Canvas model bisnis.',
        icon: ClipboardCheck
    },
    {
        title: 'Mission 4: PRD, User Flow & Acceptance Criteria',
        type: 'Practice',
        description: 'Latihan dokumentasi produk terstruktur mencakup Product Requirements Document (PRD), pemetaan user flow, batasan sistem, dan acceptance criteria untuk handoff ke tim engineering.',
        icon: Workflow
    },
    {
        title: 'Mission 5: Usability Testing & Iteration Notes',
        type: 'Practice',
        description: 'Penyusunan skenario usability testing, validasi alur penggunaan dengan partisipan, identifikasi friction points, dan dokumentasi iterasi perbaikan produk berikutnya.',
        icon: BadgeCheck
    },
    {
        title: 'Mission Advanced: Comprehensive Product Strategy',
        type: 'Advanced',
        description: 'Kompilasi tingkat lanjut yang mengintegrasikan riset pasar, problem framing, arsitektur informasi, prototipe antarmuka, dan validasi kelayakan bisnis dalam satu portofolio PM utuh.',
        icon: BookOpenCheck
    }
];
