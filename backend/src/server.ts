import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  console.log("==================================");
  console.log("🚀 PES Tamilans Auction API");
  console.log(`🌐 Server running at http://localhost:${PORT}`);
  console.log("==================================");
});