-- CreateEnum
CREATE TYPE "PaymentFrequency" AS ENUM ('Daily', 'Weekly', 'Monthly');

-- CreateEnum
CREATE TYPE "TrackingStatus" AS ENUM ('Absent', 'GPS_Off', 'In_Store', 'Out_Of_Store');

-- CreateEnum
CREATE TYPE "AccountLevel" AS ENUM ('One', 'Five');

-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('Employed', 'Not_Employed');

-- CreateTable
CREATE TABLE "mbe" (
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

    CONSTRAINT "mbe_pkey" PRIMARY KEY ("mbe_id")
);
