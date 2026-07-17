---
title: "Ledger"
description: "Full-stack personal finance tracker featuring a hybrid time-series forecasting engine and an asynchronous, non-blocking AI Advisor."
tags: ["Nuxt 3", "PostgreSQL", "Gemini AI", "Prisma", "TypeScript"]
impact: "Predictive forecaster with EWMA linear regressions & Gemini AI Advisor"
role: "Full-Stack Developer & Algorithm Engineer"
order: 2
featured: true
githubUrl: "https://github.com/abc1dee/ExpenseTracker"
thumbnail: "/images/projects/Ledger/Dashbaord.png"
gallery:
  - path: "/images/projects/Ledger/Dashbaord.png"
    label: "Interactive Dashboard"
    description: "The central analytical hub displaying real-time monthly stats, interactive charts, and month-over-month trends."
  - path: "/images/projects/Ledger/Expense Tab.png"
    label: "Expense Ledger"
    description: "Granular search and category-filtered transaction ledger powered by exact Decimal database types for zero round-off error."
  - path: "/images/projects/Ledger/Financial Insights Tab.png"
    label: "Gemini AI Advisor"
    description: "An asynchronous, non-blocking financial advisor integration that streams smart, personalized spending insights and recommendations."
  - path: "/images/projects/Ledger/Insights Next Month (Advanced Composite Forecast).png"
    label: "Advanced Forecasting Engine"
    description: "Advanced predictive modeling screen powered by EWMA linear regression and inflation metrics to forecast spending trends."

challenge: |
  Personal finance tools typically function as basic CRUD record books, failing to help users understand their spending pace or anticipate future trends. Building a forecasting engine that operates reliably on small datasets (1-2 months of data) and scales gracefully to seasonal regression models (13+ months) was a key math and engineering challenge. Additionally, integrating a Large Language Model (Gemini) to provide tailored advice required a non-blocking asynchronous architecture to prevent UI latency.

architecture: |
  The system is built on a unified Nuxt 3 full-stack architecture. The frontend utilizes Vue 3 reactive Composition APIs and Tailwind CSS for instant component updates (e.g. Month Selector, dynamic aggregates). The backend runs on Nuxt Server Engine (H3 server routes) communicating with a PostgreSQL database via Prisma ORM. The AI advisory layer calls the Google Gemini 2.5 Flash API asynchronously, rendering placeholder skeleton screens on the client side while responses are streaming/loading to ensure instantaneous page loads.

keyDecisions:
  - "Mathematical fallbacks: Multi-tier forecasting logic that scales down to standard averages for small datasets and scales up to EWMA linear regression for rich history."
  - "Decimals for Currency: Storing transaction amounts as exact Decimal columns in PostgreSQL/Prisma instead of floats, avoiding binary floating-point representation rounding issues."
  - "Non-blocking AI: Calling the Gemini API asynchronously via decoupled client-side fetchers, keeping dashboard load speeds under 100ms."

results:
  - "Outlier detection pre-filters standard deviation anomalies using Z-Scores ($Z > 2.0$)."
  - "Recency-weighted regression makes recent months 12x more influential in forecasting spending trends."
  - "Dashboard UI hot-reloaded reactively, responding instantly to transaction additions."
---

## Overview

Ledger is a full-stack personal finance application that bridges reactive transaction tracking with predictive financial analysis. Unlike basic CRUD trackers, Ledger features a custom mathematical time-series forecasting engine and an asynchronous, non-blocking AI Advisor powered by Google Gemini. The result is an application that calculates exact spending paces, forecasts upcoming month trends, catches budget anomalies, and provides tailored, context-aware financial advice.

---

## Technical Features Built

### 1. Reactive Dashboard with Historical Controls
*   Features an interactive month selector.
*   All charts, metrics (MoM changes, category allocation percentages), and transaction streams react instantly via dynamic computed properties.

### 3. Google Gemini AI Advisor
*   Analyzes aggregated monthly spend statistics to deliver high-quality, non-generic financial tips.
*   Designed using a non-blocking asynchronous lazy loader (UI skeletons) to keep page loading instantaneous.

### 4. Intelligent Anomaly Detection
*   Automatically pre-filters transaction outliers using standard deviation Z-Scores ($Z > 2.0$) with small-sample double-mean safeguards.

### 5. Precise Financial Ledger
*   A paginated, searchable, and category-filtered transaction manager utilizing precise Decimal base-10 mathematics to guarantee absolute dollar/peso precision.

---

## Engineering & Algorithm Deep-Dive

### The 3-Tier Composite Forecaster
The forecasting pipeline utilizes a multi-tier logic fallback structure:
1.  **Tier 1 (Enhanced)**: Triggered when $13+$ months of data exist. It runs raw totals through EWMA smoothing, computes a recency-weighted linear regression, blends it with a YoY seasonality index, and applies a BSP-based inflation nudge.
2.  **Tier 2 (Standard)**: For $3-12$ months of data. It runs weighted regression on smoothed data plus the inflation nudge.
3.  **Tier 3 (Fallback)**: For $<3$ months. Gracefully degrades to a trailing average.

#### Recency-Weighted OLS Implementation Snippet
```typescript
// server/utils/insights.ts
// Weights are applied exponentially to make recent months ~12x more influential
const w = weights ?? Array.from({ length: n }, (_, i) => Math.exp(2.5 * i / (n - 1)))

let sumW = 0, sumWX = 0, sumWY = 0, sumWXX = 0, sumWXY = 0
for (let i = 0; i < n; i++) {
  sumW   += w[i]
  sumWX  += w[i] * i
  sumWY  += w[i] * values[i]
  sumWXX += w[i] * i * i
  sumWXY += w[i] * i * values[i]
}

const denominator = sumW * sumWXX - sumWX * sumWX
const slope = (sumW * sumWXY - sumWX * sumWY) / denominator
const intercept = (sumWY - slope * sumWX) / sumW
const predicted = Math.max(0, slope * n + intercept)
```

---

## Database Schema Representation (Prisma)
To prevent floating-point precision loss, transaction amount columns are defined using exact decimals:
```prisma
model Expense {
  id          String   @id @default(uuid())
  description String
  amount      Decimal  @db.Decimal(10, 2)
  date        DateTime
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
}
```

---

## Visual Media

The system interfaces and interactive dashboards are shown in the screenshots gallery at the bottom of this case study.

