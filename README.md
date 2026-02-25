# 🌍 WanderWise — AI-Powered Student Travel Planner

A full-stack Next.js web app that generates **AI-powered, budget-optimized travel itineraries** for students. Plan smarter, spend less, explore more.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🧠 **AI Itinerary Engine** | Day-wise schedules with time blocks, costs & backup plans via Google Gemini |
| 💰 **Budget Optimizer** | Smart allocation across transport, stay, food & activities |
| 🎓 **Student Discounts** | Auto-detect railway concessions, museum deals, hostel discounts |
| 🗺️ **Route Visualization** | Google Maps embed with transit directions |
| 👥 **Expense Splitter** | Track group expenses & calculate minimum settlements |
| 📋 **PDF Export** | Download your complete itinerary as a PDF |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/viegz11/WanderWise.git
cd WanderWise
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/
│   ├── page.js                  # Landing page
│   ├── plan/page.js             # Multi-step trip planning form
│   ├── itinerary/page.js        # AI-generated results display
│   ├── split/page.js            # Group expense splitter
│   ├── components/              # Navbar, Footer
│   └── api/
│       ├── generate-itinerary/  # Gemini AI integration
│       └── split-expenses/      # Settlement calculator
├── lib/
│   ├── budgetOptimizer.js       # Budget allocation engine
│   ├── discountFinder.js        # Student discount database
│   └── expenseSplitter.js       # Min-transactions algorithm
└── globals.css                  # Dark-mode design system
```

## 🎯 How It Works

1. **Tell Us Your Vibe** — Enter budget, duration, location, interests & group size
2. **AI Does the Magic** — Gemini generates an optimized day-wise itinerary
3. **Go Explore!** — View route map, cost breakdown, student discounts & export as PDF

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **AI:** Google Gemini 1.5 Flash
- **Styling:** Vanilla CSS with custom dark-mode design system
- **Maps:** Google Maps Embed API

## 📄 License

MIT License — feel free to use and modify.

---

Built with ❤️ for students who love to travel.
