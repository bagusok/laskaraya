"use client"

import { ReactNode } from "react"

interface ChartContainerProps {
    children: ReactNode
    className?: string
    config?: Record<string, { label: string; color?: string }>
}

export function ChartContainer({ children, className }: ChartContainerProps) {
    return (
        <div className={`relative w-full ${className ?? ""}`}>
            {children}
        </div>
    )
}

interface ChartTooltipContentProps {
    active?: boolean
    payload?: any[]
    label?: string
    hideLabel?: boolean
}

export function ChartTooltipContent({
                                        active,
                                        payload,
                                        label,
                                        hideLabel = false,
                                    }: ChartTooltipContentProps) {
    if (!active || !payload || payload.length === 0) return null

    const data = payload[0].payload

    return (
        <div className="rounded-lg border bg-background p-2 text-sm shadow-sm">
            {!hideLabel && <div className="font-medium">{label}</div>}
            <div className="text-muted-foreground">
                {data.label || data.name}: {data.value}
            </div>
        </div>
    )
}

export function ChartTooltip({ content, ...props }: any) {
    return <>{content}</>
}

export type ChartConfig = Record<
    string,
    {
        label: string
        color?: string
    }
>
