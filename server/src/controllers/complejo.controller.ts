import type { NextFunction, Request, Response } from "express";
import { ComplejoService } from "../services/complejo.service.js";
import { UsuarioComplejoService } from "../services/usuario-complejo.service.js";
import { ActualizarComplejoSchema, CrearComplejoSchema } from "../dtos/complejo.dto.js";

const complejoService = new ComplejoService();
const usuarioComplejoService = new UsuarioComplejoService();

function obtenerId(valor: string | string[] | undefined) {
    if (typeof valor !== "string" || !/^\d+$/.test(valor)) {
        return null;
    }

    const id = Number(valor);
    return id > 0 ? id : null;
}

export class ComplejoController {
    async listar(req: Request, res: Response, next: NextFunction) {
        try {
            const complejos = await complejoService.obtenerComplejosporUsuario(req.user.userId);
            res.status(200).json({ ok: true, complejos });
        } catch (error) {
            next(error);
        }
    }

    async obtenerPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const complejoId = obtenerId(req.params.id);
            if (!complejoId) {
                res.status(400).json({ ok: false, code: "ID_INVALIDO", message: "El id del complejo es inválido" });
                return;
            }

            const complejo = await complejoService.obtenerComplejoPorId(complejoId, req.user.userId);
            if (!complejo) {
                res.status(404).json({ ok: false, code: "COMPLEJO_NO_ENCONTRADO", message: "Complejo no encontrado" });
                return;
            }

            res.status(200).json({ ok: true, complejo });
        } catch (error) {
            next(error);
        }
    }

    async crear(req: Request, res: Response, next: NextFunction) {
        try {
            const resultado = CrearComplejoSchema.safeParse(req.body);
            if (!resultado.success) {
                res.status(400).json({
                    ok: false,
                    code: "DATOS_INVALIDOS",
                    message: resultado.error.issues[0]?.message ?? "Los datos del complejo son inválidos",
                });
                return;
            }

            const complejo = await complejoService.crearComplejo(resultado.data, req.user.userId);
            res.status(201).json({ ok: true, complejo });
        } catch (error) {
            next(error);
        }
    }

    async actualizar(req: Request, res: Response, next: NextFunction) {
        try {
            const complejoId = obtenerId(req.params.id);
            const resultado = ActualizarComplejoSchema.safeParse(req.body);
            if (!complejoId || !resultado.success) {
                res.status(400).json({ ok: false, code: "DATOS_INVALIDOS", message: "id y nombre son obligatorios y válidos" });
                return;
            }

            const complejo = await complejoService.actualizarComplejo(complejoId, req.user.userId, resultado.data);
            res.status(200).json({ ok: true, complejo });
        } catch (error) {
            next(error);
        }
    }

    async eliminar(req: Request, res: Response, next: NextFunction) {
        try {
            const complejoId = obtenerId(req.params.id);
            if (!complejoId) {
                res.status(400).json({ ok: false, code: "ID_INVALIDO", message: "El id del complejo es inválido" });
                return;
            }

            const complejo = await complejoService.eliminarComplejo(complejoId, req.user.userId);
            res.status(200).json({ ok: true, complejo });
        } catch (error) {
            next(error);
        }
    }

    async cambiarEstadoUsuario(req: Request, res: Response, next: NextFunction, activo: boolean) {
        try {
            const complejoId = obtenerId(req.params.id);
            const usuarioId = obtenerId(req.params.usuarioId);
            if (!complejoId || !usuarioId) {
                res.status(400).json({ ok: false, code: "ID_INVALIDO", message: "Los ids son inválidos" });
                return;
            }

            const relacion = activo
                ? await usuarioComplejoService.habilitarUsuario(complejoId, usuarioId, req.user.userId)
                : await usuarioComplejoService.inhabilitarUsuario(complejoId, usuarioId, req.user.userId);
            res.status(200).json({ ok: true, relacion });
        } catch (error) {
            next(error);
        }
    }

    async habilitarUsuario(req: Request, res: Response, next: NextFunction) {
        return this.cambiarEstadoUsuario(req, res, next, true);
    }

    async inhabilitarUsuario(req: Request, res: Response, next: NextFunction) {
        return this.cambiarEstadoUsuario(req, res, next, false);
    }
}

export default new ComplejoController();