import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export const validateEntry = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation of entry failed",
        errors: result.error,
      });
    }

    // Attach cleaned data from Zod to the req body.
    req.body = result.data;
    next();
  };
};
