-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "adSpend" TEXT,
ADD COLUMN     "clinicName" TEXT,
ADD COLUMN     "decisionMaker" TEXT,
ADD COLUMN     "enquiryHandler" TEXT,
ADD COLUMN     "goal" TEXT,
ADD COLUMN     "monthlyRevenue" TEXT,
ADD COLUMN     "slotAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Lead_slotAt_idx" ON "Lead"("slotAt");
