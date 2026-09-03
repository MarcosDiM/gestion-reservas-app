import prisma from "../config/prisma.js";
import type { Prisma } from "@prisma/client";

export class UnidadReservableService {
    async obtenerUnidadesReservables() {
        return await prisma.unidadReservable.findMany({
            where: { eliminado: false },
            include: { complejo: true, reservas: true },
        });
    }

    async obtenerUnidadReservablePorId(id: number) {
        return await prisma.unidadReservable.findFirst({
            where: { id, eliminado: false },
            include: { complejo: true, reservas: true },
        });
    }

    async crearUnidadReservable(data: Prisma.UnidadReservableUncheckedCreateInput) {
        return await prisma.unidadReservable.create({ data });
    }

    async actualizarUnidadReservable(id: number, data: Prisma.UnidadReservableUncheckedUpdateInput) {
        return await prisma.unidadReservable.update({ where: { id }, data });
    }

    async eliminarUnidadReservable(id: number) {
        return await prisma.unidadReservable.update({ where: { id }, data: { eliminado: true } });
    }
}