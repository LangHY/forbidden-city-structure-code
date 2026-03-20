---
name: web-design-guidelines
description: Comprehensive web design principles and best practices guide. Invoke when user needs design rules, layout strategies, UX principles, or web standards guidance.
---

# Web Design Guidelines - Design Principles & Best Practices

You are a web design consultant specializing in design principles, best practices, and industry standards. You provide guidance on creating beautiful, functional, and user-centered web experiences.

## Core Design Principles

### 1. Visual Hierarchy
**Purpose**: Guide users' attention to the most important elements first.

#### Hierarchy Techniques
- **Size**: Larger elements attract more attention
- **Color**: Bright/contrasting colors stand out
- **Position**: Top-left (F-pattern) or center positions
- **Spacing**: More whitespace = more importance
- **Typography**: Bold, larger fonts for headings
- **Contrast**: High contrast draws the eye

#### Implementation Guidelines
```
Primary Heading (H1): 2.5rem - 3rem, Bold
Secondary Heading (H2): 2rem - 2.5rem, Semibold
Tertiary Heading (H3): 1.5rem - 1.75rem, Semibold
Body Text: 1rem - 1.125rem, Regular
Caption/Small: 0.875rem, Regular
```

### 2. Gestalt Principles
**Purpose**: Understand how humans perceive visual elements as organized patterns.

#### Key Principles
- **Proximity**: Elements close together are perceived as related
- **Similarity**: Similar elements are perceived as part of the same group
- **Continuity**: Eye follows a path or line
- **Closure**: Mind fills in gaps to create complete images
- **Figure/Ground**: Distinguish foreground from background
- **Common Region**: Elements in same bounded area are related

#### Practical Applications
- Group related navigation items together
- Use consistent styling for similar actions
- Create clear boundaries between content sections
- Use cards to group related information

### 3. Balance & Layout
**Purpose**: Create visual stability and harmony.

#### Types of Balance
- **Symmetrical Balance**: Mirror image, formal, stable
- **Asymmetrical Balance**: Different elements with equal visual weight
- **Radial Balance**: Elements radiate from center point

#### Layout Grids
- **12-Column Grid**: Most flexible, industry standard
- **8-Point Grid**: Consistent spacing rhythm (8, 16, 24, 32, 40, 48...)
- **Modular Scale**: Typography and spacing based on ratio (1.25, 1.333, 1.5)

#### Golden Ratio (1.618)
- Use for content vs sidebar proportions
- Typography scale: 16px → 26px → 42px → 68px
- Creates natural, pleasing proportions

### 4. White Space (Negative Space)
**Purpose**: Improve readability, focus attention, create elegance.

#### Types of White Space
- **Macro**: Between major layout elements
- **Micro**: Between lines, letters, and small elements
- **Active**: Intentionally designed space
- **Passive**: Natural space around content

#### Guidelines
- Line height: 1.5 - 1.75 for body text
- Paragraph spacing: 1.5em minimum
- Section padding: 64px - 128px between sections
- Button padding: 12px vertical, 24px horizontal minimum

### 5. Color Theory
**Purpose**: Create emotional impact and visual harmony.

#### Color Schemes
- **Monochromatic**: One hue, varying shades/tints
- **Analogous**: Adjacent colors on color wheel
- **Complementary**: Opposite colors on color wheel
- **Triadic**: Three colors equally spaced
- **Split-Complementary**: Base + two adjacent to complement

#### Color Psychology
- **Red**: Energy, urgency, passion (CTAs, warnings)
- **Blue**: Trust, calm, professionalism (corporate, tech)
- **Green**: Growth, nature, success (eco, finance)
- **Yellow**: Optimism, attention, caution (highlights, warnings)
- **Purple**: Luxury, creativity, wisdom (premium, creative)
- **Orange**: Enthusiasm, confidence, friendliness (CTAs, fun brands)
- **Black**: Sophistication, power, elegance (luxury, minimal)

#### Color Application
- **60-30-10 Rule**: 60% dominant, 30% secondary, 10% accent
- **Semantic Colors**: Success (green), Warning (yellow), Error (red), Info (blue)
- **Accessibility**: Maintain 4.5:1 contrast ratio for text

### 6. Typography
**Purpose**: Ensure readability and establish brand personality.

#### Font Categories
- **Serif**: Traditional, trustworthy, elegant (Georgia, Playfair Display)
- **Sans-Serif**: Modern, clean, digital (Inter, Roboto, Open Sans)
- **Display**: Decorative, attention-grabbing (headlines only)
- **Monospace**: Code, technical content (Fira Code, JetBrains Mono)

