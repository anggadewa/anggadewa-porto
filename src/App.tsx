import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import ProjectDetail from '@/pages/ProjectDetail';
import ProductPortfolio from '@/pages/ProductPortfolio';
import ProductCaseDetail from '@/pages/ProductCaseDetail';
import Login from '@/pages/Login';
import AdminDashboard from '@/pages/Admin/Dashboard';
import NotFound from '@/pages/NotFound';

export default function App() {
  const isProductSubdomain = typeof window !== 'undefined' && window.location.hostname.startsWith('product.');

  if (isProductSubdomain) {
    return (
      <Routes>
        <Route path="/" element={<ProductPortfolio />} />
        <Route path="/cases/:slug" element={<ProductCaseDetail />} />
        <Route path="*" element={<ProductPortfolio />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product" element={<ProductPortfolio />} />
      <Route path="/product/cases/:slug" element={<ProductCaseDetail />} />
      <Route path="/projects/:slug" element={<ProjectDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/*" element={<AdminDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
