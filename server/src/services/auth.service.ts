import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";
import { crearToken } from "../config/auth.js";

export class CredencialesInvalidasError extends Error {
    readonly statusCode = 401;
    readonly code = "CREDENCIALES_INVALIDAS";

    constructor() {
        super("Usuario o contraseña inválidos");
        this.name = "CredencialesInvalidasError";
    }
}

export class AuthService {
    async iniciarSesion(usuario: string, contrasena: string) {
        const user = await prisma.usuario.findFirst({
            where: { usuario, eliminado: false },
        });

        if (!user || !(await bcrypt.compare(contrasena, user.contrasena))) {
            throw new CredencialesInvalidasError();
        }

        return {
            token: crearToken({ userId: user.id, usuario: user.usuario }),
            usuario: {
                id: user.id,
                nombre: user.nombre,
                usuario: user.usuario,
            },
        };
    }
}