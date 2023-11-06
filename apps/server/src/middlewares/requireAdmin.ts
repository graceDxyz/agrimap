import { Request, Response, NextFunction } from "express";

const requiredAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;

  if (!user || user?.role != "ADMIN") {
    return res.sendStatus(403);
  }

  return next();
};

export default requiredAdmin;
