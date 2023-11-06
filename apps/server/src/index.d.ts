import { IUser } from "./models/user.model";

declare global {
  namespace Express {
    interface Locals {
      user: (Partial<IUser> & { sub: string }) | undefined;
    }
  }
}
