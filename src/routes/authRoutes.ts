import "dotenv/config";
import { Router } from "express";
import {
  handleLogin,
  handleRefresh,
  handleLogout,
} from "../controllers/authController";

const router = Router();

router.post("/login", handleLogin);

router.get("/refresh", handleRefresh);

router.post("/logout", handleLogout);

export default router;
