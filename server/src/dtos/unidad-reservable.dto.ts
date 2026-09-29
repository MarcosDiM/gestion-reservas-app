import { z } from "zod";


export const ObtenerUnidadesPorLista = z.object({
    id: z.number().int().nonnegative(),
    nombre: z.string(),
    tipo: z.string(),
    estado: z.string(),
    capacidad: z.number().int().nonnegative(),
});

export const CrearUnidadReservableSchema = z.object({
    complejoId: z.number().int().nonnegative(),
    nombre: z.string().trim().min(1, { message: "El nombre es obligatorio" }),
    tipo: z.string().trim().min(1, { message: "El tipo es obligatorio" }),
    capacidad: z.number().int().nonnegative({ message: "La capacidad debe ser un número no negativo" }),
});

export const ActualizarUnidadReservableSchema = z.object({
    nombre: z.string().trim().min(1, { message: "El nombre es obligatorio" }),
    tipo: z.string().trim().min(1, { message: "El tipo es obligatorio" }),
    capacidad: z.number().int().nonnegative({ message: "La capacidad debe ser un número no negativo" }),
});

export const ObtenerUnidadPorIdSchema = z.object({
    id: z.number().int().nonnegative(),
    nombre: z.string(),
    tipo: z.string(),
    estado: z.string(),
    capacidad: z.number().int().nonnegative(),
    reservas: z.array(z.object({
        id: z.number().int().nonnegative(),
        fechaInicio: z.string(),
        fechaFin: z.string(),
        usuarioId: z.number().int().nonnegative(),
    })),
});

export type ObtenerUnidadesPorListaDto = z.infer<typeof ObtenerUnidadesPorLista>;
export type CrearUnidadReservableDto = z.infer<typeof CrearUnidadReservableSchema>;
export type ActualizarUnidadReservableDto = z.infer<typeof ActualizarUnidadReservableSchema>;
export type ObtenerUnidadPorIdDto = z.infer<typeof ObtenerUnidadPorIdSchema>;