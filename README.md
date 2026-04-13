# TradeX
Full stack Indian stock trading platform with live NSE price scraping, JWT auth, MySQL database, RSS news sentiment analysis, narrative intelligence visualization, and Zerodha-style order engine. Built as a DBMS college project.



# TradeX ND 📈
### Full Stack Indian Stock Trading Platform

![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-18%2B-brightgreen)
![MySQL](https://img.shields.io/badge/database-MySQL%208.0-blue)
![React](https://img.shields.io/badge/frontend-React%2018-61dafb)

> A production-grade Indian stock trading web application built for a DBMS college project. Features live NSE price scraping, RSS-based news sentiment analysis, narrative intelligence visualization, real-time portfolio tracking, and a full order engine with Zerodha-style brokerage calculation.

---

## 📸 Screenshots

> Dashboard • Portfolio • News Intelligence • Comparator
><img width="1857" height="915" alt="image" src="https://github.com/user-attachments/assets/8fadfd02-a349-43bd-aacd-fb7a1032dd72" />
><img width="1875" height="931" alt="image" src="https://github.com/user-attachments/assets/c8057788-31cd-4917-99f3-30add0003369" />
><img width="1591" height="884" alt="image" src="https://github.com/user-attachments/assets/b7cd6ed8-a22a-45c5-bc73-cb83e8d40b73" />
> <img width="1581" height="885" alt="image" src="https://github.com/user-attachments/assets/b2119f13-7c93-47a6-ab5d-26adf57c27d5" />




---

## ✨ Features

- 🔐 **JWT Authentication** — Register, login, refresh tokens, auto-logout
- 📊 **Live Stock Prices** — Yahoo Finance scraper with Google Finance fallback and realistic drift
- 💼 **Portfolio Tracking** — Real-time P&L, holdings, average buy price
- 🛒 **Order Engine** — BUY/SELL with Zerodha-style brokerage, STT, GST, stamp duty calculation
- 📰 **News Sentiment** — RSS scraping from Google News, Yahoo Finance, Moneycontrol with keyword-based bullish/bearish/neutral scoring
- 🧠 **Narrative Intelligence** — Velocity chart, narrative cluster map, news volume heatmap (inspired by Silver Narrative Intelligence)
- 📂 **Sector Analysis** — IT, Energy, Banking, Auto, Pharma sector news tabs
- 🏦 **Broker Comparator** — Compare charges across Zerodha, Groww, Upstox, Angel One and more
- 🎨 **Premium UI** — True black theme, DM Mono + Syne fonts, animated star buttons, live ticker bar

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MySQL 8.0 (mysql2/promise) |
| Auth | JWT (access 15min + refresh 7 days) |
| Stock Data | Yahoo Finance Scraper + Google Finance fallback |
| News Data | RSS Parser (Google News, Yahoo Finance, Moneycontrol) |
| Charts | Recharts |
| Icons | Lucide React |
| Notifications | React Hot Toast |

---

## 🗃 Database Schema

```
tradex_nd/
├── users           — Authentication, balance
├── stocks          — 15 NSE stocks, live prices
├── transactions    — All BUY/SELL history
├── portfolio       — Current holdings per user
├── watchlist       — User saved stocks
├── price_history   — Historical price snapshots (every 5min)
└── news_cache      — Cached RSS articles
```

---

## 📁 Project Structure

```
tradex/
├── backend/
│   ├── server.js
│   ├── db/
│   │   └── index.js          — MySQL pool + schema init + seeding
│   ├── middleware/
│   │   └── auth.js           — JWT verification
│   ├── routes/
│   │   ├── auth.js
│   │   ├── stocks.js
│   │   ├── deals.js
│   │   ├── portfolio.js
│   │   ├── watchlist.js
│   │   ├── news.js
│   │   └── comparator.js
│   └── services/
│       ├── priceScraper.js   — Live price fetching + DB updates
│       └── narrativeEngine.js — News clustering + sentiment
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── news/         — NewsFeed, SentimentBar, VelocityChart,
│       │   │                   NarrativeMap, NewsVolumeHeatmap
│       │   └── ui/           — TickerBar, StarButton, OrderModal
│       ├── pages/            — Dashboard, Portfolio, Deals, News,
│       │                       StockMarket, Sector, Analytics
│       ├── context/
│       │   └── AuthContext.jsx
│       └── utils/
│           └── api.js        — Axios instance + interceptors
└── .env
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8.0 running on port 3306
- npm

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/tradex-nd.git
cd tradex-nd
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create MySQL database
Open MySQL Workbench or CLI and run:
```sql
CREATE DATABASE tradex_nd;
```

### 4. Configure environment
Create a `.env` file in the root:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=tradex_nd
DB_PORT=3306
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
ALPHA_VANTAGE_KEY=your_key_optional
```

### 5. Start the backend
```bash
node backend/server.js
```
You should see:
```
✅ MySQL connected and tables ready
✅ Seeded initial stocks successfully.
🚀 TradeX DBMS server running on port 5000
```

### 6. Start the frontend
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

---

## 📡 API Reference

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login, get tokens |
| GET | /api/auth/me | Yes | Get user + balance |
| GET | /api/stocks | No | All stocks from DB |
| GET | /api/stocks/live | No | Live prices + change% |
| GET | /api/stocks/gainers | No | Top 5 gainers |
| GET | /api/stocks/losers | No | Top 5 losers |
| POST | /api/deals/calculate | Yes | Preview brokerage charges |
| POST | /api/deals | Yes | Place BUY/SELL order |
| GET | /api/deals | Yes | Transaction history |
| GET | /api/portfolio | Yes | Holdings + P&L |
| GET | /api/news/stock/:symbol | No | News for a stock |
| GET | /api/news/sector/:sector | No | Sector news feed |
| GET | /api/news/portfolio | Yes | News for held stocks |
| GET | /api/news/velocity | No | Narrative velocity data |
| GET | /api/news/clusters | No | Narrative clusters |
| GET | /api/news/volume | No | News volume heatmap data |
| GET | /api/comparator | No | All broker charges |

---

## 🧠 Narrative Intelligence

- 📈 Earnings & Results
- 🏦 RBI & Monetary Policy
- 💰 FII/DII Activity
- 💻 IT Sector
- 🏧 Banking Sector
- ⚡ Crude & Energy
- 🚀 Market Rally/Crash
- 📋 IPO & Deals

Each theme clusters news articles by keyword matching, tracks lifecycle phases (emergence → acceleration → peak → decay), and calculates narrative strength scores.

---

## 📊 Key SQL Queries

```sql
-- Portfolio P&L per user
SELECT u.name, s.symbol, p.quantity,
       p.avg_buy_price, s.price,
       ((s.price - p.avg_buy_price) * p.quantity) AS pnl
FROM portfolio p
JOIN users u ON p.user_id = u.user_id
JOIN stocks s ON p.stock_id = s.stock_id;

-- Top traded stocks
SELECT s.symbol, COUNT(t.transaction_id) AS trades
FROM transactions t
JOIN stocks s ON t.stock_id = s.stock_id
GROUP BY s.symbol ORDER BY trades DESC LIMIT 5;

-- Sector investment summary
SELECT s.sector, SUM(p.quantity * p.avg_buy_price) AS invested
FROM portfolio p JOIN stocks s ON p.stock_id = s.stock_id
GROUP BY s.sector;
```

---

## 📈 Tracked Stocks (NSE)

`RELIANCE` `TCS` `INFY` `HDFCBANK` `ICICIBANK` `WIPRO` `MARUTI` `SUNPHARMA` `TATAMOTORS` `BAJFINANCE` `ADANIENT` `NTPC` `DRREDDY` `TECHM` `SBIN`

---

## ⚠️ Limitations

- Yahoo Finance scraper subject to rate limiting — realistic drift fallback activates automatically
- Live prices only update during NSE market hours (9:15 AM – 3:30 PM IST)
- News RSS feeds may return limited results outside business hours
- No real money involved — purely simulated trading

---

## 🎓 Academic Context

Built as a **Database Management Systems (DBMS) college project**. Demonstrates:
- Relational database design (3NF normalization)
- Complex SQL queries (JOINs, subqueries, GROUP BY, HAVING, VIEWs)
- ACID transactions
- Full stack web development
- REST API design
- Real-time data scraping

---

## 📄 License

MIT License — free to use for educational purposes.

---

<div align="center">
## 🔮 Roadmap & Upcoming Features

### V2 — In Progress
- [ ] WebSocket real-time price streaming (replace polling)
- [ ] Candlestick chart with TradingView Lightweight Charts
- [ ] Mobile responsive layout + PWA support
- [ ] Paper trading mode with virtual ₹1,00,000 starting balance
- [ ] Price alerts — notify when stock hits target price

### V3 — Planned
- [ ] Options & F&O order simulation
- [ ] AI-powered stock screener using news sentiment score
- [ ] SIP simulator for mutual funds
- [ ] Multi-user leaderboard (top portfolio performers)
- [ ] Export portfolio as PDF report

### Beyond
- [ ] Deploy to cloud (Railway + Vercel)
- [ ] Real broker API integration (Zerodha Kite Connect)
- [ ] Mobile app (React Native)
</div>
