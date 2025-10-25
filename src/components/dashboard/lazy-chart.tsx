"use client";

import { Suspense, lazy } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Lazy loading wrapper for chart components
 * Improves initial page load by deferring chart rendering
 */

// Lazy load chart components
const ChartAreaInteractiveLazy = lazy(() =>
  import("@/components/charts/chart-area-interactive").then((mod) => ({
    default: mod.ChartAreaInteractive,
  }))
);

const ChartRevenueLazy = lazy(() =>
  import("@/components/charts/chart-revenue").then((mod) => ({
    default: mod.ChartRevenue,
  }))
);

const ChartVisitorsLazy = lazy(() =>
  import("@/components/charts/chart-visitors").then((mod) => ({
    default: mod.ChartVisitors,
  }))
);

/**
 * Loading skeleton for charts
 */
function ChartSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-[250px] w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Lazy loaded ChartAreaInteractive with suspense
 */
export function LazyChartAreaInteractive(
  props: React.ComponentProps<typeof ChartAreaInteractiveLazy>
) {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <ChartAreaInteractiveLazy {...props} />
    </Suspense>
  );
}

/**
 * Lazy loaded ChartRevenue with suspense
 */
export function LazyChartRevenue(
  props: React.ComponentProps<typeof ChartRevenueLazy>
) {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <ChartRevenueLazy {...props} />
    </Suspense>
  );
}

/**
 * Lazy loaded ChartVisitors with suspense
 */
export function LazyChartVisitors(
  props: React.ComponentProps<typeof ChartVisitorsLazy>
) {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <ChartVisitorsLazy {...props} />
    </Suspense>
  );
}
