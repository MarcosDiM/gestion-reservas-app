
import { Rol } from "@prisma/client";
import prisma from "../config/prisma.js";
import type { ActualizarComplejoDto, CrearComplejoDto } from "../dtos/complejo.dto.js";

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
                    some: { usuarioId: userId, activo: true },
                },
            },
        });
    }

    async obtenerComplejoPorId(complejoId: number, userId: number) {
        return await prisma.complejo.findFirst({
            where: { 
                id: complejoId, eliminado: false,
            usuarios: {
                    some: { usuarioId: userId, activo: true },
                }
            },
            include: { unidadReservable: true },
        });
    }

    async crearComplejo(datos: CrearComplejoDto, userId: number) {
        return await prisma.complejo.create({
            data: {
                nombre: datos.nombre,
                fechaCreacion: new Date(),
                usuarioCreadorId: userId,
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

    async actualizarComplejo(complejoId: number, userId: number, datos: ActualizarComplejoDto) {
        await this.validarPermisoDeModificacion(complejoId, userId);

        return await prisma.complejo.update({
            where: { id: complejoId },
            data: { nombre: datos.nombre },
        });
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