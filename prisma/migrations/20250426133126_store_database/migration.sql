-- CreateEnum
CREATE TYPE "ActiveStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "company_company_type" AS ENUM ('android', 'ios', 'distributor');

-- CreateEnum
CREATE TYPE "store_samsung_campaign" AS ENUM ('no', 'yes');

-- CreateEnum
CREATE TYPE "store_partnership" AS ENUM ('Corporate', 'Retail');

-- CreateEnum
CREATE TYPE "store_store_type" AS ENUM ('ios', 'android', 'all');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('ANDROID', 'IOS', 'HOME_APPLIANCES', 'COMPUTER', 'ACCESSORIES');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'AGENT', 'SUPER_ADMIN', 'ADMIN', 'FINANCE', 'STORE_MANAGER', 'STORE_BRANCH_MANAGER', 'INVENTORY_MANAGER', 'VERIFICATION_OFFICER', 'DEVELOPER', 'SUPPORT', 'HUMAN_RESOURCE');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'APPROVED', 'PENDING', 'SUSPENDED', 'ARCHIVED', 'FRAUD', 'REJECTED', 'FULFILLED', 'ACCEPTED', 'KYC_1', 'KYC_2', 'KYC_3');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('INDIVIDUAL', 'BUSINESS');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('DEBIT', 'CREDIT', 'REFUND', 'COUPON');

-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('ENROLLED', 'APPROVED', 'REJECTED', 'FULFILLED', 'OPEN', 'CLOSED', 'OVERDUE');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEBIT', 'CREDIT');

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dob" TEXT,
    "gender" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "referralCode" TEXT,
    "telephoneNumber" TEXT,
    "profile_picture" TEXT,
    "otp" TEXT,
    "tokenVersion" INTEGER NOT NULL DEFAULT 0,
    "accountStatus" "Status" NOT NULL DEFAULT 'PENDING',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "otpExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sapphireId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Customers" (
    "customerId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "bvn" TEXT NOT NULL,
    "dob" TEXT NOT NULL,
    "userid" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customerLoanDiskId" TEXT,
    "channel" TEXT,
    "bvnPhoneNumber" TEXT NOT NULL,
    "mainPhoneNumber" TEXT,
    "dobMisMatch" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Customers_pkey" PRIMARY KEY ("customerId")
);

-- CreateTable
CREATE TABLE "CustomerKYC" (
    "kycId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "phone2" TEXT,
    "phone3" TEXT,
    "houseNumber" TEXT NOT NULL,
    "streetAddress" TEXT NOT NULL,
    "nearestBusStop" TEXT NOT NULL,
    "localGovernment" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "town" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "businessName" TEXT,
    "applicantBusinessAddress" TEXT NOT NULL,
    "applicantAddress" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "phone2Status" TEXT NOT NULL DEFAULT 'pending',
    "phone3Status" TEXT NOT NULL DEFAULT 'pending',
    "status2Comment" TEXT,
    "status3Comment" TEXT,

    CONSTRAINT "CustomerKYC_pkey" PRIMARY KEY ("kycId")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "wallet_id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "bankName" TEXT,
    "dva_id" INTEGER,
    "accountName" TEXT,
    "bankId" INTEGER,
    "currency" TEXT,
    "cust_code" TEXT,
    "cust_id" INTEGER,
    "userId" TEXT,
    "customerId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("wallet_id")
);

-- CreateTable
CREATE TABLE "WalletBalance" (
    "balanceId" TEXT NOT NULL,
    "userId" TEXT,
    "customerId" TEXT,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "lastBalance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalletBalance_pkey" PRIMARY KEY ("balanceId")
);

-- CreateTable
CREATE TABLE "LoanRecord" (
    "loanRecordId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "loanDiskId" TEXT,
    "lastPoint" TEXT,
    "channel" TEXT,
    "loanStatus" "LoanStatus" NOT NULL DEFAULT 'ENROLLED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "loanAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "LoanRecord_pkey" PRIMARY KEY ("loanRecordId")
);

-- CreateTable
CREATE TABLE "CustomerDropOffLog" (
    "dropOffLogId" TEXT NOT NULL,
    "screenTime" TEXT,
    "apiResponseTime" TEXT,
    "customerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "channel" TEXT,
    "screenName" TEXT,

    CONSTRAINT "CustomerDropOffLog_pkey" PRIMARY KEY ("dropOffLogId")
);

