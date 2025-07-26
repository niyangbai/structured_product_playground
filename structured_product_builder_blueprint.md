# 📐 Structured Product Builder – Full Blueprint

This blueprint outlines a visual, browser-based web application that allows users to create and simulate structured financial products using modular, Scratch-style bricks. It supports retail- and institutional-grade complexity, including Autocalls, Snowballs, Reverse Convertibles, Accumulators, and more.

---

## 🎯 Vision

A full-frontend, drag-and-drop application where users build structured products using visual bricks and instantly see simulated payoff charts under customizable market scenarios.

---

## 🧱 Brick System Design

### 🔹 Categories of Bricks

#### 1. **Asset Bricks**

| Brick Name        | Description                          |
| ----------------- | ------------------------------------ |
| `UnderlyingAsset` | Price time series (stock, index, FX) |
| `Bond`            | Zero or fixed-coupon bond            |

#### 2. **Option Bricks**

| Brick Name       | Description                                 |
| ---------------- | ------------------------------------------- |
| `VanillaOption`  | Call/Put, long/short, strike, expiry        |
| `DigitalOption`  | Pays fixed amount if condition is met       |
| `BarrierOption`  | Knock-in/out options with up/down barriers  |
| `LookbackOption` | Max/min price-based option                  |
| `RangeOption`    | Pays when spot remains within a price range |

#### 3. **Logic Bricks**

| Brick Name             | Description                                   |
| ---------------------- | --------------------------------------------- |
| `IfThenElse`           | Logic control between conditions              |
| `BarrierTrigger`       | Event triggers when price breaches threshold  |
| `AutocallTrigger`      | Callable note logic based on observation      |
| `KnockInCheck`         | Sets knock-in status                          |
| `MemoryBuffer`         | Stores unpaid coupons                         |
| `HighWatermarkTracker` | Tracks maximum (or minimum) observed price    |
| `TargetTracker`        | Accumulates values until payout condition met |
| `Observation`          | Checks asset condition at scheduled dates     |

#### 4. **Flow Bricks**

| Brick Name          | Description                                      |
| ------------------- | ------------------------------------------------ |
| `CouponSchedule`    | Observation/payment timetable                    |
| `CouponLogic`       | Defines coupon calculation at observation points |
| `FinalPayout`       | Logic to compute maturity cashflows              |
| `AutocallHandler`   | What happens when AutocallTrigger activates      |
| `CouponAccumulator` | Per-day accruals based on asset behavior         |

#### 5. **Math/Utility Bricks**

| Brick Name   | Description                          |
| ------------ | ------------------------------------ |
| `Sum`        | Adds multiple payoffs                |
| `Multiplier` | Scales payoff by a factor            |
| `Compare`    | Performs GT/LT/EQ comparisons        |
| `Selector`   | Selects best/worst asset from basket |
| `Timer`      | Measures elapsed time since event    |

---

## 🧰 Example Product Builds

### 🧊 Snowball Note

- `UnderlyingAsset`
- `CouponSchedule`
- `BarrierTrigger`
- `AutocallTrigger`
- `MemoryBuffer`
- `KnockInCheck`
- `FinalPayout`

### 🔥 Reverse Convertible

- `UnderlyingAsset`
- `VanillaOption` (Short Put)
- `Bond`
- `CouponSchedule`
- `FinalPayout`

### 🚀 Twin Win Note

- `UnderlyingAsset`
- `VanillaOption` (Long Call + Long Put)
- `Sum`

### 🎯 TRF (Target Redemption Forward)

- `UnderlyingAsset`
- `CouponSchedule`
- `TargetTracker`
- `AutocallHandler`
- `FinalPayout`

### 💰 Accumulator

- `UnderlyingAsset`
- `CouponAccumulator`
- `RangeOption`
- `Timer`

### 🏆 Best-of Note

- `Selector`
- `VanillaOption`
- `FinalPayout`

---

## 🧠 Engine Design (Frontend-Only)

### Component Tree

```
<App>
  ├── <BrickCanvas />       # Drag-and-drop editor
  ├── <InspectorPanel />    # Shows brick properties
  ├── <SimulationPanel />   # Market scenario selector
  └── <PayoffChart />       # Real-time chart output
```

### Architecture

- **React + react-flow** for drag-and-drop
- **Recoil/Zustand** for app state
- **Plotly.js** for payoff charting
- **LocalStorage** or URL encoding for saving strategies

---

## 📊 Simulation Modes

- **Static payoff** (P&L vs. spot at maturity)
- **Path-dependent payoff** (time series: spot vs. coupon vs. maturity)
- **Scenario testing**:
  - Uptrend, downtrend, flat
  - Custom path input
  - Optional Monte Carlo later (if backend added)

---

## 💾 Persistence / Sharing

- Strategies stored in:
  - `localStorage`
  - Encoded in shareable URLs
  - (Later: cloud sync / user login)

---

## 🛠 Example Brick JSON

```json
{
  "type": "BarrierOption",
  "direction": "up-and-out",
  "strike": 100,
  "barrier": 120,
  "notional": 1000,
  "expiry": "1Y",
  "underlying": "S&P500"
}
```

---

## 🧱 Summary: Minimum Viable Brick Set (25)

This blueprint supports:

- Snowball, Phoenix, Autocallables
- Accumulators, TRFs, Reverse Convertibles
- Bonus, Barrier, Digital, Lookback options
- All popular structured notes from retail/private banks

make it easy to add **new bricks later** (e.g., callable range accrual, FX quanto blocks)

---

## 📤 Ready for Development

This document can serve as your full architecture/design spec. You can:

- Convert it to markdown documentation
- Use it to create a component/brick library
- Base your logic engine on this schema

Would you like a **React template** to start from this?