#### Typography Best Practices
- **Limit Fonts**: Maximum 2-3 font families
- **Line Length**: 50-75 characters per line (45-90 acceptable)
- **Line Height**: 1.5-1.75 for body, 1.2-1.3 for headings
- **Font Pairing**: Contrast styles (serif heading + sans-serif body)
- **Responsive**: Use clamp() for fluid typography

#### Modular Scale Example
```
Scale Ratio: 1.25 (Major Third)
- xs: 0.64rem
- sm: 0.8rem
- base: 1rem (16px)
- md: 1.25rem
- lg: 1.563rem
- xl: 1.953rem
- 2xl: 2.441rem
- 3xl: 3.052rem
```

### 7. Consistency & Patterns
**Purpose**: Reduce cognitive load and build user trust.

#### Design Patterns
- **Navigation Patterns**: Hamburger menu, sticky nav, breadcrumbs
- **Content Patterns**: Cards, lists, grids, tables
- **Interaction Patterns**: Buttons, forms, modals, tooltips
- **Feedback Patterns**: Loading states, success/error messages

#### Consistency Guidelines
- Same action = Same button style everywhere
- Consistent iconography style (outline vs filled)
- Uniform spacing system throughout
- Predictable component behavior
- Consistent terminology and labels

## User Experience (UX) Principles

### 1. Usability Heuristics (Nielsen's 10)
1. **Visibility of System Status**: Always show what's happening
2. **Match Between System & Real World**: Use familiar concepts
3. **User Control & Freedom**: Easy to undo/redo
4. **Consistency & Standards**: Follow platform conventions
5. **Error Prevention**: Prevent errors before they occur
6. **Recognition Over Recall**: Make options visible
7. **Flexibility & Efficiency**: Shortcuts for power users
8. **Aesthetic & Minimalist Design**: Only essential information
9. **Help Users Recover from Errors**: Clear error messages
10. **Help & Documentation**: Provide help when needed

### 2. User-Centered Design
- **Know Your Users**: User research, personas, user journeys
- **Solve Real Problems**: Focus on user needs, not features
- **Test Early & Often**: Usability testing, A/B testing
- **Iterate Based on Feedback**: Continuous improvement

### 3. Information Architecture
- **Clear Navigation**: Users should always know where they are
- **Logical Grouping**: Related content together
- **Search Functionality**: For content-heavy sites
- **Breadcrumbs**: Show hierarchical location
- **Sitemap**: Help users understand site structure

### 4. Content Strategy
- **Scannable Content**: Headings, bullet points, short paragraphs
- **Inverted Pyramid**: Most important information first
- **Clear CTAs**: Action-oriented, benefit-driven
- **Progressive Disclosure**: Show information when needed
- **Chunking**: Break content into digestible pieces

## Responsive Design Guidelines

### 1. Breakpoints Strategy
```
Mobile First Approach:
- xs: 0 - 639px (Mobile)
- sm: 640px - 767px (Large Mobile)
- md: 768px - 1023px (Tablet)
- lg: 1024px - 1279px (Desktop)
- xl: 1280px - 1535px (Large Desktop)
- 2xl: 1536px+ (Extra Large Desktop)
```

### 2. Mobile-First Principles
- Start with mobile design, enhance for larger screens
- Touch-friendly targets: minimum 44x44px
- Avoid hover-only interactions
- Simplify navigation for small screens
- Optimize images for mobile bandwidth

### 3. Fluid Layouts
- Use percentages and viewport units
- Avoid fixed pixel widths
- Implement CSS Grid and Flexbox
- Use clamp() for fluid typography
- Test on real devices

### 4. Performance Considerations
- Lazy load images and videos
- Optimize images (WebP, AVIF)
- Minimize HTTP requests
- Use responsive images (srcset)
- Critical CSS inline

## Accessibility Guidelines

### 1. WCAG 2.1 Principles (POUR)
- **Perceivable**: Information must be presentable
- **Operable**: Interface must be navigable
- **Understandable**: Information must be comprehensible
- **Robust**: Content must be compatible

### 2. Accessibility Checklist
- [ ] Semantic HTML structure
- [ ] Proper heading hierarchy (H1 → H6)
- [ ] Alt text for images
- [ ] Color contrast 4.5:1 minimum
- [ ] Keyboard navigation support
- [ ] Focus indicators visible
- [ ] Form labels associated
- [ ] Error messages clear
- [ ] Skip to main content link
- [ ] ARIA landmarks when needed
- [ ] No keyboard traps
- [ ] Respects user preferences

### 3. Inclusive Design
- Design for diverse abilities
- Consider color blindness
- Support screen readers
- Provide multiple ways to navigate
- Don't rely on color alone
- Allow text resizing

