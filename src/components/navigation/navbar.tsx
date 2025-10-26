'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, Flame, Trophy, User, LogOut, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUserProgress } from '@/lib/store/user-progress'
import { useUser, useStackApp } from '@stackframe/stack'
import { getDefaultDashboardRoute } from '@/lib/dashboard-configs'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from 'react'

// Navigation structure for students
const studentNavigation: Array<{label: string; href: string; featured?: boolean}> = [
    // Dashboard link removed - available in user dropdown menu
]

// Navigation structure for teachers
const teacherNavigation: Array<{label: string; href: string; featured?: boolean}> = [
    // Dashboard link removed - available in user dropdown menu
]

export function Navbar() {
    const pathname = usePathname()
    const { totalPoints, streak } = useUserProgress()
    const [isOpen, setIsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [isPracticeDropdownOpen, setIsPracticeDropdownOpen] = useState(false)

    // Use Stack Auth hooks at top level
    // No redirect - allow unauthenticated users to access public pages
    const user = useUser()
    const app = useStackApp()

    // Get user role from Stack Auth clientMetadata
    const userRole = (user?.clientMetadata?.role as string) || 'student'

    // Get the correct dashboard route based on user role
    const dashboardRoute = getDefaultDashboardRoute(userRole as any)
    const settingsRoute = dashboardRoute + '/settings'

    // Select navigation based on role
    const navigationStructure = userRole === 'teacher' ? teacherNavigation : studentNavigation

    // Show navigation only for authenticated users
    const showNavigation = !!user

    // Ensure client-only rendering for certain features
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
                    {/* Logo - Clickable to navigate to homepage */}
                    <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                        <Image
                            src="/images/brand/nzcel-prep-logo.svg"
                            alt="ESOL Platform Logo"
                            width={40}
                            height={40}
                            className="h-10 w-10"
                        />
                        <span className="hidden font-bold text-xl text-black dark:text-white sm:inline-block">
                            ESOL Platform
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {showNavigation && navigationStructure.map((item) => {
                            // Handle simple links (no more dropdown items)
                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                            return (
                                <Link key={item.href} href={item.href}>
                                    <Button
                                        variant={isActive ? "default" : "ghost"}
                                        className={`relative ${isActive ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90' : 'text-black dark:text-white'} ${item.featured ? 'font-semibold' : ''}`}
                                    >
                                        {item.label}
                                    </Button>
                                </Link>
                            )
                        })}
                    </div>

                    {/* User Stats & Auth & Mobile Menu */}
                    <div className="flex items-center gap-3">
                        {/* User Stats - only show if logged in */}
                        {user && (
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
                        )}

                        {/* Auth Button - Desktop */}
                        {mounted && (
                            <div className="hidden md:flex items-center gap-2">
                                {user ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="rounded-full">
                                                <User className="h-5 w-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuLabel>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">{user.displayName || "User"}</span>
                                                    <span className="text-xs text-muted-foreground">{user.primaryEmail}</span>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link href={dashboardRoute}>
                                                    <User className="mr-2 h-4 w-4" />
                                                    Dashboard
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={settingsRoute}>
                                                    <User className="mr-2 h-4 w-4" />
                                                    Account Settings
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link href={app.urls.signOut}>
                                                    <LogOut className="mr-2 h-4 w-4" />
                                                    Sign Out
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <Link href={app.urls.signIn}>
                                        <Button>Sign In</Button>
                                    </Link>
                                )}
                            </div>
                        )}

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
                                                src="/images/brand/nzcel-prep-logo.svg"
                                                alt="ESOL Platform Logo"
                                                width={32}
                                                height={32}
                                                className="h-8 w-8"
                                            />
                                            <SheetTitle className="text-left">Navigation</SheetTitle>
                                        </div>
                                        <SheetDescription className="text-left">
                                            Navigate through the ESOL learning platform
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="mt-6 flex flex-col gap-2">
                                        {/* Mobile Stats - only show if logged in */}
                                        {user && (
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
                                        )}

                                        {/* Mobile Auth */}
                                        {user ? (
                                            <>
                                                <div className="mb-2 p-3 rounded-lg bg-muted">
                                                    <p className="text-sm font-medium">{user.displayName || "User"}</p>
                                                    <p className="text-xs text-muted-foreground">{user.primaryEmail}</p>
                                                </div>
                                                <Link href={dashboardRoute} onClick={() => setIsOpen(false)}>
                                                    <Button variant="ghost" className="w-full justify-start">
                                                        <User className="mr-2 h-4 w-4" />
                                                        Dashboard
                                                    </Button>
                                                </Link>
                                                <Link href={settingsRoute} onClick={() => setIsOpen(false)}>
                                                    <Button variant="ghost" className="w-full justify-start">
                                                        <User className="mr-2 h-4 w-4" />
                                                        Account Settings
                                                    </Button>
                                                </Link>
                                                <Link href={app.urls.signOut} onClick={() => setIsOpen(false)}>
                                                    <Button variant="ghost" className="w-full justify-start text-red-600">
                                                        <LogOut className="mr-2 h-4 w-4" />
                                                        Sign Out
                                                    </Button>
                                                </Link>
                                                <div className="my-2 border-t" />
                                            </>
                                        ) : (
                                            <>
                                                <Link href={app.urls.signIn} onClick={() => setIsOpen(false)}>
                                                    <Button className="w-full">Sign In</Button>
                                                </Link>
                                                <div className="my-2 border-t" />
                                            </>
                                        )}

                                        {/* Mobile Nav Links */}
                                        {showNavigation && navigationStructure.map((item) => {
                                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                                            return (
                                                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                                                    <Button
                                                        variant={isActive ? "default" : "ghost"}
                                                        className={`w-full justify-start ${isActive ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-black dark:text-white'} ${item.featured ? 'font-semibold' : ''}`}
                                                    >
                                                        {item.label}
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
