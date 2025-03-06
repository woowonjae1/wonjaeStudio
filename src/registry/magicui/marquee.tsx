'use client'

import React, { useRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  reverse?: boolean
  pauseOnHover?: boolean
  vertical?: boolean
  className?: string
  children: React.ReactNode
}

export function Marquee({
  className,
  reverse,
  pauseOnHover,
  vertical,
  children,
  ...props
}: MarqueeProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [duplicatedChildren, setDuplicatedChildren] = useState<React.ReactNode>(children)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 确保有足够的内容进行滚动
    setDuplicatedChildren(
      <>
        {children}
        {children}
        {children}
      </>
    )
  }, [children])

  return (
    <div
      className={cn(
        'group flex w-max overflow-hidden [--gap:1rem]',
        vertical && 'flex-col',
        className
      )}
      {...props}
      onMouseEnter={() => pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => pauseOnHover && setIsHovered(false)}
    >
      <div
        ref={contentRef}
        className={cn(
          'flex w-max flex-nowrap gap-[--gap]',
          vertical && 'flex-col',
          isHovered && 'pause',
          {
            'animate-marquee': !reverse && !vertical,
            'animate-marquee-reverse': reverse && !vertical,
            'animate-marquee-vertical': !reverse && vertical,
            'animate-marquee-vertical-reverse': reverse && vertical,
          }
        )}
      >
        {duplicatedChildren}
      </div>
    </div>
  )
} 