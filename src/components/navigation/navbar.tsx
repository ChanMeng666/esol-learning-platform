'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Award, BookOpen, LayoutDashboard, Menu, Flame, Trophy, MessageSquare } from 'lucide-react'
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
import { useState } from 'react'

const navLinks = [
    { href: '/', label: 'Home', icon: BookOpen },
    { href: '/practice', label: 'Practice', icon: Award },
    { href: '/conversation', label: 'Conversation', icon: MessageSquare },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
]

export function Navbar() {
    const pathname = usePathname()
    const { totalPoints, streak } = useUserProgress()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-destructive">
                            <BookOpen className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="hidden font-bold text-xl bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent sm:inline-block">
                            NZCEL Prep
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon
                            const isActive = pathname === link.href
                            return (
                                <Link key={link.href} href={link.href}>
                                    <Button
                                        variant={isActive ? "default" : "ghost"}
                                        className={`relative gap-2 ${isActive ? 'bg-primary text-primary-foreground' : ''}`}
                                    >
                                        <Icon className="h-4 w-4" />
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
                            <div className="flex items-center gap-1.5 rounded-full bg-secondary/50 px-3 py-1.5">
                                <Trophy className="h-4 w-4 text-secondary-foreground" />
                                <span className="text-sm font-semibold text-secondary-foreground">
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
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild className="md:hidden">
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle className="text-left">Navigation</SheetTitle>
                                    <SheetDescription className="text-left">
                                        Navigate through the NZCEL Prep platform
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="mt-6 flex flex-col gap-2">
                                    {/* Mobile Stats */}
                                    <div className="mb-4 flex items-center justify-between rounded-lg bg-muted p-4">
                                        <div className="flex items-center gap-2">
                                            <Trophy className="h-5 w-5 text-primary" />
                                            <span className="font-semibold">{totalPoints} Points</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Flame className="h-5 w-5 text-orange-500" />
                                            <span className="font-semibold">{streak} Days</span>
                                        </div>
                                    </div>

                                    {/* Mobile Nav Links */}
                                    {navLinks.map((link) => {
                                        const Icon = link.icon
                                        const isActive = pathname === link.href
                                        return (
                                            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                                                <Button
                                                    variant={isActive ? "default" : "ghost"}
                                                    className="w-full justify-start gap-3"
                                                >
                                                    <Icon className="h-5 w-5" />
                                                    {link.label}
                                                </Button>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    )
}
