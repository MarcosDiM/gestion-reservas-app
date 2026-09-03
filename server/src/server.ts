import "dotenv/config";
import express from "express";
import cors from "cors";
import seedRoutes from "./routes/seed.routes.js";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true, message: "Servidor activo" });
});

app.use("/api", seedRoutes);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});