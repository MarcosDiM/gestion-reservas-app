import prisma from "../config/prisma.js";
import type { Prisma } from "@prisma/client";

export class PagoService {
    async obtenerPagos() {
        return await prisma.pago.findMany({
            include: { reserva: true, comprobantes: true },
        });
    }

    async obtenerPagoPorId(id: number) {
        return await prisma.pago.findUnique({
            where: { id },
            include: { reserva: true, comprobantes: true },
        });
    }

    async crearPago(data: Prisma.PagoUncheckedCreateInput) {
        return await prisma.pago.create({ data });
    }

    async actualizarPago(id: number, data: Prisma.PagoUncheckedUpdateInput) {
        return await prisma.pago.update({ where: { id }, data });
    }

    async eliminarPago(id: number) {
        return await prisma.pago.delete({ where: { id } });
    }
}