import prisma from "../config/prisma.js";
import type { Prisma } from "@prisma/client";

export class UsuarioService {
    async obtenerUsuarios() {
        return await prisma.usuario.findMany();
    }

    async obtenerUsuarioPorId(id: number) {
        return await prisma.usuario.findUnique({ where: { id } });
    }

    async crearUsuario(data: Prisma.UsuarioCreateInput) {
        return await prisma.usuario.create({ data });
    }

    async actualizarUsuario(id: number, data: Prisma.UsuarioUpdateInput) {
        return await prisma.usuario.update({ where: { id }, data });
    }

    async eliminarUsuario(id: number) {
        return await prisma.usuario.delete({ where: { id } });
    }
}