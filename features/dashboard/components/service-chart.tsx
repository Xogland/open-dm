"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f97316", "#10b981"];

export function ServiceChart({
    data,
}: {
    data: { name: string; value: number }[];
}) {
    const total = data.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <Card className="flex flex-col shadow-sm border-0 bg-secondary/5 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0 space-y-0">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Service Mix</CardTitle>
                <Badge variant="secondary" className="text-[10px] font-mono">{total} Total</Badge>
            </CardHeader>
            <CardContent className="flex-1 pb-2 min-h-0 relative flex flex-col">
                <div className="flex-1 min-h-0 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius="65%"
                                outerRadius="85%"
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {data.map((_, index) => (
                                    <Cell key={`cell-${index}`} stroke="none" fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--background))", fontSize: '12px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Center Text for Donut */}
                    <div className="absolute inset-x-0 top-[calc(50%+10px)] -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xl font-bold leading-none">{total}</span>
                        <span className="text-[10px] text-muted-foreground uppercase">Leads</span>
                    </div>
                </div>

                {/* Custom Legend area if needed, but Recharts Legend is fine if configured right */}
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-2">
                    {data.map((item, index) => (
                        <div key={item.name} className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="text-[10px] text-muted-foreground truncate max-w-[80px]">{item.name}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
