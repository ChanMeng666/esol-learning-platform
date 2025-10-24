'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Github, ExternalLink, BookOpen, MessageCircle, LayoutDashboard, Mic } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export function Footer() {
    const currentYear = new Date().getFullYear()

    const footerLinks = [
        { href: '/speaking', label: 'AI Speaking Coach', icon: Mic },
        { href: '/practice', label: 'Practice', icon: BookOpen },
        { href: '/conversation', label: 'Conversation', icon: MessageCircle },
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ]

    const schools = [
        {
            name: 'Crimson AGE School',
            logo: '/schools-logo/crimson-age-school.svg',
            description: 'On-campus learning, primary to high school, NZ and international curriculum',
            url: 'https://age.school.nz/',
        },
        {
            name: 'Crimson Global Academy',
            logo: '/schools-logo/crimson-global-academy.svg',
            description: 'Global private classes for 7-18yrs, international curriculum',
            url: 'https://www.crimsonglobalacademy.school/nz/',
        },
        {
            name: 'Mt Hobson Academy',
            logo: '/schools-logo/mt-hobson-academy-black.svg',
            description: 'Online high school learning, NZ curriculum',
            url: 'https://www.mthobson.school.nz/',
        },
        {
            name: 'Aotearoa Infinite Academy',
            logo: '/schools-logo/aotearoa-infinite-academy.svg',
            description: 'Online high school, NZ curriculum',
            url: 'https://www.aotearoainfiniteacademy.school/',
        },
    ]

    return (
        <footer className="w-full border-t border-border/40 bg-background">
            <div className="container mx-auto px-4 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {/* Project Brand - Prominent */}
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center gap-3">
                            <Image
                                src="/nzcel-prep-logo.svg"
                                alt="ESOL Learning Platform Logo"
                                width={48}
                                height={48}
                                className="h-12 w-12"
                            />
                            <div>
                                <h3 className="font-bold text-xl text-foreground">ESOL Learning Platform</h3>
                                <p className="text-sm text-muted-foreground">AI-Powered English Learning</p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-md">
                            Comprehensive English language learning with AI-powered speaking practice, NZCEL exam prep, CEFR-aligned exercises, and adaptive learning paths tailored to your goals.
                        </p>
                        <Link
                            href="https://github.com/ChanMeng666/nzcel-prep"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors w-fit group"
                        >
                            <Github className="h-4 w-4" />
                            <span>View on GitHub</span>
                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col space-y-4">
                        <h3 className="font-semibold text-foreground">Quick Links</h3>
                        <div className="flex flex-col space-y-2">
                            {footerLinks.map((link) => {
                                const Icon = link.icon
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{link.label}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    {/* Crimson Academies Info */}
                    <div className="flex flex-col space-y-4">
                        <Link
                            href="https://crimsonacademies.school/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 group w-fit"
                        >
                            <Image
                                src="/schools-logo/crimson-academies-logo-black.svg"
                                alt="Crimson Academies Logo"
                                width={80}
                                height={80}
                                className="h-20 w-20 group-hover:scale-105 transition-transform"
                            />
                            <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">Crimson Academies</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Reinventing world-class education to unlock students&apos; limitless potential. Empowering learners across virtual and hybrid campuses worldwide.
                        </p>
                    </div>
                </div>

                <Separator className="my-8" />

                {/* Our Schools Section */}
                <div className="mb-8">
                    <h3 className="font-semibold text-foreground mb-6 text-center">Our Schools</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {schools.map((school) => (
                            <Link
                                key={school.name}
                                href={school.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center space-y-3 p-4 rounded-lg bg-background/50 hover:bg-accent/50 transition-colors group"
                            >
                                <Image
                                    src={school.logo}
                                    alt={`${school.name} Logo`}
                                    width={180}
                                    height={60}
                                    className="h-16 w-auto object-contain group-hover:scale-105 transition-transform"
                                />
                                <h4 className="font-medium text-sm text-foreground text-center group-hover:text-primary transition-colors">{school.name}</h4>
                                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                                    {school.description}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>

                <Separator className="my-8" />

                {/* Bottom Bar - Copyright */}
                <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground/70">
                    <span>© {currentYear} Crimson Academies. All rights reserved.</span>
                    <span>ESOL Learning Platform - Empowering English learners worldwide</span>
                </div>
            </div>
        </footer>
    )
}
