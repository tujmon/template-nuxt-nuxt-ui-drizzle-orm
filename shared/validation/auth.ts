import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Endereço de e-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Endereço de e-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'A confirmação de senha deve ter pelo menos 6 caracteres')
}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
})

export type RegisterInput = z.infer<typeof registerSchema>

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres').optional(),
  email: z.string().email('Endereço de e-mail inválido').optional()
}).refine(data => data.name || data.email, {
  message: 'Informe pelo menos um campo para atualizar',
  path: ['name']
})
