import "dotenv/config";
import express, { type Request, type Response } from "express";
import authRoutes from "./routes/authRoutes";
import backlogRoutes from "./routes/backlogRoutes";
import { authenticate } from "./middleware/auth";

const app = express();
const PORT = Number(process.env.PORT) || 8001;

const secrets = process.env.ACCESS_SECRET && process.env.REFRESH_SECRET;

if (!secrets) {
  throw new Error(
    "Secrets needed for JWT is not set - Please make a .env file with the required secrets"
  );
}

app.use(express.json());

app.get("/v1/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/v1/auth", authRoutes);
app.use("/v1/entries", backlogRoutes);

app.get("/v1/protected", authenticate, (req: Request, res: Response) => {
  res.json({ message: "You are authenticated", user: req.user });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;

/*
GET v1/backlog -> List everything in backlog.
GET v1/backlog/:id -> Fetch the specific entry
POST v1/backlog -> Add new item to backlog
PATCH v1/backlog/:id -> update entry
DELETE v1/backlog/:id -> Delete entry
*/
