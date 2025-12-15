import express, { type Request, type Response } from "express";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.get("/v1/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/v1/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;

/*
GET v1/backlog -> List everything in backlog.
GET v1/backlog/:id -> Fetch the specific entry
POST v1/backlog -> Add new item to backlog
PUT v1/backlog -> add a new item with a specific ID
PATCH v1/backlog/:id -> update entry
DELETE v1/backlog/:id -> Delete entry
*/
