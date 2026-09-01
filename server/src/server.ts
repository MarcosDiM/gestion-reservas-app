import { ComplejoService } from "./services/complejo.service.js";

const complejoService = new ComplejoService();

(async () => {
    try {
        // 2. Obtenerlo una vez creado
        const complejo = await complejoService.obtenerComplejoPorId(1);

        console.log("Complejo obtenido:", complejo);
    } catch (error) {
        console.error("Error al operar con el complejo:", error);
    }
})();