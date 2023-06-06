# Tutorial 6

> Tutorial de validação de entrada de dados do usuário em formulários diversos usando [React Hook Form](https://react-hook-form.com) e [Zod](https://zod.dev).

## Setup inicial

Para iniciar e criar um novo projeto `Next` do zero, basta entrar no terminal e digitar o seguinte comando:

```bash
npx create-next-app@latest form-validation --use-npm
```

Em que:

- form-validation é o nome da pasta onde o projeto será criado.
- --use-npm especifica o gerenciador de pacotes que iremos utilizar.

Após isso, responda sim (Yes), para todas as perguntas que serão feitas.

Agora, entre na pasta do projeto digite `npm run dev` no terminal e abra o navegador na url `http://localhost:3000` e aparecerá uma página pronta do **Next**.

### Instalando as dependências

Para esse projeto, usaremos algumas bibliotecas:

- React Hook Form
- Zod
- @hookform/resolvers

Para podermos usá-las no projeto, digite o comando no terminal na pasta do projeto:

```bash
npm i react-hook-form zod @hookform/resolvers
```

## Construindo a aplicação

Para começar, vamos determinar um estilo para as páginas principais, definindo a interface no arquivo `layout.tsx` no diretório `/src/app`

```tsx
// src/app/layout.tsx

import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Form Validation',
  description: '',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex items-center justify-center flex-col w-full h-screen max-w-6xl m-auto pt-14">
          <h1 className="text-2xl text-center text-slate-200">
            Form Validation
          </h1>
          {children}
        </main>
      </body>
    </html>
  )
}
```

Agora no arquivo `global.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  @apply bg-zinc-700
}
```

Agora vamos criar o componente de Formulário. Dentro da pasta `src` crie uma pasta chamada `components` e dentro dessa pasta crie outra pasta chamada `Form`. Esta será a pasta que terá o arquivo que exportará todos os componentes do nosso formuário: *Label*, *Input*, *Field* e *ErrorMessage*.

O código de cada componente está descrito abaixo:

```tsx
// components/Form/ErrorMessage.tsx

'use client' // indica ao next que este é um 'client component'

// context hook do React Hook Form
import { useFormContext } from 'react-hook-form'

interface ErrorMessageProps {
  field: string
}

// Função para procurar se um campo tem algum erro
function get(obj: Record<any, any>, path: string) {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce(
        (res, key) => (res !== null && res !== undefined ? res[key] : res),
        obj,
      )

  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/)

  return result
}

// Componente
const ErrorMessage = ({ field }: ErrorMessageProps) => {
  
  // Usando o context hook para saber o estado atual do formulário
  const {
    formState: { errors },
  } = useFormContext()

  const fieldError = get(errors, field)

  if (!fieldError) {
    return null
  }

  return (
    <span className="text-xs text-red-500 mt-1">
      {fieldError.message?.toString()}
    </span>
  )
}

export { ErrorMessage }

```

```tsx
// components/Form/Field.tsx

import { HTMLAttributes } from 'react'

interface FieldProps extends HTMLAttributes<HTMLDivElement> {}

const Field = (props: FieldProps) => {
  return <div className="flex flex-col gap-1" {...props} />
}

export { Field }
```

```tsx
// components/Form/Input.tsx

'use client'

import { InputHTMLAttributes } from 'react'
import { useFormContext } from 'react-hook-form'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
}

const Input = ({ name, className, ...rest }: InputProps) => {
  const {
    // Usado para registrar um input do formulário no react-hook-form 
    register, 
    formState: { errors },
  } = useFormContext()

  return (
    <input
      id={name}
      className={`flex-1 w-full rounded border border-zinc-300 shadow-sm px-3 py-2 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
        errors[name] ? 'ring-2 ring-red-500' : ''
      } ${className}`}
      {...register(name)}
      {...rest}
      autoComplete="off"
    />
  )
}

export { Input }
```

```tsx
// components/Form/Label.tsx

import { LabelHTMLAttributes } from 'react'

const Label = (props: LabelHTMLAttributes<HTMLLabelElement>) => {
  return (
    <label
      className="text-sm text-slate-200 flex items-center justify-between"
      {...props}
    />
  )
}

export { Label }
```

