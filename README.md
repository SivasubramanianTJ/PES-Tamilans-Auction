# 🏏 PES Tamilans Auction

A modern IPL-style player auction platform built with a scalable full-stack architecture.

This project aims to digitize the complete player auction process with real-time bidding, team management, player management, retention, RTM, and live auction capabilities.

---

## ✨ Features

### ✅ Completed

- JWT Authentication
- User Login
- Protected Routes
- Team Creation
- Active Season Management
- Prisma ORM Integration
- PostgreSQL Database
- Bruno API Collection

### 🚧 In Progress

- Player Module
- Player Categories
- Team Dashboard

### 📅 Planned

- Live Auction
- Socket.IO Real-Time Bidding
- Retention
- Right To Match (RTM)
- Auction Timer
- Admin Dashboard
- Statistics Dashboard

---

# 🛠 Tech Stack

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Zod Validation

## Development Tools

- Git
- GitHub
- Bruno
- Prisma Studio
- VS Code

---

# 📂 Project Structure

```text
PES-Tamilans-Auction/
│
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── modules/
│   │   ├── routes/
│   │   ├── sockets/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
│
├── frontend/              # Coming Soon
│
├── docs/
│   └── bruno/
│
├── database/
│
├── deployment/
│
└── README.md
```

---

# 🚀 Getting Started

## Clone the Repository

```bash
git clone git@github.com:SivasubramanianTJ/PES-Tamilans-Auction.git
```

## Go to Backend

```bash
cd PES-Tamilans-Auction/backend
```

## Install Dependencies

```bash
npm install
```

## Configure Environment Variables

Create a `.env` file inside the `backend` folder.

Example:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
PORT=4000
```

## Generate Prisma Client

```bash
npx prisma generate
```

## Run Database Migrations

```bash
npx prisma migrate dev
```

## Start Development Server

```bash
npm run dev
```

---

# 🧪 API Testing

Bruno API collection is available at:

```text
docs/bruno/
```

Import the collection into Bruno and start testing the APIs.

---

# 📌 Project Roadmap

- [x] Project Setup
- [x] Authentication Module
- [x] Team Module
- [ ] Player Module
- [ ] Season Module
- [ ] Retention Module
- [ ] RTM Module
- [ ] Auction Engine
- [ ] Live Bidding
- [ ] Dashboard
- [ ] Frontend
- [ ] Deployment

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

Please open an issue or submit a pull request.

---

# 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Sivasubramanian TJ**

GitHub: https://github.com/SivasubramanianTJ