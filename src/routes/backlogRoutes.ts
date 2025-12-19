import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  createEntry,
  deleteEntry,
  getById,
  listEntries,
  updateEntry,
} from "../controllers/backlogController";
import { normalizeType } from "../middleware/normalizeType";
import { validateEntry } from "../middleware/validateEntry";
import { CreateEntrySchema } from "../schemas/entrySchema";

const router = Router();

// All backlog endpoints should be protected
router.use(authenticate);

router.get("/", listEntries);

router.get("/:id", getById);

router.post("/", normalizeType, validateEntry(CreateEntrySchema), createEntry);

router.patch("/:id", updateEntry);

router.delete("/:id", deleteEntry);

export default router;
