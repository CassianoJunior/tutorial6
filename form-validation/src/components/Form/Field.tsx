import { HTMLAttributes } from 'react'

interface FieldProps extends HTMLAttributes<HTMLDivElement> {}

const Field = (props: FieldProps) => {
  return <div className="flex flex-col gap-1" {...props} />
}

export { Field }
