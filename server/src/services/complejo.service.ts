
import type { Prisma } from "@prisma/client";
import prisma from "../config/prisma.js";

export class ComplejoService {
    async obtenerComplejos() {
        return await prisma.complejo.findMany({
            where: { eliminado: false },
            include: { unidadReservable: true },
        });
    }

    async obtenerComplejoPorId(id: number) {
        return await prisma.complejo.findFirst({
            where: { id, eliminado: false },
            include: { unidadReservable: true },
        });
    }

    async crearComplejo(data: Prisma.ComplejoCreateInput) {
        return await prisma.complejo.create({ data });
    }

    async actualizarComplejo(id: number, data: Prisma.ComplejoUpdateInput) {
        return await prisma.complejo.update({ where: { id }, data });
    }

    async eliminarComplejo(id: number) {
        return await prisma.complejo.update({ where: { id }, data: { eliminado: true } });
    }
}