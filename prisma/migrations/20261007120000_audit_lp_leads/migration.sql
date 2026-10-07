-- CreateEnum
CREATE TYPE "LeadPaymentStatus" AS ENUM ('pending', 'checkout', 'paid', 'failed');

-- CreateTable
CREATE TABLE "audit_lp_leads" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "iso" TEXT NOT NULL DEFAULT 'IN',
    "page_url" TEXT,
    "payment_status" "LeadPaymentStatus" NOT NULL DEFAULT 'pending',
    "razorpay_order_id" TEXT,
    "razorpay_payment_id" TEXT,
    "amount_paise" INTEGER,
    "payment_method" TEXT,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audit_lp_leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "audit_lp_leads_razorpay_order_id_key" ON "audit_lp_leads"("razorpay_order_id");

-- CreateIndex
CREATE INDEX "audit_lp_leads_created_at_idx" ON "audit_lp_leads"("created_at" DESC);

-- CreateIndex
CREATE INDEX "audit_lp_leads_phone_idx" ON "audit_lp_leads"("phone");
