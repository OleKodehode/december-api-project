import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { createEntry, listEntries } from "../controllers/backlogController";

const router = Router();

// All backlog endpoints should be protected
router.use(authenticate);

router.get("/", listEntries);

router.post("/", createEntry);

// POST, PATCH, DELETE later.

export default router;
