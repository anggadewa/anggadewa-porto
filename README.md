# Dewa_Command_Center // Frontend Team Lead Portfolio

![Version](https://img.shields.io/badge/VER-1.0.1__DEV-10B981?style=for-the-badge&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

Welcome to the **Dewa_Command_Center**, a high-fidelity "Premium Terminal" themed portfolio built for a Frontend Team Lead. The project leverages modern web development standards to portray skills and projects as systematic "Nodes," blending a raw cyberpunk/terminal aesthetic with extremely clean, glass-morphic, and dynamic UI animations.

This repository marks the architectural leap from a legacy Monolithic Laravel application to an edge-ready, decoupled **React + Vite** frontend powered by a serverless **Supabase** backend.

---

## 🚀 Core Features

- **High-End UI/UX Aesthetic**: Smooth Framer Motion animations, gradient glass-morphism, "terminal hacker" typography styles, and a curated dark mode palette (`#06080B`).
- **Dynamic Curriculum Vitae (CV) Engine**: The "DOWNLOAD_LOGS" functionality on the client-side directly connects to Supabase Storage. The Admin Panel allows hot-swappable PDF uploads that immediately synchronize live to viewers.
- **Data Driven "Nodes"**: Both the **Skill Domains** and **Project Gallery** sections map over dynamic databases to enforce data hygiene.
- **Secure Control Panel**: An exclusive `/admin` operational sector strictly protected by Supabase Session Authentication.
- **Built for Vercel**: Integrated `vercel.json` ensures rigorous HTTP security headers are enforced globally in production (protecting against XSS, MIME-sniffing, and Clickjacking).

---

## 🛠️ Technology Architecture

| Component         | Technology Used                                                                 |
| ----------------- | ------------------------------------------------------------------------------- |
| **Framework**     | React 18 / Vite                                                                 |
| **Language**      | TypeScript (`.tsx`)                                                             |
| **Styling**       | Tailwind CSS + Custom CSS Variables (`index.css`)                               |
| **Animations**    | Framer Motion                                                                   |
| **Components**    | Shadcn/ui (radix-ui composites) + Lucide React (Iconography)                    |
| **Backend/BaaS**  | Supabase (Auth, PostgreSQL DB, Storage Buckets)                                 |
| **Routing**       | React Router DOM `v6`                                                           |

---

## 💻 Local Development Setup

To initialize the project locally on your machine, follow these instructions:

### 1. Clone the Repository
```bash
git clone https://github.com/anggadewa/dewa-porto-app.git
cd dewa-porto-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file at the root of the project with your valid keys.
```env
VITE_APP_NAME="Frontend Team Lead Portofolio"
VITE_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
VITE_SUPABASE_ANON_KEY="your-public-anon-key-here"
VITE_STORAGE_BUCKET_NAME="portfolio-assets"
```

### 4. Database Setup (Supabase)
Run the provided `supabase_security.sql` in your Supabase SQL Editor. This script:
- Creates all necessary Row Level Security (RLS) locks to prevent unauthorized write access from public visitors.
- Enables the secure read state for the `portfolio-assets` bucket.
- Separates Admin logic safely onto the server side.

### 5. Initialize the Server
```bash
npm run dev
```
Execute localhost on port `5173`.

---

## 🔒 Security Posture
The application is pre-hardened for public deployment:
- `vercel.json` HTTP Header directives inject strict XSS protections and deny iframe clickjacking attempts upon deployment.
- Internal RLS enforces complete lockdown on Database and Storage manipulation attempts via the public client API.

> "EXECUTING_VISIONARY_LOGIC // NODE_IDENT: ALPHA_7_GLOBAL"

*Developed & Maintained by **Dewa**.*
