
import { Rol } from "@prisma/client";
import prisma from "../config/prisma.js";
import type { ActualizarComplejoDto, CrearComplejoDto, ObtenerListaComplejosDto } from "../dtos/complejo.dto.js";
import { verificarPermisoModificacionComplejo } from "../middlewares/complejo.middleware.js";

export class ComplejoService {
    async obtenerComplejosporUsuario(userId: number): Promise<ObtenerListaComplejosDto[]> {
        const complejos = await prisma.complejo.findMany({
            where: {
                eliminado: false,
                usuarios: {
                    some: { usuarioId: userId, activo: true },
                },
            },
            select: {
                nombre: true,
                _count: {
                    select: {
                        unidadReservable: { where: { eliminado: false } },
                    },
                },
            },
        });

        return complejos.map(({ nombre, _count }) => ({
            nombre,
            unidades: _count.unidadReservable,
        }));
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
        await verificarPermisoModificacionComplejo(complejoId, userId);

        return await prisma.complejo.update({
            where: { id: complejoId },
            data: { nombre: datos.nombre },
        });
    }

    async eliminarComplejo(complejoId: number, userId: number) {
        await verificarPermisoModificacionComplejo(complejoId, userId);

        return await prisma.complejo.update({
            where: { id: complejoId },
            data: { eliminado: true },
        });
    }
} 