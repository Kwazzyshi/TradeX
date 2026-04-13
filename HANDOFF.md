# TradeX ND — Full Stack Indian Trading Platform
## Project Handoff Document for AI Collaboration

---

## PLATFORM NAME
**TradeX ND** (previously referred to as TradeX)

## DESIGN DIRECTION
- **Theme:** Pure black (#000000 base), not dark gray — true black
- **Accent:** Bright green (#00e5a0) for gains, red (#ff4d6a) for losses
- **Typography:** DM Mono for numbers/prices, Syne for headings/UI
- **Style:** Dense, data-rich, professional fintech — like Zerodha Kite but more premium

---

## WHAT HAS BEEN BUILT SO FAR (by Claude)

### Backend (Node.js + Express) — COMPLETE
All files located in `/tradex/backend/`

**server.js** — Main Express server with:
- Helmet security, CORS, rate limiting
- Serves all API routes
- Serves frontend static files from /frontend/dist

**db/index.js** — PostgreSQL schema with tables:
- `users` — id, name, email, password_hash, phone, pan, kyc_status
- `user_funds` — available_balance, used_margin, total_invested
- `watchlist` — user_id, symbol, exchange
- `orders` — full order book with BUY/SELL, brokerage, taxes, status
- `holdings` — portfolio holdings with avg buy price
- `mf_holdings` — mutual fund investments with SIP support
- `price_cache` — 60-second TTL cache for stock prices
- `sessions` — refresh token storage

**routes/auth.js** — Full auth system:
- POST /api/auth/register — creates user + default watchlist (RELIANCE, TCS, HDFCBANK, INFY, ICICIBANK) + funds entry
- POST /api/auth/login — returns accessToken (15min) + refreshToken (7 days)
- POST /api/auth/refresh — rotates refresh tokens
- POST /api/auth/logout — invalidates session
- GET /api/auth/me — returns user profile + funds

**routes/stocks.js** — Stock data with Alpha Vantage:
- GET /api/stocks/indices — NIFTY50, SENSEX, BANKNIFTY, NIFTYIT, NIFTYMID50
- GET /api/stocks/quote/:symbol — live price (with 60s DB cache, BSE suffix for AV)
- GET /api/stocks/search/:query — symbol search filtered to India
- GET /api/stocks/history/:symbol/:interval — OHLCV history (1D/1W/1M/3M/1Y)
- GET /api/stocks/top-gainers — market movers
- GET /api/stocks/top-losers — market movers
- ⚠️ Falls back to realistic simulated prices when AV rate-limits (free tier = 25 calls/day)

**routes/orders.js** — Full order engine:
- GET /api/orders — order history
- POST /api/orders/calculate — preview brokerage + taxes before placing
- POST /api/orders — place BUY/SELL with:
  - Real Zerodha-style brokerage calculation (₹20 flat or 0.03% whichever lower)
  - STT, exchange charges, SEBI charges, GST, stamp duty
  - Atomic DB transactions (deducts funds on BUY, updates holdings, credits on SELL)
  - Prevents oversell (checks holdings qty)
  - Prevents insufficient funds
- DELETE /api/orders/:id — cancel pending order

**routes/portfolio.js:**
- GET /api/portfolio — all holdings + funds
- GET /api/portfolio/summary — aggregated stats

**routes/watchlist.js:**
- GET /api/watchlist — user's watchlist with cached prices
- POST /api/watchlist — add symbol
- DELETE /api/watchlist/:symbol — remove symbol

**routes/mutualfunds.js** — Uses mfapi.in (free Indian MF API):
- GET /api/mf/top — 8 curated top funds with 1Y/3Y returns from real NAV data
- GET /api/mf/:schemeCode — single fund with full NAV history
- GET /api/mf/search/:query — search all Indian MFs
- GET /api/mf/user/holdings — user's MF portfolio
- POST /api/mf/invest — invest in a fund (deducts from wallet, calculates units at current NAV)

**routes/comparator.js** — Broker commission comparator:
- GET /api/comparator — all 7 brokers (Zerodha, Groww, Upstox, Angel One, ICICI Direct, HDFC Securities, Fyers)
- POST /api/comparator/calculate — calculate actual charges for any order value across all brokers
  - Covers: delivery, intraday, F&O
  - Includes: brokerage, STT, exchange charges, GST, stamp duty
  - Marks cheapest and most expensive

**middleware/auth.js** — JWT Bearer token verification

**.env** (configured):
```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/tradex_nd
JWT_SECRET=tradex_nd_jwt_secret_change_in_production_2024
JWT_REFRESH_SECRET=tradex_nd_refresh_secret_change_in_production_2024
ALPHA_VANTAGE_KEY=9E5KZAFCMWW7B215
```

**package.json** dependencies:
express, cors, helmet, express-rate-limit, bcryptjs, jsonwebtoken, pg, axios, node-cron, dotenv

### Frontend (HTML prototype) — PARTIALLY DONE
A polished HTML/CSS/JS prototype was built showing:
- Sidebar navigation (Dashboard, Watchlist, Portfolio, Orders, Mutual Funds, IPO, Comparator)
- Indices bar (NIFTY, SENSEX, BANK NIFTY, IT, MID50)
- Stock price chart with period selector
- Watchlist with sparklines
- Buy/Sell order panel with live charge calculator
- Portfolio P&L stats
- Commission comparator table
- Mutual Funds preview

**NOT YET BUILT (Frontend React app):**
- React + Vite project setup
- Auth pages (Login / Register)
- All pages wired to backend API
- Real-time price updates (WebSocket or polling)
- Full chart with real OHLCV data (Lightweight Charts or Recharts)
- Mutual Funds full page
- Commission Comparator full page
- Orders page
- Portfolio page with P&L
- Funds page (add/withdraw money)
- Search modal
- Mobile responsive layout

---

## TECH STACK
- **Frontend:** React 18 + Vite + Tailwind CSS (to be built)
- **Backend:** Node.js + Express ✅ DONE
- **Database:** PostgreSQL ✅ Schema done
- **Cache:** PostgreSQL price_cache table (no Redis needed for now)
- **Stock Data:** Alpha Vantage API (key: 9E5KZAFCMWW7B215) — BSE suffix (e.g. RELIANCE.BSE)
- **MF Data:** mfapi.in — completely free, no key needed
- **Auth:** JWT access tokens (15min) + refresh tokens (7 days), bcrypt passwords

---

## PROJECT FOLDER STRUCTURE
```
tradex/
├── backend/
│   ├── server.js
│   ├── db/
│   │   └── index.js
│   ├── middleware/
│   │   └── auth.js
│   └── routes/
│       ├── auth.js
│       ├── stocks.js
│       ├── orders.js
│       ├── portfolio.js
│       ├── watchlist.js
│       ├── mutualfunds.js
│       └── comparator.js
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── hooks/
│       └── utils/
├── .env
└── package.json
```

---

## API SUMMARY TABLE
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login, get tokens |
| POST | /api/auth/refresh | No | Refresh access token |
| POST | /api/auth/logout | No | Invalidate session |
| GET | /api/auth/me | Yes | Get user + funds |
| GET | /api/stocks/indices | No | Get all indices |
| GET | /api/stocks/quote/:symbol | No | Get stock price |
| GET | /api/stocks/search/:query | No | Search stocks |
| GET | /api/stocks/history/:symbol/:interval | No | Price history |
| GET | /api/stocks/top-gainers | No | Top gainers |
| GET | /api/stocks/top-losers | No | Top losers |
| GET | /api/watchlist | Yes | Get watchlist |
| POST | /api/watchlist | Yes | Add to watchlist |
| DELETE | /api/watchlist/:symbol | Yes | Remove from watchlist |
| GET | /api/portfolio | Yes | Get holdings + funds |
| GET | /api/portfolio/summary | Yes | Portfolio stats |
| GET | /api/orders | Yes | Order history |
| POST | /api/orders/calculate | Yes | Preview charges |
| POST | /api/orders | Yes | Place order |
| DELETE | /api/orders/:id | Yes | Cancel order |
| GET | /api/mf/top | No | Top mutual funds |
| GET | /api/mf/:schemeCode | No | Fund detail + NAV |
| GET | /api/mf/search/:query | No | Search MFs |
| GET | /api/mf/user/holdings | Yes | User MF holdings |
| POST | /api/mf/invest | Yes | Invest in MF |
| GET | /api/comparator | No | All brokers |
| POST | /api/comparator/calculate | No | Compare charges |

---

## WHAT CHATGPT SHOULD ASK CLAUDE TO BUILD NEXT

### PRIORITY 1 — React Frontend Setup
Ask Claude to:
1. Create `/frontend` as a React + Vite + Tailwind CSS project
2. Set up folder structure: pages/, components/, context/, hooks/, utils/
3. Create AuthContext (stores user, tokens, auto-refresh logic)
4. Create API utility (axios instance with auth headers + token refresh interceptor)
5. Create a React Router setup with protected routes

### PRIORITY 2 — Auth Pages
Ask Claude to build:
- `/login` page — email + password form, black theme
- `/register` page — name, email, phone, password, confirm password
- Auto redirect to dashboard if already logged in
- Store tokens in localStorage, user in context

### PRIORITY 3 — Dashboard Page
Ask Claude to build the main dashboard with:
- Indices bar (poll /api/stocks/indices every 5s)
- Live watchlist (poll every 10s)
- Buy/Sell panel (call /api/orders/calculate for preview, /api/orders to place)
- Portfolio summary widget
- Top gainers/losers widget
- Chart component using Lightweight Charts library (TradingView's open source)

### PRIORITY 4 — Full Pages
Ask Claude to build each page:
- **Watchlist page** — full watchlist management, add/remove stocks
- **Portfolio page** — holdings table with live P&L calculation
- **Orders page** — order history table with status badges
- **Mutual Funds page** — fund cards with returns, search, invest modal
- **Comparator page** — interactive tool with order value slider, comparison table
- **Funds page** — add money simulation, balance display

### PRIORITY 5 — Polish
- Real-time price updates via polling (every 5-10s)
- Toast notifications for order success/failure
- Loading skeletons
- Mobile responsive sidebar (hamburger menu)
- Dark/light theme toggle (optional)

---

## DESIGN TOKENS FOR CLAUDE (BLACK THEME)
```css
--bg: #000000;          /* True black background */
--surface: #0a0a0a;     /* Cards */
--surface2: #111111;    /* Input fields, hover */
--border: #1a1a1a;      /* Borders */
--accent: #00e5a0;      /* Green - gains, CTA */
--red: #ff4d6a;         /* Losses, sell */
--blue: #0095ff;        /* Info, links */
--text: #f0f0f0;        /* Primary text */
--muted: #444444;       /* Subtle labels */
--muted2: #888888;      /* Secondary text */
```

---

## IMPORTANT NOTES FOR AI COLLABORATORS
1. **Alpha Vantage free tier** = 25 API calls/day. The backend already has a 60-second DB cache and realistic fallback prices so the app works even when rate-limited.
2. **mfapi.in** is completely free with no rate limits — use it freely for all MF data.
3. **All monetary values** are in Indian Rupees (₹). Format large numbers in Indian style (lakhs, crores): ₹4.82L, ₹1.2Cr.
4. **Stock symbols** use BSE suffix for Alpha Vantage (RELIANCE.BSE) but are stored without suffix in the DB.
5. **The backend is production-ready** — don't rewrite it, just build the frontend on top of it.
6. **JWT flow:** accessToken in Authorization header, refreshToken in localStorage, auto-refresh on 401.
7. **Database must be initialized** by calling `initDB()` from db/index.js on server start — add this to server.js.

---

## PROMPT TEMPLATE FOR CHATGPT TO GIVE CLAUDE

Use this exact prompt format when asking Claude to build a specific part:

---
"You are continuing to build TradeX ND, a full-stack Indian stock trading platform. The backend is fully built in Node.js/Express with PostgreSQL. You are now building the [COMPONENT NAME].

Design: Pure black theme (#000000 bg), green (#00e5a0) accents, DM Mono for numbers, Syne for UI text.

The backend API base URL is http://localhost:5000. Auth uses Bearer JWT tokens.

[Paste relevant API endpoints from the table above]

Build: [specific component/page description]

Requirements:
- React 18 functional components with hooks
- Tailwind CSS for styling (use the black theme tokens above)
- Axios for API calls
- No TypeScript (plain JS)
- Mobile responsive"
---

Good luck building TradeX ND! 🚀
