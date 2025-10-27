import { LucideIcon, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: "default" | "primary" | "success" | "warning" | "info";
  className?: string;
  footer?: {
    label: string;
    sublabel?: string;
  };
  href?: string;
  isLoading?: boolean;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
  className,
  footer,
  href,
  isLoading = false,
}: StatCardProps) {
  const isTrendingUp = trend ? trend.value > 0 : null;

  // Enhanced gradient styles with better depth
  const variantStyles = {
    default: "bg-gradient-to-br from-card to-card/95 border-border/40 shadow-sm hover:shadow-md",
    primary: "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 shadow-sm hover:shadow-md",
    success: "bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border-green-500/20 shadow-sm hover:shadow-md",
    warning: "bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/20 shadow-sm hover:shadow-md",
    info: "bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/20 shadow-sm hover:shadow-md",
  };

  const iconColors = {
    default: "text-muted-foreground bg-muted/50",
    primary: "text-primary bg-primary/10",
    success: "text-green-600 dark:text-green-400 bg-green-500/10",
    warning: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
    info: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
  };

  const trendColors = {
    positive: "text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/30",
    negative: "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/30",
    neutral: "text-gray-600 dark:text-gray-400 bg-gray-500/10 border-gray-500/30",
  };

  const getTrendColor = () => {
    if (!trend) return trendColors.neutral;
    if (trend.value > 0) return trendColors.positive;
    if (trend.value < 0) return trendColors.negative;
    return trendColors.neutral;
  };

  const cardContent = (
    <>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {isLoading ? (
              <div className="h-9 w-24 bg-muted animate-pulse rounded" />
            ) : (
              <p className="text-2xl font-bold tracking-tight tabular-nums @[250px]/card:text-3xl">
                {value}
              </p>
            )}
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className={cn("rounded-lg p-2.5 backdrop-blur-sm", iconColors[variant])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>

        {/* Trend Badge */}
        {trend && !isLoading && (
          <div className="flex items-center gap-2 mt-3">
            <Badge
              variant="outline"
              className={cn(
                "px-2.5 py-0.5 font-medium",
                getTrendColor()
              )}
            >
              {isTrendingUp ? (
                <TrendingUp className="mr-1 h-3 w-3" />
              ) : trend.value < 0 ? (
                <TrendingDown className="mr-1 h-3 w-3" />
              ) : null}
              {trend.value > 0 ? "+" : ""}{trend.value}%
            </Badge>
            <span className="text-xs text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </CardHeader>

      {/* Footer Section */}
      {footer && (
        <CardFooter className="pt-0 pb-4 flex-col items-start">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
            {footer.label}
            {isTrendingUp !== null && (
              isTrendingUp ? (
                <TrendingUp className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-red-500" />
              )
            )}
          </div>
          {footer.sublabel && (
            <p className="text-xs text-muted-foreground mt-0.5">{footer.sublabel}</p>
          )}
        </CardFooter>
      )}
    </>
  );

  const cardClass = cn(
    variantStyles[variant],
    "transition-all duration-200 @container/card group",
    href && "cursor-pointer hover:scale-[1.02]",
    className
  );

  if (href) {
    return (
      <Link href={href}>
        <Card className={cardClass}>
          {cardContent}
          {href && (
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </Card>
      </Link>
    );
  }

  return (
    <Card className={cardClass}>
      {cardContent}
    </Card>
  );
}
