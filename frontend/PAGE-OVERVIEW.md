# KnightSource - Page Overview

Visual guide to what each page looks like and does.

## Landing Page (/)

**URL:** `http://localhost:3000/`

**What You See:**
```
┌─────────────────────────────────────┐
│  [KnightSource Logo]  [Nav] [🌙]   │ ← Header
├─────────────────────────────────────┤
│                                     │
│     Unlock Every UCF Benefit        │ ← Hero
│   See all the resources available   │
│                                     │
│  [Explore Resources] [Calculate]    │
│                                     │
│  [SVG Illustration with circles]    │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      The Numbers Speak              │ ← Stats
│                                     │
│  [47+]    [$2,847]   [5]    [5min] │
│ Resources  Savings  Categories Time │
│                                     │
│     ┌─ Savings Estimator ─┐        │
│     │ Class Year: ○ ○ ○ ○ │        │
│     │ Housing: ○ On ○ Off  │        │
│     │ Insurance: ○ ○       │        │
│     │ [Calculate Savings]  │        │
│     │                      │        │
│     │ You could save       │        │
│     │    $2,400/year       │        │
│     └──────────────────────┘        │
│                                     │
├─────────────────────────────────────┤
│                                     │
│       How It Works                  │ ← Steps
│                                     │
│   [1]          [2]          [3]     │
│  Browse      Learn        Start     │
│ Resources   Details      Saving     │
│                                     │
├─────────────────────────────────────┤
│                                     │
│    Trusted On Campus                │ ← Social Proof
│                                     │
│   [UCF] [Student Resources] [...]   │
│                                     │
│  Ready to unlock your benefits?     │
│       [Get Started →]               │
│                                     │
├─────────────────────────────────────┤
│  [Footer Links]                     │
└─────────────────────────────────────┘

NO CHATBOT on this page (per requirements)
```

## Home Page (/home)

**URL:** `http://localhost:3000/home`

**What You See:**
```
┌─────────────────────────────────────┐
│  [KnightSource]  [Home] [▼] [🌙]   │
├─────────────────────────────────────┤
│                                     │
│      Explore UCF Resources          │
│                                     │
│  Browse five categories of benefits │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐      │
│  │ ⚖️   │  │ 🎓   │  │ ❤️   │      │
│  │Legal │  │Acade-│  │Health│      │
│  │      │  │mics  │  │care  │      │
│  └──────┘  └──────┘  └──────┘      │
│                                     │
│  ┌──────┐  ┌──────┐                │
│  │ ✈️   │  │ 💪   │                │
│  │Confe-│  │Recre-│                │
│  │rences│  │ation │                │
│  └──────┘  └──────┘                │
│                                     │
├─────────────────────────────────────┤
│  [Footer]                           │
└─────────────────────────────────────┘
                           [💬] ← Chatbot appears
```

## Category Page Example (/healthcare)

**URL:** `http://localhost:3000/healthcare`

**What You See:**
```
┌─────────────────────────────────────┐
│  [KnightSource]  [Home] [▼] [🌙]   │
├─────────────────────────────────────┤
│                                     │
│         Healthcare                  │ ← Title
│  Take advantage of UCF health       │
│  services and save                  │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  ▸ Records (Health Info Mgmt)  ⌄   │ ← Accordion
│                                     │
│  ▾ Primary Care Services       ⌃   │ ← Expanded
│  ┌─────────────────────────────┐   │
│  │ Description                 │   │
│  │ Your detailed description   │   │
│  │ here with markdown support  │   │
│  │                             │   │
│  │ Contact                     │   │
│  │ 📞 (407) 823-2701          │   │
│  │                             │   │
│  │ Financial Value             │   │
│  │ ┌─────────────────────────┐ │   │
│  │ │ Save $75-$150 per visit │ │   │
│  │ │ compared to urgent care │ │   │
│  │ └─────────────────────────┘ │   │
│  │                             │   │
│  │ Exceptions                  │   │
│  │ • Not available in summer   │   │
│  │ • Requires student ID       │   │
│  │                             │   │
│  │ How to Access               │   │
│  │ 1. Call to schedule         │   │
│  │ 2. Bring your student ID    │   │
│  │ 3. Check in early           │   │
│  └─────────────────────────────┘   │
│                                     │
│  ▸ Mental Health Counseling    ⌄   │
│                                     │
│  ▸ Pharmacy Services           ⌄   │
│                                     │
│  ▸ Health Insurance            ⌄   │
│                                     │
├─────────────────────────────────────┤
│  [Footer]                           │
└─────────────────────────────────────┘
                           [💬] ← Chatbot appears
```