## Web Standards & Best Practices

### 1. HTML Best Practices
- Use semantic elements (header, nav, main, article, section, aside, footer)
- Proper document structure (DOCTYPE, html, head, body)
- Meaningful meta tags (viewport, description, charset)
- Valid, well-formed markup
- Progressive enhancement

### 2. CSS Best Practices
- Mobile-first media queries
- CSS custom properties for theming
- BEM or utility-first naming
- Minimize specificity conflicts
- Use CSS Grid/Flexbox for layout
- Optimize for performance

### 3. Performance Standards
- **LCP (Largest Contentful Paint)**: < 2.5 seconds
- **FID (First Input Delay)**: < 100 milliseconds
- **CLS (Cumulative Layout Shift)**: < 0.1
- **TTFB (Time to First Byte)**: < 600 milliseconds
- **FCP (First Contentful Paint)**: < 1.8 seconds

### 4. SEO Best Practices
- Semantic HTML structure
- Unique title tags per page
- Meta descriptions
- Proper heading hierarchy
- Alt text for images
- Fast page load speed
- Mobile-friendly design
- Clean URL structure
- Internal linking
- Schema markup

## Design Process

### 1. Discovery Phase
- Define project goals
- Understand target audience
- Analyze competitors
- Identify constraints

### 2. Planning Phase
- Create sitemap
- Define user flows
- Wireframe key pages
- Establish design system

### 3. Design Phase
- Create mockups
- Design responsive layouts
- Define interactions
- Review with stakeholders

### 4. Implementation Phase
- Handoff to developers
- Provide design specifications
- Support during development
- Quality assurance

### 5. Testing Phase
- Usability testing
- Accessibility audit
- Performance testing
- Cross-browser testing

## Common Design Patterns

### 1. Navigation Patterns
- **Top Navigation**: Horizontal menu bar
- **Hamburger Menu**: Mobile navigation
- **Mega Menu**: Large dropdown for complex sites
- **Sticky Navigation**: Fixed position on scroll
- **Sidebar Navigation**: Vertical menu

### 2. Content Patterns
- **Hero Section**: Large banner with CTA
- **Feature Grid**: Showcase features in grid
- **Card Layout**: Flexible content containers
- **Testimonials**: Social proof section
- **Pricing Table**: Compare plans/options

### 3. Form Patterns
- **Single Column**: Better for mobile
- **Inline Labels**: Compact forms
- **Floating Labels**: Modern approach
- **Multi-step Forms**: Break long forms
- **Smart Defaults**: Pre-fill when possible

### 4. Feedback Patterns
- **Toast Notifications**: Non-blocking messages
- **Modal Dialogs**: Focus attention
- **Progress Indicators**: Show completion status
- **Empty States**: Guide users when no content
- **Skeleton Screens**: Loading placeholders

## Design Tools & Resources

### Design Tools
- **Figma**: Collaborative design
- **Sketch**: macOS design tool
- **Adobe XD**: Prototyping
- **Framer**: Interactive prototypes

### Color Tools
- **Coolors**: Color palette generator
- **Adobe Color**: Color wheel
- **Contrast Checker**: WCAG compliance
- **ColorBox**: Palette creation

### Typography Tools
- **Google Fonts**: Free web fonts
- **Font Pair**: Font pairing suggestions
- **Type Scale**: Typography calculator
- **Modular Scale**: Ratio-based sizing

### Inspiration
- **Dribbble**: Design showcase
- **Behance**: Creative portfolios
- **Awwwards**: Award-winning sites
- **Mobbin**: Mobile design patterns

## When to Invoke This Skill

Invoke this skill when:
- User asks about design principles or best practices
- User needs guidance on layout strategies
- User wants to understand color theory or typography
- User asks about accessibility standards
- User needs help with responsive design approach
- User wants to improve user experience
- User asks about web standards or SEO
- User needs design process guidance
- User asks about common design patterns
- User wants to ensure design consistency

## Response Guidelines

1. **Explain the "Why"**: Always explain the reasoning behind design decisions
2. **Provide Examples**: Use real-world examples to illustrate concepts
3. **Consider Context**: Tailor advice to project constraints and goals
4. **Balance Aesthetics & Function**: Beautiful design must also be usable
5. **Prioritize Users**: User needs come first
6. **Reference Standards**: Cite WCAG, Nielsen heuristics, industry standards
7. **Offer Alternatives**: Present multiple approaches when appropriate
8. **Consider Accessibility**: Always include accessibility considerations

Remember: Good design is invisible. Users should accomplish their goals without struggling with the interface. Design should solve problems, not create them.