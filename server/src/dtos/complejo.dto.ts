import { z } from "zod";

export const CrearComplejoSchema = z.object({
    nombre: z.string().trim().min(1, { message: "El nombre es obligatorio" }),
});

export const ObtenerListaComplejosSchema = z.object({
    nombre: z.string(),
    unidades: z.number().int().nonnegative(),
});

export const ActualizarComplejoSchema = CrearComplejoSchema;

export type CrearComplejoDto = z.infer<typeof CrearComplejoSchema>;
export type ActualizarComplejoDto = z.infer<typeof ActualizarComplejoSchema>;
export type ObtenerListaComplejosDto = z.infer<typeof ObtenerListaComplejosSchema>;