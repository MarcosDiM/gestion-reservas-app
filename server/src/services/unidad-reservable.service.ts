import { EstadoUnidadReservable, Rol, type Prisma } from "@prisma/client";
import prisma from "../config/prisma.js";

export class AccesoComplejoNoAutorizadoError extends Error {
    readonly statusCode = 403;
    readonly code = "ACCESO_COMPLEJO_NO_AUTORIZADO";

    constructor() {
        super("El usuario no tiene acceso a este complejo");
        this.name = "AccesoComplejoNoAutorizadoError";
    }
}

export class UnidadReservableNoEncontradaError extends Error {
    readonly statusCode = 404;
    readonly code = "UNIDAD_RESERVABLE_NO_ENCONTRADA";

    constructor() {
        super("La unidad reservable no existe");
        this.name = "UnidadReservableNoEncontradaError";
    }
}

export class UnidadReservableService {
    async obtenerUnidadesReservables(complejoId: number, userId: number) {
        await this.validarAccesoAlComplejo(complejoId, userId);

        return await prisma.unidadReservable.findMany({
            where: { complejoId, eliminado: false },
            include: { complejo: true, reservas: true },
        });
    }

    async obtenerUnidadReservablePorId(unidadId: number, userId: number) {
        const unidad = await this.obtenerUnidadConComplejo(unidadId);
        await this.validarAccesoAlComplejo(unidad.complejoId, userId);

        return await prisma.unidadReservable.findFirst({
            where: { id: unidadId, eliminado: false },
            include: { complejo: true, reservas: true },
        });
    }

    async crearUnidadReservable(data: Prisma.UnidadReservableUncheckedCreateInput, userId: number) {
        await this.validarPermisoDeModificacion(data.complejoId, userId);
        return await prisma.unidadReservable.create({ data });
    }

    async actualizarUnidadReservable(id: number, data: Prisma.UnidadReservableUncheckedUpdateInput, userId: number) {
        const unidad = await this.obtenerUnidadConComplejo(id);
        await this.validarPermisoDeModificacion(unidad.complejoId, userId);

        return await prisma.unidadReservable.update({ where: { id }, data });
    }

    async eliminarUnidadReservable(id: number, userId: number) {
        const unidad = await this.obtenerUnidadConComplejo(id);
        await this.validarPermisoDeModificacion(unidad.complejoId, userId);

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
        await this.validarPermisoDeModificacion(unidad.complejoId, userId);

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

    private async validarAccesoAlComplejo(complejoId: number, userId: number) {
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
            throw new AccesoComplejoNoAutorizadoError();
        }
    }
}