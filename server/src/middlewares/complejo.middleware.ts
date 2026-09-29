import { Rol } from "@prisma/client";
import prisma from "../config/prisma.js";

export class AccesoComplejoNoAutorizadoError extends Error {
    readonly statusCode = 403;
    readonly code = "ACCESO_COMPLEJO_NO_AUTORIZADO";

    constructor() {
        super("El usuario no tiene acceso a este complejo");
        this.name = "AccesoComplejoNoAutorizadoError";
    }
}

export class AccionNoAdmitidaError extends Error {
    readonly statusCode = 403;
    readonly code = "ACCION_NO_ADMITIDA";

    constructor() {
        super("El usuario no tiene permisos para modificar este complejo");
        this.name = "AccionNoAdmitidaError";
    }
}

export async function verificarAccesoComplejo(complejoId: number, userId: number): Promise<void> {
    const complejoAutorizado = await prisma.complejo.findFirst({
        where: {
            id: complejoId,
            eliminado: false,
            usuarios: {
                some: { usuarioId: userId, activo: true },
            },
        },
        select: { id: true },
    });

    if (!complejoAutorizado) {
        throw new AccesoComplejoNoAutorizadoError();
    }
}

export async function verificarPermisoModificacionComplejo(complejoId: number, userId: number): Promise<void> {
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