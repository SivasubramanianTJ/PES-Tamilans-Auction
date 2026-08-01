import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/routes/auth.routes";

import teamRoutes from "./modules/teams/routes/team.routes";

import seasonRoutes from "./modules/seasons/routes/season.routes";

import playerRoutes from "./modules/players/routes/player.routes";

import seasonPlayerRoutes from "./modules/seasonPlayers/routes/seasonPlayer.routes";

import auctionRoutes from "./modules/auction/routes/auction.routes";

import liveAuctionRoutes from "./modules/liveAuction/routes/liveAuction.routes";

import path from "path";
import { fileURLToPath } from "url";

import analyticsRoutes from "./modules/analytics/routes/analytics.routes";

import exportRoutes from "./modules/export/routes/export.routes";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/analytics", analyticsRoutes);
app.use("/api/export", exportRoutes);

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to PES Tamilans Auction API 🚀",
    version: "1.0.0",
  });
});

app.use(express.static(path.join(__dirname, "../public")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/seasons", seasonRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/season-players", seasonPlayerRoutes);
app.use("/api/auction", auctionRoutes);
app.use("/api/live-auction", liveAuctionRoutes);

import multer from "multer";

const upload = multer({ dest: "uploads/" });

app.post(
  "/upload-test",
  upload.single("file"),
  (req, res) => {
    console.log(req.file);
    res.json(req.file);
  }
);

export default app;