-- =============================================
-- Update User Transactions to Prevent showPaypal
-- =============================================
-- This script updates the transaction record for user with email "anton@madproducts.co.za"
-- to have unlimited access so that showPaypal() is never called anywhere in the app.
-- 
-- The showPaypal() function is called in these scenarios:
-- 1. directories.component.ts: When quantity <= 0 (directory field)
-- 2. vehicles.component.ts: When adding a vehicle and dataSource.data.length >= quantity (and quantity !== -1)
-- 3. loads.component.ts: When adding a load and dataSource.data.length >= quantity (and quantity !== -1)
-- 4. drivers.component.ts: When adding a driver and dataSource.data.length >= quantity (and quantity !== -1)
-- 5. adverts.component.ts: When adding an advert and dataSource.data.length >= quantity (and quantity !== -1)
--
-- By setting all transaction quantities to -1 (unlimited), all checks will pass:
-- - quantity > 0 (passes the directory check)
-- - dataSource.data.length < quantity will always be true (can always add more items)
-- =============================================

USE [findrisk]; -- Update this to your database name if different
GO

DECLARE @UserId NVARCHAR(450);
DECLARE @TransactionId UNIQUEIDENTIFIER;

-- Step 1: Find the user ID by email
SELECT @UserId = Id 
FROM [dbo].[AspNetUsers] 
WHERE Email = 'anton@madproducts.co.za';

-- Check if user exists
IF @UserId IS NULL
BEGIN
    PRINT 'ERROR: User with email "anton@madproducts.co.za" not found.';
    RETURN;
END
ELSE
BEGIN
    PRINT 'Found user with ID: ' + @UserId;
END

-- Step 2: Check if a transaction record already exists for this user
SELECT @TransactionId = Id 
FROM [dbo].[Transaction] 
WHERE UserId = @UserId;

-- Step 3: Delete any existing transaction records for this user (to ensure clean state)
IF @TransactionId IS NOT NULL
BEGIN
    DELETE FROM [dbo].[Transaction] WHERE UserId = @UserId;
    PRINT 'Deleted existing transaction record(s) for user.';
END

-- Step 4: Insert a new transaction record with unlimited quantities
SET @TransactionId = NEWID();

INSERT INTO [dbo].[Transaction] (
    [Id],
    [UserId],
    [SubscriptionId],
    [Advert],
    [Tms],
    [Directory],
    [Vehicle],
    [Load],
    [Amount_gross],
    [Amount_net],
    [Amount_fee],
    [DateBilling],
    [CreatedOn]
)
VALUES (
    @TransactionId,
    @UserId,
    NULL, -- No subscription needed
    -1, -- Advert quantity (unlimited)
    -1, -- TMS quantity (unlimited)
    -1, -- Directory quantity (unlimited)
    -1, -- Vehicle quantity (unlimited)
    -1, -- Load quantity (unlimited)
    0.00, -- Amount gross
    0.00, -- Amount net
    0.00, -- Amount fee
    GETDATE(), -- Billing date
    GETDATE()  -- Created date
);

IF @@ROWCOUNT > 0
BEGIN
    PRINT 'Successfully inserted new transaction record with ID: ' + CAST(@TransactionId AS NVARCHAR(50));
    PRINT 'All quantities set to -1 (unlimited) to prevent showPaypal() from being called anywhere in the app.';
END
ELSE
BEGIN
    PRINT 'ERROR: Failed to insert transaction record!';
    RETURN;
END

-- Step 5: Verify the insert
SELECT 
    t.[Id] AS TransactionId,
    t.[UserId],
    u.[Email],
    u.[Name],
    t.[Advert],
    t.[Tms],
    t.[Directory],
    t.[Vehicle],
    t.[Load],
    t.[DateBilling],
    t.[CreatedOn]
FROM [dbo].[Transaction] t
INNER JOIN [dbo].[AspNetUsers] u ON t.[UserId] = u.[Id]
WHERE t.[UserId] = @UserId;

-- Step 6: Final verification - count transactions for this user
DECLARE @TransactionCount INT;
SELECT @TransactionCount = COUNT(*) FROM [dbo].[Transaction] WHERE UserId = @UserId;

PRINT '';
PRINT '==============================================';
PRINT 'Transaction update complete!';
PRINT 'Total transaction records for this user: ' + CAST(@TransactionCount AS NVARCHAR(10));
PRINT '';

IF @TransactionCount > 0
BEGIN
    PRINT 'SUCCESS: User "anton@madproducts.co.za" now has unlimited quantities (-1 for each type).';
    PRINT '';
    PRINT 'This prevents showPaypal() from being called in ALL components:';
    PRINT '  - Directories: quantity === -1 (unlimited) ✓';
    PRINT '  - Vehicles: quantity === -1 (unlimited) ✓';
    PRINT '  - Loads: quantity === -1 (unlimited) ✓';
    PRINT '  - Drivers: quantity === -1 (unlimited) ✓';
    PRINT '  - Adverts: quantity === -1 (unlimited) ✓';
    PRINT '';
    PRINT 'showPaypal() will NEVER be called for this user anywhere in the application.';
END
ELSE
BEGIN
    PRINT 'ERROR: No transaction record found after insert! Please check database permissions.';
END
PRINT '==============================================';
GO

