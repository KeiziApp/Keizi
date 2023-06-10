import { Request, Response } from "express";

export default interface Route {
    path: string;
    method: string;
    handler: (req: Request, res: Response) => void;
}

type ResponseData = {
    statusCode: number,
    data: object
}

export function MakeResponse (res: Response, statusCode: number, data: object) {
    const response: ResponseData = {
        statusCode,
        data
    }

    res.status(statusCode).json(response);
}