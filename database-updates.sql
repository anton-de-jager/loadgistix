-- =============================================
-- Database Updates for Model Property Changes
-- =============================================
-- Run these scripts on your SQL Server database to add the missing columns
-- and update the stored procedures

-- =============================================
-- 1. BRANCH TABLE AND STORED PROCEDURE
-- =============================================

-- Add Email and Phone columns to Branch table
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Branch]') AND name = 'Email')
BEGIN
    ALTER TABLE [dbo].[Branch] ADD [Email] NVARCHAR(255) NULL;
    PRINT 'Added Email column to Branch table';
END
ELSE
BEGIN
    PRINT 'Email column already exists in Branch table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Branch]') AND name = 'Phone')
BEGIN
    ALTER TABLE [dbo].[Branch] ADD [Phone] NVARCHAR(50) NULL;
    PRINT 'Added Phone column to Branch table';
END
ELSE
BEGIN
    PRINT 'Phone column already exists in Branch table';
END
GO

-- =============================================
-- 2. LOAD TABLE
-- =============================================

-- Add missing columns to Load table
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Load]') AND name = 'DeliveryNoteNumber')
BEGIN
    ALTER TABLE [dbo].[Load] ADD [DeliveryNoteNumber] NVARCHAR(100) NULL;
    PRINT 'Added DeliveryNoteNumber column to Load table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Load]') AND name = 'WeighBridgeTicketNumber')
BEGIN
    ALTER TABLE [dbo].[Load] ADD [WeighBridgeTicketNumber] NVARCHAR(100) NULL;
    PRINT 'Added WeighBridgeTicketNumber column to Load table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Load]') AND name = 'ReturnDocumentNumber')
BEGIN
    ALTER TABLE [dbo].[Load] ADD [ReturnDocumentNumber] NVARCHAR(100) NULL;
    PRINT 'Added ReturnDocumentNumber column to Load table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Load]') AND name = 'ReturnKgs')
BEGIN
    ALTER TABLE [dbo].[Load] ADD [ReturnKgs] FLOAT NULL;
    PRINT 'Added ReturnKgs column to Load table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Load]') AND name = 'ReturnPallets')
BEGIN
    ALTER TABLE [dbo].[Load] ADD [ReturnPallets] INT NULL;
    PRINT 'Added ReturnPallets column to Load table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Load]') AND name = 'ReturnReasonId')
BEGIN
    ALTER TABLE [dbo].[Load] ADD [ReturnReasonId] UNIQUEIDENTIFIER NULL;
    PRINT 'Added ReturnReasonId column to Load table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Load]') AND name = 'StockProblemId')
BEGIN
    ALTER TABLE [dbo].[Load] ADD [StockProblemId] UNIQUEIDENTIFIER NULL;
    PRINT 'Added StockProblemId column to Load table';
END
GO

-- =============================================
-- 3. BID TABLE
-- =============================================

-- Add missing columns to Bid table
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Bid]') AND name = 'DeliveryNoteNumber')
BEGIN
    ALTER TABLE [dbo].[Bid] ADD [DeliveryNoteNumber] NVARCHAR(100) NULL;
    PRINT 'Added DeliveryNoteNumber column to Bid table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Bid]') AND name = 'WeighBridgeTicketNumber')
BEGIN
    ALTER TABLE [dbo].[Bid] ADD [WeighBridgeTicketNumber] NVARCHAR(100) NULL;
    PRINT 'Added WeighBridgeTicketNumber column to Bid table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Bid]') AND name = 'ReturnDocumentNumber')
BEGIN
    ALTER TABLE [dbo].[Bid] ADD [ReturnDocumentNumber] NVARCHAR(100) NULL;
    PRINT 'Added ReturnDocumentNumber column to Bid table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Bid]') AND name = 'ReturnKgs')
BEGIN
    ALTER TABLE [dbo].[Bid] ADD [ReturnKgs] FLOAT NULL;
    PRINT 'Added ReturnKgs column to Bid table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Bid]') AND name = 'ReturnPallets')
BEGIN
    ALTER TABLE [dbo].[Bid] ADD [ReturnPallets] INT NULL;
    PRINT 'Added ReturnPallets column to Bid table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Bid]') AND name = 'ReturnReasonId')
BEGIN
    ALTER TABLE [dbo].[Bid] ADD [ReturnReasonId] UNIQUEIDENTIFIER NULL;
    PRINT 'Added ReturnReasonId column to Bid table';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Bid]') AND name = 'StockProblemId')
BEGIN
    ALTER TABLE [dbo].[Bid] ADD [StockProblemId] UNIQUEIDENTIFIER NULL;
    PRINT 'Added StockProblemId column to Bid table';
END
GO

-- =============================================
-- NOTES FOR STORED PROCEDURE UPDATES
-- =============================================
/*
You need to manually update the following stored procedures to include the new parameters:

1. usp_action_branch - Add @Email and @Phone parameters
2. usp_action_load - Add delivery/return related parameters
3. usp_action_bid - Add delivery/return related parameters

For each stored procedure:
1. Add the new parameters to the procedure definition
2. Include them in INSERT statements
3. Include them in UPDATE statements
4. Include them in SELECT statements (if applicable)

Example for usp_action_branch:
- Add parameters: @Email NVARCHAR(255) = NULL, @Phone NVARCHAR(50) = NULL
- In INSERT: Include [Email], [Phone] in column list and @Email, @Phone in values
- In UPDATE: Add [Email] = @Email, [Phone] = @Phone
*/

PRINT '';
PRINT '=============================================';
PRINT 'Table alterations completed successfully!';
PRINT 'Next steps:';
PRINT '1. Update usp_action_branch stored procedure';
PRINT '2. Update usp_action_load stored procedure';
PRINT '3. Update usp_action_bid stored procedure';
PRINT '=============================================';

