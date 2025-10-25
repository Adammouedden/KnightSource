# Content Paste Guide

This guide shows you exactly where to paste your UCF resource content.

## File Locations

All content files are in `/content/categories/`:

- `legal.json`
- `academics.json`
- `healthcare.json`
- `conferences.json`
- `recreation.json`

## How to Paste Your Content

### Step 1: Open the Category File

For example, to edit Healthcare resources:

```bash
Open: /content/categories/healthcare.json
```

### Step 2: Find the Subcategory

Each file has a `subcategories` array. Find the one you want to edit:

```json
{
  "name": "Primary Care Services",
  "description_md": "**PASTE: Subcategory specific description**",
  ...
}
```

### Step 3: Replace PASTE Markers

Replace any text starting with `PASTE:` with your actual content:

**Before:**
```json
"description_md": "**PASTE: Subcategory specific description**"
```

**After:**
```json
"description_md": "UCF Student Health Services provides primary care for common illnesses and injuries. Services include physical exams, sick visits, vaccinations, and preventive care."
```

### Step 4: Use Markdown Formatting

All fields ending in `_md` support Markdown:

```json
"financial_value_md": "**Save $75-$150 per visit** compared to urgent care or private clinics.\n\nAnnual savings: **$300-$600** for regular visits."
```

This renders as:

> **Save $75-$150 per visit** compared to urgent care or private clinics.
>
> Annual savings: **$300-$600** for regular visits.

### Step 5: Copy to Public Directory

After editing, run this command to make your changes visible:

```bash
cp -r content/* public/content/
```

Or manually copy files from `/content/` to `/public/content/`.

## Field Reference

### Required Fields

- `name`: Subcategory name (plain text)
- `title`: Category title (plain text, at top level)
- `description`: Category description (plain text, at top level)

### Optional Fields (all support Markdown)

- `description_md`: Detailed description of the service/resource
- `phone`: Contact phone number (auto-converts to clickable link)
- `financial_value_md`: How much money students save
- `exceptions_md`: Who can't use this or when it's not available
- `steps_md`: How to access the resource (numbered steps work great!)

### Leave Fields Empty

If you don't have content for a field, you can:

1. Leave the PASTE marker (it will show as italic placeholder)
2. Set it to empty string: `""`
3. Remove the field entirely

All three approaches are safe - empty fields simply won't display.

## Examples

### Legal Services Example

```json
{
  "name": "Student Legal Services",
  "description_md": "Free legal consultation and representation for UCF students on a variety of civil matters.",
  "phone": "(407) 823-2538",
  "financial_value_md": "**Save $150-$300 per hour** in attorney fees.\n\nTypical savings: **$500-$1,500** per case.",
  "exceptions_md": "- Cannot help with criminal cases\n- Must be currently enrolled student\n- Cannot represent you against UCF",
  "steps_md": "1. Call (407) 823-2538 to schedule\n2. Bring your UCF ID\n3. Bring any relevant documents\n4. Appointments available Monday-Friday 8am-5pm"
}
```

### Healthcare Example

```json
{
  "name": "Mental Health Counseling",
  "description_md": "UCF Counseling and Psychological Services (CAPS) provides free mental health counseling to all enrolled students.",
  "phone": "(407) 823-2811",
  "financial_value_md": "**Free individual counseling** (typically $100-$200 per session elsewhere).\n\nGroup therapy and workshops also free.\n\n**Potential annual savings: $1,200-$2,400** for regular therapy.",
  "exceptions_md": "- Limited to 12 sessions per academic year\n- 24/7 crisis support available",
  "steps_md": "1. Call (407) 823-2811 during business hours\n2. Or visit [caps.sdes.ucf.edu](https://caps.sdes.ucf.edu) to schedule online\n3. First appointment is typically within 1-2 weeks\n4. After-hours crisis support: call same number"
}
```

### Conference Funding Example

```json
{
  "name": "Graduate Student Travel Grant",
  "description_md": "The Office of Research provides travel grants for graduate students presenting research at conferences.",
  "phone": "(407) 823-2901",
  "financial_value_md": "**Up to $500 per academic year** for conference travel.\n\nCovers registration, airfare, hotel, and ground transportation.",
  "exceptions_md": "- Must be presenting research (poster or talk)\n- Graduate students only\n- Apply at least 30 days before travel\n- One grant per academic year",
  "steps_md": "1. Get acceptance confirmation from conference\n2. Complete online application at [research.ucf.edu/travel-grant](https://research.ucf.edu/)\n3. Submit at least 30 days before travel\n4. Reimbursement processed after travel with receipts"
}
```

## Markdown Quick Reference

```markdown
**Bold text**
_Italic text_
[Link text](https://url.com)

# Large heading
## Medium heading

- Bullet point
- Another bullet

1. Numbered step
2. Next step
```

## Testing Your Content

After pasting and copying to public:

1. Run `npm run dev`
2. Visit the category page
3. Click to expand the accordion
4. Check formatting looks good
5. Click phone number to test click-to-call
6. View in dark mode to ensure readability

## Quick Tips

- **Bold important numbers**: `**$500**` for financial values
- **Use bullets for exceptions**: Start each line with `- `
- **Use numbers for steps**: Start each line with `1. `, `2. `, etc.
- **Phone format doesn't matter**: `(407) 823-2538` or `407-823-2538` both work
- **Links work**: `[Text](url)` renders as clickable link
- **Paragraphs**: Use `\n\n` for paragraph breaks

## Need Help?

All files have working examples with placeholder content. Copy the format and replace with your content!

The site is forgiving - if something doesn't look right, just edit the JSON and refresh the page.
