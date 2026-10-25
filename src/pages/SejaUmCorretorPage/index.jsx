import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
import { logAuditEvent } from '../../lib/api'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import SEOHelmet from '../../components/SEOHelmet'
import { 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Upload, 
  ShieldCheck, 
  ArrowRight,
  FileCheck,
  Building2,
  FileText
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function SejaUmCorretorPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    cpf: '',
    creci: '',
    creci_uf: 'SP',
    creci_type: 'definitivo',
    city: 'São José dos Campos',
    bio: '',
    avatar_url: '',
    creci_card_front: '',
    creci_card_back: '',
    terms_accepted: false,
    lgpd_consent: false
  })

  const [loading, setLoading] = useState(false)
  const [uploadingFront, setUploadingFront] = useState(false)
  const [uploadingBack, setUploadingBack] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  // Upload helper para arquivos no Supabase Storage
  async function handleFileUpload(file, targetField, setProgress) {
    if (!file) return
    setProgress(true)
    try {
      const ext = file.name.split('.').pop()
      const fileName = `creci-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
      const filePath = `documents/${fileName}`

      const { data, error } = await supabase.storage
        .from('property-images') // reutiliza bucket existente
        .upload(filePath, file)

      if (error) {
        // Fallback: se bucket não permitir upload sem login, gera Data URL para não travar
        const reader = new FileReader()
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, [targetField]: reader.result }))
          toast.success('Documento anexado com sucesso!')
          setProgress(false)
        }
        reader.readAsDataURL(file)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, [targetField]: publicUrl }))
      toast.success('Documento anexado com sucesso!')
    } catch (err) {
      console.error(err)
      toast.error('Erro ao anexar arquivo.')
    } finally {
      setProgress(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.terms_accepted || !formData.lgpd_consent) {
      toast.error('Você deve aceitar os Termos e a Política de Privacidade (LGPD)')
      return
    }

    if (!formData.creci) {
      toast.error('Informe o número do seu CRECI')
      return
    }

    setLoading(true)

    try {
      // 1. Criar usuário no Supabase Auth
      const authData = await signup(
        formData.email,
        formData.password,
        { 
          name: formData.name,
          role: 'corretor',
          creci: formData.creci
        }
      )

      const userId = authData?.user?.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `usr_${Date.now()}`)

      // 2. Salvar na tabela admin_users com status 'pending'
      const { error: dbError } = await supabase.from('admin_users').upsert({
        id: userId,
        email: formData.email,
        password_hash: 'managed_by_supabase_auth',
        name: formData.name,
        phone: formData.phone,
        cpf: formData.cpf,
        creci: formData.creci,
        creci_uf: formData.creci_uf,
        creci_type: formData.creci_type,
        city: formData.city,
        bio: formData.bio,
        avatar_url: formData.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
        creci_card_front: formData.creci_card_front,
        creci_card_back: formData.creci_card_back,
        role: 'corretor',
        status: 'pending',
        terms_accepted: true,
        created_at: new Date().toISOString()
      }, { onConflict: 'email' })

      if (dbError) throw dbError

      // 3. Registrar auditoria
      await logAuditEvent({
        userId,
        userName: formData.name,
        userRole: 'corretor',
        action: 'solicitacao_cadastro_corretor',
        targetType: 'admin_users',
        targetId: userId,
        details: {
          creci: formData.creci,
          creci_uf: formData.creci_uf,
          creci_type: formData.creci_type,
          city: formData.city
        }
      })

      toast.success('Cadastro submetido com sucesso!')
      navigate('/cadastro-em-analise')
    } catch (error) {
      console.error(error)
      toast.error(error.message || 'Erro ao realizar cadastro.')
    } finally {
      setLoading(false)
    }
  }

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Comissão Acima da Média',
      desc: 'Remuneração transparente, com repasses ágeis e tabela progressiva de honorários.'
    },
    {
      icon: Award,
      title: 'Portfólio de Médio e Alto Padrão',
      desc: 'Imóveis selecionados a dedo nos bairros mais nobres de São José dos Campos, Taubaté e Jacareí.'
    },
    {
      icon: Users,
      title: 'Leads Qualificados Diariamente',
      desc: 'Distribuição inteligente de clientes com poder de compra e interesse real nos imóveis.'
    },
    {
      icon: Building2,
      title: 'CRM Imobiliário Integrado',
      desc: 'Gestão de funil de vendas (Kanban), agendamento de visitas e controle de propostas na palma da mão.'
    }
  ]

  return (
    <>
      <SEOHelmet 
        title="Seja um Corretor Parceiro" 
        description="Junte-se à equipe de corretores da Viva Belle Imobiliária no Vale do Paraíba. Portfólio de alto padrão, leads qualificados e suporte completo." 
        path="/seja-um-corretor" 
      />
      <Header />

      {/* Hero Section */}
      <section className="bg-navy-950 pt-32 pb-20 px-6 text-white relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-gold-500/30">
            Carreira & Parceria no Vale do Paraíba
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight max-w-3xl mx-auto">
            Eleve sua carreira imobiliária ao mais alto padrão.
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto mt-6 text-base sm:text-lg leading-relaxed font-light">
            Faça parte da equipe que mais cresce no Vale do Paraíba. Oferecemos estrutura, tecnologia, suporte jurídico e os melhores lançamentos e imóveis exclusivos da região.
          </p>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-16 px-6 bg-warm-50 border-b border-warm-200">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-warm-200 flex flex-col items-start">
                <div className="w-12 h-12 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center mb-4">
                  <b.icon size={24} />
                </div>
                <h3 className="font-serif font-bold text-navy-900 text-lg mb-2">{b.title}</h3>
                <p className="text-warm-600 text-xs sm:text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulário de Credenciamento */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-900">
              Formulário de Credenciamento de Corretor
            </h2>
            <p className="text-warm-500 text-sm mt-3 max-w-lg mx-auto">
              Preencha com seus dados profissionais. Após a submissão, nossa equipe validará seu registro no CRECI para liberar o acesso ao painel.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-warm-50 border border-warm-200 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
            {/* Bloco 1: Dados Pessoais */}
            <div>
              <h3 className="font-serif text-xl font-bold text-navy-900 mb-4 pb-2 border-b border-warm-200 flex items-center gap-2">
                <Users size={20} className="text-gold-500" /> 1. Dados Pessoais
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Carlos Roberto Silva"
                    className="input-field bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                    CPF *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cpf}
                    onChange={e => setFormData({...formData, cpf: e.target.value})}
                    placeholder="000.000.000-00"
                    className="input-field bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                    Telefone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="(12) 99999-9999"
                    className="input-field bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                    Cidade Principal de Atuação *
                  </label>
                  <select
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    className="input-field bg-white"
                  >
                    <option value="São José dos Campos">São José dos Campos</option>
                    <option value="Taubaté">Taubaté</option>
                    <option value="Jacareí">Jacareí</option>
                    <option value="Caçapava">Caçapava</option>
                    <option value="Pindamonhangaba">Pindamonhangaba</option>
                    <option value="Campos do Jordão">Campos do Jordão</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bloco 2: Credenciais de Acesso */}
            <div>
              <h3 className="font-serif text-xl font-bold text-navy-900 mb-4 pb-2 border-b border-warm-200 flex items-center gap-2">
                <FileCheck size={20} className="text-gold-500" /> 2. Acesso à Plataforma
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                    E-mail Profissional *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="seuemail@exemplo.com.br"
                    className="input-field bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                    Senha de Acesso *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    placeholder="Mínimo 6 caracteres"
                    className="input-field bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Bloco 3: Dados do CRECI e Documentos */}
            <div>
              <h3 className="font-serif text-xl font-bold text-navy-900 mb-4 pb-2 border-b border-warm-200 flex items-center gap-2">
                <ShieldCheck size={20} className="text-gold-500" /> 3. Registro Profissional (CRECI)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                    Número do CRECI *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.creci}
                    onChange={e => setFormData({...formData, creci: e.target.value})}
                    placeholder="Ex: 123456-F"
                    className="input-field bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                    Estado do CRECI (UF) *
                  </label>
                  <select
                    value={formData.creci_uf}
                    onChange={e => setFormData({...formData, creci_uf: e.target.value})}
                    className="input-field bg-white"
                  >
                    <option value="SP">São Paulo (SP)</option>
                    <option value="RJ">Rio de Janeiro (RJ)</option>
                    <option value="MG">Minas Gerais (MG)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                    Situação do Registro *
                  </label>
                  <select
                    value={formData.creci_type}
                    onChange={e => setFormData({...formData, creci_type: e.target.value})}
                    className="input-field bg-white"
                  >
                    <option value="definitivo">Definitivo</option>
                    <option value="provisorio">Provisório / Estágio</option>
                  </select>
                </div>
              </div>

              {/* Uploads de Documentos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border border-warm-200">
                  <label className="block text-xs font-semibold text-navy-900 mb-2">
                    Foto do CRECI (Frente) *
                  </label>
                  {formData.creci_card_front ? (
                    <div className="flex items-center gap-3">
                      <img src={formData.creci_card_front} alt="CRECI Frente" className="w-16 h-12 object-cover rounded border" />
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, creci_card_front: ''})} 
                        className="text-xs text-red-600 underline"
                      >
                        Substituir
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-warm-300 rounded-xl p-4 cursor-pointer hover:bg-warm-50 transition">
                      <Upload size={20} className="text-warm-400 mb-1" />
                      <span className="text-xs text-warm-600 font-medium">
                        {uploadingFront ? 'Enviando...' : 'Anexar Frente do CRECI'}
                      </span>
                      <input 
                        type="file" 
                        accept="image/*,.pdf" 
                        className="hidden" 
                        onChange={e => handleFileUpload(e.target.files[0], 'creci_card_front', setUploadingFront)} 
                      />
                    </label>
                  )}
                </div>

                <div className="p-4 bg-white rounded-xl border border-warm-200">
                  <label className="block text-xs font-semibold text-navy-900 mb-2">
                    Foto do CRECI (Verso) *
                  </label>
                  {formData.creci_card_back ? (
                    <div className="flex items-center gap-3">
                      <img src={formData.creci_card_back} alt="CRECI Verso" className="w-16 h-12 object-cover rounded border" />
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, creci_card_back: ''})} 
                        className="text-xs text-red-600 underline"
                      >
                        Substituir
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-warm-300 rounded-xl p-4 cursor-pointer hover:bg-warm-50 transition">
                      <Upload size={20} className="text-warm-400 mb-1" />
                      <span className="text-xs text-warm-600 font-medium">
                        {uploadingBack ? 'Enviando...' : 'Anexar Verso do CRECI'}
                      </span>
                      <input 
                        type="file" 
                        accept="image/*,.pdf" 
                        className="hidden" 
                        onChange={e => handleFileUpload(e.target.files[0], 'creci_card_back', setUploadingBack)} 
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-semibold text-navy-900 uppercase tracking-wider mb-1.5">
                  Mini Bio / Apresentação (Opcional)
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                  placeholder="Conte um pouco sobre sua experiência, nicho de atuação e tempo de mercado..."
                  className="input-field bg-white text-sm"
                />
              </div>
            </div>

            {/* Bloco 4: Termos e LGPD */}
            <div className="bg-white p-5 rounded-2xl border border-warm-200 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.terms_accepted}
                  onChange={e => setFormData({...formData, terms_accepted: e.target.checked})}
                  className="mt-1 w-4 h-4 text-gold-500 rounded border-warm-300 focus:ring-gold-500"
                />
                <span className="text-xs text-warm-700 leading-relaxed">
                  Declaro que os dados fornecidos são verdadeiros e aceito os <strong>Termos de Parceria e Código de Ética</strong> da Viva Belle Imobiliária.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.lgpd_consent}
                  onChange={e => setFormData({...formData, lgpd_consent: e.target.checked})}
                  className="mt-1 w-4 h-4 text-gold-500 rounded border-warm-300 focus:ring-gold-500"
                />
                <span className="text-xs text-warm-700 leading-relaxed">
                  Autorizo o tratamento de meus dados profissionais para fins de verificação junto ao CRECI e cumprimento da <strong>Lei Geral de Proteção de Dados (LGPD)</strong>.
                </span>
              </label>
            </div>

            {/* Botão de Envio */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full py-4 justify-center text-base font-semibold shadow-lg disabled:opacity-50"
              >
                {loading ? 'Submetendo Credenciamento...' : 'Enviar Solicitação de Parceria'}
                <ArrowRight size={18} />
              </button>
              <p className="text-center text-xs text-warm-400 mt-4">
                Já possui conta ativa?{' '}
                <Link to="/admin/login" className="text-gold-600 font-semibold hover:underline">
                  Faça login aqui
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </>
  )
}
