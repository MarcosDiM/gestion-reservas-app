import "dotenv/config";
import express from "express";
import cors from "cors";
import seedRoutes from "./routes/seed.routes.js";
import authRoutes from "./routes/auth.routes.js";
import runSeed from "./seed.js";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true, message: "Servidor activo" });
});

app.use("/api/auth", authRoutes);
app.use("/api", seedRoutes);

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const statusCode = typeof error === "object" && error !== null && "statusCode" in error
        && typeof error.statusCode === "number"
        ? error.statusCode
        : 500;
    const code = typeof error === "object" && error !== null && "code" in error
        && typeof error.code === "string"
        ? error.code
        : "ERROR_INTERNO";
    const message = error instanceof Error ? error.message : "Error interno del servidor";

    res.status(statusCode).json({ ok: false, code, message });
});

async function startServer() {
    await runSeed();

    app.listen(PORT, () => {
        console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
}

startServer().catch((error) => {
    console.error("No se pudo iniciar el servidor:", error);
    process.exit(1);
});