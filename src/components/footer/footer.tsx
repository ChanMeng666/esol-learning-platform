'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Github, Mail, ExternalLink, BookOpen, MessageCircle, LayoutDashboard } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export function Footer() {
    const currentYear = new Date().getFullYear()

    const footerLinks = [
        { href: '/practice', label: 'Practice', icon: BookOpen },
        { href: '/conversation', label: 'Conversation', icon: MessageCircle },
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
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
                                alt="NZCEL Prep Logo"
                                width={48}
                                height={48}
                                className="h-12 w-12"
                            />
                            <div>
                                <h3 className="font-bold text-xl text-foreground">NZCEL Prep</h3>
                                <p className="text-sm text-muted-foreground">Interactive Learning Platform</p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-md">
                            Master the New Zealand Certificates in English Language with AI-powered practice, adaptive learning, and gamification.
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

                    {/* Developer Info */}
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/chan_logo.svg"
                                alt="Chan Meng Logo"
                                width={24}
                                height={24}
                                className="h-6 w-6"
                            />
                            <h3 className="font-semibold text-foreground">Chan Meng</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Custom web solutions tailored to your needs. From concept to deployment.
                        </p>
                        <div className="flex flex-col space-y-2">
                            <a
                                href="mailto:chanmeng.dev@gmail.com"
                                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
                            >
                                <Mail className="h-4 w-4" />
                                <span>chanmeng.dev@gmail.com</span>
                            </a>
                            <Link
                                href="https://github.com/ChanMeng666"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit group"
                            >
                                <Github className="h-4 w-4" />
                                <span>Portfolio & Projects</span>
                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                        </div>
                    </div>
                </div>

                <Separator className="my-8" />

                {/* Bottom Bar - Copyright */}
                <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground/70">
                    <span>© {currentYear} NZCEL Prep. All rights reserved.</span>
                </div>
            </div>
        </footer>
    )
}
