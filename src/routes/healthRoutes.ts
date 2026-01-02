import { Router, type Response, type Request } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;