## Chatbot (All Pages Except Landing)

**Appearance:**
```
Bottom Right Corner:
┌──────────────────────────────┐
│ [💬]  ← Floating button      │
└──────────────────────────────┘

When Clicked:
┌─────────────────────────────────┐
│ KnightSource Assistant     [×]  │
├─────────────────────────────────┤
│ Ask me anything about UCF       │
│ resources and benefits!         │
├─────────────────────────────────┤
│                                 │
│     [User message bubble]       │
│                        10:30 AM │
│                                 │
│ [Assistant message bubble]      │
│ 10:30 AM                        │
│                                 │
│                                 │
├─────────────────────────────────┤
│ [Type message...] [Send →]     │
└─────────────────────────────────┘
```

## Mobile View (All Pages)

**Responsive Behavior:**
```
┌─────────────────┐
│[KS] [☰] [🌙]   │ ← Hamburger menu
├─────────────────┤
│                 │
│  Content        │
│  stacks         │
│  vertically     │
│                 │
│  1 column       │
│  layout         │
│                 │
│  Cards          │
│  full width     │
│                 │
├─────────────────┤
│   [Footer]      │
└─────────────────┘
        [💬]
```

## Dark Mode (Toggle in Header)

**Changes:**
- Background: White → Dark gray
- Text: Black → White
- Cards: White → Dark cards
- Gold accent stays consistent
- All content remains readable

## Interactive Elements

### Hover Effects
- **Category Cards**: Lift up, shadow intensifies
- **Buttons**: Darken background
- **Links**: Change to gold color
- **Accordion Items**: Title changes to gold

### Click-to-Call
- Phone numbers are tappable/clickable
- Opens phone app on mobile
- Copies number on desktop

### Smooth Scrolling
- Landing page CTAs scroll to sections
- Smooth anchor navigation
- Hash URLs supported

## Content Display Logic

### When Field Has Content
Shows normally with formatting

### When Field Has "PASTE:"
Shows in italic, muted color (placeholder style)

### When Field is Empty
Doesn't display at all (clean, no broken sections)

## Dev Mode Special Features

**Only visible when running `npm run dev`:**

At bottom of each category page:
```
┌──────────────────────────────────┐
│ ▸ Dev: Content File Location     │
│   Edit: /content/categories/     │
│         healthcare.json          │
└──────────────────────────────────┘
```

Click to expand and see exact file to edit.

## Navigation Flows

### From Landing → Categories
1. Click "Explore Resources"
2. Lands on `/home`
3. See 5 category cards
4. Click any card → Category page

### From Category → Category
1. Click header "Categories" dropdown
2. Select different category
3. Jump directly there

### Using Chatbot
1. Click 💬 button (except on landing)
2. Dialog opens
3. Type question
4. Get contextual response
5. Conversation saves in localStorage

## Animations Timeline

### Page Load
- 0ms: Header appears
- 100ms: Hero fades in from bottom
- 300ms: Illustration scales in
- 500ms: Chatbot button appears (if not landing)

### Stats Section (Landing)
- Counters animate from 0 → target
- 2 second duration with easing
- Triggers when scrolled into view

### Category Cards (Home)
- Each card fades in sequentially
- 100ms delay between each
- Entrance from bottom

### Accordion (Category Pages)
- Smooth expand/collapse
- Chevron rotates 180°
- Content fades in
- 200ms transition

## Responsive Breakpoints

- **Mobile**: < 768px (1 column)
- **Tablet**: 768px - 1024px (2 columns)
- **Desktop**: > 1024px (3 columns for home, full width for categories)

## Color System

- **Primary**: Gold (#D97706) - amber-600
- **Success**: Green - For positive values
- **Background**: White / Dark gray
- **Text**: Black / White (high contrast)
- **Muted**: Gray 500 / 400

---

**All pages are live and working!** Start `npm run dev` to explore.
