'use client'

import { Form } from '@/components/Form'
import { PasswordStrength } from '@/components/PasswordStrength'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const isValidCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/[^\d]+/g, '')
  if (cpf.length !== 11) {
    return false
  }
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i)
  }
  let remainder = 11 - (sum % 11)
  if (remainder === 10 || remainder === 11) {
    remainder = 0
  }
  if (remainder !== parseInt(cpf.charAt(9))) {
    return false
  }
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i)
  }
  remainder = 11 - (sum % 11)
  if (remainder === 10 || remainder === 11) {
    remainder = 0
  }
  if (remainder !== parseInt(cpf.charAt(10))) {
    return false
  }
  return true
}

const createUserSchema = z
  .object({
    name: z
      .string()
      .nonempty('Nome obrigatório')
      .min(3, 'O nome deve conter no mínimo 3 caracteres'),
    email: z
      .string()
      .nonempty('Email obrigatório')
      .email('Digite um e-mail válido'),
    password: z
      .string()
      .nonempty('Senha obrigatória')
      .min(8, 'A senha deve ter no mínimo 8 caracteres'),
    confirmPassword: z.string().nonempty('Confirmação da senha obrigatória'),
    phoneNumber: z
      .string()
      .nonempty('Telefone obrigatório')
      .min(11, 'Digite um telefone válido')
      .max(11)
      .transform((value) => {
        return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
      })
      .refine((value) => {
        return value.match(/^\([1-9]{2}\) [9]{0,1}[6-9]{1}[0-9]{3}-[0-9]{4}$/)
      }, 'Digite um telefone válido'),
    zipCode: z
      .string()
      .nonempty('CEP obrigatório')
      .min(8)
      .max(8)
      .transform((value) => {
        return value.replace(/(\d{5})(\d{3})/, '$1-$2')
      })
      .refine((value) => {
        return value.match(/^\d{5}-\d{3}$/)
      }),
    cpf: z
      .string()
      .nonempty('CPF obrigatório')
      .min(11)
      .max(11)
      .transform((value) => {
        return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
      })
      .refine((value) => {
        return value.match(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/) && isValidCPF(value)
      }, 'Digite um CPF válido'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type CreateUserData = z.infer<typeof createUserSchema>

export default function Home() {
  const createUserForm = useForm<CreateUserData>({
    resolver: zodResolver(createUserSchema),
  })

  const { handleSubmit, watch } = createUserForm

  const [formData, setFormData] = useState<CreateUserData | undefined>(
    undefined,
  )

  const handleClickSumbitButton = handleSubmit((data) => {
    setFormData(data)
  })

  const passwordValue = watch('password')

  return (
    <div className="flex flex-row gap-8 m-auto items-center justify-center w-full">
      <FormProvider {...createUserForm}>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-2 min-w-[30rem]"
        >
          <Form.Field>
            <Form.Label htmlFor="name">Name</Form.Label>
            <Form.Input name="name" placeholder="Seu nome" />
            <Form.ErrorMessage field="name" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="email">Email</Form.Label>
            <Form.Input name="email" placeholder="Seu melhor email" />
            <Form.ErrorMessage field="email" />
          </Form.Field>
          <Form.Field className="flex flex-col gap-4 w-full">
            <div className="w-full flex-1">
              <Form.Label htmlFor="password">Senha</Form.Label>
              <Form.Input
                name="password"
                type="password"
                placeholder="Uma senha forte"
              />
              <Form.ErrorMessage field="password" />
            </div>
            {passwordValue && <PasswordStrength password={passwordValue} />}
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="confirmPassword">Confirme a senha</Form.Label>
            <Form.Input
              name="confirmPassword"
              type="password"
              placeholder="Repita sua senha"
            />
            <Form.ErrorMessage field="confirmPassword" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="phoneNumber">Telefone</Form.Label>
            <Form.Input
              name="phoneNumber"
              placeholder="Seu telefone principal"
            />
            <Form.ErrorMessage field="phoneNumber" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="zipCode">CEP</Form.Label>
            <Form.Input name="zipCode" placeholder="Seu CEP" />
            <Form.ErrorMessage field="zipCode" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="cpf">CPF</Form.Label>
            <Form.Input name="cpf" placeholder="Seu CPF" />
            <Form.ErrorMessage field="cpf" />
          </Form.Field>
          <button
            className="bg-violet-500 mt-8 text-white px-4 py-2 rounded shadow hover:bg-violet-600 transition-colors"
            onClick={handleClickSumbitButton}
            type="submit"
          >
            Enviar
          </button>
        </form>
      </FormProvider>
      <div className="w-full flex flex-col items-center text-start justify-center h-full">
        {formData ? (
          <>
            <h1 className="text-slate-200 text-2xl">Dados enviados</h1>
            <div>
              <p className="text-slate-200 text-xl">
                <strong>Nome:</strong> {formData.name}
              </p>
              <p className="text-slate-200 text-xl">
                <strong>Email:</strong> {formData.email}
              </p>
              <p className="text-slate-200 text-xl">
                <strong>Senha:</strong> {formData.password}
              </p>
              <p className="text-slate-200 text-xl">
                <strong>Telefone:</strong> {formData.phoneNumber}
              </p>
              <p className="text-slate-200 text-xl">
                <strong>CEP:</strong> {formData.zipCode}
              </p>
              <p className="text-slate-200 text-xl">
                <strong>CPF:</strong> {formData.cpf}
              </p>
            </div>
          </>
        ) : (
          <p className="text-slate-200 text-xl">Formulário vazio</p>
        )}
      </div>
    </div>
  )
}
