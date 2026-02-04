# Component Breakdown & UI Library

## UI Component Library

### Atomic Design Structure
```
components/
├── ui/              # Atomic components (atoms)
├── features/        # Composed components (molecules + organisms)
├── layout/          # Page layout (templates)
└── forms/           # Form components
```

### Core Components (Pre-built)

#### Basic Components
- ✅ **Button** - Variants: primary, secondary, ghost, danger | Sizes: sm, md, lg
- ✅ **Card** - Hoverable, bordered, with sections (Header, Body, Footer)
- ✅ **Input** - Text input with label, error, icon, helper text
- ✅ **Badge** - Status indicators with variants (default, primary, success, warning, danger)
- ✅ **Rating** - Star rating component (interactive or read-only)
- ✅ **Modal** - Dialog with customizable size and footer
- ✅ **Skeleton** - Loading placeholder

#### Additional UI Components (To Build)
- [ ] **Checkbox** - Checkable input with label
- [ ] **Select/Dropdown** - Dropdown menu selector
- [ ] **Tabs** - Tabbed interface
- [ ] **Toast/Notification** - Toast notifications
- [ ] **Tooltip** - Hover tooltips
- [ ] **Pagination** - Page navigation
- [ ] **Spinner** - Loading indicator
- [ ] **Avatar** - User profile image
- [ ] **Breadcrumb** - Navigation breadcrumb

#### Feature Components (Pre-built)
- ✅ **SearchBar** - Multi-field search (Location, Dates, Guests)
- ✅ **ListingCard** - Property card with image, price, rating
- ✅ **Header** - Top navigation with mobile menu
- ✅ **Footer** - Footer with links and social media

#### Feature Components (To Build)
- [ ] **ListingGallery** - Image carousel with lightbox
- [ ] **PropertyPreview3D** - 3D virtual tour viewer (Three.js/Spline)
- [ ] **ReviewCard** - Individual review display
- [ ] **ReviewSummary** - AI-generated highlights/concerns
- [ ] **BookingFlow** - Multi-step booking wizard
- [ ] **PaymentForm** - Stripe payment integration
- [ ] **HostProfile** - Host information and reviews
- [ ] **MessageThread** - Chat interface
- [ ] **MapSearch** - Interactive map with listings
- [ ] **PricingCalculator** - Dynamic price breakdown

---

## Design System

### Color Palette
```css
/* Primary */
--color-primary: #3B82F6       /* Blue 500 */
--color-primary-light: #60A5FA /* Blue 400 */
--color-primary-dark: #1D4ED8  /* Blue 700 */

/* Secondary */
--color-secondary: #9333EA     /* Purple 600 */
--color-secondary-light: #A855F7 /* Purple 500 */

/* Accent */
--color-accent: #EC4899       /* Pink 500 */

/* Neutral */
--color-white: #FFFFFF
--color-gray-50: #F9FAFB
--color-gray-100: #F3F4F6
--color-gray-200: #E5E7EB
--color-gray-500: #6B7280
--color-gray-700: #374151
--color-gray-900: #111827

/* Dark Mode */
--color-dark-bg: #0F172A      /* Slate 950 */
--color-dark-surface: #1E293B  /* Slate 900 */
--color-dark-text: #F1F5F9    /* Slate 100 */

/* Semantic */
--color-success: #10B981      /* Green 500 */
--color-warning: #F59E0B      /* Amber 500 */
--color-error: #EF4444        /* Red 500 */
--color-info: #06B6D4         /* Cyan 500 */
```

