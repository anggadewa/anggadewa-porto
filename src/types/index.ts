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
