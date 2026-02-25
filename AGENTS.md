# AGENTS.md

## Important: Working with a Non-Technical User

The user is a non-technical person with no programming experience.
- Always explain what you are doing in simple, plain language
- Never ask the user to manually edit code or configuration files
- If something breaks, fix it yourself — do not ask the user to debug
- After each change, tell the user how to see the result (e.g., "open your browser")
- Prefer simple, working solutions over clever or complex ones
- When asking questions in planning mode, use non-technical language

## Project: Business ROI Calculator

### Goal

Build a single-page web application that calculates Return on Investment (ROI) for a business project. The user fills in a form and immediately sees ROI metrics and a cumulative cash flow chart.

### Tech Stack

- React (Vite is already configured)
- Recharts for the chart
- CSS for styling (no Tailwind)
- No backend required — all calculations happen in the browser

### UI Theme Options

Before starting, the mentee picks ONE theme. Ask which they prefer:

- **Theme A — Corporate Blue:** Primary color #2563eb, white background, blue accent buttons, clean corporate feel
- **Theme B — EPAM Brand:** Primary color #39f, dark sidebar (#1a1a2e), EPAM-inspired palette, modern tech look
- **Theme C — Warm Professional:** Primary color #f59e0b (amber/orange), cream background (#fffbeb), warm and approachable

### Application Structure

```
roi-calculator/
├── src/
│   ├── App.jsx          — main layout (two-column: form + results)
│   ├── components/
│   │   ├── InputForm.jsx    — form with 4 fields
│   │   ├── Results.jsx      — ROI %, payback period, net profit
│   │   └── CashFlowChart.jsx — cumulative cash flow line chart
│   ├── utils/
│   │   └── calculations.js  — pure functions for ROI math
│   ├── App.css
│   └── main.jsx
├── package.json
├── AGENTS.md
└── index.html
```

### Input Fields

1. **Initial Investment** — number input, default 100000, label "Initial Investment ($)"
2. **Monthly Revenue** — number input, default 15000, label "Expected Monthly Revenue ($)"
3. **Monthly Costs** — number input, default 5000, label "Monthly Operating Costs ($)"
4. **Time Period** — dropdown select: 12 / 24 / 36 months, label "Calculation Period (months)"

### Calculations (utils/calculations.js)

- **Monthly Net Profit** = Monthly Revenue − Monthly Costs
- **Cumulative Cash Flow for month N** = (Monthly Net Profit × N) − Initial Investment
- **Payback Period** = ceil(Initial Investment / Monthly Net Profit) months. If Monthly Net Profit ≤ 0, show "Never"
- **Total Net Profit** = (Monthly Net Profit × Period) − Initial Investment
- **ROI %** = (Total Net Profit / Initial Investment) × 100

### Chart

- Type: Line chart (Recharts `<LineChart>`)
- X-axis: months (1 to Period)
- Y-axis: cumulative cash flow ($)
- Show a horizontal reference line at $0 to visualize the break-even point
- Line color matches chosen theme accent, reference line: dashed gray

### Layout

- Two-column layout on desktop (form left, results + chart right)
- Single column on mobile (form on top, results below)
- Max width 1200px, centered

### Style

- Clean, professional look
- Font: system font stack
- Card-style containers with subtle shadow for form and results sections
- All numbers formatted with commas (e.g., $100,000)

### Constraints

- All computation must be client-side — no API calls, no backend
- App must start with `npm run dev` and be accessible at localhost
- Keep code simple and readable — no unnecessary abstractions
