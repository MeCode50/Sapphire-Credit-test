/*
  Warnings:

  - You are about to drop the `cluster` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mbe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `region` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `store` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "store" DROP CONSTRAINT "store_cluster_id_fkey";

-- DropForeignKey
ALTER TABLE "store" DROP CONSTRAINT "store_company_id_fkey";

-- DropForeignKey
ALTER TABLE "store" DROP CONSTRAINT "store_region_id_fkey";

-- DropTable
DROP TABLE "cluster";

-- DropTable
DROP TABLE "company";

-- DropTable
DROP TABLE "mbe";

-- DropTable
DROP TABLE "region";

-- DropTable
DROP TABLE "store";

-- CreateTable
CREATE TABLE "Store" (
    "store_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "region_id" TEXT NOT NULL,
    "cluster_id" TEXT NOT NULL,
    "store_name" TEXT NOT NULL,
    "erp_warehouse_name" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "region_data" TEXT,
    "partner" TEXT,
    "store_email" TEXT NOT NULL,
    "store_dva" TEXT,
    "paystack_customer_code" TEXT,
    "paystack_account_name" TEXT,
    "paystack_account_number" TEXT,
    "paystack_bank_name" TEXT,
    "paystack_account_id" INTEGER,
    "paystack_email" TEXT NOT NULL,
    "store_email2" TEXT NOT NULL,
    "store_email3" TEXT NOT NULL,
    "password" TEXT,
    "bundle" TEXT NOT NULL DEFAULT '0',
    "bundle_used" TEXT NOT NULL DEFAULT '0',
    "insurance_email" TEXT,
    "insurance_company" TEXT,
    "partnership" "store_partnership" NOT NULL DEFAULT 'Retail',
    "store_type" "store_store_type" NOT NULL DEFAULT 'android',
    "status" "ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "devfin" "ActiveStatus" NOT NULL DEFAULT 'INACTIVE',
    "target" INTEGER NOT NULL,
    "target_reflex" INTEGER NOT NULL DEFAULT 0,
    "target_android" INTEGER NOT NULL,
    "target_ios" INTEGER NOT NULL,
    "target_slam" INTEGER NOT NULL,
    "target_sentiflex" INTEGER NOT NULL,
    "target_accessories" INTEGER NOT NULL,
    "target_tradein" INTEGER NOT NULL,
    "target_preowned" INTEGER NOT NULL,
    "target_new_device" INTEGER NOT NULL,
    "target_value" INTEGER NOT NULL,
    "store_open" TIME(6) NOT NULL,
    "store_close" TIME(6) NOT NULL,
    "latitude" TEXT NOT NULL DEFAULT '0',
    "longitude" TEXT NOT NULL DEFAULT '0',
    "mou1" TEXT NOT NULL,
    "mou2" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,
    "account_name" TEXT NOT NULL,
    "bank_name" TEXT NOT NULL,
    "bank_code" TEXT NOT NULL,
    "account_number2" TEXT,
    "account_name2" TEXT,
    "bank_name2" TEXT,
    "bank_code2" TEXT NOT NULL,
    "phone_number" TEXT,
    "samsung_campaign" "store_samsung_campaign" NOT NULL DEFAULT 'no',
    "credit_partner" "ActiveStatus" NOT NULL DEFAULT 'INACTIVE',
    "royal" "ActiveStatus" NOT NULL DEFAULT 'INACTIVE',
    "discount_type" TEXT NOT NULL,
    "discount_value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "date_updated" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT NOT NULL,
    "store_id_int" INTEGER,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("store_id")
);

-- CreateTable
CREATE TABLE "Cluster" (
    "cluster_id" TEXT NOT NULL,
    "region_id" INTEGER NOT NULL,
    "cluster_name" TEXT NOT NULL,
    "cluster_supervisor_id" INTEGER NOT NULL,
    "cluster_supervisor_id_2" INTEGER,
    "status" "ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "date_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "Cluster_pkey" PRIMARY KEY ("cluster_id")
);

-- CreateTable
CREATE TABLE "Region" (
    "region_id" TEXT NOT NULL,
    "region_name" TEXT NOT NULL,
    "region_manager_id" INTEGER NOT NULL,
    "status" "ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "date_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("region_id")
);

-- CreateTable
CREATE TABLE "Company" (
    "company_id" TEXT NOT NULL,
    "country_id" INTEGER NOT NULL,
    "company_type" "company_company_type" NOT NULL DEFAULT 'android',
    "company_name" TEXT NOT NULL,
    "company_phone" TEXT NOT NULL,
    "erp_supplier_name" TEXT,
    "api_key" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "ims_company" "ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "domino_company" "ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "status" "ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "date_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "Mbe" (
    "mbe_id" TEXT NOT NULL,
    "mbe_id_int" INTEGER,
    "store_id" TEXT NOT NULL,
    "store_id2" TEXT,
    "store_id3" TEXT,
    "store_id4" TEXT,
    "store_id5" TEXT,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "pt_status" BOOLEAN NOT NULL DEFAULT false,
    "tt_status" BOOLEAN DEFAULT false,
    "trainer_id" INTEGER NOT NULL,
    "phone" TEXT NOT NULL,
    "state" TEXT,
    "title" TEXT NOT NULL,
    "is_probation" BOOLEAN NOT NULL DEFAULT false,
    "vendor_id" INTEGER,
    "grade_name" TEXT,
    "latitude" TEXT NOT NULL DEFAULT '0',
    "longitude" TEXT NOT NULL DEFAULT '0',
    "profile_picture" TEXT NOT NULL,
    "accessories_target" INTEGER NOT NULL,
    "new_device_target" INTEGER NOT NULL,
    "preowned_target" INTEGER NOT NULL,
    "sentiflex_target" INTEGER NOT NULL,
    "sentinel_target" INTEGER NOT NULL,
    "trade_in_target" INTEGER NOT NULL,
    "daily_hours" INTEGER NOT NULL DEFAULT 8,
    "days_per_week" INTEGER NOT NULL DEFAULT 6,
    "monthly_salary" INTEGER NOT NULL DEFAULT 25000,
    "payment_frequency" "PaymentFrequency" NOT NULL DEFAULT 'Monthly',
    "bank_account_number" TEXT NOT NULL,
    "bank_name" TEXT NOT NULL,
    "bank_code" TEXT NOT NULL,
    "total_commission" DECIMAL(65,30) NOT NULL,
    "commission_paid" DECIMAL(65,30) NOT NULL,
    "commission_unpaid" DECIMAL(65,30) NOT NULL,
    "tracking_status" "TrackingStatus" NOT NULL DEFAULT 'Absent',
    "device_type" "DeviceType" NOT NULL DEFAULT 'ANDROID',
    "status" BOOLEAN NOT NULL DEFAULT true,
    "account_level" "AccountLevel" NOT NULL DEFAULT 'One',
    "guarantor_form" TEXT NOT NULL,
    "guarantor_form2" TEXT,
    "referral_id" INTEGER,
    "referral_channel" TEXT,
    "referral_paid" BOOLEAN NOT NULL DEFAULT false,
    "employment_status" "EmploymentStatus" NOT NULL DEFAULT 'Employed',
    "employment_date" TIMESTAMP(3),
    "volume_target" TEXT NOT NULL,
    "value_target" TEXT NOT NULL,
    "date_created" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "date_resigned" TIMESTAMP(3) NOT NULL,
    "date_deactivated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mbe_pkey" PRIMARY KEY ("mbe_id")
);

-- CreateIndex
CREATE INDEX "Store_store_id_idx" ON "Store"("store_id");

-- CreateIndex
CREATE INDEX "Store_company_id_idx" ON "Store"("company_id");

-- CreateIndex
CREATE INDEX "Store_region_id_idx" ON "Store"("region_id");

-- CreateIndex
CREATE INDEX "Store_cluster_id_idx" ON "Store"("cluster_id");

-- CreateIndex
CREATE INDEX "Store_store_name_idx" ON "Store"("store_name");

-- CreateIndex
CREATE INDEX "Store_store_email_idx" ON "Store"("store_email");

-- CreateIndex
CREATE INDEX "Store_status_idx" ON "Store"("status");

-- CreateIndex
CREATE INDEX "Store_partnership_idx" ON "Store"("partnership");

-- CreateIndex
CREATE INDEX "Store_store_type_idx" ON "Store"("store_type");

-- CreateIndex
CREATE INDEX "Store_created_at_idx" ON "Store"("created_at");

-- CreateIndex
CREATE INDEX "Store_date_updated_idx" ON "Store"("date_updated");

-- CreateIndex
CREATE INDEX "Cluster_cluster_id_idx" ON "Cluster"("cluster_id");

-- CreateIndex
CREATE INDEX "Cluster_region_id_idx" ON "Cluster"("region_id");

-- CreateIndex
CREATE INDEX "Cluster_cluster_name_idx" ON "Cluster"("cluster_name");

-- CreateIndex
CREATE INDEX "Cluster_cluster_supervisor_id_idx" ON "Cluster"("cluster_supervisor_id");

-- CreateIndex
CREATE INDEX "Cluster_status_idx" ON "Cluster"("status");

-- CreateIndex
CREATE INDEX "Cluster_date_created_idx" ON "Cluster"("date_created");

-- CreateIndex
CREATE INDEX "Region_region_id_idx" ON "Region"("region_id");

-- CreateIndex
CREATE INDEX "Region_region_name_idx" ON "Region"("region_name");

-- CreateIndex
CREATE INDEX "Region_region_manager_id_idx" ON "Region"("region_manager_id");

-- CreateIndex
CREATE INDEX "Region_status_idx" ON "Region"("status");

-- CreateIndex
CREATE INDEX "Region_date_created_idx" ON "Region"("date_created");

-- CreateIndex
CREATE INDEX "Region_updated_by_idx" ON "Region"("updated_by");

-- CreateIndex
CREATE INDEX "Company_company_id_idx" ON "Company"("company_id");

-- CreateIndex
CREATE INDEX "Company_country_id_idx" ON "Company"("country_id");

-- CreateIndex
CREATE INDEX "Company_company_type_idx" ON "Company"("company_type");

-- CreateIndex
CREATE INDEX "Company_company_name_idx" ON "Company"("company_name");

-- CreateIndex
CREATE INDEX "Company_status_idx" ON "Company"("status");

-- CreateIndex
CREATE INDEX "Company_date_created_idx" ON "Company"("date_created");

-- CreateIndex
CREATE INDEX "Mbe_mbe_id_idx" ON "Mbe"("mbe_id");

-- CreateIndex
CREATE INDEX "Mbe_mbe_id_int_idx" ON "Mbe"("mbe_id_int");

-- CreateIndex
CREATE INDEX "Mbe_store_id_idx" ON "Mbe"("store_id");

-- CreateIndex
CREATE INDEX "Mbe_firstname_idx" ON "Mbe"("firstname");

-- CreateIndex
CREATE INDEX "Mbe_lastname_idx" ON "Mbe"("lastname");

-- CreateIndex
CREATE INDEX "Mbe_username_idx" ON "Mbe"("username");

-- CreateIndex
CREATE INDEX "Mbe_trainer_id_idx" ON "Mbe"("trainer_id");

-- CreateIndex
CREATE INDEX "Mbe_phone_idx" ON "Mbe"("phone");

-- CreateIndex
CREATE INDEX "Mbe_vendor_id_idx" ON "Mbe"("vendor_id");

-- CreateIndex
CREATE INDEX "Mbe_tracking_status_idx" ON "Mbe"("tracking_status");

-- CreateIndex
CREATE INDEX "Mbe_status_idx" ON "Mbe"("status");

-- CreateIndex
CREATE INDEX "Mbe_employment_status_idx" ON "Mbe"("employment_status");

-- CreateIndex
CREATE INDEX "Mbe_date_created_idx" ON "Mbe"("date_created");

-- CreateIndex
CREATE INDEX "Mbe_updated_by_idx" ON "Mbe"("updated_by");

-- CreateIndex
CREATE INDEX "Mbe_updated_at_idx" ON "Mbe"("updated_at");

-- CreateIndex
CREATE INDEX "Mbe_date_resigned_idx" ON "Mbe"("date_resigned");

-- CreateIndex
CREATE INDEX "Mbe_date_deactivated_idx" ON "Mbe"("date_deactivated");

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_cluster_id_fkey" FOREIGN KEY ("cluster_id") REFERENCES "Cluster"("cluster_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Region"("region_id") ON DELETE RESTRICT ON UPDATE CASCADE;