Por fim, um arquivo principal para exportar todos os componentes:

```tsx
// components/Form/index.tsx

import { ErrorMessage } from './ErrorMessage'
import { Field } from './Field'
import { Input } from './Input'
import { Label } from './Label'

export const Form = {
  ErrorMessage,
  Field,
  Input,
  Label,
}
```

Nesse momento, já podemos criar nosso formulário.

Agora, vamos entender como o *Zod* funciona.

Com o *Zod* podemos criar objetos que são automaticamente convertidos em uma tipagem TypeScript. Essa ferramenta é poderosísima e ajuda muito no densenvolivmento de aplicações complexas que precisam de integridade de dados.

Assim, vamos definir nosso formulário e os tipos dos seus campos.

Para cobrirmos uma pequena parte das possibilidades do *Zod* e entendermos um pouco do seu poder, o nosso formulário terá as seguintes informações.

- Nome
- Email
- Senha
- Confirmação de senha
- Telefone
- CEP
- CPF
  
Para realizar a validação dos dados, o *Zod* disponibiliza vários métodos. Aqui utilizaremos apenas alguns deles:

- string()
  - Define o tipo do campo como string;
- nonempty()
  - Define que o campo não pode ser nulo;
- email()
  - Define que o campo precisa ter o formato de um email.
- min(), max()
  - Define a quantidade mínima e máxima de caracteres.
- transform()
  - Recebe o valor do campo como parâmetro e permite a manipulação.
- refine()
  - Recebe o valor do campo como parâmetro e permite definir regras de validação.  

> Obs.: Todos os métodos acima podem receber uma mensagem como parâmetro, que será exibida quando o campo não seguir às especificações.

Você pode ver mais detalhes na própria [documentação](https://github.com/colinhacks/zod/blob/master/README.md#basic-usage) do *Zod*.

Apenas com esses métodos podemos realizar validações e verificações poderosas e complexas.

O nosso objeto do *Zod* fica da seguinte maneira:

```tsx
import { z } from 'zod'

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
```

Com esse objeto, podemos definir um *type* no `TypeScript` e depois conseguimos criar um formulário seguindo essa tipagem:

```ts
type CreateUserData = z.infer<typeof createUserSchema>
```

Agora, basta criarmos o formulário usando o tipo desse objeto e usar o zodResolver na intanciação do React Hook Form. Dessa maneira, nossa estrutura da página principal com o formulário fica da seguinte forma:

```tsx
// src/app/page.tsx

'use client'

import { Form } from '@/components/Form'
import { PasswordStrength } from '@/components/PasswordStrength'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

// Função que verifica se um CPF é válido
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

// componente
export default function Home() {

  /* 
    Instânciação do formulário por meio do hook useForm
    Aqui podemos informar algumas configurações como o resolver
    e os valores iniciais, entre outros.
  */ 
  const createUserForm = useForm<CreateUserData>({
    resolver: zodResolver(createUserSchema),
  })

  const { handleSubmit, watch } = createUserForm

  const [formData, setFormData] = useState<CreateUserData | undefined>(
    undefined,
  )

  /*
    Usando a função handleSubmit, os dados do formulário só serão passados
    para a função se não houver nenhuma inconsistência com os valores 
    digitados nos campos, anteriormente definidos na tipagem
  */

  const handleClickSumbitButton = handleSubmit((data) => {
    setFormData(data)
  })

  const passwordValue = watch('password')

  return (
    <div className="flex flex-row gap-8 m-auto items-center justify-center w-full">
      {/*Provider do formulário, usado em conjunto com o 
      useFormContext dos componentes internos do Form */}
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
```

Com o formulário definido dessa forma, é impossível o usuário enviar uma informação indevida para o servidor. Basta definir as tipagens dos campos de acordo com o que o back-end espera e pronto, o seu sistema não perderá a integridade.
Assim como no front-end, também é possível (e recomendado) usar o *Zod* no back-end, para verificar se o que chegou no corpo da requisição ou nos parâmetros da url condizem com o que o servidor e espera, e assim trate os erros conforme a necessidade.

Com esse tutorial, fica fácil entender o poder dessa biblioteca e a grande variedade de benefícios que ele possui, trazendo mais confiabilidade e segurança para o código e para o desenvolvedor.
