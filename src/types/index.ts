export interface Project {
  id: number;
  title: string;
  slug: string;
  category: string;
  description: string;
  thumbnail: string | null;
  images: string[] | null;
  tech_stack: string[] | null;
  is_featured: boolean;
  link: string | null;
  github_link: string | null;
  role: string | null;
  timeline: string | null;
  key_features: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: number;
  category: string;
  items: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type ProductEvidenceMode = 'Outcome' | 'Validation Outcome' | 'Learning & Next Improvement';

export interface ProductCaseStudyRecord {
  id: number;
  project_id?: number | null;
  project?: Project | null;
  slug: string;
  title: string;
  category: string;
  summary: string;
  role: string;
  timeline: string;
  mode: ProductEvidenceMode;
  visual: string;
  thumbnail?: string | null;
  images?: string[] | null;
  approach_images?: string[] | null;
  output_images?: string[] | null;
  outcome_images?: string[] | null;
  context: string;
  problem: string;
  insight: string;
  approach: string;
  output: string;
  outcome: string;
  deliverables: string[];
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductDocumentRecord {
  id: number;
  title: string;
  type: string;
  description: string;
  file_path: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ResumeVersion {
  id: string;
  file_path: string;
  file_name: string;
  file_size: number;
  is_active: boolean;
  created_at: string;
}

export type CertificateAudience = 'developer' | 'product';

export interface CertificateRecord {
  id: string;
  audience: CertificateAudience;
  title: string;
  issuer: string;
  issued_at: string | null;
  credential_url: string | null;
  image_path: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}
