# Public Assets

This directory contains all static assets for the ESOL Learning Platform.

## Directory Structure

```
public/
├── images/                     # All image assets
│   ├── brand/                 # Brand logos and identity
│   │   ├── chan_logo.svg
│   │   └── nzcel-prep-logo.svg
│   ├── schools/               # School logos
│   │   ├── aotearoa-infinite-academy.svg
│   │   ├── crimson-academies-logo-black.svg
│   │   ├── crimson-age-school.svg
│   │   ├── crimson-global-academy.svg
│   │   └── mt-hobson-academy-black.svg
│   ├── accreditations/        # Accreditation and certification logos
│   │   ├── AP.svg
│   │   ├── Cambridge-International-School.svg
│   │   ├── Council-of-British-International-Schools.svg
│   │   ├── Florida-Department-of-Education.svg
│   │   ├── NCAA.svg
│   │   ├── NCEA.svg
│   │   ├── Pearson-Edexcel.svg
│   │   └── Western-Association-of-Schools-and-Colleges.svg
│   ├── illustrations/         # Feature illustrations and graphics
│   │   ├── ai-speaking-coach.svg
│   │   ├── general-practice.svg
│   │   ├── nzcel-exam-prep.svg
│   │   └── scenario-learning.svg
│   └── icons/                 # UI icons and utility graphics
│       ├── file.svg
│       ├── globe.svg
│       ├── next.svg
│       ├── vercel.svg
│       └── window.svg
└── animations/                # Lottie animation files
    ├── dashboard.lottie
    ├── learning.lottie
    ├── realtime-speaking.lottie
    └── speaking.lottie
```

## Usage Guidelines

### Brand Assets (`images/brand/`)
- Platform logo and branding materials
- Used in navbar, footer, and metadata
- Do not modify without approval

### School Logos (`images/schools/`)
- Official logos for partner schools
- Used in footer and about sections
- Maintain aspect ratios when displaying

### Accreditation Logos (`images/accreditations/`)
- Official accreditation and certification logos
- Used in testimonials and credibility sections
- Keep original colors and proportions

### Illustrations (`images/illustrations/`)
- Feature-specific illustrations
- Used in landing page timeline and feature cards
- Can be updated for visual improvements

### Icons (`images/icons/`)
- General UI icons and graphics
- Some are Next.js/Vercel defaults
- Add new icons here for reusability

### Animations (`animations/`)
- Lottie animation files for interactive elements
- Used in dashboard, practice pages, and speaking coach
- Keep file sizes optimized for web

## Adding New Assets

When adding new assets:
1. Choose the appropriate category directory
2. Use descriptive, kebab-case filenames
3. Optimize images/animations for web
4. Update this README if adding new categories
5. Reference using absolute paths from `/images/` or `/animations/`

## File Formats

- **Images**: SVG preferred for logos and icons (scalable, small file size)
- **Animations**: `.lottie` format for interactive animations
- **Naming**: Use kebab-case (e.g., `crimson-age-school.svg`)

## Image Optimization

- SVG files should be minified
- Animations should be optimized for web delivery
- Remove unnecessary metadata from files
- Test file sizes before committing
