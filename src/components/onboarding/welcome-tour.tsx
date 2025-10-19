'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, BookOpen, Award, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface WelcomeTourProps {
    onComplete?: () => void
}

const tourSteps = [
    {
        title: 'Welcome to NZCEL Prep!',
        description: 'AI-powered NZCEL exam preparation.',
        icon: BookOpen,
    },
    {
        title: 'Practice Your Skills',
        description: 'Practice all 4 skills.',
        icon: Award,
    },
    {
        title: 'Track Your Progress',
        description: 'Monitor your performance.',
        icon: LayoutDashboard,
    },
]

export function WelcomeTour({ onComplete }: WelcomeTourProps) {
    const [currentStep, setCurrentStep] = useState(0)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Check if user has seen the tour before
        const hasSeenTour = localStorage.getItem('hasSeenWelcomeTour')
        if (!hasSeenTour) {
            setIsVisible(true)
        }
    }, [])

    const handleNext = () => {
        if (currentStep < tourSteps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            handleComplete()
        }
    }

    const handleComplete = () => {
        localStorage.setItem('hasSeenWelcomeTour', 'true')
        setIsVisible(false)
        onComplete?.()
    }

    const handleSkip = () => {
        handleComplete()
    }

    const currentStepData = tourSteps[currentStep]
    const Icon = currentStepData.icon

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
                        onClick={handleSkip}
                    />

                    {/* Tour Card */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', duration: 0.5 }}
                        >
                            <Card className="w-full max-w-md">
                                <CardContent className="p-6">
                                    {/* Close Button */}
                                    <button
                                        onClick={handleSkip}
                                        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>

                                    {/* Content */}
                                    <div className="flex flex-col items-center text-center space-y-4">
                                        {/* Icon */}
                                        <motion.div
                                            key={currentStep}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', delay: 0.2 }}
                                            className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-destructive flex items-center justify-center"
                                        >
                                            <Icon className="h-8 w-8 text-primary-foreground" />
                                        </motion.div>

                                        {/* Title */}
                                        <motion.h2
                                            key={`title-${currentStep}`}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-2xl font-bold"
                                        >
                                            {currentStepData.title}
                                        </motion.h2>

                                        {/* Description */}
                                        <motion.p
                                            key={`desc-${currentStep}`}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="text-muted-foreground"
                                        >
                                            {currentStepData.description}
                                        </motion.p>

                                        {/* Progress Dots */}
                                        <div className="flex gap-2 pt-4">
                                            {tourSteps.map((_, index) => (
                                                <div
                                                    key={index}
                                                    className={`h-2 w-2 rounded-full transition-all ${
                                                        index === currentStep
                                                            ? 'bg-primary w-8'
                                                            : 'bg-muted'
                                                    }`}
                                                />
                                            ))}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3 pt-4 w-full">
                                            {currentStep > 0 && (
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setCurrentStep(currentStep - 1)}
                                                    className="flex-1"
                                                >
                                                    Back
                                                </Button>
                                            )}
                                            <Button
                                                onClick={handleNext}
                                                className="flex-1 gap-2"
                                            >
                                                {currentStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}
                                                <ArrowRight className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Skip Button */}
                                        {currentStep < tourSteps.length - 1 && (
                                            <button
                                                onClick={handleSkip}
                                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                Skip tour
                                            </button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}
