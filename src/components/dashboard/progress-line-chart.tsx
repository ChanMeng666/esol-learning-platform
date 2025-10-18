'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

// Demo data - realistic weekly activity pattern for demonstration
const generateDemoData = () => {
    // Simulate a realistic study week: consistent weekday studying, lighter weekend
    return [
        { day: 'Mon', questions: 6, points: 180 },
        { day: 'Tue', questions: 8, points: 240 },
        { day: 'Wed', questions: 5, points: 150 },
        { day: 'Thu', questions: 7, points: 210 },
        { day: 'Fri', questions: 6, points: 180 },
        { day: 'Sat', questions: 0, points: 0 },
        { day: 'Sun', questions: 0, points: 0 },
    ]
}

export function ProgressLineChart() {
    const data = generateDemoData()

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle>Weekly Progress</CardTitle>
                <CardDescription>Your daily activity over the past week</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                            dataKey="day"
                            tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                            stroke="hsl(var(--border))"
                        />
                        <YAxis
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                            stroke="hsl(var(--border))"
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                            }}
                            labelStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: '12px' }}
                            iconType="line"
                        />
                        <Line
                            type="monotone"
                            dataKey="questions"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={{ fill: 'hsl(var(--primary))' }}
                            name="Questions Answered"
                        />
                        <Line
                            type="monotone"
                            dataKey="points"
                            stroke="hsl(var(--secondary))"
                            strokeWidth={2}
                            dot={{ fill: 'hsl(var(--secondary))' }}
                            name="Points Earned"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
