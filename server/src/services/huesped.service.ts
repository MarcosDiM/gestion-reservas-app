import prisma from "../config/prisma.js";

export interface HuespedInput {
    nombre: string;
    apellido: string;
    procedencia: string;
    mail: string;
    telefono: string;
    descripcion: string;
    dni?: string | null;
}

export class HuespedService {
    async obtenerHuespedes() {
        return await prisma.huesped.findMany();
    }

    async obtenerHuespedPorId(id: number) {
        return await prisma.huesped.findUnique({
            where: { id },
            include: { reservas: true }, 
        });
    }

    async crearHuesped(data: HuespedInput) {
        return await prisma.huesped.create({
            data,
        });
    }

    async actualizarHuesped(id: number, data: Partial<HuespedInput>) {
        return await prisma.huesped.update({
            where: { id },
            data,
        });
    }

    async eliminarHuesped(id: number) {
        return await prisma.huesped.delete({
            where: { id },
        });
    }
}