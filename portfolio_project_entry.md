# Project Portfolio Entry: Ledger (AI-Powered Financial Forecaster)

Use the following structured information to design and generate a premium project card, case study, or detailed detail modal for this full-stack project in my portfolio.

---

## 🏷️ Project Metadata

- **Project Name**: Ledger
- **Role**: Full-Stack Developer & Algorithm Engineer
- **Project Subtitle**: Full-Stack Personal Finance Tracker with Hybrid Time-Series Forecasting & Gemini AI
- **Tech Stack**:
  - **Frontend**: Nuxt 3 (Vue 3, Composition API, SFC)
  - **Backend**: Nuxt Server Engine (H3, Server Routes)
  - **Database**: PostgreSQL (Prisma ORM)
  - **Styling**: Tailwind CSS
  - **AI Integration**: Google Gemini 2.5 Flash API
  - **Language**: TypeScript (Strict)
  - **Key Math Primitives**: OLS Linear Regression, Exponential Weighted Moving Averages (EWMA), Year-over-Year (YoY) Seasonality Indices.

---

## 💡 The Pitch (Case Study Summary)

> **"Ledger is a full-stack personal finance application that bridges reactive transaction tracking with predictive financial analysis. Unlike basic CRUD trackers, Ledger features a custom mathematical time-series forecasting engine and an asynchronous, non-blocking AI Advisor powered by Google Gemini. The result is an application that calculates exact spending paces, forecasts upcoming month trends, catches budget anomalies, and provides tailored, context-aware financial advice."**

---

## 🌟 Key Features Built

1. **Reactive Dashboard with Historical Controls**:
   - Features an interactive month selector.
   - All charts, metrics (MoM changes, category allocation percentages), and transaction streams react instantly via dynamic computed properties.
2. **Hybrid Time-Series Forecasting Engine**:
   - Toggles between **This Month (Pace-Based)** projection and **Next Month (Regression-Based)** forecast.
   - Tracks days elapsed and extrapolates end-of-month spend relative to calendar limits.
3. **Google Gemini AI Advisor**:
   - Analyzes aggregated monthly spend statistics to deliver high-quality, non-generic financial tips.
   - Designed using a non-blocking asynchronous lazy loader (UI skeletons) to keep page loading instantaneous.
4. **Intelligent Anomaly Detection**:
   - Automatically pre-filters transaction outliers using standard deviation Z-Scores ($Z > 2.0$) with small-sample double-mean safeguards.
5. **Precise Financial Ledger**:
   - A paginated, searchable, and category-filtered transaction manager utilizing precise Decimal base-10 mathematics to guarantee absolute dollar/peso precision.

---

## ⚙️ Engineering & Algorithm Deep-Dive

### The 3-Tier Composite Forecaster
Explain the mathematical logic backing the forecasting pipeline:
- **Tier 1 (Enhanced)**: Triggered when $13+$ months of data exist. It runs raw totals through EWMA smoothing, computes a recency-weighted linear regression, blends it with a YoY seasonality index, and applies a BSP-based inflation nudge.
- **Tier 2 (Standard)**: For $3-12$ months of data. It runs weighted regression on smoothed data plus the inflation nudge.
- **Tier 3 (Fallback)**: For $<3$ months. Gracefully degrades to a trailing average.

#### Mathematical Snippet (Recency-Weighted OLS)
```typescript
// From server/utils/insights.ts
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

## 🗄️ Database Schema Representation (Prisma)
- Uses strict database relations (`Category` to `Expense` 1:N).
- Prevents floating-point precision loss by defining amount columns using exact decimals:
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

## 📂 Visual Media & Image Paths
For the portfolio layout, use the following local image assets captured directly from the running webapp:
- **Dashboard View**: `docs/images/dashboard.png`
- **Searchable Ledger**: `docs/images/expenses.png`
- **Pace Projection Card**: `docs/images/insights_this_month.png`
- **Composite Forecast Card**: `docs/images/insights_next_month.png`
