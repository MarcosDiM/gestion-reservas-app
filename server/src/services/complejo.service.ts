
import { Rol, type Prisma } from "@prisma/client";
import prisma from "../config/prisma.js";

export class AccionNoAdmitidaError extends Error {
    readonly statusCode = 403;
    readonly code = "ACCION_NO_ADMITIDA";

    constructor() {
        super("El usuario no tiene permisos para modificar este complejo");
        this.name = "AccionNoAdmitidaError";
    }
}

export class ComplejoService {
    async obtenerComplejosporUsuario(userId: number) {
        return await prisma.complejo.findMany({
            where: {
                eliminado: false,
                usuarios: {
                    some: { usuarioId: userId },
                },
            },
        });
    }

    async obtenerComplejoPorId(complejoId: number, userId: number) {
        return await prisma.complejo.findFirst({
            where: { 
                id: complejoId, eliminado: false,
            usuarios: {
                    some: { usuarioId: userId },
                }
            },
            include: { unidadReservable: true },
        });
    }

    async crearComplejo(data: Prisma.ComplejoCreateInput, userId: number) {
        return await prisma.complejo.create({
            data: {
                ...data,
                usuarios: {
                    create: {
                        usuario: { connect: { id: userId } },
                        propietario: true,
                        rol: Rol.ADMIN,
                    },
                },
            },
        });
    }

    async actualizarComplejo(complejoId: number, userId: number, data: Prisma.ComplejoUpdateInput) {
        await this.validarPermisoDeModificacion(complejoId, userId);

        return await prisma.complejo.update({ where: { id: complejoId }, data });
    }

    async eliminarComplejo(complejoId: number, userId: number) {
        await this.validarPermisoDeModificacion(complejoId, userId);

        return await prisma.complejo.update({
            where: { id: complejoId },
            data: { eliminado: true },
        });
    }

    private async validarPermisoDeModificacion(complejoId: number, userId: number) {
        const complejoAutorizado = await prisma.complejo.findFirst({
            where: {
                id: complejoId,
                eliminado: false,
                usuarios: {
                    some: { usuarioId: userId, rol: Rol.ADMIN },
                },
            },
            select: { id: true },
        });

        if (!complejoAutorizado) {
            throw new AccionNoAdmitidaError();
        }
    }
} 