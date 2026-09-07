import type { AuthPayload } from "../config/auth.js";

declare global {
    namespace Express {
        interface Request {
            user: AuthPayload;
        }
    }
}

export {};