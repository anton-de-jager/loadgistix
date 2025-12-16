-- =============================================
-- Fix Transaction Stored Procedure
-- =============================================
-- This script adds the missing 'select-current' action to the usp_action_transaction stored procedure
-- The API calls this action but it doesn't exist, causing getTransactions() to return empty array
-- =============================================

USE [findrisk]; -- Update this to your database name if different
GO

-- Drop and recreate the stored procedure with the select-current action
IF OBJECT_ID('dbo.usp_action_transaction', 'P') IS NOT NULL 
    DROP PROCEDURE dbo.usp_action_transaction;
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

PRINT '==============================================';
PRINT 'Transaction stored procedure updated successfully!';
PRINT 'Added missing "select-current" action.';
PRINT '==============================================';
GO

