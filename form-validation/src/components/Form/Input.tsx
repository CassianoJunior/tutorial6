'use client'

import { InputHTMLAttributes } from 'react'
import { useFormContext } from 'react-hook-form'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
}

const Input = ({ name, className, ...rest }: InputProps) => {
  const {
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
