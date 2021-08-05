import { Router } from "express";
import * as userController from "../controllers/userConroller";

const signinRouter = Router();

signinRouter.post("/", userController.authenticate)

export default signinRouter;