-- CreateTable
CREATE TABLE "TransactionHistory" (
    "transactionHistoryId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentType" "PaymentType" NOT NULL,
    "prevBalance" DOUBLE PRECISION NOT NULL,
    "newBalance" DOUBLE PRECISION NOT NULL,
    "paymentReference" TEXT NOT NULL,
    "extRef" TEXT,
    "currency" TEXT,
    "channel" TEXT,
    "charge" DOUBLE PRECISION,
    "chargeNarration" TEXT,
    "senderBank" TEXT,
    "senderAccount" TEXT,
    "recieverBank" TEXT,
    "recieverAccount" TEXT,
    "paymentDescription" TEXT NOT NULL,
    "paid_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userUserId" TEXT,
    "customerId" TEXT,

    CONSTRAINT "TransactionHistory_pkey" PRIMARY KEY ("transactionHistoryId")
);

-- CreateTable
CREATE TABLE "RefreshSession" (
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "deviceOS" TEXT,
    "deviceBrowser" TEXT,
    "deviceBrowserVersion" TEXT,
    "deviceName" TEXT,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefreshSession_pkey" PRIMARY KEY ("sessionId")
);

-- CreateTable
CREATE TABLE "Products" (
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "appKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedById" TEXT,
    "createdById" TEXT,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "Admins" (
    "adminid" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "inviteStatus" "Status" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Admins_pkey" PRIMARY KEY ("adminid")
);

-- CreateTable
CREATE TABLE "Device" (
    "deviceid" TEXT NOT NULL,
    "deviceBrand" TEXT,
    "deviceModel" TEXT,
    "price" DOUBLE PRECISION,
    "currency" TEXT DEFAULT 'NGN',
    "deviceImage" TEXT,
    "date_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "created_by_id" TEXT,
    "deviceModelNumber" TEXT,
    "back_camera" TEXT,
    "battery" TEXT,
    "color" TEXT,
    "data_storage" TEXT,
    "display" TEXT,
    "front_camera" TEXT,
    "memory" TEXT,
    "network" TEXT,
    "os" TEXT,
    "other_features" TEXT,
    "proccessor_cpu" TEXT,
    "sap" DOUBLE PRECISION,
    "screen_size" TEXT,
    "sentinel_cover" TEXT,
    "sld" DOUBLE PRECISION,
    "deviceType" "DeviceType" NOT NULL,
    "case_colors" TEXT,
    "windows_version" TEXT,
    "updated_by_id" TEXT,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("deviceid")
);

-- CreateTable
CREATE TABLE "PushSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subscription" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store" (
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
    "store_open" TIME NOT NULL,
    "store_close" TIME NOT NULL,
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

    CONSTRAINT "store_pkey" PRIMARY KEY ("store_id")
);

-- CreateTable
CREATE TABLE "cluster" (
    "cluster_id" TEXT NOT NULL,
    "region_id" INTEGER NOT NULL,
    "cluster_name" TEXT NOT NULL,
    "cluster_supervisor_id" INTEGER NOT NULL,
    "cluster_supervisor_id_2" INTEGER,
    "status" "ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "date_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "cluster_pkey" PRIMARY KEY ("cluster_id")
);

-- CreateTable
CREATE TABLE "region" (
    "region_id" TEXT NOT NULL,
    "region_name" TEXT NOT NULL,
    "region_manager_id" INTEGER NOT NULL,
    "status" "ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "date_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "region_pkey" PRIMARY KEY ("region_id")
);

