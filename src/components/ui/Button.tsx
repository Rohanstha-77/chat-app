import React, { ButtonHTMLAttributes } from 'react'
type btnProps={
    varient?: string
    size?: string
    isLoading?: boolean
    type?: "button" | "submit"
    children?: React.ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

const Button = ({varient, size, isLoading, type,children, ...props}:btnProps) => {
  return (
    <>
        <button className={`active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none ${varient} ${size}` } disabled={isLoading} type={type} {...props}>
            {/* {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/>: null} */}
            {children}
        </button>
    </>
  )
}

export default Button