import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import ProjectDetail from '@/pages/ProjectDetail';
import Login from '@/pages/Login';
import AdminDashboard from '@/pages/Admin/Dashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects/:slug" element={<ProjectDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/*" element={<AdminDashboard />} />
    </Routes>
  );
}
