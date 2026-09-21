import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import complejoController from "../controllers/complejo.controller.js";

const router = Router();

router.use(requireAuth);
router.get("/", complejoController.listar);
router.get("/:id", complejoController.obtenerPorId);
router.post("/", complejoController.crear);
router.put("/:id", complejoController.actualizar);
router.delete("/:id", complejoController.eliminar);
router.patch("/:id/usuarios/:usuarioId/habilitar", complejoController.habilitarUsuario);
router.patch("/:id/usuarios/:usuarioId/inhabilitar", complejoController.inhabilitarUsuario);

export default router;