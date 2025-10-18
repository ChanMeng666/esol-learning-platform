'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import { useUserProgress } from '@/lib/store/user-progress'

export function SkillRadarChart() {
    const { skillProgress } = useUserProgress()

    const data = [
        { skill: 'Listening', value: skillProgress.listening },
        { skill: 'Speaking', value: skillProgress.speaking },
        { skill: 'Reading', value: skillProgress.reading },
        { skill: 'Writing', value: skillProgress.writing },
    ]

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle>Skill Distribution</CardTitle>
                <CardDescription>Your progress across all four NZCEL skills</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={data}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis
                            dataKey="skill"
                            tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                        />
                        <PolarRadiusAxis
                            angle={90}
                            domain={[0, 100]}
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                        />
                        <Radar
                            name="Progress"
                            dataKey="value"
                            stroke="hsl(var(--primary))"
                            fill="hsl(var(--primary))"
                            fillOpacity={0.6}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
