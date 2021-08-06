import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import Session from "../entities/Session";
import jwt from "jsonwebtoken";
import User from "../entities/User";

export default async function auth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authorization = req.headers["authorization"];
    const token = authorization.split("Bearer ")[1];

    const key = process.env.JWT_SECRET;
    let sessionId;
    try {
      const data = jwt.verify(token, key) as { sessionId: number };
      sessionId = data.sessionId;
    } catch (err) {
      return res.status(401).send("invalid token");
    }

    const sessionRepository = getRepository(Session);
    const session = await sessionRepository.findOne({ id:sessionId });

    if (!session) {
      return res.sendStatus(401);
    }

    const userRepository = getRepository(User);
    const user = await userRepository
      .createQueryBuilder("user")
      .leftJoin("user.sessions", "session")
      .where("session.id = :sessionId",{sessionId:sessionId})
      .getOne();

    if(!user){
      return res.sendStatus(500);
    }

    res.locals.user = user;

    next();
    
  } catch (err) {
    next(err);
  }
}
