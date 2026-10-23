-- CreateTable
CREATE TABLE "ayurveda_leads" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "clinic" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "page_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ayurveda_leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ayurveda_leads_created_at_idx" ON "ayurveda_leads"("created_at" DESC);

-- CreateIndex
CREATE INDEX "ayurveda_leads_phone_idx" ON "ayurveda_leads"("phone");
