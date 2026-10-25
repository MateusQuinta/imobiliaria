import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './hooks/useSupabaseAuth'
import { Toaster } from 'react-hot-toast'

// Páginas Públicas
import HomePage from './pages/HomePage'
import ListingPage from './pages/ListingPage'
import PropertyDetailPage from './pages/PropertyDetailPage'
import SobrePage from './pages/SobrePage'
import ContatoPage from './pages/ContatoPage'
import StyleGuide from './pages/StyleGuide'
import SejaUmCorretorPage from './pages/SejaUmCorretorPage/index'

// Autenticação e Status
import LoginPage from './pages/Admin/LoginPage'
import RegisterPage from './pages/Admin/RegisterPage'
import CadastroEmAnalisePage from './pages/Admin/CadastroEmAnalisePage'
import ContaSuspensaPage from './pages/Admin/ContaSuspensaPage'

// Painel do Corretor e Admin
import AdminRoute from './components/Admin/AdminRoute'
import AdminLayout from './pages/Admin/AdminLayout'
import DashboardPage from './pages/Admin/DashboardPage'
import PropertiesPage from './pages/Admin/PropertiesPage'
import PropertyFormPage from './pages/Admin/PropertyFormPage'
import LeadsPage from './pages/Admin/LeadsPage'
import VisitsPage from './pages/Admin/VisitsPage'
import CommissionsPage from './pages/Admin/CommissionsPage'
import ProfilePage from './pages/Admin/ProfilePage'

// Exclusivo Admin / Dono
import ApprovalsPage from './pages/Admin/ApprovalsPage'
import BrokersManagementPage from './pages/Admin/BrokersManagementPage'
import AgencySettingsPage from './pages/Admin/AgencySettingsPage'
import AuditLogsPage from './pages/Admin/AuditLogsPage'

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <BrowserRouter>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/imoveis" element={<ListingPage />} />
            <Route path="/imoveis/:id" element={<PropertyDetailPage />} />
            <Route path="/sobre" element={<SobrePage />} />
            <Route path="/contato" element={<ContatoPage />} />
            <Route path="/vender" element={<ContatoPage />} />
            <Route path="/seja-um-corretor" element={<SejaUmCorretorPage />} />
            <Route path="/style-guide" element={<StyleGuide />} />
            
            {/* Rotas de Autenticação & Status */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin/register" element={<RegisterPage />} />
            <Route path="/cadastro-em-analise" element={<CadastroEmAnalisePage />} />
            <Route path="/conta-suspensa" element={<ContaSuspensaPage />} />
            
            {/* Painel Administrativo e CRM do Corretor */}
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
              <Route path="visits" element={<VisitsPage />} />
              <Route path="commissions" element={<CommissionsPage />} />
              <Route path="profile" element={<ProfilePage />} />

              {/* Rotas de Gestão (Diretoria / Admin) */}
              <Route path="approvals" element={
                <AdminRoute adminOnly>
                  <ApprovalsPage />
                </AdminRoute>
              } />
              <Route path="brokers" element={
                <AdminRoute adminOnly>
                  <BrokersManagementPage />
                </AdminRoute>
              } />
              <Route path="admins" element={
                <AdminRoute adminOnly>
                  <BrokersManagementPage />
                </AdminRoute>
              } />
              <Route path="settings" element={
                <AdminRoute adminOnly>
                  <AgencySettingsPage />
                </AdminRoute>
              } />
              <Route path="audit" element={
                <AdminRoute adminOnly>
                  <AuditLogsPage />
                </AdminRoute>
              } />
            </Route>

            {/* Redirecionamento 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  )
}
