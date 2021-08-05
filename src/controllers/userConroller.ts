import { NextFunction, Request, Response } from "express";
import ReqUser from "../protocols/ReqUser";
import userSchema from "../schemas/userSchema";

import * as userService from "../services/userService";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { error: joiError } = userSchema.validate(req.body);
    if (joiError) throw joiError;

    const { email, password } = req.body as ReqUser;
    await userService.create({ email, password });
    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
}
