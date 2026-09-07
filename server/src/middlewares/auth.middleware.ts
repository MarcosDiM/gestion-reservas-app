import type { NextFunction, Request, Response } from "express";
import { verificarToken } from "../config/auth.js";

export class NoAutorizadoError extends Error {
    readonly statusCode = 401;
    readonly code = "NO_AUTORIZADO";

    constructor() {
        super("Se requiere un token válido");
        this.name = "NoAutorizadoError";
    }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
    try {
        const authorization = req.headers.authorization;
        const [scheme, token] = authorization?.split(" ") ?? [];

        if (scheme !== "Bearer" || !token) {
            throw new NoAutorizadoError();
        }

        req.user = verificarToken(token);
        next();
    } catch (error) {
        next(error instanceof NoAutorizadoError ? error : new NoAutorizadoError());
    }
}