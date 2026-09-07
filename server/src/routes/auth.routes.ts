import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { AuthService } from "../services/auth.service.js";

const router = Router();
const authService = new AuthService();

router.post("/login", async (req, res, next) => {
    try {
        const { usuario, contrasena } = req.body as {
            usuario?: unknown;
            contrasena?: unknown;
        };

        if (typeof usuario !== "string" || typeof contrasena !== "string") {
            res.status(400).json({
                ok: false,
                code: "DATOS_INVALIDOS",
                message: "usuario y contrasena son obligatorios",
            });
            return;
        }

        res.status(200).json({ ok: true, ...(await authService.iniciarSesion(usuario, contrasena)) });
    } catch (error) {
        next(error);
    }
});

router.get("/me", requireAuth, (req, res) => {
    res.status(200).json({ ok: true, usuario: req.user });
});

export default router;