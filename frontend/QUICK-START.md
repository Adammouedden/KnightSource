# KnightSource - Quick Start Guide

## What You Have

A complete, production-ready website with:

- Landing page with stats and savings calculator
- 5 category pages (Legal, Academics, Healthcare, Conferences, Recreation)
- Global chatbot (except landing page)
- Dark mode support
- Fully responsive design
- Easy content management via JSON files

## Get Started in 3 Steps

### 1. Run the Site

```bash
npm run dev
```

Visit `http://localhost:3000`

### 2. Add Your Content

All content is in `/content/categories/*.json` files:

- `legal.json`
- `academics.json`
- `healthcare.json`
- `conferences.json`
- `recreation.json`

Open any file and replace the `PASTE:` markers with your actual content.

**Example:**

```json
{
  "name": "Student Legal Services",
  "description_md": "Your description here",
  "phone": "(407) 823-2538",
  "financial_value_md": "**Save $150-$300 per hour** in attorney fees",
  "exceptions_md": "- Cannot help with criminal cases\n- Must be enrolled",
  "steps_md": "1. Call to schedule\n2. Bring your UCF ID"
}
```

### 3. Sync Your Changes

After editing any content file, run:

```bash
npm run sync-content
```

Or use the script:

```bash
./sync-content.sh
```

Refresh your browser to see the changes!

## Project Structure

```
/content/               ← Edit your content here
  stats.json           ← Landing page numbers
  /categories/         ← All resource content
    legal.json
    academics.json
    healthcare.json
    conferences.json
    recreation.json

/app/                  ← Pages (you probably won't edit these)
/components/           ← UI components (you probably won't edit these)
/public/content/       ← Auto-synced from /content/
```

## Key Features

### Landing Page (/)
- Hero with animated entrance
- Stats section with counters
- Interactive savings estimator
- How it works section
- NO chatbot (by design)

### Home Page (/home)
- Grid of 5 category cards
- Each links to its category page
- Chatbot appears here

### Category Pages
- Clean header with description
- Accordion for each subcategory
- Shows: description, phone, value, exceptions, steps
- All fields support Markdown
- Chatbot appears here

### Chatbot
- Floating button bottom-right
- Opens chat dialog
- Mocked AI responses (easy to wire real LLM)
- Conversation saved in localStorage
- Appears everywhere except landing page

## Editing Tips

### Markdown Support

All fields ending in `_md` support Markdown:

```markdown
**Bold text**
_Italic text_
[Link](https://url.com)

- Bullet point
- Another bullet

1. First step
2. Second step
```

### Financial Values

Emphasize numbers with bold:

```json
"financial_value_md": "**Save $500 per year** on gym memberships"
```

### Phone Numbers

Any format works, auto-converts to click-to-call:

```json
"phone": "(407) 823-2538"
"phone": "407-823-2538"
"phone": "407.823.2538"
```

## Workflow

1. Edit content in `/content/categories/*.json`
2. Run `npm run sync-content`
3. Refresh browser
4. Repeat!

## Development Commands

```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run sync-content  # Sync content to public folder
./sync-content.sh     # Alternative sync method
```

## What's Next?

### Customize Design
- Colors: Search/replace `amber-600` with your color
- Fonts: Edit `app/layout.tsx`

### Connect Real Chatbot
- Open `/components/ChatProvider.tsx`
- Replace `mockLLMResponse` with your API

### Add More Categories
1. Create new JSON in `/content/categories/`
2. Create new page in `/app/[category-name]/page.tsx` (copy existing)
3. Add to category list in `/app/home/page.tsx`
4. Add to header navigation in `/components/Header.tsx`

### Deploy
```bash
npm run build
```
Upload the `/out` folder to any static host!

## Need Help?

- **Content format**: See `CONTENT-GUIDE.md`
- **Full docs**: See `README.md`
- **Examples**: Look at existing JSON files

## Development Mode Features

When running `npm run dev`, category pages show a collapsible section at the bottom revealing which JSON file to edit. This disappears in production builds.

## Quick Troubleshooting

**Changes not showing?**
- Did you run `npm run sync-content`?
- Did you refresh the browser?

**JSON error?**
- Check for missing commas
- Check for unmatched quotes
- Validate JSON at jsonlint.com

**Build failing?**
- Run `npm run typecheck` to see errors
- Make sure all JSON files are valid

---

You're all set! Start adding your UCF resource content and make it beautiful!
