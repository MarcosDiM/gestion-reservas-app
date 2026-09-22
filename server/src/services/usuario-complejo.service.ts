import { Rol } from "@prisma/client";
import prisma from "../config/prisma.js";
import { AccionNoAdmitidaError } from "./complejo.service.js";

export class UsuarioNoPerteneceAlComplejoError extends Error {
    readonly statusCode = 404;
    readonly code = "USUARIO_NO_PERTENECE_AL_COMPLEJO";

    constructor() {
        super("El usuario no pertenece a este complejo");
        this.name = "UsuarioNoPerteneceAlComplejoError";
    }
}

export class UsuarioComplejoService {
    async inhabilitarUsuario(complejoId: number, usuarioId: number, userId: number) {
        await this.validarPermisoDeModificacion(complejoId, userId);
        return await this.cambiarEstadoUsuario(complejoId, usuarioId, false);
    }

    async habilitarUsuario(complejoId: number, usuarioId: number, userId: number) {
        await this.validarPermisoDeModificacion(complejoId, userId);
        return await this.cambiarEstadoUsuario(complejoId, usuarioId, true);
    }

    private async cambiarEstadoUsuario(complejoId: number, usuarioId: number, activo: boolean) {
        const relacion = await prisma.usuarioComplejo.findUnique({
            where: {
                usuarioId_complejoId: { usuarioId, complejoId },
            },
            select: { id: true },
        });

        if (!relacion) {
            throw new UsuarioNoPerteneceAlComplejoError();
        }

        return await prisma.usuarioComplejo.update({
            where: { id: relacion.id },
            data: { activo },
        });
    }

    private async validarPermisoDeModificacion(complejoId: number, userId: number) {
        const complejoAutorizado = await prisma.complejo.findFirst({
            where: {
                id: complejoId,
                eliminado: false,
                usuarios: {
                    some: { usuarioId: userId, rol: Rol.ADMIN, activo: true },
                },
            },
            select: { id: true },
        });

        if (!complejoAutorizado) {
            throw new AccionNoAdmitidaError();
        }
    }
}