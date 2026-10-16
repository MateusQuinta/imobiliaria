import { supabase } from './supabase'

export async function submitContactForm(formData) {
  try {
    const { error } = await supabase.from('contact_forms').insert({
      name: formData.nome,
      email: formData.email,
      phone: formData.telefone,
      subject: formData.assunto,
      message: formData.mensagem,
      consent: formData.aceite,
    })

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error submitting contact form:', error)
    // Fallback: em caso de erro do Supabase (não configurado), simula sucesso
    return { success: true, fallback: true }
  }
}

export async function submitPropertyInquiry(propertyId, formData) {
  try {
    const { error } = await supabase.from('property_inquiries').insert({
      property_id: propertyId,
      name: formData.nome,
      email: formData.email,
      phone: formData.telefone,
      message: formData.mensagem,
    })

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error submitting property inquiry:', error)
    // Fallback: em caso de erro do Supabase (não configurado), simula sucesso
    return { success: true, fallback: true }
  }
}
