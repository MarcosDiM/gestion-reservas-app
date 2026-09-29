import { EstadoUnidadReservable, type Prisma } from "@prisma/client";
import prisma from "../config/prisma.js";
import type { ActualizarUnidadReservableDto, CrearUnidadReservableDto, ObtenerUnidadesPorListaDto, ObtenerUnidadPorIdDto } from "../dtos/unidad-reservable.dto.js";
import { verificarAccesoComplejo, verificarPermisoModificacionComplejo } from "../middlewares/complejo.middleware.js";

export class UnidadReservableNoEncontradaError extends Error {
    readonly statusCode = 404;
    readonly code = "UNIDAD_RESERVABLE_NO_ENCONTRADA";

    constructor() {
        super("La unidad reservable no existe");
        this.name = "UnidadReservableNoEncontradaError";
    }
}

export class UnidadReservableService {
    async obtenerUnidadesReservables(complejoId: number, userId: number):Promise<ObtenerUnidadesPorListaDto[]> {
        await verificarAccesoComplejo(complejoId, userId);

        const unidades = await prisma.unidadReservable.findMany({
            where: { complejoId, eliminado: false },
            include: {
                complejo: true,
                reservas: true,
            },
        });
        return unidades;
    }

    async obtenerUnidadReservablePorId(unidadId: number, userId: number, complejoId: number): Promise<ObtenerUnidadPorIdDto> {
        await verificarAccesoComplejo(complejoId, userId);

        const unidad = await prisma.unidadReservable.findFirst({
            where: { id: unidadId, complejoId, eliminado: false },
            select: {
                id: true,
                nombre: true,
                tipo: true,
                estado: true,
                capacidad: true,
                reservas: {
                    where: { eliminado: false },
                    select: {
                        id: true,
                        fechaInicio: true,
                        fechaSalida: true,
                        usuarioCreadorId: true,
                    },
                },
            },
        });

        if (!unidad) {
            throw new UnidadReservableNoEncontradaError();
        }

        return {
            ...unidad,
            reservas: unidad.reservas.map((reserva) => ({
                id: reserva.id,
                fechaInicio: reserva.fechaInicio.toISOString(),
                fechaFin: reserva.fechaSalida.toISOString(),
                usuarioId: reserva.usuarioCreadorId,
            })),
        };
    }

    async crearUnidadReservable(data: CrearUnidadReservableDto, userId: number) {
        await verificarPermisoModificacionComplejo(data.complejoId, userId);
        return await prisma.unidadReservable.create({
            data: {
                nombre: data.nombre,
                eliminado: false,
                tipo: data.tipo,
                estado: EstadoUnidadReservable.DISPONIBLE,
                capacidad: data.capacidad,
                complejoId: data.complejoId,
                reservas: { create: [] },
                fechaCreacion: new Date(),
                usuarioCreadorId: userId,
            } });
    }

    async actualizarUnidadReservable(id: number, data: ActualizarUnidadReservableDto, userId: number, complejoId: number) {
        await verificarPermisoModificacionComplejo(complejoId, userId);

        const resultado = await prisma.unidadReservable.updateMany({
            where: { id, complejoId, eliminado: false },
            data: {
                nombre: data.nombre,
                tipo: data.tipo,
                capacidad: data.capacidad,
            },
        });

        if (resultado.count === 0) {
            throw new UnidadReservableNoEncontradaError();
        }

        const unidad = await prisma.unidadReservable.findFirst({
            where: { id, complejoId, eliminado: false },
        });

        if (!unidad) {
            throw new UnidadReservableNoEncontradaError();
        }

        return unidad;
    }

    async eliminarUnidadReservable(id: number, userId: number) {
        const unidad = await this.obtenerUnidadConComplejo(id);
        await verificarPermisoModificacionComplejo(unidad.complejoId, userId);

        return await prisma.unidadReservable.update({ where: { id }, data: { eliminado: true } });
    }

    async inhabilitarUnidadReservable(id: number, userId: number) {
        return await this.cambiarEstadoUnidadReservable(id, userId, EstadoUnidadReservable.INHABILITADO);
    }

    async habilitarUnidadReservable(id: number, userId: number) {
        return await this.cambiarEstadoUnidadReservable(id, userId, EstadoUnidadReservable.DISPONIBLE);
    }

    private async cambiarEstadoUnidadReservable(
        id: number,
        userId: number,
        estado: EstadoUnidadReservable,
    ) {
        const unidad = await this.obtenerUnidadConComplejo(id);
        await verificarPermisoModificacionComplejo(unidad.complejoId, userId);

        return await prisma.unidadReservable.update({
            where: { id },
            data: { estado },
        });
    }

    private async obtenerUnidadConComplejo(id: number) {
        const unidad = await prisma.unidadReservable.findUnique({
            where: { id },
            select: { id: true, complejoId: true },
        });

        if (!unidad) {
            throw new UnidadReservableNoEncontradaError();
        }

        return unidad;
    }
}