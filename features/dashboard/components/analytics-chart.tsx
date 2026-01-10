"use client";

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background border border-border p-3 rounded-lg shadow-xl backdrop-blur-sm bg-opacity-95">
                <p className="text-sm mb-2 text-foreground">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm py-1">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-muted-foreground">{entry.name}:</span>
                        <span className="font-mono text-foreground">{entry.value}</span>
                    </div>
                ))}
                {payload.length >= 2 && payload[1].value > 0 && (
                    <div className="mt-2 pt-2 border-t border-border flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">Conversion Rate:</span>
                        <span className="font-bold text-green-500">
                            {((payload[1].value / payload[0].value) * 100).toFixed(1)}%
                        </span>
                    </div>
                )}
            </div>
        );
    }
    return null;
};

export function AnalyticsChart({
    data,
}: {
    data: { date: string; submissions: number; views: number }[];
}) {
    // Format date for display
    const formattedData = data.map(item => ({
        ...item,
        dateFormatted: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }));

    return (
        <Card className="col-span-full lg:col-span-4 shadow-sm border-0 bg-secondary/5 h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7 shrink-0">
                <div className="space-y-1">
                    <CardTitle className="text-xl">Traffic vs Conversion</CardTitle>
                    <CardDescription>
                        Performance metrics for the last 30 days
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:px-6 flex-1 min-h-0">
                <div className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="dateFormatted"
                                stroke="#888888"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                minTickGap={30}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                            />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.4} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                verticalAlign="top"
                                align="right"
                                height={36}
                                iconType="circle"
                                iconSize={8}
                                wrapperStyle={{ fontSize: '12px', paddingBottom: '20px' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="views"
                                stroke="#f97316"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#colorViews)"
                                name="Unique Views"
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="submissions"
                                stroke="#3b82f6"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#colorSubmissions)"
                                name="Submissions"
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
