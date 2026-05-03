# 🕵️ QA Testing Report — Internship Portfolio Tracker Frontend
> Tested: April 5, 2026 | App: http://localhost:5173 | Stack: React + Vite + TailwindCSS v4 + Recharts

---

## 📋 Table of Contents
1. [Global / Shell](#1-global--shell)
2. [Dashboard](#2-dashboard)
3. [Internships](#3-internships)
4. [Skills](#4-skills)
5. [Certifications](#5-certifications)
6. [Evidence Vault](#6-evidence-vault)
7. [Analytics](#7-analytics)
8. [Export](#8-export)
9. [Dark Mode Bug Index](#9-dark-mode-bug-index)
10. [Non-Functional Button Index](#10-non-functional-button-index)
11. [Prioritised Fix List](#11-prioritised-fix-list)

---

## 1. Global / Shell

### Structure
- **Sidebar** (left, fixed width 256px): Logo + app name "SkillTrack / Career OS", nav links × 7, Pro Tip card at bottom.
- **Header** (top, sticky): Page title "Portfolio Tracker", subtitle, Quick actions ⌘K button, Moon/Sun toggle.
- **Main area** (scrollable): Page content rendered here.

### Elements Tested

| Element | Intended Behaviour | Actual Result | Status |
|---|---|---|---|
| Sidebar nav links (×7) | Navigate to the correct page | All 7 links navigate correctly | ✅ Works |
| Moon icon (dark mode toggle) | Switch to dark mode, icon becomes Sun | Dark mode enables instantly | ✅ Works |
| Sun icon (light mode toggle) | Switch to light mode, icon becomes Moon | Light mode restores instantly | ✅ Works |
| Dark mode persistence | Should persist across page refresh | Resets to light mode on refresh | ❌ Bug |
| "Quick actions ⌘K" button | Opens command palette overlay | Opens correctly | ✅ Works |
| Command palette search | Filters commands as user types | Filters correctly (tested with "dashboard") | ✅ Works |
| Command palette Escape | Closes the palette | Closes correctly | ✅ Works |
| Sidebar active state | Highlights current page in sidebar | Highlights correctly | ✅ Works |
| Header title | Should reflect current page name | Always says "Portfolio Tracker" — never updates | ❌ Bug |
| "Pro Tip" card (sidebar bottom) | Could rotate tips or be contextual | Hardcoded static string, never changes | ⚠️ Minor |
| Sidebar scroll-away | Sidebar should stay fixed while content scrolls | Sidebar disappears when user scrolls down on long pages | ❌ Bug |

### Dark Mode — Global Shell
- ✅ Sidebar: Background and text fully readable in dark mode
- ✅ Header: Background and text readable
- ✅ Active nav item: White highlight on dark background — readable
- ⚠️ Quick actions button: Readable but border barely visible in dark mode

---

## 2. Dashboard

### What It Contains
- 4 KPI stat cards: Active Internships (2), Skills Tracked (24), Certifications (8), Evidence Items (47)
- Recent Activity section: 4 activity cards in a row
- Skill Health Score: Area chart (overtime score, currently 92) with "?" tooltip
- Skill Balance: Radar chart (Current vs Target across 6 skill dimensions) with ProgressRing showing 76%
- Alerts panel: 3 alert items (warning/error/info)
- Upcoming Deadlines: 4 items with priority dots and type badges

### Elements Tested

| Element | Intended Behaviour | Actual Result | Status |
|---|---|---|---|
| KPI cards (×4) | Show real data from backend | Hardcoded static numbers | ⚠️ Mock data |
| Trend arrows on KPI cards | Green ↑ for up, red ↓ for down | All green (all hardcoded as "up") | ✅ Works (UI) |
| Recent Activity cards (×4) | Show live recent events | Static hardcoded events | ⚠️ Mock data |
| "?" tooltip on Skill Health Score | Shows explanation text on hover | Tooltip not rendering visibly (may be z-index/overflow issue) | ❌ Bug |
| Skill Health Score area chart | Hoverable data points with monthly scores | Chart line **invisible in dark mode** | ❌ Dark Mode Bug |
| Recharts tooltip on area chart | Pops up with value on hover | Tooltip works correctly (shows "Sep: 72") | ✅ Works |
| Skill Balance radar chart | Shows Current vs Target per skill category | Radar fills **invisible in dark mode** | ❌ Dark Mode Bug |
| ProgressRing (76%) | Circular progress ring beside radar | Barely visible in dark | ⚠️ Dark Mode Bug |
| Alert items (×3) | Colored box per severity | Alert boxes **very faint/dark in dark mode** — almost invisible | ❌ Dark Mode Bug |
| Upcoming Deadlines (×4) | List items with priority dot + type badge | Readable in dark mode | ✅ Works |
| Deadline priority dots | Red=high, orange=medium, blue=low | Correct colours visible | ✅ Works |
| Deadline type badges | Small pill labels | Near-invisible in dark (bg-accent too dark) | ⚠️ Dark Mode Bug |

---

## 3. Internships

### What It Contains
- Page title + "+ Add Internship" button (top right)
- "Skills Growth from Internships" line chart (Jun–Jan skill count)
- 2 internship cards: Meta (Active), Stripe (Completed)
  - Company logo icon, role, location, period, status badge, description, skill tags
  - Key Projects section (3 tiles with checkmark icons)
  - Skill Impact Analysis: Horizontal bar chart (before/after per skill)
  - Growth Metrics: List showing % growth per skill

### Elements Tested

| Element | Intended Behaviour | Actual Result | Status |
|---|---|---|---|
| "+ Add Internship" button | Should open a form/modal | Nothing happens — no modal | ❌ Dead button |
| ExternalLink icon (per card) | Open company or internship details | Nothing happens | ❌ Dead button |
| Skills Growth line chart | Shows skill count over time | **Invisible line in dark mode** — dots visible, line not | ❌ Dark Mode Bug |
| Skill Impact bar chart (horizontal) | Shows before (grey) and after (primary) bars | **Both bars black on dark background** — invisible | ❌ Dark Mode Bug |
| "Active" status badge | Green badge on Meta card | Renders correctly in both modes | ✅ Works |
| "Completed" status badge | Grey badge on Stripe card | Renders correctly | ✅ Works |
| Skill tags on cards | Small rounded pill labels | Readable in dark mode | ✅ Works |
| Key Projects gradient bg | Subtle gradient section | Barely visible gradient in dark | ⚠️ Dark Mode Bug |
| Growth Metrics list | % growth per skill | Green percentage text visible in dark | ✅ Works |

---

## 4. Skills

### What It Contains
**Overview (Level 1):**
- Page title + "+ Add Skill" button
- Category cards grid (7 cards): Languages, Frontend, Backend, Database, Cloud, DevOps, Tools
  - Each: avg level %, skill count, growing/decaying count, colour gradient
- Overall Stats row: Total Skills, Average Level, Growing Skills, Needs Attention

**Drill-down (Level 2 — click a category card):**
- Back arrow (←) to return to overview
- Category title + skill count
- Left: Skill list (progress bar, level%, evidence/cert/internship counts)
- Right top: Growth area chart (Aug–Feb)
- Right bottom: Evidence Mapping list + "Link New Evidence" dashed button

### Elements Tested

| Element | Intended Behaviour | Actual Result | Status |
|---|---|---|---|
| "+ Add Skill" button | Open a form/modal | Nothing happens | ❌ Dead button |
| Category cards (×7) | Click → navigate to drill-down | All cards navigate correctly | ✅ Works |
| Category card hover | Scale + shadow animation | Works in both modes | ✅ Works |
| Coloured category cards in dark | Each category has unique colour gradient | Blues, purples, greens ARE visible in dark mode — good! | ✅ Works |
| Back arrow (←) | Returns to category overview | Works correctly | ✅ Works |
| Skill list items (left panel) | Click → select skill, update right panel | Selection and right panel update works | ✅ Works |
| Selected skill highlight (primary) | White card when selected in dark | Readable in dark | ✅ Works |
| Progress bar fill (skill level) | Shows level as filled bar | **Fill nearly invisible in dark** — `bg-current` on dark backgrounds | ❌ Dark Mode Bug |
| Skill growth area chart | Aug–Feb level chart | **Area fill and line invisible in dark mode** | ❌ Dark Mode Bug |
| Decaying skill (Python) | Red TrendingDown icon + orange decay alert box | Alert box visible but very faint orange in dark | ⚠️ Dark Mode Bug |
| Evidence Mapping list | Linked items with type icons | Renders correctly in both modes | ✅ Works |
| "Link New Evidence" dashed button | Open evidence linking modal | Nothing happens | ❌ Dead button |
| Stats row (overview bottom) | Aggregated numbers | Correct in both modes | ✅ Works |

---

## 5. Certifications

### What It Contains
- Page title + "+ Add Certification" button
- 4 KPI cards: Active (6), Expiring Soon (1), Expired (1), Issuers (8)
- 3 analytics charts:
  - Status Distribution (Donut/Pie chart — green/orange/red)
  - By Difficulty (Bar chart — Beginner/Intermediate/Advanced)
  - Acquisition Timeline (Line chart — certs over time)
- 8 certification cards (2-col grid)
  - Each: Gradient icon, name, issuer, status badge, issue/expiry dates, skill tags, credential ID, Verify button

### Elements Tested

| Element | Intended Behaviour | Actual Result | Status |
|---|---|---|---|
| "+ Add Certification" button | Open form/modal | Nothing happens | ❌ Dead button |
| KPI cards (×4) | Derived from cert data | Correctly derived from static array | ✅ Works (static) |
| Status Distribution donut | Green/orange/red segments | **All segments black in dark mode** — completely invisible | ❌ Dark Mode Bug |
| Legend colour dots below pie | Coloured dots + labels | Dots render black in dark | ❌ Dark Mode Bug |
| By Difficulty bar chart | 3 coloured bars | **Bars invisible in dark** (black on black) | ❌ Dark Mode Bug |
| Acquisition Timeline line | Dots + connecting line | Line invisible, dots barely showing | ❌ Dark Mode Bug |
| Status badges (Active/Expiring/Expired) | Colour-coded pills per card | Correct in both modes | ✅ Works |
| Skill tags on cert cards | Small accent pills | Readable in both modes | ✅ Works |
| Credential ID text | Monospaced ID string | Readable in both modes | ✅ Works |
| "Verify" button | Open cert.verificationUrl in new tab | Nothing happens | ❌ Dead button |

---

## 6. Evidence Vault

### What It Contains
- Page title + "+ Upload Evidence" button
- 5 stat cards: Total (10), Projects (3), Documents (2), Certifications (1), Media (3)
- Search bar (text input with Search icon)
- Filter tabs: All / Projects / Documents / Certs / Media
- "Featured Evidence" section: 3 gradient cards with orange star
- "All Evidence" section: 2-col grid of all evidence items
  - Each: Type icon, title, description, format badge, date, linked-skill count, tag pills, optional ExternalLink

### Elements Tested

| Element | Intended Behaviour | Actual Result | Status |
|---|---|---|---|
| "+ Upload Evidence" button | Open upload modal/file picker | Nothing happens | ❌ Dead button |
| Search bar | Filter evidence by title or tag | **Works correctly** — "React" filters matching items | ✅ Works |
| "Projects" filter tab | Show only projects | **Works correctly** | ✅ Works |
| "Documents" filter tab | Show only documents | **Works correctly** | ✅ Works |
| "Certs" filter tab | Show only certifications | **Works correctly** | ✅ Works |
| "Media" filter tab | Show only media | **Works correctly** | ✅ Works |
| "All" filter tab | Reset to show all | **Works correctly** | ✅ Works |
| Search + filter combined | AND the two conditions | Works correctly | ✅ Works |
| Featured cards (×3) | Gradient background with star | Gradient faint but visible in dark | ✅ Works |
| Star icon (featured indicator) | Mark/unmark as featured | Visual only — no toggle interaction | ⚠️ No interaction |
| ExternalLink button on cards | Open item.url in new tab | Nothing happens | ❌ Dead button |
| "achievement" type filter | Has achievement-type items in data | **No filter tab for "achievement"** | ❌ Missing feature |
| Impact badge (high/medium) | Colour-coded border pill | Readable in dark | ✅ Works |
| Evidence tag pills | Small grey pills | Readable in dark | ✅ Works |

---

## 7. Analytics

### What It Contains
- Page title + subtitle
- Key Insights banner: 3 colour-coded insight cards (success/info/warning)
- 4 KPI metric cards: Growth Velocity, Avg Skill Health, Active Streaks, Evidence/Skill ratio
- Overall Growth Trajectory: Composed chart (Area + 2 Lines + Bar)
- Skill Development Velocity: Area chart (8 weeks of data)
- Skill Health Matrix: Radar chart (6 skills, health vs practice)
- Skills by Category: Horizontal bar chart (count + avg level)
- Internship Impact Analysis: Scatter plot (Duration × Skills Gained, bubble size = avg growth%)

### Elements Tested

| Element | Intended Behaviour | Actual Result | Status |
|---|---|---|---|
| Key Insights banner | 3 summary insight cards | Renders correctly in both modes | ✅ Works |
| KPI metric cards (×4) | Computed analytics metrics | Hardcoded static numbers | ⚠️ Mock data |
| Overall Growth Trajectory (composed) | Area + 2 Lines + Bar chart | **ALL elements invisible in dark mode** | ❌ Dark Mode Bug |
| Skill Velocity area chart | Smooth area per week | **Invisible in dark mode** | ❌ Dark Mode Bug |
| Skill Health Matrix radar | 2 overlapping radars | **Both radars invisible in dark mode** | ❌ Dark Mode Bug |
| Skills by Category horizontal bar | Bars per category | **All bars invisible in dark** | ❌ Dark Mode Bug |
| Internship Impact scatter | 2 data points (Meta, Stripe) | Barely visible as very small dots | ⚠️ Visibility issue |
| Internship table below scatter | Company + stats | Readable in dark | ✅ Works |
| Analytics data source | Should derive from real Skills/Certs data | **Completely separate hardcoded dataset** — disconnected from other pages | ❌ Data integrity bug |

---

## 8. Export

### What It Contains
- Page title + subtitle
- Format selector: PDF / JSON / Markdown (3 toggle cards)
- Template Style: Professional / Minimal / Detailed (3 toggle cards)
- Sections to Include: 6 custom checkboxes
- Quick Actions: Export button, Copy Share Link, Preview
- Share Directly: LinkedIn, Email Portfolio, Public Profile Link
- Export Preview summary (auto-updates with selections)
- Recent Exports: 3 hardcoded history items with Download icon

### Elements Tested

| Element | Intended Behaviour | Actual Result | Status |
|---|---|---|---|
| Format buttons (PDF/JSON/Markdown) | Select format, highlight borders | Selection state updates correctly | ✅ Works |
| Template buttons (×3) | Select template, highlight borders | Selection state updates correctly | ✅ Works |
| Section checkboxes (×6) | Toggle included sections | Custom checkbox renders + visual state updates | ✅ Works |
| Export Preview counter | Updates as sections toggled | Correctly reflects checked count | ✅ Works |
| Estimated size | Changes per format | Updates with format change (hardcoded per format) | ✅ Works (static) |
| "Export PDF/JSON/Markdown" button | Trigger real export via backend | Calls `alert()` — placeholder only | ❌ Dead button |
| "Copy Share Link" button | Copy real shareable URL | Copies hardcoded fake URL + `alert()` | ❌ Dead button |
| "Preview" button | Show export preview | Nothing happens | ❌ Dead button |
| "Share on LinkedIn" | Open LinkedIn share dialog | Nothing happens | ❌ Dead button |
| "Email Portfolio" | Open email compose | Nothing happens | ❌ Dead button |
| "Public Profile Link" | Navigate to public profile | Nothing happens | ❌ Dead button |
| Recent Exports (×3) | Show real export history | Static hardcoded list | ⚠️ Mock data |
| Download icon on recent exports | Re-download a file | Nothing happens | ❌ Dead button |

---

## 9. Dark Mode Bug Index

### Root Cause Analysis
Recharts renders charts using SVG elements. The `fill` and `stroke` props receive strings like `hsl(var(--chart-1))`. While this works in HTML/CSS context, **SVG elements do not inherit CSS custom properties** in the same way in some situations — particularly when the SVG is isolated. Additionally, dark mode is applied by adding `class="dark"` to a parent `<div>`, not to `<html>`, which can break CSS variable inheritance for deeply nested SVG.

The dark mode `--chart-N` values ARE correctly defined in `theme.css`:
```css
.dark {
  --chart-1: oklch(0.65 0.22 270); /* purple-blue */
  --chart-2: oklch(0.75 0.18 165); /* teal-green */
  --chart-3: oklch(0.82 0.19 75);  /* yellow */
  --chart-4: oklch(0.70 0.24 310); /* pink-purple */
  --chart-5: oklch(0.72 0.25 20);  /* orange-red */
}
```

But the `dark` class is on a nested `<div>`, not `<html>`. The SVG computation context loses the variables.

### Chart Visibility Bugs

| Page | Chart | Dark Mode Bug | Severity |
|---|---|---|---|
| Dashboard | Skill Health Score (Area) | Area fill and line invisible | 🔴 Critical |
| Dashboard | Skill Balance (Radar) | Both fills invisible, labels partial | 🔴 Critical |
| Internships | Skills Growth (Line) | Connecting line invisible | 🔴 Critical |
| Internships | Skill Impact (Bar, horizontal) | Both bars (before/after) black on dark | 🔴 Critical |
| Skills | Skill growth (Area) | Area fill and line invisible | 🔴 Critical |
| Certifications | Status Distribution (Donut) | All segments black | 🔴 Critical |
| Certifications | By Difficulty (Bar) | All bars invisible | 🔴 Critical |
| Certifications | Acquisition Timeline (Line) | Line invisible | 🔴 Critical |
| Analytics | Overall Growth Trajectory | All series invisible | 🔴 Critical |
| Analytics | Skill Velocity (Area) | Area and line invisible | 🔴 Critical |
| Analytics | Skill Health Matrix (Radar) | Both overlapping radars invisible | 🔴 Critical |
| Analytics | Skills by Category (Bar) | All bars invisible | 🔴 Critical |

### UI Element Visibility Bugs

| Page | Element | Bug Description | Severity |
|---|---|---|---|
| Dashboard | Alert cards | `bg-orange-500/5` / `bg-red-500/5` near-transparent in dark | 🟠 High |
| Dashboard | Deadline type badges | `bg-accent` too dark — badges invisible | 🟡 Medium |
| Skills | Progress bar fills | `bg-current` matches dark bg — invisible | 🟠 High |
| Skills | Skill decay alert box | Orange warning faint | 🟡 Medium |
| Internships | Key Projects gradient | gradient near-invisible | 🟡 Medium |
| Certifications | Pie chart legend dots | Dots render black | 🟠 High |

---

## 10. Non-Functional Button Index

| Page | Button Label | Expected Behaviour When Working |
|---|---|---|
| Internships | + Add Internship | Modal: company, role, location, dates, skills |
| Internships | ExternalLink (×2) | Open company/internship URL in new tab |
| Skills | + Add Skill | Modal: name, category, initial level |
| Skills | Link New Evidence | Modal: select + link existing evidence to skill |
| Certifications | + Add Certification | Modal: name, issuer, dates, credential ID, skills |
| Certifications | Verify (×8) | Open `cert.verificationUrl` in new tab |
| Evidence Vault | + Upload Evidence | Modal: file upload or URL, type, tags, skill links |
| Evidence Vault | ExternalLink (per card) | Open `item.url` in new tab |
| Export | Export PDF/JSON/Markdown | POST to export API → file download trigger |
| Export | Copy Share Link | Backend generates URL → copy to clipboard |
| Export | Preview | Show in-page or new-tab preview of export |
| Export | Share on LinkedIn | Open LinkedIn share with portfolio URL |
| Export | Email Portfolio | Open mailto: with file or link |
| Export | Public Profile Link | Navigate to public portfolio page |
| Export | Download (recent exports) | Re-download from backend storage |

---

## 11. Prioritised Fix List

### 🔴 P0 — Critical (Fix Immediately)

**1. Fix ALL chart colours in dark mode**
- Move `class="dark"` from the wrapper `<div>` to `<html>` element
- OR: Create a `useChartColors()` hook that reads CSS vars via `getComputedStyle(document.documentElement)` and returns explicit colour strings to pass as Recharts props
- Alternatively: Use `@apply` Tailwind and pass as `className` on SVG wrapper

**2. Fix Alert card backgrounds in dark mode** (Dashboard)
- Change `bg-orange-500/5` → `bg-orange-500/15 dark:bg-orange-500/20`
- Change `bg-red-500/5` → `bg-red-500/15 dark:bg-red-500/20`
- Change `bg-blue-500/5` → `bg-blue-500/15 dark:bg-blue-500/20`

**3. Fix skill progress bar fill in dark mode** (Skills)
- Change `bg-current` → `bg-primary` for the progress fill bar

**4. Fix dark mode persistence** (App.tsx)
```typescript
const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
const toggleTheme = () => {
  const next = !isDark;
  setIsDark(next);
  localStorage.setItem('theme', next ? 'dark' : 'light');
};
```

### 🟠 P1 — High Priority

**5. Fix Sidebar to stay sticky on scroll**
```tsx
<aside className="w-64 border-r border-border bg-card flex flex-col sticky top-0 h-screen overflow-y-auto">
```

**6. Fix Header title to reflect current page**
- Pass `currentPage` as prop to header, render a readable title

**7. Fix Certifications pie chart legend dot colours in dark mode**
- Check that `style={{ backgroundColor: item.color }}` receives a resolved colour, not a CSS var string

**8. Add "achievement" filter tab to Evidence Vault**

**9. Make ExternalLink and Verify buttons functional** (simple: `window.open(url, '_blank')`)

### 🟡 P2 — Medium Priority

**10.** Replace `alert()` in Export with `sonner` toast notifications  
**11.** Connect Analytics charts to the same static arrays as Skills/Certs pages  
**12.** Add empty state UI for Evidence Vault search returning no results  
**13.** Add loading skeleton states  

### 🟢 P3 — Low Priority Polish

**14.** Rotate/contextualise the "Pro Tip" card  
**15.** Fix/verify the "?" tooltip visibility (z-index or overflow issue on Dashboard)  
**16.** Add page transition animations  
**17.** Show breadcrumb in Skills drill-down  

---

*This report was generated from a live automated QA testing session covering all 7 pages, every interactive element, and both light and dark modes with screenshots as evidence.*
