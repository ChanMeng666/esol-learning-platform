'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
    BookOpen,
    MessageCircle,
    LayoutDashboard,
    Mic,
    Users,
    ClipboardList,
    TrendingUp,
    GraduationCap,
    Building2,
    Shield,
    FileText,
    Settings,
    LogIn,
    UserPlus,
    Info
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useUser, useStackApp } from '@stackframe/stack'

export function Footer() {
    const currentYear = new Date().getFullYear()
    const user = useUser()
    const app = useStackApp()
    const userRole = (user?.clientMetadata?.role as string) || 'student'

    // Guest/Unauthenticated Quick Links
    const guestLinks = [
        { href: '/register', label: 'Get Started', icon: UserPlus },
        { href: app.urls.signIn, label: 'Sign In', icon: LogIn },
        { href: '/speaking', label: 'AI Speaking Coach', icon: Mic },
        { href: '/practice', label: 'Practice Demo', icon: BookOpen },
        { href: '/about', label: 'About Us', icon: Info },
    ]

    // Student Quick Links
    const studentLinks = [
        { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/speaking', label: 'AI Speaking Coach', icon: Mic },
        { href: '/practice/general', label: 'General Practice', icon: BookOpen },
        { href: '/practice/nzcel', label: 'NZCEL Prep', icon: GraduationCap },
        { href: '/conversation', label: 'Conversation', icon: MessageCircle },
        { href: '/student/progress', label: 'My Progress', icon: TrendingUp },
    ]

    // Teacher Quick Links
    const teacherLinks = [
        { href: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/teacher/classes', label: 'My Classes', icon: Users },
        { href: '/teacher/assignments', label: 'Assignments', icon: ClipboardList },
        { href: '/teacher/students', label: 'Student Progress', icon: TrendingUp },
        { href: '/teacher/resources', label: 'Resources', icon: BookOpen },
        { href: '/teacher/analytics', label: 'Analytics', icon: FileText },
    ]

    // Parent Quick Links
    const parentLinks = [
        { href: '/parent/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/parent/children', label: 'Children Progress', icon: Users },
        { href: '/parent/assignments', label: 'Assignments', icon: ClipboardList },
        { href: '/parent/feedback', label: 'Teacher Feedback', icon: MessageCircle },
        { href: '/parent/reports', label: 'Reports', icon: FileText },
    ]

    // School Admin Quick Links
    const schoolAdminLinks = [
        { href: '/school-admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/school-admin/departments', label: 'Departments', icon: Building2 },
        { href: '/school-admin/users', label: 'User Management', icon: Users },
        { href: '/school-admin/analytics', label: 'Analytics', icon: TrendingUp },
        { href: '/school-admin/reports', label: 'Reports', icon: FileText },
        { href: '/school-admin/settings', label: 'Settings', icon: Settings },
    ]

    // Department Head Quick Links
    const departmentHeadLinks = [
        { href: '/department/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/department/teachers', label: 'Teachers', icon: Users },
        { href: '/department/classes', label: 'Classes', icon: GraduationCap },
        { href: '/department/analytics', label: 'Analytics', icon: TrendingUp },
        { href: '/department/reports', label: 'Reports', icon: FileText },
    ]

    // System Admin Quick Links
    const systemAdminLinks = [
        { href: '/system-admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/system-admin/organizations', label: 'Organizations', icon: Building2 },
        { href: '/system-admin/users', label: 'User Management', icon: Users },
        { href: '/system-admin/permissions', label: 'Permissions', icon: Shield },
        { href: '/system-admin/audit', label: 'Audit Logs', icon: FileText },
        { href: '/system-admin/database', label: 'Database', icon: Settings },
    ]

    // Select appropriate links based on user status and role
    const footerLinks = !user ? guestLinks :
                        userRole === 'teacher' ? teacherLinks :
                        userRole === 'parent' ? parentLinks :
                        userRole === 'school_admin' ? schoolAdminLinks :
                        userRole === 'department_head' ? departmentHeadLinks :
                        userRole === 'system_admin' ? systemAdminLinks :
                        studentLinks

    const schools = [
        {
            name: 'Crimson AGE School',
            logo: '/images/schools/crimson-age-school.svg',
            description: 'On-campus learning, primary to high school, NZ and international curriculum',
            url: 'https://age.school.nz/',
        },
        {
            name: 'Crimson Global Academy',
            logo: '/images/schools/crimson-global-academy.svg',
            description: 'Global private classes for 7-18yrs, international curriculum',
            url: 'https://www.crimsonglobalacademy.school/nz/',
        },
        {
            name: 'Mt Hobson Academy',
            logo: '/images/schools/mt-hobson-academy-black.svg',
            description: 'Online high school learning, NZ curriculum',
            url: 'https://www.mthobson.school.nz/',
        },
        {
            name: 'Aotearoa Infinite Academy',
            logo: '/images/schools/aotearoa-infinite-academy.svg',
            description: 'Online high school, NZ curriculum',
            url: 'https://www.aotearoainfiniteacademy.school/',
        },
    ]

    return (
        <footer className="w-full border-t border-border/40 bg-background">
            <div className="container mx-auto px-4 py-16">
                {/* Main Footer Content - Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 mb-12">
                    {/* Project Brand - Prominent */}
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center gap-3">
                            <Image
                                src="/images/brand/nzcel-prep-logo.svg"
                                alt="ESOL Platform Logo"
                                width={48}
                                height={48}
                                className="h-12 w-12"
                            />
                            <div>
                                <h3 className="font-bold text-xl text-foreground">ESOL Platform</h3>
                                <p className="text-sm text-muted-foreground">AI-Powered English Learning</p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-md">
                            Comprehensive English language learning with AI-powered speaking practice, NZCEL exam prep, CEFR-aligned exercises, and adaptive learning paths tailored to your goals.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col space-y-4">
                        <div>
                            <h3 className="font-semibold text-foreground">Quick Links</h3>
                            {!user && <p className="text-xs text-muted-foreground mt-1">Get started with our platform</p>}
                            {user && userRole === 'student' && <p className="text-xs text-muted-foreground mt-1">Student resources</p>}
                            {user && userRole === 'teacher' && <p className="text-xs text-muted-foreground mt-1">Teaching tools</p>}
                            {user && userRole === 'parent' && <p className="text-xs text-muted-foreground mt-1">Parent portal</p>}
                            {user && userRole === 'school_admin' && <p className="text-xs text-muted-foreground mt-1">School administration</p>}
                            {user && userRole === 'department_head' && <p className="text-xs text-muted-foreground mt-1">Department management</p>}
                            {user && userRole === 'system_admin' && <p className="text-xs text-muted-foreground mt-1">System administration</p>}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                            {footerLinks.slice(0, 6).map((link) => {
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
                </div>

                <Separator className="my-12" />

                {/* Crimson Academies Section - Standalone Row */}
                <div className="flex flex-col items-center space-y-6 mb-12">
                    <Link
                        href="https://crimsonacademies.school/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center space-y-3 group"
                    >
                        <Image
                            src="/images/schools/crimson-academies-logo-black.svg"
                            alt="Crimson Academies Logo"
                            width={200}
                            height={200}
                            className="h-48 w-48 group-hover:scale-105 transition-transform"
                        />
                        <h4 className="font-medium text-lg text-foreground text-center group-hover:text-primary transition-colors">
                            Crimson Academies
                        </h4>
                    </Link>
                    <p className="text-sm text-muted-foreground text-center max-w-2xl">
                        Reinventing world-class education to unlock students&apos; limitless potential. Empowering learners across virtual and hybrid campuses worldwide.
                    </p>
                </div>

                <Separator className="my-12" />

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

                {/* Developer brand credit — Chan Meng */}
                <div className="mt-6 flex flex-col items-center gap-2 border-t border-border/40 pt-6 text-center">
                    <a
                        href="https://github.com/ChanMeng666"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <Image src="/brand/chan-meng-monkey.svg" alt="Chan Meng" width={20} height={20} className="h-5 w-5" />
                        <span className="font-medium">Built by Chan Meng — need a custom app like this one?</span>
                    </a>
                    <a
                        href="mailto:chanmeng.dev@gmail.com"
                        className="text-xs text-muted-foreground transition-colors hover:text-primary"
                    >
                        chanmeng.dev@gmail.com
                    </a>
                </div>
            </div>
        </footer>
    )
}
