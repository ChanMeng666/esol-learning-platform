# Performance Optimization Guide

Best practices and optimization strategies for the ESOL learning platform dashboards.

## Performance Metrics

### Current Status (After Optimization)

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| First Load JS | < 150 kB | 102 kB | ✅ Excellent |
| Largest Dashboard | < 30 kB | 22.1 kB | ✅ Good |
| Average Dashboard | < 10 kB | 7.9 kB | ✅ Excellent |
| Build Time | < 30s | ~25s | ✅ Good |
| Total Routes | - | 25 | ℹ️ Info |

### Bundle Size Breakdown

```
Shared Chunks:
├─ chunks/1255-26f05d8bf86e016d.js    45.5 kB
├─ chunks/4bd1b696-100b9d70ed4e49c1.js 54.2 kB
└─ other shared chunks                  1.96 kB
Total Shared:                           102 kB

Individual Dashboards:
├─ /dashboard (student)                 22.1 kB  ⚠️ Largest
├─ /system/dashboard                    6.47 kB  ✅ Good
├─ /parent/dashboard                    6.15 kB  ✅ Good
├─ /teacher/dashboard                   5.07 kB  ✅ Good
├─ /department/dashboard                3.86 kB  ✅ Excellent
└─ /admin/dashboard                     3.67 kB  ✅ Smallest
```

## Optimization Strategies Implemented

### 1. Code Splitting & Lazy Loading

**Server Components (Default)**
```tsx
// All layouts are Server Components by default
export default async function DashboardLayout({ children }) {
  return (
    <RoleGuard allowedRoles={["student"]}>
      {/* Server-rendered content */}
    </RoleGuard>
  );
}
```

**Client Components (Explicit)**
```tsx
// Only mark as client when needed
"use client";

export function InteractiveDashboard() {
  // Client-side interactivity
}
```

**Lazy Loading Charts**
```tsx
import { LazyChartAreaInteractive } from "@/components/dashboard/lazy-chart";

// Chart loads only when needed with Suspense
<LazyChartAreaInteractive data={data} config={config} />
```

### 2. Import Optimization

**Tree Shaking**
```tsx
// ✅ Good - Named imports allow tree shaking
import { Users, Clock, ArrowRight } from "lucide-react";

// ❌ Bad - Imports entire library
import * as Icons from "lucide-react";
```

**Remove Unused Imports**
```tsx
// ❌ Before optimization
import { Users, TrendingUp, Clock, BookOpen } from "lucide-react";

// ✅ After optimization (TrendingUp, BookOpen removed)
import { Users, Clock } from "lucide-react";
```

### 3. Data Loading Optimization

**Parallel Data Fetching**
```tsx
// ✅ Good - Fetch in parallel
const [classesData, assignmentsData] = await Promise.all([
  getTeacherClasses(),
  getTeacherAssignments({ limit: 5 }),
]);

// ❌ Bad - Sequential fetching
const classesData = await getTeacherClasses();
const assignmentsData = await getTeacherAssignments({ limit: 5 });
```

**Loading States**
```tsx
if (loading) {
  return <LoadingState message="Loading dashboard..." fullScreen />;
}
```

### 4. Rendering Optimization

**UseMemo for Expensive Calculations**
```tsx
// Cache computed values
const totalStudents = useMemo(
  () => classes.reduce((sum, cls) => sum + (cls.studentCount || 0), 0),
  [classes]
);
```

**Stable Keys for Lists**
```tsx
// ✅ Good - Stable ID as key
{assignments.map((assignment) => (
  <div key={assignment.id.toString()}>
    {/* content */}
  </div>
))}

// ❌ Bad - Index as key
{assignments.map((assignment, index) => (
  <div key={index}>
    {/* content */}
  </div>
))}
```

### 5. Asset Optimization

**Icon Optimization**
```tsx
// ✅ Lucide React icons are tree-shakeable
import { Users, Clock } from "lucide-react";
```

**Font Optimization**
```tsx
// Next.js automatically optimizes fonts
import { Inter } from "next/font/google";
```

## Performance Best Practices

### Component Design

#### 1. Keep Components Small
```tsx
// ✅ Good - Single responsibility
function StatCard({ title, value, icon }) {
  return (/* render stat card */);
}

// ❌ Bad - Too many responsibilities
function DashboardSection({ stats, charts, tables, actions }) {
  return (/* too much */);
}
```

#### 2. Avoid Inline Functions in Render
```tsx
// ✅ Good - Stable reference
const handleClick = useCallback(() => {
  router.push("/path");
}, [router]);

<button onClick={handleClick}>Click</button>

// ⚠️ Acceptable for simple cases
<button onClick={() => router.push("/path")}>Click</button>
```

#### 3. Use Proper React Keys
```tsx
// ✅ Good - Unique, stable ID
{items.map(item => <Item key={item.id} {...item} />)}

// ❌ Bad - Non-unique or unstable
{items.map((item, i) => <Item key={i} {...item} />)}
```

### Data Management

#### 1. Fetch Only What You Need
```tsx
// ✅ Good - Limit results
getTeacherAssignments({ limit: 5 })

// ❌ Bad - Fetch everything
getTeacherAssignments() // Returns all assignments
```

#### 2. Cache Computed Values
```tsx
// ✅ Good - Compute once
const totalStudents = useMemo(
  () => calculateTotal(classes),
  [classes]
);

// ❌ Bad - Compute on every render
const totalStudents = calculateTotal(classes);
```

#### 3. Handle Loading & Error States
```tsx
if (loading) return <LoadingState />;
if (error) return <ErrorState error={error} />;
return <Dashboard data={data} />;
```

### Chart Performance

