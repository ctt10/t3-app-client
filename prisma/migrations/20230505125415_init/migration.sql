-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "media" TEXT[],
    "theme" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "itemType" TEXT NOT NULL,
    "subType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "orderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "stateProvince" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "addressline" TEXT NOT NULL,
    "addressline2" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "paymentId" TEXT,
    "customerId" TEXT,
    "idempotencyKey" TEXT,
    "receiptUrl" TEXT,
    "billId" TEXT,
    "vendorId" TEXT,
    "shippingCost" INTEGER,
    "shipped" BOOLEAN DEFAULT false,
    "received" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuickbooksBill" (
    "id" TEXT NOT NULL,
    "billId" INTEGER NOT NULL,
    "billSyncToken" TEXT NOT NULL,
    "txnId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuickbooksBill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuickbooksVendor" (
    "id" TEXT NOT NULL,
    "qbId" INTEGER NOT NULL,
    "qbSyncToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuickbooksVendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuickbooksToken" (
    "id" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "realmId" TEXT NOT NULL,
    "token_type" TEXT NOT NULL,
    "expires_in" INTEGER NOT NULL,
    "x_refresh_token_expires_in" INTEGER NOT NULL,
    "id_token" TEXT NOT NULL,
    "latency" INTEGER NOT NULL,
    "state" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuickbooksToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Item_id_key" ON "Item"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_id_key" ON "Order"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_customerId_key" ON "Order"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_receiptUrl_key" ON "Order"("receiptUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Order_billId_key" ON "Order"("billId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_vendorId_key" ON "Order"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "QuickbooksBill_id_key" ON "QuickbooksBill"("id");

-- CreateIndex
CREATE UNIQUE INDEX "QuickbooksVendor_id_key" ON "QuickbooksVendor"("id");

-- CreateIndex
CREATE UNIQUE INDEX "QuickbooksToken_id_key" ON "QuickbooksToken"("id");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_billId_fkey" FOREIGN KEY ("billId") REFERENCES "QuickbooksBill"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "QuickbooksVendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuickbooksBill" ADD CONSTRAINT "QuickbooksBill_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "QuickbooksVendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
