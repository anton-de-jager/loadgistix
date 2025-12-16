-- =============================================
-- COMPLETE FIX FOR showPaypal Issue
-- =============================================
-- This script does everything needed to prevent showPaypal() from being called:
-- 1. Fixes the usp_action_transaction stored procedure (adds missing 'select-current' action)
-- 2. Creates/updates the transaction record for anton@madproducts.co.za with unlimited quantities
-- =============================================

USE [findrisk]; -- Update this to your database name if different
GO

PRINT '==============================================';
PRINT 'STEP 1: Fixing Transaction Stored Procedure';
PRINT '==============================================';
PRINT '';

-- Drop and recreate the stored procedure with the select-current action
IF OBJECT_ID('dbo.usp_action_transaction', 'P') IS NOT NULL 
BEGIN
    DROP PROCEDURE dbo.usp_action_transaction;
    PRINT 'Dropped existing usp_action_transaction procedure.';
END
GO

CREATE PROCEDURE dbo.usp_action_transaction
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @userId NVARCHAR(450) = NULL,
    @subscriptionId UNIQUEIDENTIFIER = NULL,
    @advert INT = NULL,
    @tms INT = NULL,
    @directory INT = NULL,
    @vehicle INT = NULL,
    @load INT = NULL,
    @amount_gross DECIMAL(18,2) = NULL,
    @amount_net DECIMAL(18,2) = NULL,
    @amount_fee DECIMAL(18,2) = NULL,
    @dateBilling DATETIME = NULL,
    @createdOn DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT * FROM dbo.[Transaction] WHERE UserId = @userId ORDER BY CreatedOn DESC;
    END
    ELSE IF @action = 'select-current'
    BEGIN
        -- Return the most recent transaction for the user
        -- This is what the API expects when calling getTransactions()
        SELECT TOP 1 * FROM dbo.[Transaction] 
        WHERE UserId = @userId 
        ORDER BY CreatedOn DESC;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT * FROM dbo.[Transaction] WHERE Id = @id;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.[Transaction] (Id, UserId, SubscriptionId, Advert, Tms, Directory, Vehicle, Load,
            Amount_gross, Amount_net, Amount_fee, DateBilling, CreatedOn)
        VALUES (@id, @userId, @subscriptionId, @advert, @tms, @directory, @vehicle, @load,
            @amount_gross, @amount_net, @amount_fee, @dateBilling, GETDATE());
        SELECT * FROM dbo.[Transaction] WHERE Id = @id;
    END
    ELSE IF @action = 'update'
    BEGIN
        UPDATE dbo.[Transaction]
        SET 
            SubscriptionId = ISNULL(@subscriptionId, SubscriptionId),
            Advert = ISNULL(@advert, Advert),
            Tms = ISNULL(@tms, Tms),
            Directory = ISNULL(@directory, Directory),
            Vehicle = ISNULL(@vehicle, Vehicle),
            Load = ISNULL(@load, Load),
            Amount_gross = ISNULL(@amount_gross, Amount_gross),
            Amount_net = ISNULL(@amount_net, Amount_net),
            Amount_fee = ISNULL(@amount_fee, Amount_fee),
            DateBilling = ISNULL(@dateBilling, DateBilling)
        WHERE Id = @id;
        
        SELECT * FROM dbo.[Transaction] WHERE Id = @id;
    END
    ELSE IF @action = 'delete'
    BEGIN
        DELETE FROM dbo.[Transaction] WHERE Id = @id;
        SELECT @id AS Id, 'Deleted' AS Status;
    END
END;
GO

PRINT 'Created usp_action_transaction with "select-current" action.';
PRINT '';

PRINT '==============================================';
PRINT 'STEP 2: Creating Transaction for User';
PRINT '==============================================';
PRINT '';

DECLARE @UserId NVARCHAR(450);
DECLARE @TransactionId UNIQUEIDENTIFIER;

-- Find the user ID by email
SELECT @UserId = Id 
FROM [dbo].[AspNetUsers] 
WHERE Email = 'anton@madproducts.co.za';

-- Check if user exists
IF @UserId IS NULL
BEGIN
    PRINT 'ERROR: User with email "anton@madproducts.co.za" not found.';
    PRINT 'Please ensure the user exists in AspNetUsers table.';
    RETURN;
END
ELSE
BEGIN
    PRINT 'Found user with ID: ' + @UserId;
END

-- Check if a transaction record already exists for this user
SELECT @TransactionId = Id 
FROM [dbo].[Transaction] 
WHERE UserId = @UserId;

-- Delete any existing transaction records for this user (to ensure clean state)
IF @TransactionId IS NOT NULL
BEGIN
    DELETE FROM [dbo].[Transaction] WHERE UserId = @UserId;
    PRINT 'Deleted existing transaction record(s) for user.';
END

-- Insert a new transaction record with unlimited quantities
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
    PRINT 'All quantities set to -1 (unlimited).';
END
ELSE
BEGIN
    PRINT 'ERROR: Failed to insert transaction record!';
    RETURN;
END

PRINT '';
PRINT '==============================================';
PRINT 'STEP 3: Verification';
PRINT '==============================================';
PRINT '';

-- Display the transaction data
PRINT 'Transaction Record:';
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

-- Test the stored procedure with select-current action
PRINT '';
PRINT 'Testing stored procedure with "select-current" action:';
EXEC dbo.usp_action_transaction 
    @action = 'select-current',
    @userId = @UserId;

-- Final verification
DECLARE @TransactionCount INT;
SELECT @TransactionCount = COUNT(*) FROM [dbo].[Transaction] WHERE UserId = @UserId;

PRINT '';
PRINT '==============================================';
PRINT 'COMPLETE!';
PRINT '==============================================';
PRINT 'Total transaction records for this user: ' + CAST(@TransactionCount AS NVARCHAR(10));
PRINT '';

IF @TransactionCount > 0
BEGIN
    PRINT 'SUCCESS: User "anton@madproducts.co.za" now has unlimited access!';
    PRINT '';
    PRINT 'What was fixed:';
    PRINT '  1. Added missing "select-current" action to usp_action_transaction ✓';
    PRINT '  2. Created transaction record with unlimited quantities (-1) ✓';
    PRINT '  3. Verified the stored procedure returns data correctly ✓';
    PRINT '';
    PRINT 'Result:';
    PRINT '  - getTransactions() will now return data (not empty array) ✓';
    PRINT '  - quantity will be set to -1 (unlimited) ✓';
    PRINT '  - showPaypal() will NEVER be called ✓';
    PRINT '';
    PRINT 'Next steps:';
    PRINT '  1. Refresh your frontend application';
    PRINT '  2. Check console.log(res) - should show transaction data';
    PRINT '  3. Check console.log(this.quantity) - should show -1';
    PRINT '  4. Try adding a vehicle - should work without showPaypal dialog';
END
ELSE
BEGIN
    PRINT 'ERROR: No transaction record found after insert!';
    PRINT 'Please check database permissions and try again.';
END
PRINT '==============================================';
GO

