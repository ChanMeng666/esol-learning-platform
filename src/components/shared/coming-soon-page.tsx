"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Rocket, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ComingSoonPageProps {
  title: string;
  description?: string;
  expectedDate?: string;
  features?: string[];
  backUrl?: string;
  backLabel?: string;
}

export function ComingSoonPage({
  title,
  description = "We're working hard to bring you this feature. Check back soon!",
  expectedDate = "Q1 2025",
  features = [],
  backUrl,
  backLabel = "Go Back",
}: ComingSoonPageProps) {
  const router = useRouter();

  const handleGoBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Rocket className="h-10 w-10 text-white animate-pulse" />
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">{description}</p>
            </div>

            {/* Expected Date */}
            {expectedDate && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Expected Release: {expectedDate}</span>
              </div>
            )}

            {/* Features Preview */}
            {features.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-6 text-left">
                <h3 className="font-semibold mb-3 text-center">What to Expect</h3>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full text-sm font-medium">
              <Clock className="h-4 w-4" />
              <span>In Development</span>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleGoBack}
              variant="default"
              size="lg"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}