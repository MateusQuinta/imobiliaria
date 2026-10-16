import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')
})

export const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  creci: z.string().min(5, 'CRECI inválido'),
  role: z.enum(['admin', 'corretor'])
})

export const propertySchema = z.object({
  title: z.string().min(5, 'Título deve ter no mínimo 5 caracteres'),
  type: z.enum(['VENDA', 'ALUGUEL', 'LANÇAMENTO']),
  priceNum: z.number().positive('Preço deve ser positivo'),
  neighborhood: z.string().min(2, 'Bairro inválido'),
  address: z.string().min(5, 'Endereço inválido'),
  beds: z.number().int().min(0),
  baths: z.number().int().min(0),
  parking: z.number().int().min(0),
  area: z.number().positive('Área deve ser positiva'),
  status: z.enum(['rascunho', 'ativo', 'inativo', 'vendido']),
  featured: z.boolean()
})
