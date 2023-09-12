-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `role` ENUM('admin', 'staff') NOT NULL,
    `status` ENUM('ok', 'removed') NOT NULL DEFAULT 'ok',
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Admin_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminLog` (
    `id` VARCHAR(191) NOT NULL,
    `datetime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` VARCHAR(20) NOT NULL,
    `content` JSON NOT NULL,
    `adminId` VARCHAR(191) NULL,
    `operatorId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `id` VARCHAR(191) NOT NULL,
    `address` TEXT NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `status` ENUM('ok', 'flagged', 'removed') NOT NULL DEFAULT 'ok',
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Customer_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerLog` (
    `id` VARCHAR(191) NOT NULL,
    `datetime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` VARCHAR(20) NOT NULL,
    `content` JSON NOT NULL,
    `customerId` VARCHAR(191) NULL,
    `operatorId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event` (
    `id` VARCHAR(191) NOT NULL,
    `datetimeStart` DATETIME(3) NOT NULL,
    `datetimeEnd` DATETIME(3) NOT NULL,
    `type` VARCHAR(20) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `address` TEXT NOT NULL,
    `status` ENUM('active', 'cancelled', 'completed', 'removed', 'unpaid') NOT NULL DEFAULT 'active',
    `customerId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventLog` (
    `id` VARCHAR(191) NOT NULL,
    `datetime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` VARCHAR(20) NOT NULL,
    `content` JSON NOT NULL,
    `eventId` VARCHAR(191) NULL,
    `operatorId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventSupply` (
    `id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `status` ENUM('ok', 'removed') NOT NULL DEFAULT 'ok',
    `eventId` VARCHAR(191) NULL,
    `supplyId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventSupplyLog` (
    `id` VARCHAR(191) NOT NULL,
    `datetime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` VARCHAR(20) NOT NULL,
    `content` JSON NOT NULL,
    `eventSupplyId` VARCHAR(191) NULL,
    `operatorId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Supplier` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `address` TEXT NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `status` ENUM('ok', 'flagged', 'removed') NOT NULL DEFAULT 'ok',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupplierLog` (
    `id` VARCHAR(191) NOT NULL,
    `datetime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` VARCHAR(20) NOT NULL,
    `content` JSON NOT NULL,
    `supplierId` VARCHAR(191) NULL,
    `operatorId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Supply` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `brand` VARCHAR(255) NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `stock` INTEGER NOT NULL,
    `status` ENUM('ok', 'removed') NOT NULL DEFAULT 'ok',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupplyLog` (
    `id` VARCHAR(191) NOT NULL,
    `datetime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` VARCHAR(20) NOT NULL,
    `content` JSON NOT NULL,
    `supplyId` VARCHAR(191) NULL,
    `operatorId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `datetimeOrdered` DATETIME(3) NOT NULL,
    `datetimeExpected` DATETIME(3) NOT NULL,
    `datetimeArrived` DATETIME(3) NOT NULL,
    `status` ENUM('active', 'arrived', 'cancelled', 'removed') NOT NULL DEFAULT 'active',
    `supplierId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderLog` (
    `id` VARCHAR(191) NOT NULL,
    `datetime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` VARCHAR(20) NOT NULL,
    `content` JSON NOT NULL,
    `orderId` VARCHAR(191) NULL,
    `operatorId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderSupply` (
    `id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `status` ENUM('ok', 'removed') NOT NULL DEFAULT 'ok',
    `orderId` VARCHAR(191) NULL,
    `supplyId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderSupplyLog` (
    `id` VARCHAR(191) NOT NULL,
    `datetime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` VARCHAR(20) NOT NULL,
    `content` JSON NOT NULL,
    `orderSupplyId` VARCHAR(191) NULL,
    `operatorId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Task` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `status` ENUM('active', 'completed', 'onhold', 'removed') NOT NULL DEFAULT 'active',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TaskLog` (
    `id` VARCHAR(191) NOT NULL,
    `datetime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` VARCHAR(20) NOT NULL,
    `content` JSON NOT NULL,
    `taskId` VARCHAR(191) NULL,
    `operatorId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `status` ENUM('nur', 'unverified', 'ok', 'deactivated', 'removed', 'suspended') NOT NULL DEFAULT 'unverified',

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserLog` (
    `id` VARCHAR(191) NOT NULL,
    `datetime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` VARCHAR(20) NOT NULL,
    `content` JSON NOT NULL,
    `userId` VARCHAR(191) NULL,
    `operatorId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserInformation` (
    `id` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(255) NOT NULL,
    `firstname` VARCHAR(255) NOT NULL,
    `middlename` VARCHAR(255) NOT NULL,
    `suffix` VARCHAR(20) NOT NULL,
    `gender` ENUM('male', 'female') NOT NULL,
    `birthdate` DATE NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UserInformation_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserInformationLog` (
    `id` VARCHAR(191) NOT NULL,
    `datetime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` VARCHAR(20) NOT NULL,
    `content` JSON NOT NULL,
    `userInformationId` VARCHAR(191) NULL,
    `operatorId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminLog` ADD CONSTRAINT `AdminLog_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminLog` ADD CONSTRAINT `AdminLog_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerLog` ADD CONSTRAINT `CustomerLog_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerLog` ADD CONSTRAINT `CustomerLog_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventLog` ADD CONSTRAINT `EventLog_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventLog` ADD CONSTRAINT `EventLog_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventSupply` ADD CONSTRAINT `EventSupply_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventSupply` ADD CONSTRAINT `EventSupply_supplyId_fkey` FOREIGN KEY (`supplyId`) REFERENCES `Supply`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventSupplyLog` ADD CONSTRAINT `EventSupplyLog_eventSupplyId_fkey` FOREIGN KEY (`eventSupplyId`) REFERENCES `EventSupply`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventSupplyLog` ADD CONSTRAINT `EventSupplyLog_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplierLog` ADD CONSTRAINT `SupplierLog_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplierLog` ADD CONSTRAINT `SupplierLog_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplyLog` ADD CONSTRAINT `SupplyLog_supplyId_fkey` FOREIGN KEY (`supplyId`) REFERENCES `Supply`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplyLog` ADD CONSTRAINT `SupplyLog_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderLog` ADD CONSTRAINT `OrderLog_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderLog` ADD CONSTRAINT `OrderLog_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderSupply` ADD CONSTRAINT `OrderSupply_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderSupply` ADD CONSTRAINT `OrderSupply_supplyId_fkey` FOREIGN KEY (`supplyId`) REFERENCES `Supply`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderSupplyLog` ADD CONSTRAINT `OrderSupplyLog_orderSupplyId_fkey` FOREIGN KEY (`orderSupplyId`) REFERENCES `OrderSupply`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderSupplyLog` ADD CONSTRAINT `OrderSupplyLog_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskLog` ADD CONSTRAINT `TaskLog_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskLog` ADD CONSTRAINT `TaskLog_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserLog` ADD CONSTRAINT `UserLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserLog` ADD CONSTRAINT `UserLog_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserInformation` ADD CONSTRAINT `UserInformation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserInformationLog` ADD CONSTRAINT `UserInformationLog_userInformationId_fkey` FOREIGN KEY (`userInformationId`) REFERENCES `UserInformation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserInformationLog` ADD CONSTRAINT `UserInformationLog_operatorId_fkey` FOREIGN KEY (`operatorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
