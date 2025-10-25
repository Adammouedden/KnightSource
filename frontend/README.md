# KnightSource - UCF Student Benefits Explorer

A modern, responsive website helping UCF students discover campus resources and maximize their benefits.

## Features

- **Landing Page** with animated stats, hero section, and savings estimator
- **Category Pages** for Legal, Academics, Healthcare, Conferences, and Recreation
- **Accordion UI** for easy content navigation with Markdown support
- **Global Chatbot** (appears on all pages except landing) with mocked AI responses
- **Dark Mode** support with system-aware toggle
- **Fully Responsive** design optimized for mobile, tablet, and desktop
- **Easy Content Management** via JSON files with clear paste markers

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to see the site.

## Project Structure

```
/app
  /page.tsx                  # Landing page
  /home/page.tsx             # Categories grid
  /legal/page.tsx            # Legal resources
  /academics/page.tsx        # Academic resources
  /healthcare/page.tsx       # Healthcare resources
  /conferences/page.tsx      # Conference funding
  /recreation/page.tsx       # Recreation facilities

/components
  /CategoryCard.tsx          # Category cards with icons
  /StatCard.tsx             # Animated stat counters
  /AccordionSection.tsx     # Collapsible content sections
  /SavingsEstimator.tsx     # Interactive savings calculator
  /Chatbot.tsx              # Floating chat widget
  /ChatProvider.tsx         # Chat state management
  /Header.tsx               # Navigation header
  /Footer.tsx               # Site footer

/content
  /stats.json               # Landing page statistics
  /categories/*.json        # Category content files

/public/content             # Public copy for client access
```

## How to Add/Edit Content

### 1. Edit Statistics (Landing Page)

Edit `/content/stats.json`:

```json
{
  "totalResources": 47,
  "avgSavingsPerStudent": 2847,
  "topCategories": 5,
  "timeToFirstWin": "5 minutes"
}
```

### 2. Edit Category Content

Each category has its own JSON file in `/content/categories/`. Here's the format:

```json
{
  "title": "Healthcare",
  "description": "Take advantage of UCF health services and save.",
  "subcategories": [
    {
      "name": "Primary Care Services",
      "description_md": "Your detailed description here with **bold** and _italic_ support",
      "phone": "(407) 823-2701",
      "financial_value_md": "Save $75-$150 per visit compared to urgent care",
      "exceptions_md": "- Not available during summer\n- Requires student ID",
      "steps_md": "1. Call to schedule\n2. Bring your student ID\n3. Check in 10 minutes early"
    }
  ]
}
```

All `*_md` fields support **Markdown formatting**:
- Bold: `**text**`
- Italic: `_text_`
- Lists: Start lines with `- ` or `1. `
- Headings: `# Heading`

### 3. Content Guidelines

- **PASTE markers** (`PASTE: ...`) are styled as italic placeholders
- Replace them with your actual content
- Empty fields won't break the site - they simply won't display
- Phone numbers become click-to-call links automatically
- Financial values get special highlighting

### 4. After Editing Content

After updating any JSON file in `/content/`, run:

```bash
cp -r content/* public/content/
```

This copies your content to the public directory for client-side access.

## Components Overview

### Landing Page Features

- **Hero Section**: Big headline, CTA buttons, SVG artwork
- **Stats Visualization**: Animated counters using recharts
- **Savings Estimator**: Interactive calculator with class year, housing, and insurance inputs
- **How It Works**: 3-step process explanation
- **Trusted Partners**: Logo placeholder section

### Category Pages

- Clean title and description
- Accordion sections for each subcategory
- Each accordion shows:
  - Description (Markdown)
  - Phone number (click-to-call)
  - Financial value (highlighted)
  - Exceptions (bulleted list)
  - Steps (numbered list)

### Chatbot

- Appears on all pages EXCEPT the landing page
- Floating button in bottom-right corner
- Mocked responses based on keywords
- Conversation persists in localStorage
- Easy to wire to a real LLM later (see TODOs in `ChatProvider.tsx`)

## Customization

### Colors

The site uses a gold/amber accent inspired by UCF. To change:

Edit `tailwind.config.ts` or search/replace `amber-600` throughout the codebase.

### Fonts

Currently using system fonts (Inter). To change:

Edit `app/layout.tsx` and import your preferred Google Font.

### Chatbot AI Integration

To connect a real LLM:

1. Open `/components/ChatProvider.tsx`
2. Find the `mockLLMResponse` function
3. Replace it with your API call:

```typescript
async function realLLMResponse(userMessage: string): Promise<string> {
  const response = await fetch('YOUR_API_ENDPOINT', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMessage })
  });
  const data = await response.json();
  return data.response;
}
```

## Development Tips

### Dev Mode Content Helper

When running in development mode (`npm run dev`), each category page shows a collapsible section at the bottom revealing the exact file path to edit.

### Hot Reload

Content changes require a page refresh since JSON is loaded at runtime. The dev server will hot-reload component changes automatically.

### Build

```bash
npm run build
```

Builds a static export in `/out` that can be deployed anywhere.

## Tech Stack

- **Next.js 13** (App Router, Static Export)
- **TypeScript**
- **Tailwind CSS** with custom design system
- **shadcn/ui** components
- **Framer Motion** for animations
- **Recharts** for data visualization
- **React Markdown** for content rendering
- **Lucide React** for icons

## Accessibility

- Semantic HTML throughout
- Keyboard navigation support
- ARIA labels on interactive elements
- Focus states on all clickable items
- Screen reader friendly

## SEO

- Metadata configured per route
- OpenGraph tags for social sharing
- Descriptive titles and descriptions

## Browser Support

Modern browsers (Chrome, Firefox, Safari, Edge) - last 2 versions.

## License

Built for UCF students.
