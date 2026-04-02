import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/Admin/AdminLayout';

// Sub-pages
import DashboardHome from './DashboardHome';
import ProjectList from './ProjectList';
import ProjectForm from './ProjectForm';
import SkillList from './SkillList';
import SkillForm from './SkillForm';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
                return;
            }
            setIsChecking(false);
        };

        checkUser();
    }, [navigate]);

    if (isChecking) {
        return (
            <div className="min-h-screen bg-[#06080B] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] font-black tracking-[0.4em] text-primary animate-pulse uppercase">Handshaking_Secure_Terminal...</span>
                </div>
            </div>
        );
    }

    return (
        <AdminLayout>
            <Routes>
                {/* Overview */}
                <Route path="/" element={<DashboardHome />} />
                
                {/* Projects */}
                <Route path="projects" element={<ProjectList />} />
                <Route path="projects/new" element={<ProjectForm />} />
                <Route path="projects/edit/:id" element={<ProjectForm />} />
                
                {/* Skills */}
                <Route path="skills" element={<SkillList />} />
                <Route path="skills/new" element={<SkillForm />} />
                <Route path="skills/edit/:id" element={<SkillForm />} />
            </Routes>
        </AdminLayout>
    );
}