-- CreateTable
CREATE TABLE "company" (
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

    CONSTRAINT "company_pkey" PRIMARY KEY ("company_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "User_telephoneNumber_key" ON "User"("telephoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_sapphireId_key" ON "User"("sapphireId");

-- CreateIndex
CREATE INDEX "User_userId_idx" ON "User"("userId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_referralCode_idx" ON "User"("referralCode");

-- CreateIndex
CREATE INDEX "User_accountStatus_idx" ON "User"("accountStatus");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_telephoneNumber_idx" ON "User"("telephoneNumber");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE INDEX "User_updatedAt_idx" ON "User"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Customers_email_key" ON "Customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customers_bvn_key" ON "Customers"("bvn");

-- CreateIndex
CREATE INDEX "Customers_customerId_idx" ON "Customers"("customerId");

-- CreateIndex
CREATE INDEX "Customers_firstName_idx" ON "Customers"("firstName");

-- CreateIndex
CREATE INDEX "Customers_lastName_idx" ON "Customers"("lastName");

-- CreateIndex
CREATE INDEX "Customers_email_idx" ON "Customers"("email");

-- CreateIndex
CREATE INDEX "Customers_bvnPhoneNumber_idx" ON "Customers"("bvnPhoneNumber");

-- CreateIndex
CREATE INDEX "Customers_mainPhoneNumber_idx" ON "Customers"("mainPhoneNumber");

-- CreateIndex
CREATE INDEX "Customers_bvn_idx" ON "Customers"("bvn");

-- CreateIndex
CREATE INDEX "Customers_dob_idx" ON "Customers"("dob");

-- CreateIndex
CREATE INDEX "Customers_createdAt_idx" ON "Customers"("createdAt");

-- CreateIndex
CREATE INDEX "Customers_updatedAt_idx" ON "Customers"("updatedAt");

-- CreateIndex
CREATE INDEX "Customers_customerLoanDiskId_idx" ON "Customers"("customerLoanDiskId");

-- CreateIndex
CREATE INDEX "CustomerKYC_kycId_idx" ON "CustomerKYC"("kycId");

-- CreateIndex
CREATE INDEX "CustomerKYC_customerId_idx" ON "CustomerKYC"("customerId");

-- CreateIndex
CREATE INDEX "CustomerKYC_state_idx" ON "CustomerKYC"("state");

-- CreateIndex
CREATE INDEX "CustomerKYC_localGovernment_idx" ON "CustomerKYC"("localGovernment");

-- CreateIndex
CREATE INDEX "CustomerKYC_occupation_idx" ON "CustomerKYC"("occupation");

-- CreateIndex
CREATE INDEX "CustomerKYC_createdAt_idx" ON "CustomerKYC"("createdAt");

-- CreateIndex
CREATE INDEX "CustomerKYC_updatedAt_idx" ON "CustomerKYC"("updatedAt");

-- CreateIndex
CREATE INDEX "CustomerKYC_phone2Status_idx" ON "CustomerKYC"("phone2Status");

-- CreateIndex
CREATE INDEX "CustomerKYC_phone3Status_idx" ON "CustomerKYC"("phone3Status");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_accountNumber_key" ON "Wallet"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_cust_code_key" ON "Wallet"("cust_code");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_key" ON "Wallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_customerId_key" ON "Wallet"("customerId");

-- CreateIndex
CREATE INDEX "Wallet_wallet_id_idx" ON "Wallet"("wallet_id");

-- CreateIndex
CREATE INDEX "Wallet_userId_idx" ON "Wallet"("userId");

-- CreateIndex
CREATE INDEX "Wallet_accountNumber_idx" ON "Wallet"("accountNumber");

-- CreateIndex
CREATE INDEX "Wallet_bankName_idx" ON "Wallet"("bankName");

-- CreateIndex
CREATE INDEX "Wallet_cust_code_idx" ON "Wallet"("cust_code");

-- CreateIndex
CREATE INDEX "Wallet_cust_id_idx" ON "Wallet"("cust_id");

-- CreateIndex
CREATE INDEX "Wallet_currency_idx" ON "Wallet"("currency");

-- CreateIndex
CREATE INDEX "Wallet_customerId_idx" ON "Wallet"("customerId");

-- CreateIndex
CREATE INDEX "Wallet_accountName_idx" ON "Wallet"("accountName");

-- CreateIndex
CREATE INDEX "Wallet_created_at_idx" ON "Wallet"("created_at");

-- CreateIndex
CREATE INDEX "Wallet_updated_at_idx" ON "Wallet"("updated_at");

-- CreateIndex
CREATE UNIQUE INDEX "WalletBalance_userId_key" ON "WalletBalance"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WalletBalance_customerId_key" ON "WalletBalance"("customerId");

-- CreateIndex
CREATE INDEX "WalletBalance_balanceId_idx" ON "WalletBalance"("balanceId");

-- CreateIndex
CREATE INDEX "WalletBalance_userId_idx" ON "WalletBalance"("userId");

-- CreateIndex
CREATE INDEX "WalletBalance_customerId_idx" ON "WalletBalance"("customerId");

-- CreateIndex
CREATE INDEX "WalletBalance_balance_idx" ON "WalletBalance"("balance");

-- CreateIndex
CREATE INDEX "WalletBalance_lastBalance_idx" ON "WalletBalance"("lastBalance");

-- CreateIndex
CREATE INDEX "WalletBalance_created_at_idx" ON "WalletBalance"("created_at");

-- CreateIndex
CREATE INDEX "WalletBalance_updated_at_idx" ON "WalletBalance"("updated_at");

-- CreateIndex
CREATE INDEX "LoanRecord_loanRecordId_idx" ON "LoanRecord"("loanRecordId");

-- CreateIndex
CREATE INDEX "LoanRecord_customerId_idx" ON "LoanRecord"("customerId");

-- CreateIndex
CREATE INDEX "LoanRecord_loanDiskId_idx" ON "LoanRecord"("loanDiskId");

-- CreateIndex
CREATE INDEX "LoanRecord_lastPoint_idx" ON "LoanRecord"("lastPoint");

-- CreateIndex
CREATE INDEX "LoanRecord_channel_idx" ON "LoanRecord"("channel");

-- CreateIndex
CREATE INDEX "LoanRecord_createdAt_idx" ON "LoanRecord"("createdAt");

-- CreateIndex
CREATE INDEX "LoanRecord_updatedAt_idx" ON "LoanRecord"("updatedAt");

-- CreateIndex
CREATE INDEX "CustomerDropOffLog_dropOffLogId_idx" ON "CustomerDropOffLog"("dropOffLogId");

-- CreateIndex
CREATE INDEX "CustomerDropOffLog_customerId_idx" ON "CustomerDropOffLog"("customerId");

-- CreateIndex
CREATE INDEX "CustomerDropOffLog_screenTime_idx" ON "CustomerDropOffLog"("screenTime");

-- CreateIndex
CREATE INDEX "CustomerDropOffLog_apiResponseTime_idx" ON "CustomerDropOffLog"("apiResponseTime");

-- CreateIndex
CREATE INDEX "CustomerDropOffLog_createdAt_idx" ON "CustomerDropOffLog"("createdAt");

-- CreateIndex
CREATE INDEX "CustomerDropOffLog_updatedAt_idx" ON "CustomerDropOffLog"("updatedAt");

-- CreateIndex
CREATE INDEX "TransactionHistory_transactionHistoryId_idx" ON "TransactionHistory"("transactionHistoryId");

-- CreateIndex
CREATE INDEX "TransactionHistory_amount_idx" ON "TransactionHistory"("amount");

-- CreateIndex
CREATE INDEX "TransactionHistory_paymentType_idx" ON "TransactionHistory"("paymentType");

-- CreateIndex
CREATE INDEX "TransactionHistory_paymentReference_idx" ON "TransactionHistory"("paymentReference");

-- CreateIndex
CREATE INDEX "TransactionHistory_extRef_idx" ON "TransactionHistory"("extRef");

-- CreateIndex
CREATE INDEX "TransactionHistory_currency_idx" ON "TransactionHistory"("currency");

-- CreateIndex
CREATE INDEX "TransactionHistory_channel_idx" ON "TransactionHistory"("channel");

-- CreateIndex
CREATE INDEX "TransactionHistory_charge_idx" ON "TransactionHistory"("charge");

-- CreateIndex
CREATE INDEX "TransactionHistory_chargeNarration_idx" ON "TransactionHistory"("chargeNarration");

-- CreateIndex
CREATE INDEX "TransactionHistory_senderBank_idx" ON "TransactionHistory"("senderBank");

-- CreateIndex
CREATE INDEX "TransactionHistory_senderAccount_idx" ON "TransactionHistory"("senderAccount");

-- CreateIndex
CREATE INDEX "TransactionHistory_recieverBank_idx" ON "TransactionHistory"("recieverBank");

-- CreateIndex
CREATE INDEX "TransactionHistory_recieverAccount_idx" ON "TransactionHistory"("recieverAccount");

-- CreateIndex
CREATE INDEX "TransactionHistory_paymentDescription_idx" ON "TransactionHistory"("paymentDescription");

-- CreateIndex
CREATE INDEX "TransactionHistory_userUserId_idx" ON "TransactionHistory"("userUserId");

-- CreateIndex
CREATE INDEX "TransactionHistory_createdAt_idx" ON "TransactionHistory"("createdAt");

-- CreateIndex
CREATE INDEX "TransactionHistory_updatedAt_idx" ON "TransactionHistory"("updatedAt");

-- CreateIndex
CREATE INDEX "RefreshSession_userId_idx" ON "RefreshSession"("userId");

-- CreateIndex
CREATE INDEX "RefreshSession_expiresAt_idx" ON "RefreshSession"("expiresAt");

-- CreateIndex
CREATE INDEX "RefreshSession_deviceOS_idx" ON "RefreshSession"("deviceOS");

-- CreateIndex
CREATE INDEX "RefreshSession_deviceBrowser_idx" ON "RefreshSession"("deviceBrowser");

-- CreateIndex
CREATE INDEX "RefreshSession_deviceBrowserVersion_idx" ON "RefreshSession"("deviceBrowserVersion");

-- CreateIndex
CREATE INDEX "RefreshSession_deviceName_idx" ON "RefreshSession"("deviceName");

-- CreateIndex
CREATE INDEX "RefreshSession_userAgent_idx" ON "RefreshSession"("userAgent");

-- CreateIndex
CREATE INDEX "RefreshSession_ipAddress_idx" ON "RefreshSession"("ipAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Products_name_key" ON "Products"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Products_appKey_key" ON "Products"("appKey");

-- CreateIndex
CREATE INDEX "Products_productId_idx" ON "Products"("productId");

-- CreateIndex
CREATE INDEX "Products_name_idx" ON "Products"("name");

-- CreateIndex
CREATE INDEX "Products_appKey_idx" ON "Products"("appKey");

-- CreateIndex
CREATE INDEX "Products_createdAt_idx" ON "Products"("createdAt");

-- CreateIndex
CREATE INDEX "Products_updatedAt_idx" ON "Products"("updatedAt");

-- CreateIndex
CREATE INDEX "Products_isActive_idx" ON "Products"("isActive");

-- CreateIndex
CREATE INDEX "Products_updatedById_idx" ON "Products"("updatedById");

-- CreateIndex
CREATE UNIQUE INDEX "Admins_userid_key" ON "Admins"("userid");

-- CreateIndex
CREATE INDEX "Admins_adminid_idx" ON "Admins"("adminid");

-- CreateIndex
CREATE INDEX "Admins_userid_idx" ON "Admins"("userid");

-- CreateIndex
CREATE INDEX "Admins_inviteStatus_idx" ON "Admins"("inviteStatus");

-- CreateIndex
CREATE INDEX "Admins_password_idx" ON "Admins"("password");

-- CreateIndex
CREATE INDEX "Device_deviceid_idx" ON "Device"("deviceid");

-- CreateIndex
CREATE INDEX "Device_deviceBrand_idx" ON "Device"("deviceBrand");

-- CreateIndex
CREATE INDEX "Device_deviceModel_idx" ON "Device"("deviceModel");

-- CreateIndex
CREATE INDEX "Device_deviceType_idx" ON "Device"("deviceType");

-- CreateIndex
CREATE INDEX "Device_date_created_idx" ON "Device"("date_created");

-- CreateIndex
CREATE INDEX "Device_updated_at_idx" ON "Device"("updated_at");

-- CreateIndex
CREATE INDEX "Device_created_by_id_idx" ON "Device"("created_by_id");

-- CreateIndex
CREATE INDEX "Device_updated_by_id_idx" ON "Device"("updated_by_id");

-- CreateIndex
CREATE INDEX "Device_isActive_idx" ON "Device"("isActive");

-- CreateIndex
CREATE INDEX "Device_price_idx" ON "Device"("price");

-- CreateIndex
CREATE INDEX "Device_sap_idx" ON "Device"("sap");

-- CreateIndex
CREATE INDEX "Device_currency_idx" ON "Device"("currency");

-- CreateIndex
CREATE UNIQUE INDEX "PushSubscription_userId_key" ON "PushSubscription"("userId");

-- CreateIndex
CREATE INDEX "PushSubscription_id_idx" ON "PushSubscription"("id");

-- CreateIndex
CREATE INDEX "PushSubscription_userId_idx" ON "PushSubscription"("userId");

-- CreateIndex
CREATE INDEX "PushSubscription_createdAt_idx" ON "PushSubscription"("createdAt");

-- CreateIndex
CREATE INDEX "PushSubscription_updatedAt_idx" ON "PushSubscription"("updatedAt");

-- AddForeignKey
ALTER TABLE "Customers" ADD CONSTRAINT "Customers_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerKYC" ADD CONSTRAINT "CustomerKYC_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("customerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("customerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletBalance" ADD CONSTRAINT "WalletBalance_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("customerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletBalance" ADD CONSTRAINT "WalletBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanRecord" ADD CONSTRAINT "LoanRecord_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("customerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerDropOffLog" ADD CONSTRAINT "CustomerDropOffLog_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("customerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionHistory" ADD CONSTRAINT "TransactionHistory_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("customerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionHistory" ADD CONSTRAINT "TransactionHistory_userUserId_fkey" FOREIGN KEY ("userUserId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshSession" ADD CONSTRAINT "RefreshSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Admins"("adminid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Admins"("adminid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admins" ADD CONSTRAINT "Admins_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "Admins"("adminid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "Admins"("adminid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PushSubscription" ADD CONSTRAINT "PushSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store" ADD CONSTRAINT "store_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store" ADD CONSTRAINT "store_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "region"("region_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store" ADD CONSTRAINT "store_cluster_id_fkey" FOREIGN KEY ("cluster_id") REFERENCES "cluster"("cluster_id") ON DELETE RESTRICT ON UPDATE CASCADE;