### Typography
```css
/* Font Family */
--font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif
--font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace

/* Font Sizes */
--text-xs: 0.75rem      (12px)
--text-sm: 0.875rem     (14px)
--text-base: 1rem       (16px)
--text-lg: 1.125rem     (18px)
--text-xl: 1.25rem      (20px)
--text-2xl: 1.5rem      (24px)
--text-3xl: 1.875rem    (30px)
--text-4xl: 2.25rem     (36px)
--text-5xl: 3rem        (48px)
--text-6xl: 3.75rem     (60px)
--text-7xl: 4.5rem      (72px)

/* Font Weights */
--font-light: 300
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

### Spacing Scale
```css
--space-0: 0
--space-1: 0.25rem    (4px)
--space-2: 0.5rem     (8px)
--space-3: 0.75rem    (12px)
--space-4: 1rem       (16px)
--space-6: 1.5rem     (24px)
--space-8: 2rem       (32px)
--space-12: 3rem      (48px)
--space-16: 4rem      (64px)
--space-20: 5rem      (80px)
--space-24: 6rem      (96px)
```

### Border Radius
```css
--radius-sm: 0.375rem    (6px)
--radius-base: 0.5rem    (8px)
--radius-md: 0.75rem     (12px)
--radius-lg: 1rem        (16px)
--radius-xl: 1.5rem      (24px)
--radius-2xl: 2rem       (32px)
--radius-full: 9999px
```

### Shadows
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

### Z-Index Scale
```css
--z-hide: -1
--z-base: 0
--z-dropdown: 10
--z-sticky: 20
--z-fixed: 30
--z-modal-backdrop: 40
--z-modal: 50
--z-popover: 60
--z-tooltip: 70
```

---

## Responsive Breakpoints

```css
/* Mobile First */
@media (min-width: 640px)   { /* sm */ }
@media (min-width: 768px)   { /* md */ }
@media (min-width: 1024px)  { /* lg */ }
@media (min-width: 1280px)  { /* xl */ }
@media (min-width: 1536px)  { /* 2xl */ }
```

---

## Animation Guidelines

### Micro-interactions
```css
/* Smooth transitions */
--transition-fast: 150ms ease-out
--transition-base: 300ms ease-out
--transition-slow: 500ms ease-out

/* Common animations */
--animate-fade-in: fade-in 300ms ease-out
--animate-scale-up: scale-up 300ms ease-out
--animate-slide-up: slide-up 300ms ease-out
--animate-bounce: bounce 2s infinite
```

### Motion Principles
1. **Fast & Snappy** - 150-300ms for micro-interactions
2. **Smooth** - Ease-out curves for natural movement
3. **Meaningful** - Animations that guide user attention
4. **Consistent** - Same animation duration/curve throughout

---

## Component Props Interface Examples

### Button
```typescript
<Button 
  variant="primary"      // primary | secondary | ghost | danger
  size="md"             // sm | md | lg
  disabled={false}
  isLoading={false}
  icon={<IconComponent />}
  onClick={handleClick}
>
  Click me
</Button>
```

### Card
```typescript
<Card hoverable={true} bordered={true}>
  <CardHeader>
    <h3>Card Title</h3>
  </CardHeader>
  <CardBody>
    {/* Content */}
  </CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Input
```typescript
<Input
  label="Email"
  type="email"
  placeholder="user@example.com"
  icon={<MailIcon />}
  error="Invalid email"
  helperText="Enter a valid email address"
  onChange={handleChange}
/>
```

### Rating
```typescript
<Rating
  value={4}
  onChange={handleRating}
  readOnly={false}
  size="md"
  showLabel={true}
/>
```

### Modal
```typescript
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirm Action"
  size="md"
  footer={<Button>Submit</Button>}
>
  {/* Modal content */}
</Modal>
```

---

## Implementation Status

- [x] Core UI components (Button, Card, Input, Badge, Rating, Modal, Skeleton)
- [x] Layout components (Header, Footer)
- [x] Feature components (SearchBar, ListingCard)
- [ ] Advanced components (3D preview, Payment form)
- [ ] Complete form suite (Login, Signup, Listing form)
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)
- [ ] Animation library
- [ ] Dark mode implementation
- [ ] Responsive testing
- [ ] Storybook documentation

