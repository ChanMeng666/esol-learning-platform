'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

export interface BreadcrumbItem {
    label: string
    href?: string
}

interface BreadcrumbProps {
    items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
            {items.map((item, index) => {
                const isLast = index === items.length - 1

                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-2"
                    >
                        {item.href && !isLast ? (
                            <Link
                                href={item.href}
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className={isLast ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                                {item.label}
                            </span>
                        )}

                        {!isLast && (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                    </motion.div>
                )
            })}
        </nav>
    )
}
