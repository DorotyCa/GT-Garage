-- CreateTable
CREATE TABLE "utilizatori" (
    "id" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'client',
    "nume" TEXT,
    "prenume" TEXT,
    "email" TEXT NOT NULL,
    "telefon" TEXT,
    "adresa" TEXT,
    "oras" TEXT,
    "judet" TEXT,
    "dataInregistrarii" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "utilizatori_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicii" (
    "id" SERIAL NOT NULL,
    "categorie" TEXT NOT NULL,
    "denumire" TEXT NOT NULL,
    "descriere" TEXT,
    "durataEstimata" INTEGER NOT NULL,
    "pretMin" DECIMAL(65,30) NOT NULL,
    "pretMax" DECIMAL(65,30) NOT NULL,
    "activ" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "servicii_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "masini" (
    "id" SERIAL NOT NULL,
    "proprietarId" TEXT,
    "marca" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "anFabricatie" INTEGER,
    "combustibil" TEXT,
    "motorizare" TEXT,
    "putereCp" INTEGER,
    "transmisie" TEXT,
    "culoare" TEXT,
    "vin" TEXT,
    "numarInmatriculare" TEXT NOT NULL,
    "kilometraj" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "masini_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programari" (
    "id" SERIAL NOT NULL,
    "clientId" TEXT NOT NULL,
    "masinaId" INTEGER NOT NULL,
    "serviciuId" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "observatii" TEXT,
    "status" TEXT NOT NULL DEFAULT 'In asteptare',
    "dataCrearii" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "programari_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programari_blocate" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "oraStart" TIMESTAMP(3),
    "oraEnd" TIMESTAMP(3),
    "motiv" TEXT NOT NULL DEFAULT 'Service Inchis / Concediu',
    "dataCrearii" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "programari_blocate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facturi" (
    "id" SERIAL NOT NULL,
    "programareId" INTEGER,
    "serie" TEXT NOT NULL DEFAULT 'GTG',
    "numar" TEXT NOT NULL,
    "dataEmitere" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotalManopera" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "subtotalPiese" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "discount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "tva" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Neplatita',

    CONSTRAINT "facturi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "istoric_service" (
    "id" SERIAL NOT NULL,
    "masinaId" INTEGER NOT NULL,
    "programareId" INTEGER,
    "descriereReparatie" TEXT NOT NULL,
    "observatiiSuplimentare" TEXT,
    "kilometrajLaReparatie" INTEGER NOT NULL,
    "dataReparatie" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "istoric_service_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilizatori_email_key" ON "utilizatori"("email");

-- CreateIndex
CREATE UNIQUE INDEX "masini_vin_key" ON "masini"("vin");

-- CreateIndex
CREATE UNIQUE INDEX "facturi_programareId_key" ON "facturi"("programareId");

-- AddForeignKey
ALTER TABLE "masini" ADD CONSTRAINT "masini_proprietarId_fkey" FOREIGN KEY ("proprietarId") REFERENCES "utilizatori"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programari" ADD CONSTRAINT "programari_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "utilizatori"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programari" ADD CONSTRAINT "programari_masinaId_fkey" FOREIGN KEY ("masinaId") REFERENCES "masini"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programari" ADD CONSTRAINT "programari_serviciuId_fkey" FOREIGN KEY ("serviciuId") REFERENCES "servicii"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facturi" ADD CONSTRAINT "facturi_programareId_fkey" FOREIGN KEY ("programareId") REFERENCES "programari"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "istoric_service" ADD CONSTRAINT "istoric_service_masinaId_fkey" FOREIGN KEY ("masinaId") REFERENCES "masini"("id") ON DELETE CASCADE ON UPDATE CASCADE;
