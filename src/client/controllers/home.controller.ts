import { Request, Response } from 'express';

export const homeController = async (_req: Request, res: Response) => {
    try {
        res.render("home", { layout: 'main' });
    } catch (error: any) {
        console.debug(error);
        res.status(error.status).json({ error: error.message });
    }
};