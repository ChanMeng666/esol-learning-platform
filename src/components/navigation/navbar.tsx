'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, Flame, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUserProgress } from '@/lib/store/user-progress'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useState, useEffect } from 'react'

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/practice', label: 'Practice' },
    { href: '/conversation', label: 'Conversation' },
    { href: '/dashboard', label: 'Dashboard' },
]

export function Navbar() {
    const pathname = usePathname()
    const { totalPoints, streak } = useUserProgress()
    const [isOpen, setIsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)

    // Ensure Sheet only renders on client to prevent hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    // Handle scroll to show/hide navbar
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY

            // Show navbar when scrolling up or at the top
            if (currentScrollY < lastScrollY || currentScrollY < 10) {
                setIsVisible(true)
            }
            // Hide navbar when scrolling down (but only after scrolling past 100px)
            else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false)
            }

            setLastScrollY(currentScrollY)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [lastScrollY])

    return (
        <nav className={`sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/nzcel-prep-logo.svg"
                            alt="NZCEL Prep Logo"
                            width={40}
                            height={40}
                            className="h-10 w-10"
                        />
                        <span className="hidden font-bold text-xl text-black dark:text-white sm:inline-block">
                            NZCEL Prep
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href
                            return (
                                <Link key={link.href} href={link.href}>
                                    <Button
                                        variant={isActive ? "default" : "ghost"}
                                        className={`relative ${isActive ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90' : 'text-black dark:text-white'}`}
                                    >
                                        {link.label}
                                    </Button>
                                </Link>
                            )
                        })}
                    </div>

                    {/* User Stats & Mobile Menu */}
                    <div className="flex items-center gap-3">
                        {/* User Stats */}
                        <div className="hidden sm:flex items-center gap-3">
                            <div className="flex items-center gap-1.5 rounded-full bg-black/5 dark:bg-white/10 px-3 py-1.5 border border-black/10 dark:border-white/20">
                                <Trophy className="h-4 w-4 text-black dark:text-white" />
                                <span className="text-sm font-semibold text-black dark:text-white">
                                    {totalPoints}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1.5">
                                <Flame className="h-4 w-4 text-white" />
                                <span className="text-sm font-semibold text-white">
                                    {streak}
                                </span>
                            </div>
                        </div>

                        {/* Mobile Menu */}
                        {mounted ? (
                            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                                <SheetTrigger asChild className="md:hidden">
                                    <Button variant="ghost" size="icon">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Image
                                                src="/nzcel-prep-logo.svg"
                                                alt="NZCEL Prep Logo"
                                                width={32}
                                                height={32}
                                                className="h-8 w-8"
                                            />
                                            <SheetTitle className="text-left">Navigation</SheetTitle>
                                        </div>
                                        <SheetDescription className="text-left">
                                            Navigate through the NZCEL Prep platform
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="mt-6 flex flex-col gap-2">
                                        {/* Mobile Stats */}
                                        <div className="mb-4 flex items-center justify-between rounded-lg bg-muted p-4">
                                            <div className="flex items-center gap-2">
                                                <Trophy className="h-5 w-5 text-black dark:text-white" />
                                                <span className="font-semibold text-black dark:text-white">{totalPoints} Points</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Flame className="h-5 w-5 text-orange-500" />
                                                <span className="font-semibold text-orange-500">{streak} Days</span>
                                            </div>
                                        </div>

                                        {/* Mobile Nav Links */}
                                        {navLinks.map((link) => {
                                            const isActive = pathname === link.href
                                            return (
                                                <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                                                    <Button
                                                        variant={isActive ? "default" : "ghost"}
                                                        className={`w-full justify-start ${isActive ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-black dark:text-white'}`}
                                                    >
                                                        {link.label}
                                                    </Button>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        ) : (
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
