import { NextFunction, Request, Response } from "express";
import ReqAuthenticate from "../protocols/ReqAuthenticate";
import ReqUser from "../protocols/ReqUser";
import * as userSchemas from "../schemas/userSchemas";

import * as userService from "../services/userService";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { error: joiError } = userSchemas.create.validate(req.body);
    if (joiError) throw joiError;

    const { email, password } = req.body as ReqUser;
    await userService.create({ email, password });
    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const { error: joiError } = userSchemas.signin.validate(req.body);
    if (joiError) throw joiError;

    const { email, password } = req.body as ReqAuthenticate;
    const authentication = await userService.authenticate({ email, password });
    
    res.send(authentication);
  } catch (err) {
    next(err);
  }
}
