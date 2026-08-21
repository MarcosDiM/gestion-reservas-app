-- CreateEnum
CREATE TYPE "TipoPago" AS ENUM ('SEÑA', 'PAGO_FINAL', 'REEMBOLSO');

-- CreateEnum
CREATE TYPE "Moneda" AS ENUM ('ARS', 'USD', 'EUR', 'BRL', 'PESO');

-- CreateTable
CREATE TABLE "Complejo" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Complejo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnidadReservable" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "complejoId" INTEGER NOT NULL,

    CONSTRAINT "UnidadReservable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reserva" (
    "id" SERIAL NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaSalida" TIMESTAMP(3) NOT NULL,
    "cantidadPersonas" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "plataformaProveniente" TEXT NOT NULL,
    "aclaracion" TEXT NOT NULL,
    "tarifa" DECIMAL(65,30) NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL,
    "unidadReservableId" INTEGER NOT NULL,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Huesped" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "procedencia" TEXT NOT NULL,
    "mail" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "dni" TEXT,

    CONSTRAINT "Huesped_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReservaHuesped" (
    "id" SERIAL NOT NULL,
    "esTitular" BOOLEAN NOT NULL,
    "reservaId" INTEGER NOT NULL,
    "huespedId" INTEGER NOT NULL,

    CONSTRAINT "ReservaHuesped_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "mailOUsuario" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "rol" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" SERIAL NOT NULL,
    "tipoPago" "TipoPago" NOT NULL,
    "monto" DECIMAL(65,30) NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "reservaId" INTEGER NOT NULL,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comprobante" (
    "id" SERIAL NOT NULL,
    "tipoPago" "TipoPago" NOT NULL,
    "archivo" TEXT NOT NULL,
    "monto" DECIMAL(65,30) NOT NULL,
    "moneda" "Moneda" NOT NULL,
    "pagoId" INTEGER NOT NULL,

    CONSTRAINT "Comprobante_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_mailOUsuario_key" ON "Usuario"("mailOUsuario");

-- AddForeignKey
ALTER TABLE "UnidadReservable" ADD CONSTRAINT "UnidadReservable_complejoId_fkey" FOREIGN KEY ("complejoId") REFERENCES "Complejo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_unidadReservableId_fkey" FOREIGN KEY ("unidadReservableId") REFERENCES "UnidadReservable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaHuesped" ADD CONSTRAINT "ReservaHuesped_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "Reserva"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaHuesped" ADD CONSTRAINT "ReservaHuesped_huespedId_fkey" FOREIGN KEY ("huespedId") REFERENCES "Huesped"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "Reserva"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comprobante" ADD CONSTRAINT "Comprobante_pagoId_fkey" FOREIGN KEY ("pagoId") REFERENCES "Pago"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
