import "dotenv/config";
import express, { type Request, type Response } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import backlogRoutes from "./routes/backlogRoutes";
import healthRoutes from "./routes/healthRoutes";
import { authenticate } from "./middleware/auth";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json";

const app = express();
const PORT = Number(process.env.PORT) || 8001;

const secrets = process.env.ACCESS_SECRET && process.env.REFRESH_SECRET;

if (!secrets) {
  throw new Error(
    "Secrets needed for JWT is not set - Please make a .env file with the required secrets"
  );
}

app.use(cors({ origin: `localhost:${PORT}`, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.get("/v1/health", healthRoutes);

app.use("/v1/auth", authRoutes);
app.use("/v1/entries", backlogRoutes);

app.get("/v1/protected", authenticate, (req: Request, res: Response) => {
  res.json({ message: "You are authenticated", user: req.user });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/api-docs`);
});

export default app;
