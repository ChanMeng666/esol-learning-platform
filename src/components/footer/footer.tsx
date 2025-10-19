'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Github, Mail, ExternalLink } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="w-full border-t border-border/40 bg-gradient-to-b from-background to-muted/30">
            <div className="container mx-auto px-4 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {/* Developer Brand */}
                    <div className="flex flex-col items-start space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12">
                                <Image
                                    src="/chan_logo.svg"
                                    alt="Chan Meng Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-foreground">Chan Meng</h3>
                                <p className="text-sm text-muted-foreground">Custom Web Solutions</p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Crafting modern, responsive web applications tailored to your needs.
                        </p>
                    </div>

                    {/* Project Info */}
                    <div className="flex flex-col space-y-4">
                        <h3 className="font-semibold text-foreground">NZCEL Prep Platform</h3>
                        <p className="text-sm text-muted-foreground">
                            An interactive learning platform for NZCEL exam preparation with AI-powered assistance.
                        </p>
                        <Link
                            href="https://github.com/ChanMeng666/nzcel-prep"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors w-fit group"
                        >
                            <Github className="h-4 w-4" />
                            <span>View Source Code</span>
                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col space-y-4">
                        <h3 className="font-semibold text-foreground">Get in Touch</h3>
                        <div className="flex flex-col space-y-3">
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

                {/* Bottom Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <p>
                        © {currentYear} Chan Meng. All rights reserved.
                    </p>
                    <p className="text-center sm:text-right">
                        Need a custom website?{' '}
                        <a
                            href="mailto:chanmeng.dev@gmail.com"
                            className="text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                            Let&apos;s talk
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    )
}
