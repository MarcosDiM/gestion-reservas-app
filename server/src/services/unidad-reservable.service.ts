import prisma from "../config/prisma.js";
import type { Prisma } from "@prisma/client";

export class UnidadReservableService {
    async obtenerUnidadesReservables() {
        return await prisma.unidadReservable.findMany({
            include: { complejo: true, reservas: true },
        });
    }

    async obtenerUnidadReservablePorId(id: number) {
        return await prisma.unidadReservable.findUnique({
            where: { id },
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
        return await prisma.unidadReservable.delete({ where: { id } });
    }
}