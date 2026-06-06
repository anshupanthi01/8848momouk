import * as React from "react"
import { cn } from "@/lib/utils"

function Card({ className, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn("rounded-2xl border border-[#21408e]/15 bg-white/78 shadow-[0_24px_70px_-45px_rgba(30,46,92,0.75)] backdrop-blur-xl", className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }) {
  return <div className={cn("space-y-1.5 p-5", className)} {...props} />
}

function CardTitle({ className, ...props }) {
  return <h3 className={cn("au-nav-font text-base uppercase tracking-[0.08em] text-[#21408e]", className)} {...props} />
}

function CardDescription({ className, ...props }) {
  return <p className={cn("text-sm leading-6 text-[#21408e]/65", className)} {...props} />
}

function CardContent({ className, ...props }) {
  return <div className={cn("p-5 pt-0", className)} {...props} />
}

function CardFooter({ className, ...props }) {
  return <div className={cn("flex items-center p-5 pt-0", className)} {...props} />
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
