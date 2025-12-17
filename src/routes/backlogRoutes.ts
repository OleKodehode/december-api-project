import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { listEntries } from "../controllers/backlogController";

const router = Router();

// All backlog endpoints should be protected
router.use(authenticate);

router.get("/", listEntries);

// POST, PATCH, DELETE later.

export default router;
