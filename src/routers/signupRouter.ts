import { Router } from "express";
import * as userController from "../controllers/userConroller";

const signupRouter = Router();

signupRouter.post("/", userController.create)

export default signupRouter;