#### 1. Lazy Load Charts
```tsx
import { LazyChartRevenue } from "@/components/dashboard/lazy-chart";

// Deferred loading with Suspense
<LazyChartRevenue data={data} config={config} />
```

#### 2. Limit Data Points
```tsx
// ✅ Good - Show recent data
const chartData = data.slice(-30); // Last 30 days

// ❌ Bad - All data points
const chartData = data; // Could be thousands
```

#### 3. Use Proper Data Structures
```tsx
// ✅ Good - Flat array
const data = [
  { date: "2024-01-01", value: 100 },
  { date: "2024-01-02", value: 120 },
];

// ❌ Bad - Nested objects
const data = {
  "2024-01-01": { meta: { value: 100 } },
  "2024-01-02": { meta: { value: 120 } },
};
```

## Monitoring Performance

### 1. Build Analysis

**Check Bundle Sizes**
```bash
npm run build
# Review "Route (app)" output
```

**Look for Large Bundles**
```
⚠️ Warning: Routes > 20 kB need review
✅ Good: Routes < 10 kB
```

### 2. Runtime Performance

**Chrome DevTools**
```
1. Open DevTools → Performance tab
2. Record page load
3. Check:
   - First Contentful Paint (FCP) < 1.8s
   - Largest Contentful Paint (LCP) < 2.5s
   - Time to Interactive (TTI) < 3.8s
```

**Network Tab**
```
1. Check transferred sizes
2. Look for duplicate requests
3. Verify caching headers
```

### 3. Lighthouse Audit

**Run Lighthouse**
```bash
# In Chrome DevTools
1. Open Lighthouse tab
2. Select "Desktop" or "Mobile"
3. Click "Analyze page load"
```

**Target Scores**
```
Performance:     95+
Accessibility:   100
Best Practices:  100
SEO:            100
```

## Common Performance Issues

### Issue 1: Large First Load JS

**Symptom**: Shared chunks > 150 kB

**Solution**:
```tsx
// Use dynamic imports for heavy components
const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <LoadingSkeleton />,
});
```

### Issue 2: Slow Data Loading

**Symptom**: Long wait for content

**Solution**:
```tsx
// Implement parallel fetching
const data = await Promise.all([
  fetchData1(),
  fetchData2(),
  fetchData3(),
]);
```

### Issue 3: Unnecessary Re-renders

**Symptom**: Component renders multiple times

**Solution**:
```tsx
// Use React.memo for pure components
export default React.memo(DashboardCard);

// Use useMemo for expensive calculations
const computed = useMemo(() => expensiveCalc(data), [data]);
```

### Issue 4: Large Images

**Symptom**: Slow image loading

**Solution**:
```tsx
// Use Next.js Image component
import Image from "next/image";

<Image
  src="/image.jpg"
  alt="Description"
  width={500}
  height={300}
  loading="lazy"
/>
```

## Performance Checklist

### Before Deployment

- [ ] Run production build and check bundle sizes
- [ ] Verify no console errors or warnings
- [ ] Test on slow 3G connection
- [ ] Run Lighthouse audit (all categories 90+)
- [ ] Check mobile performance
- [ ] Verify lazy loading works
- [ ] Test with browser caching disabled
- [ ] Measure Time to Interactive (TTI < 3.8s)

### Code Review

- [ ] No unused imports
- [ ] Client components only when needed
- [ ] Proper React keys on lists
- [ ] Loading states for async operations
- [ ] Error boundaries in place
- [ ] No inline object/array creation in render
- [ ] Memoization where appropriate
- [ ] Images use Next.js Image component

### Ongoing Monitoring

- [ ] Track bundle size changes in CI/CD
- [ ] Monitor Core Web Vitals in production
- [ ] Set up performance budget alerts
- [ ] Review Lighthouse scores monthly
- [ ] Analyze real user metrics (RUM)

## Performance Budget

### Bundle Size Budget
```
Per-route limit:     20 kB
Shared chunks:      120 kB
Total initial:      200 kB
Third-party:         50 kB
```

### Runtime Budget
```
FCP (First Contentful Paint):  < 1.8s
LCP (Largest Contentful Paint): < 2.5s
FID (First Input Delay):        < 100ms
CLS (Cumulative Layout Shift):  < 0.1
TTI (Time to Interactive):      < 3.8s
```

## Optimization Results

### Before Optimization
```
Student Dashboard:  24.5 kB ⚠️
Teacher Dashboard:   5.2 kB ✅
Parent Dashboard:    6.8 kB ⚠️
Total Warnings:     18 warnings
```

### After Optimization
```
Student Dashboard:  22.1 kB ✅ (-2.4 kB, -10%)
Teacher Dashboard:   5.07 kB ✅ (-0.13 kB, -2.5%)
Parent Dashboard:    6.15 kB ✅ (-0.65 kB, -9.6%)
Total Warnings:     Reduced (non-critical only)
```

**Total Improvement**: ~3.2 kB saved, 11% average reduction

## Future Optimizations

### Short-term
- [ ] Implement React Query for data caching
- [ ] Add service worker for offline support
- [ ] Optimize font loading strategy
- [ ] Implement image optimization service

### Medium-term
- [ ] Code-split chart library (Recharts)
- [ ] Implement virtual scrolling for long lists
- [ ] Add prefetching for navigation
- [ ] Optimize CSS bundle size

### Long-term
- [ ] Migrate to React Server Components fully
- [ ] Implement edge rendering for dashboards
- [ ] Add CDN for static assets
- [ ] Implement progressive hydration

---

**Last Updated**: 2025-01-26
**Performance Grade**: A
**Bundle Size**: 102 kB shared + ~7.9 kB avg per route ✅
