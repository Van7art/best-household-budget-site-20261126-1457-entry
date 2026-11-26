// Seed data for Envelope Budget — The Alvarez Family, November 2026.
// All figures in US dollars. Everything here is demo data stored locally;
// nothing leaves the browser.
window.BUDGET_SEED = {
  family: "The Alvarez Family",
  month: "November 2026",
  income: 5850,
  savingsGoal: 1470,
  envelopes: [
    { id: "rent",       name: "Rent",        icon: "⌂", assigned: 1800, spent: 1800, color: "#f4a259", note: "Due the 1st — paid in full" },
    { id: "groceries",  name: "Groceries",   icon: "◍", assigned: 650,  spent: 512,  color: "#2a9d8f", note: "Weekly shop at Market Fresh" },
    { id: "transport",  name: "Transport",   icon: "➤", assigned: 320,  spent: 278,  color: "#457b9d", note: "Fuel + bus passes" },
    { id: "utilities",  name: "Utilities",   icon: "⚡", assigned: 280,  spent: 241,  color: "#e9c46a", note: "Electric, water, internet" },
    { id: "dining",     name: "Dining Out",  icon: "✦", assigned: 240,  spent: 268,  color: "#e76f51", note: "Over budget — pizza night!" },
    { id: "fun",        name: "Fun Money",   icon: "♪", assigned: 180,  spent: 142,  color: "#9b5de5", note: "Movies, games, hobbies" },
    { id: "clothing",   name: "Clothing",    icon: "♡", assigned: 120,  spent: 96,   color: "#00b4d8", note: "Winter jackets for the kids" },
    { id: "household",  name: "Household",   icon: "▣", assigned: 150,  spent: 113,  color: "#6a994e", note: "Cleaning, repairs, bits" }
  ],
  transactions: [
    { id: 1,  date: "2026-11-01", desc: "Payday — Alvarez Design Studio", env: "income", amount: 3400 },
    { id: 2,  date: "2026-11-01", desc: "Rent — November", env: "rent", amount: -1800 },
    { id: 3,  date: "2026-11-02", desc: "Market Fresh — weekly groceries", env: "groceries", amount: -148 },
    { id: 4,  date: "2026-11-03", desc: "Shell — fuel", env: "transport", amount: -52 },
    { id: 5,  date: "2026-11-04", desc: "Electric bill — City Power", env: "utilities", amount: -132 },
    { id: 6,  date: "2026-11-05", desc: "Luigi's Pizzeria — family night", env: "dining", amount: -64 },
    { id: 7,  date: "2026-11-06", desc: "Cinema tickets — Saturday movie", env: "fun", amount: -38 },
    { id: 8,  date: "2026-11-07", desc: "Target — kids' winter jackets", env: "clothing", amount: -96 },
    { id: 9,  date: "2026-11-08", desc: "Internet — FiberLink monthly", env: "utilities", amount: -79 },
    { id: 10, date: "2026-11-09", desc: "Market Fresh — weekly groceries", env: "groceries", amount: -132 },
    { id: 11, date: "2026-11-10", desc: "Bus passes — Sofia & Marco", env: "transport", amount: -86 },
    { id: 12, date: "2026-11-11", desc: "Hardware store — faucet repair", env: "household", amount: -47 },
    { id: 13, date: "2026-11-12", desc: "Water bill — City Water", env: "utilities", amount: -30 },
    { id: 14, date: "2026-11-13", desc: "Sushi Bar — date night", env: "dining", amount: -58 },
    { id: 15, date: "2026-11-14", desc: "Payday — Alvarez Design Studio", env: "income", amount: 2450 },
    { id: 16, date: "2026-11-15", desc: "Market Fresh — weekly groceries", env: "groceries", amount: -121 },
    { id: 17, date: "2026-11-16", desc: "Shell — fuel", env: "transport", amount: -48 },
    { id: 18, date: "2026-11-17", desc: "Bookshop — Sofia's novels", env: "fun", amount: -34 },
    { id: 19, date: "2026-11-18", desc: "Car insurance — SafeDrive", env: "transport", amount: -92 },
    { id: 20, date: "2026-11-19", desc: "Pharmacy + cleaning supplies", env: "household", amount: -66 },
    { id: 21, date: "2026-11-20", desc: "Streaming — MovieBox monthly", env: "fun", amount: -16 },
    { id: 22, date: "2026-11-21", desc: "Taco truck — lunch with friends", env: "dining", amount: -42 },
    { id: 23, date: "2026-11-22", desc: "Market Fresh — weekly groceries", env: "groceries", amount: -111 },
    { id: 24, date: "2026-11-23", desc: "Board game night — Fun Money", env: "fun", amount: -54 },
    { id: 25, date: "2026-11-24", desc: "Burger joint — takeaway", env: "dining", amount: -104 },
    { id: 26, date: "2026-11-15", desc: "Phone bill — MobilePlus", env: "other", amount: -95 },
    { id: 27, date: "2026-11-18", desc: "Dentist copay — Marco", env: "other", amount: -180 },
    { id: 28, date: "2026-11-20", desc: "School lunches — November", env: "other", amount: -120 },
    { id: 29, date: "2026-11-22", desc: "Gym — FitLife monthly", env: "other", amount: -45 },
    { id: 30, date: "2026-11-23", desc: "Birthday gift — Grandma Rosa", env: "other", amount: -150 },
    { id: 31, date: "2026-11-25", desc: "Home insurance — monthly", env: "other", amount: -170 }
  ],
  bills: [
    { id: "b1", name: "Rent", amount: 1800, due: "2026-11-01", paid: true, autopay: true, cat: "Housing" },
    { id: "b2", name: "Electric — City Power", amount: 132, due: "2026-11-05", paid: true, autopay: true, cat: "Utilities" },
    { id: "b3", name: "Internet — FiberLink", amount: 79, due: "2026-11-08", paid: true, autopay: true, cat: "Utilities" },
    { id: "b4", name: "Water — City Water", amount: 64, due: "2026-11-12", paid: true, autopay: false, cat: "Utilities" },
    { id: "b5", name: "Phone — MobilePlus", amount: 95, due: "2026-11-15", paid: false, autopay: true, cat: "Utilities" },
    { id: "b6", name: "Car insurance — SafeDrive", amount: 148, due: "2026-11-18", paid: true, autopay: true, cat: "Transport" },
    { id: "b7", name: "Streaming — MovieBox", amount: 16, due: "2026-11-20", paid: true, autopay: true, cat: "Fun" },
    { id: "b8", name: "Gym — FitLife", amount: 45, due: "2026-11-22", paid: false, autopay: false, cat: "Health" },
    { id: "b9", name: "Rent", amount: 1800, due: "2026-12-01", paid: false, autopay: true, cat: "Housing" },
    { id: "b10", name: "Electric — City Power (est.)", amount: 140, due: "2026-12-05", paid: false, autopay: true, cat: "Utilities" },
    { id: "b11", name: "Internet — FiberLink", amount: 79, due: "2026-12-08", paid: false, autopay: true, cat: "Utilities" },
    { id: "b12", name: "Water — City Water (est.)", amount: 64, due: "2026-12-12", paid: false, autopay: false, cat: "Utilities" }
  ],
  // Month-over-month spending (Sep, Oct, Nov) for the trend chart.
  trend: [
    { month: "Sep", spent: 3980, income: 5850 },
    { month: "Oct", spent: 4120, income: 5850 },
    { month: "Nov", spent: 4210, income: 5850 }
  ],
  rollover: [
    { env: "Groceries", amount: 138, note: "Left over — rolls into December" },
    { env: "Transport", amount: 42, note: "Left over — rolls into December" },
    { env: "Utilities", amount: 39, note: "Left over — rolls into December" },
    { env: "Fun Money", amount: 38, note: "Left over — rolls into December" },
    { env: "Clothing", amount: 24, note: "Left over — rolls into December" },
    { env: "Household", amount: 37, note: "Left over — rolls into December" },
    { env: "Dining Out", amount: -28, note: "Over spent — covered from Fun Money" }
  ]
};
