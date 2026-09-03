import prisma from "../config/prisma.js";
import type { Prisma } from "@prisma/client";

export class ReservaService {
    async obtenerReservas() {
        return await prisma.reserva.findMany({
            where: { eliminado: false },
            include: { unidadReservable: true, huespedes: true, pagos: true },
        });
    }

    async obtenerReservaPorId(id: number) {
        return await prisma.reserva.findFirst({
            where: { id, eliminado: false },
            include: { unidadReservable: true, huespedes: true, pagos: true },
        });
    }

    async crearReserva(data: Prisma.ReservaUncheckedCreateInput) {
        return await prisma.reserva.create({ data });
    }

    async actualizarReserva(id: number, data: Prisma.ReservaUncheckedUpdateInput) {
        return await prisma.reserva.update({ where: { id }, data });
    }

    async eliminarReserva(id: number) {
        return await prisma.reserva.update({ where: { id }, data: { eliminado: true } });
    }
}