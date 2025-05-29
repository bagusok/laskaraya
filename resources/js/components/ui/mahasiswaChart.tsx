import { Sector, PieChart, Pie, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

interface Stat {
    label: string
    value: string | number
}

interface MahasiswaChartProps {
    data: Stat[]
}

export default function MahasiswaChart({ data }: MahasiswaChartProps) {
    // Define colors for each segment
    const colors = ['hsl(191,100%,50%)', 'hsl(98,83%,58%)', 'hsl(292,100%,50%)'];

    // Convert data to chartData with proper structure
    const chartData = data.map((stat, i) => ({
        name: stat.label,
        value: typeof stat.value === "string" ? parseInt(stat.value) : stat.value,
        fill: colors[i] || `hsl(${i * 137.5 % 360}, 70%, 50%)`,
    })).filter(item => item.value > 0); // Filter out zero values

    const chartConfig = chartData.reduce((config, item) => {
        config[item.name] = {
            label: item.name,
            color: item.fill,
        }
        return config
    }, {} as ChartConfig)

    return (
        <div className="flex flex-col">
            <div className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[300px] w-full"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                dataKey="value"
                                nameKey="name"
                                innerRadius={60}
                                outerRadius={120}
                                strokeWidth={2}
                                stroke="hsl(var(--border))"
                                activeIndex={0}
                                activeShape={(props) => {
                                    const { outerRadius = 0, ...otherProps } = props;
                                    return (
                                        <Sector
                                            {...otherProps}
                                            outerRadius={outerRadius + 10}
                                            stroke="hsl(var(--border))"
                                            strokeWidth={2}
                                        />
                                    );
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>

                {/* Legend */}
                <div className="mt-4 flex flex-wrap justify-center gap-4">
                    {chartData.map((item, index) => (
                        <div key={item.name} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.fill }}
                            />
                            <span className="text-sm text-muted-foreground">
                                {item.name}: {item.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
