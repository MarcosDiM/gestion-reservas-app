import prisma from "../config/prisma.js";
import type { Prisma } from "@prisma/client";

export class ComprobanteService {
    async obtenerComprobantes() {
        return await prisma.comprobante.findMany({
            where: { eliminado: false },
            include: { pago: true },
        });
    }

    async obtenerComprobantePorId(id: number) {
        return await prisma.comprobante.findFirst({
            where: { id, eliminado: false },
            include: { pago: true },
        });
    }

    async crearComprobante(data: Prisma.ComprobanteUncheckedCreateInput) {
        return await prisma.comprobante.create({ data });
    }

    async actualizarComprobante(id: number, data: Prisma.ComprobanteUncheckedUpdateInput) {
        return await prisma.comprobante.update({ where: { id }, data });
    }

    async eliminarComprobante(id: number) {
        return await prisma.comprobante.update({ where: { id }, data: { eliminado: true } });
    }
}