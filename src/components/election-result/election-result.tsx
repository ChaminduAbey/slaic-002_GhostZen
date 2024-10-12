
"use client"
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"


const chartConfig = {
    votes: {
        label: "Votes",
        color: "hsl(var(--chart-1))",
    },
    // label: {
    //     color: "hsl(var(--background))",
    // },
    anura: {
        label: "Anura",
        color: "red"
    },
    ranil: {
        label: "Ranil",
        color: "green"
    },
    sajith: {
        label: "Sajith",
        color: "blue"
    }
} satisfies ChartConfig

export function ElectionResultCard({
    result
}: {
    result: {
        anura: number
        ranil: number
        sajith: number,
        location: string
    }
}) {
    var chartData = [
        { name: "anura", votes: result.anura, image: "/graphics/poll-card-anura.png", fill: "var(--color-anura)" },
        { name: "ranil", votes: result.ranil, image: "/graphics/poll-card-ranil.png", fill: "var(--color-ranil)" },
        { name: "sajith", votes: result.sajith, image: "/graphics/poll-card-sajith.png", fill: "var(--color-sajith)" },
    ]

    // sort 
    chartData = chartData.sort((a, b) => b.votes - a.votes)

    return <div className="flex flex-col items-start space-y-2">
        <motion.div
            layoutId="poll-result"
            transition={{
                duration: 0.5
            }}
            initial={{
                opacity: 0.0,
                y: -10
            }}
            animate={{
                opacity: 1.0,
                y: 0
            }}
            className="flex h-[300px] ">
            <ChartContainer config={chartConfig}>
                <BarChart
                    accessibilityLayer
                    data={chartData}
                    layout="vertical"
                    margin={{
                        right: 16,
                    }}
                >
                    <CartesianGrid horizontal={false} />
                    <YAxis
                        dataKey="name"
                        type="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                        hide
                    />
                    <XAxis dataKey="votes" type="number" hide />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                    />
                    <Bar
                        dataKey="votes"
                        layout="vertical"
                        // fill="var(--color-votes)"
                        radius={4}
                    >
                        {/* <LabelList
                        dataKey="name"
                        position="insideLeft"
                        offset={32}
                        className="fill-[--color-label]"
                        fontSize={12}
                    /> */}
                        <LabelList
                            dataKey="image"
                            position="left"
                            content={<CustomImageLabel x={0} y={0} value={''} />}
                        />
                    </Bar>
                </BarChart>
            </ChartContainer>
        </motion.div>
        <div className="flex flex-col justify-center">
            <div className="flex items-center">
                <TrendingUp size={24} />
                <span className="ml-2 text-sm font-semibold">Election Result</span>
            </div>
            <span className="text-sm">{result.location}</span>
        </div>
    </div>
}
const CustomImageLabel = ({ x, y, value }: { x: number, y: number, value: string }) => (
    <image
        href={value} // value contains the image URL
        x={x - 8} // x position for the image
        y={y + 8} // adjust y position to center the image
        height={72} // set image height
        width={72} // set image width
    />
);