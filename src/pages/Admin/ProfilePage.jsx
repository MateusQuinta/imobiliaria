import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { 
  User, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink, 
  Save, 
  Upload, 
  Camera,
  FileCheck
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
    city: '',
    avatar_url: ''
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        city: profile.city || 'São José dos Campos',
        avatar_url: profile.avatar_url || ''
      })
    }
  }, [profile])

  const handleAvatarUpload = async (file) => {
    if (!file) return
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const fileName = `avatar-${Date.now()}.${ext}`
      const filePath = `avatars/${fileName}`

      const { error } = await supabase.storage
        .from('property-images')
        .upload(filePath, file)

      if (error) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, avatar_url: reader.result }))
          setUploading(false)
        }
        reader.readAsDataURL(file)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, avatar_url: publicUrl }))
      toast.success('Foto de perfil atualizada!')
    } catch (err) {
      toast.error('Erro ao enviar foto.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({
          name: formData.name,
          phone: formData.phone,
          bio: formData.bio,
          city: formData.city,
          avatar_url: formData.avatar_url
        })
        .eq('id', user.id)

      if (error) throw error

      await refreshProfile()
      toast.success('Perfil atualizado com sucesso!')
    } catch (err) {
      toast.error('Erro ao salvar alterações.')
    } finally {
      setSaving(false)
    }
  }

  const brokerId = profile?.id || user?.id

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-navy-900">Meu Perfil Profissional</h1>
          <p className="text-warm-500 text-sm mt-0.5">
            Gerencie suas informações públicas, biografia e foto de exibição no site.
          </p>
        </div>

        {brokerId && (
          <Link
            to={`/corretor/${brokerId}`}
            target="_blank"
            className="btn btn-secondary gap-2 text-xs py-2.5 px-4 bg-white border-warm-300 hover:border-gold-500 shadow-sm"
          >
            <ExternalLink size={14} className="text-gold-600" />
            Ver Minha Página Pública
          </Link>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm border border-warm-200 space-y-8">
        {/* Foto de perfil e resumo */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-warm-200">
          <div className="relative group">
            <img
              src={formData.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80'}
              alt={formData.name || 'Corretor'}
              className="w-28 h-28 rounded-2xl object-cover border-2 border-gold-500/50 shadow-md"
            />
            <label className="absolute inset-0 bg-black/40 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition cursor-pointer">
              <Camera size={22} />
              <span className="text-[10px] font-semibold mt-1">Alterar Foto</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => handleAvatarUpload(e.target.files[0])}
              />
            </label>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="font-serif text-2xl font-bold text-navy-900">{formData.name || 'Nome do Corretor'}</h2>
              <span className="bg-gold-50 text-gold-700 text-xs font-bold px-2 py-0.5 rounded border border-gold-200">
                CRECI-{profile?.creci_uf || 'SP'} {profile?.creci || 'Em análise'}
              </span>
            </div>
            <p className="text-xs text-warm-500">{user?.email}</p>
            <p className="text-xs text-emerald-600 font-medium flex items-center justify-center sm:justify-start gap-1">
              <ShieldCheck size={14} /> Cadastro verificado pela Viva Belle Imobiliária
            </p>
          </div>
        </div>

        {/* Campos Editáveis */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
              Nome de Exibição *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
              WhatsApp / Telefone *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              placeholder="(12) 99999-9999"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
              Cidade Principal de Atuação
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={e => setFormData({...formData, city: e.target.value})}
              placeholder="São José dos Campos"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
              URL da Foto de Perfil (ou use o botão acima)
            </label>
            <input
              type="url"
              value={formData.avatar_url}
              onChange={e => setFormData({...formData, avatar_url: e.target.value})}
              placeholder="https://..."
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
            Mini Biografia Profissional
          </label>
          <textarea
            rows={4}
            value={formData.bio}
            onChange={e => setFormData({...formData, bio: e.target.value})}
            placeholder="Conte sua trajetória, tempo de mercado no Vale do Paraíba, nicho de atuação e diferenciais..."
            className="input-field text-sm"
          />
        </div>

        {/* Dados Legais (Somente Leitura) */}
        <div className="bg-warm-50 p-6 rounded-2xl border border-warm-200">
          <h3 className="font-serif text-base font-bold text-navy-900 mb-4 flex items-center gap-2">
            <FileCheck size={18} className="text-gold-500" /> Registro Legal no CRECI
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-warm-500 block">Número do Registro:</span>
              <strong className="text-navy-900 text-sm">{profile?.creci || 'Não informado'}</strong>
            </div>
            <div>
              <span className="text-warm-500 block">Conselho Regional:</span>
              <strong className="text-navy-900 text-sm">CRECI-{profile?.creci_uf || 'SP'}</strong>
            </div>
            <div>
              <span className="text-warm-500 block">Situação Cadastral:</span>
              <strong className="text-emerald-700 text-sm capitalize">{profile?.creci_type || 'Definitivo'}</strong>
            </div>
          </div>
          <p className="text-[11px] text-warm-400 mt-4">
            * Para alterações no número do CRECI ou UF, solicite autorização direta à diretoria por motivos de conformidade legal.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary gap-2 py-3 px-8 text-sm font-semibold shadow-md"
          >
            <Save size={16} />
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  )
}
