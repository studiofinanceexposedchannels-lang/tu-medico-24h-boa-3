'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Check, Loader2, ShieldCheck, Flame } from 'lucide-react'
import { cn } from '@/lib/utils'

const DEFAULT_STEPS = [
  'Confirmando tu compra del Método de La Dieta Japonesa',
  'Asegurando tu conexión de pago',
  'Preparando tu acceso especial',
]

interface ProcessingLoaderProps {
  onDone: () => void
  badge?: string
  title?: string
  subtitle?: string
  steps?: string[]
  duration?: number
}

export function ProcessingLoader({
  onDone,
  badge = 'Paso 1 de 3',
  title = 'Preparando tu pedido',
  subtitle = 'No cierres esta página mientras confirmamos tu compra.',
  steps = DEFAULT_STEPS,
  duration = 5200,
}: ProcessingLoaderProps) {
  const isPaso2 = badge.toLowerCase().includes('paso 2')
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(6)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const timers: number[] = []
    steps.forEach((_, i) => {
      const stepTime = Math.round(((i + 1) / steps.length) * Math.max(duration - 400, 400))
      timers.push(window.setTimeout(() => setStep(i + 1), stepTime))
    })
    timers.push(window.setTimeout(() => setProgress(100), Math.max(duration - 220, 0)))
    timers.push(window.setTimeout(() => setClosing(true), duration - 650))
    timers.push(window.setTimeout(() => onDone(), duration))
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [duration, onDone, steps])

  useEffect(() => {
    const tick = 100 / Math.max(duration / 100, 1)
    const id = window.setInterval(() => {
      setProgress((p) => Math.min(100, p + tick))
    }, 100)
    return () => window.clearInterval(id)
  }, [duration])

  if (isPaso2) {
    return (
      <div className={cn('tone-ember fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-background px-2 py-3 text-foreground transition-opacity duration-500', closing && 'pointer-events-none opacity-0')} role="status" aria-live="polite">
        <div className="flex h-full max-h-[533px] w-full max-w-[300px] flex-col justify-between">
          <div className="flex items-center justify-center rounded-full border border-primary/50 bg-primary/10 px-2 py-1 text-center font-display text-[8px] font-bold uppercase tracking-wide text-primary">
            <AlertTriangle className="mr-1 size-2.5 animate-blink" /> Paso 2 de 3: ¡No cierres esta página!
          </div>
          <div className="mt-2 text-center">
            <span className="inline-flex items-center gap-1 rounded-full border border-foreground/20 px-2 py-0.5 font-display text-[8px] font-bold uppercase tracking-[0.18em] text-foreground/70"><Flame className="size-2.5 text-primary" /> Atención</span>
            <h1 className="mt-1.5 text-balance font-display text-[1.24rem] font-extrabold uppercase leading-[0.98] tracking-tight">
              Tu pedido del <span className="text-primary">Método de La Dieta Japonesa</span> está casi completo…
            </h1>
            <p className="mt-1.5 text-[10px] leading-tight text-foreground/70">Pero hay algo <strong className="text-foreground">muy importante</strong> que todavía necesitas saber.</p>
          </div>
          <img src="/images/neuropatia-alert-banner.png" alt="Mujer mayor preocupada por el dolor y la neuropatía en su pie" className="mt-2 aspect-[3/2] h-auto w-full rounded-xl border border-primary/30 bg-card object-contain shadow-[0_12px_25px_-18px_var(--primary)]" />
          <div className="mt-2 flex flex-col gap-1.5 text-[10px] leading-[1.3] text-foreground">
            <p>Hasta ahora ya has dado dos pasos importantes: <strong className="text-foreground">equilibrio y movilidad</strong>, y <strong className="text-foreground">alimentación y autocuidado</strong>.</p>
            <p className="font-display font-bold uppercase text-foreground">Pero hay una pregunta que esos materiales no pueden responder por sí solos:</p>
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-2 font-display text-[10px] font-bold uppercase leading-tight text-destructive">¿Quién estará a tu lado cuando te surja una duda urgente sobre tu neuropatía?</p>
            <div className="grid grid-cols-2 gap-1.5 rounded-lg border border-primary/30 bg-card/70 p-2 text-[9px] font-bold leading-tight text-foreground shadow-[0_8px_20px_-16px_var(--primary)]">
              <p>“¿Cómo sé si una herida se está infectando?”</p>
              <p>“¿Mi neuropatía está empeorando?”</p>
              <p>“¿Qué hago si aparece una ampolla?”</p>
              <p>“¿Cuándo debo consultar a un médico?”</p>
            </div>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-foreground/15"><div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${Math.min(progress, 100)}%` }} /></div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('tone-ember fixed inset-0 z-50 flex items-center justify-center bg-background px-5 text-foreground transition-opacity duration-500', closing && 'pointer-events-none opacity-0')} role="status" aria-live="polite">
      <div className="w-full max-w-md"><div className="mb-6 flex items-center justify-center"><span className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-4 py-1.5 font-display text-xs font-bold uppercase tracking-[0.2em] text-foreground/80"><ShieldCheck className="size-4" />{badge}</span></div><div className="flex items-center justify-center gap-3 text-center"><Loader2 className="size-6 shrink-0 animate-spin text-primary" /><h1 className="font-display text-2xl font-extrabold uppercase tracking-tight sm:text-3xl">{title}<span className="animate-blink">...</span></h1></div><p className="mt-3 text-center text-sm text-foreground/60">{subtitle}</p><div className="mt-8 h-2.5 w-full overflow-hidden rounded-full bg-foreground/15"><div className="h-full rounded-full bg-primary transition-[width] duration-200" style={{ width: `${Math.min(progress, 100)}%` }} /></div><ul className="mt-6 space-y-3">{steps.map((label, i) => { const done = step > i; const active = step === i; return <li key={label} className={cn('flex items-center gap-3 rounded-xl border border-foreground/10 bg-background/5 px-4 py-3 text-sm', done && 'border-primary/30 bg-primary/10')}><span className={cn('flex size-6 shrink-0 items-center justify-center rounded-full border', done ? 'border-primary bg-primary text-primary-foreground' : 'border-foreground/30 text-foreground/50')}>{done ? <Check className="size-4" /> : active ? <Loader2 className="size-3.5 animate-spin" /> : <span className="size-2 rounded-full bg-background/30" />}</span><span className={cn(done ? 'text-foreground' : 'text-foreground/60')}>{label}</span></li> })}</ul></div>
    </div>
  )
}

