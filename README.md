# ROI Calculator — Vibe-Coding Bootcamp

A business ROI calculator built with React. This is a skeleton project for the Vibe-Coding Bootcamp.

## Getting Started

1. Open this folder in VS Code
2. Open the terminal in VS Code (Terminal → New Terminal)
3. Install dependencies:

```bash
npm install
```

4. Start the dev server:

```bash
npm run dev
```

5. Open the link shown in the terminal (usually http://localhost:5173)

You should see a placeholder page — the app is ready for development.

---

## Choose Your Start Mode

### Option A — Quick Start (copy-paste this prompt into Claude Code)

Copy the entire prompt below and paste it into Claude Code:

```
Read the AGENTS.md file in this project. Build the complete ROI Calculator application as described:

1. Create an input form with 4 fields: Initial Investment (default $100,000), Monthly Revenue (default $15,000), Monthly Costs (default $5,000), and Calculation Period (12/24/36 months dropdown).

2. Create the calculation logic: ROI percentage, payback period in months, total net profit, and month-by-month cumulative cash flow.

3. Create a Results component showing ROI %, payback period, and net profit — all numbers formatted with commas.

4. Add a Recharts line chart showing cumulative cash flow over the selected period with a dashed $0 reference line for the break-even point.

5. Use a two-column layout (form left, results + chart right) that collapses to single column on mobile.

Before you start, ask me which UI theme I want (A, B, or C — see AGENTS.md). Then build everything in one go. Make sure the app runs with npm run dev.
```

### Option B — Interactive Start (planning mode)

Copy this short prompt into Claude Code:

```
I want to build a business ROI calculator where users enter investment parameters and see ROI metrics with a chart. Read the AGENTS.md for details. Before writing any code, ask me questions to clarify what I want — use simple, non-technical language. Then propose a plan and build it step by step.
```

---

Both options produce a working ROI calculator. Try whichever feels more comfortable — or try both!
