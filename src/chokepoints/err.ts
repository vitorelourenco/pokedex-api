import { Request, Response, NextFunction } from "express";
import { ValidationError } from "joi";
import { DeepValidationError } from "../protocols/DeepValidationError";

export default function err(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {

  if(err instanceof DeepValidationError){
    res.status(err.code);
  } else if(err instanceof ValidationError) {
    res.status(400);
  } else {
    res.status(500);
  }

  res.send(err.message);
}
