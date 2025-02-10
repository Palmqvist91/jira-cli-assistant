import { Router } from "express";
import {
    homeController,
} from "@client/controllers/index.controller";

export const viewRouter = Router();
export const apiRouter = Router();

/* view */
viewRouter.get('/', homeController);