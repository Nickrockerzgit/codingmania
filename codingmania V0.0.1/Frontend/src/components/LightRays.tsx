"use client"

import { useEffect, useState, type CSSProperties } from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface LightRaysProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>
  count?: number
  color?: string
  blur?: number
  speed?: number
  length?: string
  position?: 'full' | 'top-right'
}

type LightRay = {
  id: string
  left: number
  rotate: number
  width: number
  swing: number
  delay: number
  duration: number
  intensity: number
}

const createRays = (count: number, cycle: number, position: string): LightRay[] => {
  if (count <= 0) return []

  return Array.from({ length: count }, (_, index) => {
    let left, rotate, width, swing;
    
    if (position === 'top-right') {
      left = 95 + Math.random() * 5;
      rotate = 160 + Math.random() * 30;
      width = 200 + Math.random() * 200;
      swing = 3 + Math.random() * 4;
    } else {
      left = 8 + Math.random() * 84;
      rotate = -28 + Math.random() * 56;
      width = 160 + Math.random() * 160;
      swing = 0.8 + Math.random() * 1.8;
    }
    
    const delay = Math.random() * cycle;
    const duration = cycle * (0.75 + Math.random() * 0.5);
    const intensity = 0.6 + Math.random() * 0.5;

    return {
      id: `${index}-${Math.round(left * 10)}`,
      left,
      rotate,
      width,
      swing,
      delay,
      duration,
      intensity,
    }
  })
}

const Ray = ({
  left,
  rotate,
  width,
  swing,
  delay,
  duration,
  intensity,
}: LightRay) => {
  return (
    <motion.div
      className="pointer-events-none absolute -top-[12%] left-[var(--ray-left)] h-[var(--light-rays-length)] w-[var(--ray-width)] origin-top -translate-x-1/2 rounded-full bg-gradient-to-b from-[var(--ray-color)] to-transparent opacity-0 mix-blend-screen blur-[var(--light-rays-blur)]"
      style={
        {
          "--ray-left": `${left}%`,
          "--ray-width": `${width}px`,
          "--ray-color": `rgba(220, 38, 38, 0.7)`,
        } as CSSProperties
      }
      initial={{ rotate: rotate }}
      animate={{
        opacity: [0, intensity, 0],
        rotate: [rotate - swing, rotate + swing, rotate - swing],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
        repeatDelay: duration * 0.1,
      }}
    />
  )
}

export function LightRays({
  className,
  style,
  count = 7,
  color = "rgba(220, 38, 38, 0.2)",
  blur = 36,
  speed = 14,
  length = "70vh",
  position = 'full',
  ref,
  ...props
}: LightRaysProps) {
  const [rays, setRays] = useState<LightRay[]>([])
  const cycleDuration = Math.max(speed, 0.1)

  useEffect(() => {
    setRays(createRays(count, cycleDuration, position))
  }, [count, cycleDuration, position])

  const containerClass = position === 'top-right' 
    ? "pointer-events-none fixed top-0 right-0 w-full h-full z-0"
    : "pointer-events-none absolute inset-0 isolate overflow-hidden rounded-[inherit]"

  return (
    <div
      ref={ref}
      className={cn(containerClass, className)}
      style={
        {
          "--light-rays-color": color,
          "--light-rays-blur": `${blur}px`,
          "--light-rays-length": position === 'top-right' ? '100vh' : length,
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={
            {
              background: position === 'top-right'
                ? "radial-gradient(circle at 90% 10%, rgba(220, 38, 38, 0.5), transparent 60%)"
                : "radial-gradient(circle at 20% 15%, rgba(220, 38, 38, 0.45), transparent 70%)",
            } as CSSProperties
          }
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={
            {
              background: position === 'top-right'
                ? "radial-gradient(circle at 85% 5%, rgba(220, 38, 38, 0.3), transparent 50%)"
                : "radial-gradient(circle at 80% 10%, rgba(220, 38, 38, 0.35), transparent 75%)",
            } as CSSProperties
          }
        />
        {rays.map((ray) => (
          <Ray key={ray.id} {...ray} />
        ))}
      </div>
    </div>
  )
}