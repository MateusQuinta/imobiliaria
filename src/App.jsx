import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './hooks/useSupabaseAuth'
import HomePage from './pages/HomePage'
import ListingPage from './pages/ListingPage'
import PropertyDetailPage from './pages/PropertyDetailPage'
import SobrePage from './pages/SobrePage'
import ContatoPage from './pages/ContatoPage'
import StyleGuide from './pages/StyleGuide'
import AdminRoute from './components/Admin/AdminRoute'
import AdminLayout from './pages/Admin/AdminLayout'
import LoginPage from './pages/Admin/LoginPage'
import RegisterPage from './pages/Admin/RegisterPage'
import DashboardPage from './pages/Admin/DashboardPage'
import PropertiesPage from './pages/Admin/PropertiesPage'
import LeadsPage from './pages/Admin/LeadsPage'
import AdminsPage from './pages/Admin/AdminsPage'
import PropertyFormPage from './pages/Admin/PropertyFormPage'

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/imoveis" element={<ListingPage />} />
            <Route path="/imoveis/:id" element={<PropertyDetailPage />} />
            <Route path="/sobre" element={<SobrePage />} />
            <Route path="/contato" element={<ContatoPage />} />
            <Route path="/vender" element={<ContatoPage />} />
            <Route path="/style-guide" element={<StyleGuide />} noIndex />
            
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin/register" element={<RegisterPage />} />
            
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="properties" element={<PropertiesPage />} />
              <Route path="properties/new" element={<PropertyFormPage />} />
              <Route path="properties/:id/edit" element={<PropertyFormPage />} />
              <Route path="leads" element={<LeadsPage />} />
              <Route path="admins" element={<AdminsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  )
}
