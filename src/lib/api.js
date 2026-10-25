import { supabase } from './supabase'

export async function submitContactForm(formData) {
  try {
    // Gravar em contact_forms
    await supabase.from('contact_forms').insert({
      name: formData.nome,
      email: formData.email,
      phone: formData.telefone,
      subject: formData.assunto || 'Contato pelo Site',
      message: formData.mensagem,
      consent: formData.aceite ?? true,
    })

    // Gravar também na tabela unificada de leads
    await supabase.from('leads').insert({
      name: formData.nome,
      email: formData.email,
      phone: formData.telefone,
      subject: formData.assunto || 'Contato pelo Site',
      message: formData.mensagem,
      status: 'novo',
      history: [{ date: new Date().toISOString(), status: 'novo', note: 'Lead criado via formulário de contato' }]
    })

    return { success: true }
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return { success: true, fallback: true }
  }
}

export async function submitPropertyInquiry(propertyId, formData, propertyTitle = '') {
  try {
    await supabase.from('property_inquiries').insert({
      property_id: propertyId,
      name: formData.nome,
      email: formData.email,
      phone: formData.telefone,
      message: formData.mensagem,
    })

    // Gravar na tabela de leads com o imóvel associado
    await supabase.from('leads').insert({
      name: formData.nome,
      email: formData.email,
      phone: formData.telefone,
      subject: `Interesse no imóvel #${propertyId}`,
      message: formData.mensagem,
      property_id: propertyId,
      property_title: propertyTitle,
      status: 'novo',
      history: [{ date: new Date().toISOString(), status: 'novo', note: `Interesse no imóvel #${propertyId}` }]
    })

    return { success: true }
  } catch (error) {
    console.error('Error submitting property inquiry:', error)
    return { success: true, fallback: true }
  }
}

export async function logAuditEvent({ userId, userName, userRole, action, targetType, targetId, details }) {
  try {
    await supabase.from('audit_logs').insert({
      user_id: userId,
      user_name: userName,
      user_role: userRole,
      action,
      target_type: targetType,
      target_id: targetId ? String(targetId) : null,
      details: details || {}
    })
  } catch (error) {
    console.warn('Audit log error (ignorable in dev):', error)
  }
}

export async function getAgencySettings() {
  try {
    const { data, error } = await supabase.from('agency_settings').select('*').limit(1).single()
    if (error || !data) {
      return {
        require_property_moderation: false,
        default_commission_rate: 6.0,
        lead_distribution_rule: 'round_robin',
        company_name: 'Viva Belle Imobiliária',
        company_creci: '12345-J',
        company_phone: '(12) 3900-0000',
        company_whatsapp: '5512999990000',
        company_email: 'contato@vivabelle.com.br'
      }
    }
    return data
  } catch (err) {
    return {
      require_property_moderation: false,
      default_commission_rate: 6.0,
      lead_distribution_rule: 'round_robin',
      company_name: 'Viva Belle Imobiliária',
      company_creci: '12345-J',
      company_phone: '(12) 3900-0000',
      company_whatsapp: '5512999990000',
      company_email: 'contato@vivabelle.com.br'
    }
  }
}
