import jwt from "jsonwebtoken";

export type AuthPayload = {
    userId: number;
    usuario: string;
};

function getJwtSecret() {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET no está definida. Revisa tu archivo .env");
    }

    return secret;
}

export function crearToken(payload: AuthPayload) {
    return jwt.sign(payload, getJwtSecret(), { expiresIn: "8h" });
}

export function verificarToken(token: string) {
    return jwt.verify(token, getJwtSecret()) as AuthPayload;
}