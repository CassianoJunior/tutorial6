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
