import prisma from "../config/prisma.js";
import type { Prisma } from "@prisma/client";

export class ReservaHuespedService {
    async obtenerReservasHuespedes() {
        return await prisma.reservaHuesped.findMany({
            include: { reserva: true, huesped: true },
        });
    }

    async obtenerReservaHuespedPorId(id: number) {
        return await prisma.reservaHuesped.findUnique({
            where: { id },
            include: { reserva: true, huesped: true },
        });
    }

    async crearReservaHuesped(data: Prisma.ReservaHuespedUncheckedCreateInput) {
        return await prisma.reservaHuesped.create({ data });
    }

    async actualizarReservaHuesped(id: number, data: Prisma.ReservaHuespedUncheckedUpdateInput) {
        return await prisma.reservaHuesped.update({ where: { id }, data });
    }

    async eliminarReservaHuesped(id: number) {
        return await prisma.reservaHuesped.delete({ where: { id } });
    }
}