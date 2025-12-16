USE [FindRisk];
GO

-- ============================================================================
-- UPDATE STORED PROCEDURES FOR NEW FIELDS
-- ============================================================================
-- This script updates the stored procedures to include new fields added to:
-- 1. Branch (Email, Phone)
-- 2. Load (DeliveryNoteNumber, WeighBridgeTicketNumber, ReturnDocumentNumber, 
--          ReturnKgs, ReturnPallets, ReturnReasonId, StockProblemId)
-- 3. Bid (Same delivery/return fields as Load)
-- ============================================================================

PRINT 'Starting stored procedure updates...';
GO

-- ============================================================================
-- 1. UPDATE BRANCH STORED PROCEDURE
-- ============================================================================

IF OBJECT_ID('dbo.usp_action_branch', 'P') IS NOT NULL 
    DROP PROCEDURE dbo.usp_action_branch;
GO

CREATE PROCEDURE dbo.usp_action_branch
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @userId NVARCHAR(450) = NULL,
    @userDescription NVARCHAR(200) = NULL,
    @description NVARCHAR(200) = NULL,
    @addressLat FLOAT = NULL,
    @addressLon FLOAT = NULL,
    @addressLabel NVARCHAR(500) = NULL,
    @email NVARCHAR(255) = NULL,
    @phone NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT * FROM dbo.Branch WHERE UserId = @userId ORDER BY Description;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT * FROM dbo.Branch WHERE Id = @id;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.Branch (Id, UserId, UserDescription, Description, AddressLat, AddressLon, AddressLabel, Email, Phone)
        VALUES (@id, @userId, @userDescription, @description, @addressLat, @addressLon, @addressLabel, @email, @phone);
        SELECT * FROM dbo.Branch WHERE Id = @id;
    END
    ELSE IF @action = 'update'
    BEGIN
        UPDATE dbo.Branch SET 
            UserDescription = @userDescription,
            Description = @description,
            AddressLat = @addressLat,
            AddressLon = @addressLon,
            AddressLabel = @addressLabel,
            Email = @email,
            Phone = @phone
        WHERE Id = @id;
        SELECT * FROM dbo.Branch WHERE Id = @id;
    END
    ELSE IF @action = 'delete'
    BEGIN
        DELETE FROM dbo.Branch WHERE Id = @id;
        SELECT 'Success' AS result;
    END
END;
GO

PRINT 'Branch stored procedure updated successfully.';
GO

-- ============================================================================
-- 2. UPDATE LOAD STORED PROCEDURE
-- ============================================================================

IF OBJECT_ID('dbo.usp_action_load', 'P') IS NOT NULL 
    DROP PROCEDURE dbo.usp_action_load;
GO

CREATE PROCEDURE dbo.usp_action_load
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @userId NVARCHAR(450) = NULL,
    @userDescription NVARCHAR(200) = NULL,
    @loadTypeId UNIQUEIDENTIFIER = NULL,
    @loadTypeDescription NVARCHAR(100) = NULL,
    @liquid BIT = NULL,
    @description NVARCHAR(500) = NULL,
    @note NVARCHAR(MAX) = NULL,
    @price FLOAT = NULL,
    @itemCount INT = NULL,
    @weight FLOAT = NULL,
    @length FLOAT = NULL,
    @width FLOAT = NULL,
    @height FLOAT = NULL,
    @volume FLOAT = NULL,
    @totalValue FLOAT = NULL,
    @dateOut DATETIME = NULL,
    @dateIn DATETIME = NULL,
    @dateBidEnd DATETIME = NULL,
    @fridgeHours FLOAT = NULL,
    @kgsLoaded FLOAT = NULL,
    @customerLoadedForm NVARCHAR(200) = NULL,
    @reviewAverageLoad FLOAT = NULL,
    @reviewCountLoad INT = NULL,
    @bidCount INT = NULL,
    @loadDestinationId UNIQUEIDENTIFIER = NULL,
    @originatingAddressLabel NVARCHAR(500) = NULL,
    @originatingAddressLat FLOAT = NULL,
    @originatingAddressLon FLOAT = NULL,
    @destinationAddressLabel NVARCHAR(500) = NULL,
    @destinationAddressLat FLOAT = NULL,
    @destinationAddressLon FLOAT = NULL,
    @route NVARCHAR(MAX) = NULL,
    @meters FLOAT = NULL,
    @minutes FLOAT = NULL,
    @odoStart FLOAT = NULL,
    @odoEnd FLOAT = NULL,
    @deliveryNoteNumber NVARCHAR(100) = NULL,
    @weighBridgeTicketNumber NVARCHAR(100) = NULL,
    @returnDocumentNumber NVARCHAR(100) = NULL,
    @returnKgs FLOAT = NULL,
    @returnPallets INT = NULL,
    @returnReasonId UNIQUEIDENTIFIER = NULL,
    @stockProblemId UNIQUEIDENTIFIER = NULL,
    @destinationCount INT = NULL,
    @destinationDelivered INT = NULL,
    @status NVARCHAR(50) = NULL,
    @createdOn DATETIME = NULL,
    @changedOn DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT * FROM dbo.Load WHERE UserId = @userId ORDER BY CreatedOn DESC;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT * FROM dbo.Load WHERE Id = @id;
    END
    ELSE IF @action = 'select-by-id'
    BEGIN
        SELECT * FROM dbo.Load WHERE Id = @id;
    END
    ELSE IF @action = 'select-route'
    BEGIN
        SELECT * FROM dbo.Load WHERE UserId = @userId AND Status NOT IN ('Cancelled', 'Completed') ORDER BY CreatedOn DESC;
    END
    ELSE IF @action = 'select-route-only'
    BEGIN
        SELECT Route AS result FROM dbo.Load WHERE Id = @id;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.Load (Id, UserId, UserDescription, LoadTypeId, LoadTypeDescription, Liquid,
            Description, Note, Price, ItemCount, Weight, Length, Width, Height, Volume, TotalValue,
            DateOut, DateIn, DateBidEnd, FridgeHours, KgsLoaded, CustomerLoadedForm,
            ReviewAverageLoad, ReviewCountLoad, BidCount, LoadDestinationId,
            OriginatingAddressLabel, OriginatingAddressLat, OriginatingAddressLon,
            DestinationAddressLabel, DestinationAddressLat, DestinationAddressLon,
            Route, Meters, Minutes, OdoStart, OdoEnd, 
            DeliveryNoteNumber, WeighBridgeTicketNumber, ReturnDocumentNumber,
            ReturnKgs, ReturnPallets, ReturnReasonId, StockProblemId,
            DestinationCount, DestinationDelivered,
            Status, CreatedOn, ChangedOn)
        VALUES (@id, @userId, @userDescription, @loadTypeId, @loadTypeDescription, @liquid,
            @description, @note, @price, @itemCount, @weight, @length, @width, @height, @volume, @totalValue,
            @dateOut, @dateIn, @dateBidEnd, @fridgeHours, @kgsLoaded, @customerLoadedForm,
            ISNULL(@reviewAverageLoad, 0), ISNULL(@reviewCountLoad, 0), 0, @loadDestinationId,
            @originatingAddressLabel, @originatingAddressLat, @originatingAddressLon,
            @destinationAddressLabel, @destinationAddressLat, @destinationAddressLon,
            @route, @meters, @minutes, @odoStart, @odoEnd,
            @deliveryNoteNumber, @weighBridgeTicketNumber, @returnDocumentNumber,
            @returnKgs, @returnPallets, @returnReasonId, @stockProblemId,
            ISNULL(@destinationCount, 0), 0,
            ISNULL(@status, 'Open'), GETDATE(), GETDATE());
        SELECT * FROM dbo.Load WHERE Id = @id;
    END
    ELSE IF @action = 'update'
    BEGIN
        -- Delete existing destinations for this load
        DELETE FROM dbo.LoadDestination WHERE LoadId = @id;
        
        UPDATE dbo.Load SET 
            UserDescription = @userDescription,
            LoadTypeId = @loadTypeId,
            LoadTypeDescription = @loadTypeDescription,
            Liquid = @liquid,
            Description = @description,
            Note = @note,
            Price = @price,
            ItemCount = @itemCount,
            Weight = @weight,
            Length = @length,
            Width = @width,
            Height = @height,
            Volume = @volume,
            TotalValue = @totalValue,
            DateOut = @dateOut,
            DateIn = @dateIn,
            DateBidEnd = @dateBidEnd,
            FridgeHours = @fridgeHours,
            Route = @route,
            Meters = @meters,
            Minutes = @minutes,
            OdoStart = @odoStart,
            OdoEnd = @odoEnd,
            DeliveryNoteNumber = @deliveryNoteNumber,
            WeighBridgeTicketNumber = @weighBridgeTicketNumber,
            ReturnDocumentNumber = @returnDocumentNumber,
            ReturnKgs = @returnKgs,
            ReturnPallets = @returnPallets,
            ReturnReasonId = @returnReasonId,
            StockProblemId = @stockProblemId,
            Status = @status,
            ChangedOn = GETDATE()
        WHERE Id = @id;
        SELECT * FROM dbo.Load WHERE Id = @id;
    END
    ELSE IF @action = 'update-status'
    BEGIN
        UPDATE dbo.Load SET Status = @status, ChangedOn = GETDATE() WHERE Id = @id;
        SELECT * FROM dbo.Load WHERE Id = @id;
    END
    ELSE IF @action = 'delete'
    BEGIN
        DELETE FROM dbo.LoadDestination WHERE LoadId = @id;
        DELETE FROM dbo.Bid WHERE LoadId = @id;
        DELETE FROM dbo.Load WHERE Id = @id;
        SELECT 'Success' AS result;
    END
END;
GO

PRINT 'Load stored procedure updated successfully.';
GO

-- ============================================================================
-- 3. UPDATE BID STORED PROCEDURE
-- ============================================================================

IF OBJECT_ID('dbo.usp_action_bid', 'P') IS NOT NULL 
    DROP PROCEDURE dbo.usp_action_bid;
GO

CREATE PROCEDURE dbo.usp_action_bid
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @userId NVARCHAR(450) = NULL,
    @userDescription NVARCHAR(200) = NULL,
    @loadId UNIQUEIDENTIFIER = NULL,
    @loadDescription NVARCHAR(500) = NULL,
    @loadTypeId UNIQUEIDENTIFIER = NULL,
    @loadTypeDescription NVARCHAR(100) = NULL,
    @vehicleId UNIQUEIDENTIFIER = NULL,
    @vehicleDescription NVARCHAR(200) = NULL,
    @vehicleCategoryId UNIQUEIDENTIFIER = NULL,
    @vehicleCategoryDescription NVARCHAR(100) = NULL,
    @vehicleTypeId UNIQUEIDENTIFIER = NULL,
    @vehicleTypeDescription NVARCHAR(100) = NULL,
    @driverId UNIQUEIDENTIFIER = NULL,
    @driverDescription NVARCHAR(200) = NULL,
    @price FLOAT = NULL,
    @dateOut DATETIME = NULL,
    @dateIn DATETIME = NULL,
    @fridgeHours FLOAT = NULL,
    @kgsLoaded FLOAT = NULL,
    @customerLoadedForm NVARCHAR(200) = NULL,
    @status NVARCHAR(50) = NULL,
    @loadDestinationId UNIQUEIDENTIFIER = NULL,
    @originatingAddressLabel NVARCHAR(500) = NULL,
    @originatingAddressLat FLOAT = NULL,
    @originatingAddressLon FLOAT = NULL,
    @destinationAddressLabel NVARCHAR(500) = NULL,
    @destinationAddressLat FLOAT = NULL,
    @destinationAddressLon FLOAT = NULL,
    @route NVARCHAR(MAX) = NULL,
    @meters FLOAT = NULL,
    @minutes FLOAT = NULL,
    @odoStart FLOAT = NULL,
    @odoEnd FLOAT = NULL,
    @deliveryNoteNumber NVARCHAR(100) = NULL,
    @weighBridgeTicketNumber NVARCHAR(100) = NULL,
    @returnDocumentNumber NVARCHAR(100) = NULL,
    @returnKgs FLOAT = NULL,
    @returnPallets INT = NULL,
    @returnReasonId UNIQUEIDENTIFIER = NULL,
    @stockProblemId UNIQUEIDENTIFIER = NULL,
    @destinationCount INT = NULL,
    @destinationDelivered INT = NULL,
    @statusLoad NVARCHAR(50) = NULL,
    @reviewAverageLoad FLOAT = NULL,
    @reviewCountLoad INT = NULL,
    @reviewAverageDriver FLOAT = NULL,
    @reviewCountDriver INT = NULL,
    @createdOn DATETIME = NULL,
    @changedOn DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT * FROM dbo.Bid WHERE UserId = @userId ORDER BY CreatedOn DESC;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT * FROM dbo.Bid WHERE Id = @id;
    END
    ELSE IF @action = 'select-load'
    BEGIN
        SELECT * FROM dbo.Bid WHERE LoadId = @loadId ORDER BY Price;
    END
    ELSE IF @action = 'select-load-open'
    BEGIN
        SELECT * FROM dbo.Bid WHERE LoadId = @loadId AND Status IN ('Pending', 'Accepted') ORDER BY Price;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        
        -- Get load details
        DECLARE @loadData TABLE (
            OriginatingAddressLabel NVARCHAR(500),
            OriginatingAddressLat FLOAT,
            OriginatingAddressLon FLOAT,
            DestinationAddressLabel NVARCHAR(500),
            DestinationAddressLat FLOAT,
            DestinationAddressLon FLOAT,
            Route NVARCHAR(MAX),
            Meters FLOAT,
            Minutes FLOAT,
            DestinationCount INT,
            LoadDestinationId UNIQUEIDENTIFIER
        );
        
        INSERT INTO @loadData
        SELECT OriginatingAddressLabel, OriginatingAddressLat, OriginatingAddressLon,
               DestinationAddressLabel, DestinationAddressLat, DestinationAddressLon,
               Route, Meters, Minutes, DestinationCount, LoadDestinationId
        FROM dbo.Load WHERE Id = @loadId;
        
        INSERT INTO dbo.Bid (Id, UserId, UserDescription, LoadId, LoadDescription, LoadTypeId, LoadTypeDescription,
            VehicleId, VehicleDescription, VehicleCategoryId, VehicleCategoryDescription,
            VehicleTypeId, VehicleTypeDescription, DriverId, DriverDescription, Price, DateOut, DateIn,
            FridgeHours, KgsLoaded, CustomerLoadedForm, Status, LoadDestinationId,
            OriginatingAddressLabel, OriginatingAddressLat, OriginatingAddressLon,
            DestinationAddressLabel, DestinationAddressLat, DestinationAddressLon,
            Route, Meters, Minutes, OdoStart, OdoEnd,
            DeliveryNoteNumber, WeighBridgeTicketNumber, ReturnDocumentNumber,
            ReturnKgs, ReturnPallets, ReturnReasonId, StockProblemId,
            DestinationCount, DestinationDelivered,
            StatusLoad, ReviewAverageLoad, ReviewCountLoad, ReviewAverageDriver, ReviewCountDriver,
            CreatedOn, ChangedOn)
        SELECT @id, @userId, @userDescription, @loadId, @loadDescription, @loadTypeId, @loadTypeDescription,
            @vehicleId, @vehicleDescription, @vehicleCategoryId, @vehicleCategoryDescription,
            @vehicleTypeId, @vehicleTypeDescription, @driverId, @driverDescription, @price, @dateOut, @dateIn,
            @fridgeHours, @kgsLoaded, @customerLoadedForm, 'Pending', ld.LoadDestinationId,
            ld.OriginatingAddressLabel, ld.OriginatingAddressLat, ld.OriginatingAddressLon,
            ld.DestinationAddressLabel, ld.DestinationAddressLat, ld.DestinationAddressLon,
            ld.Route, ld.Meters, ld.Minutes, @odoStart, @odoEnd,
            @deliveryNoteNumber, @weighBridgeTicketNumber, @returnDocumentNumber,
            @returnKgs, @returnPallets, @returnReasonId, @stockProblemId,
            ld.DestinationCount, 0,
            'Open', 0, 0, 0, 0, GETDATE(), GETDATE()
        FROM @loadData ld;
        
        -- Update bid count on load
        UPDATE dbo.Load SET BidCount = BidCount + 1, ChangedOn = GETDATE() WHERE Id = @loadId;
        
        -- Return load and bid
        SELECT * FROM dbo.Load WHERE Id = @loadId;
        SELECT * FROM dbo.Bid WHERE Id = @id;
    END
    ELSE IF @action = 'update'
    BEGIN
        UPDATE dbo.Bid SET 
            VehicleId = @vehicleId,
            VehicleDescription = @vehicleDescription,
            VehicleCategoryId = @vehicleCategoryId,
            VehicleCategoryDescription = @vehicleCategoryDescription,
            VehicleTypeId = @vehicleTypeId,
            VehicleTypeDescription = @vehicleTypeDescription,
            DriverId = @driverId,
            DriverDescription = @driverDescription,
            Price = @price,
            DateOut = @dateOut,
            DateIn = @dateIn,
            FridgeHours = @fridgeHours,
            KgsLoaded = @kgsLoaded,
            OdoStart = @odoStart,
            OdoEnd = @odoEnd,
            DeliveryNoteNumber = @deliveryNoteNumber,
            WeighBridgeTicketNumber = @weighBridgeTicketNumber,
            ReturnDocumentNumber = @returnDocumentNumber,
            ReturnKgs = @returnKgs,
            ReturnPallets = @returnPallets,
            ReturnReasonId = @returnReasonId,
            StockProblemId = @stockProblemId,
            ChangedOn = GETDATE()
        WHERE Id = @id;
        
        -- Return load and bid
        SELECT * FROM dbo.Load WHERE Id = (SELECT LoadId FROM dbo.Bid WHERE Id = @id);
        SELECT * FROM dbo.Bid WHERE Id = @id;
    END
    ELSE IF @action = 'accept'
    BEGIN
        -- Decline all other bids for this load
        UPDATE dbo.Bid SET Status = 'Declined', ChangedOn = GETDATE() 
        WHERE LoadId = (SELECT LoadId FROM dbo.Bid WHERE Id = @id) AND Id != @id;
        
        -- Accept this bid
        UPDATE dbo.Bid SET Status = 'Accepted', StatusLoad = 'Accepted', ChangedOn = GETDATE() WHERE Id = @id;
        
        -- Update load status
        UPDATE dbo.Load SET Status = 'Accepted', ChangedOn = GETDATE() 
        WHERE Id = (SELECT LoadId FROM dbo.Bid WHERE Id = @id);
        
        -- Return load and bid
        SELECT * FROM dbo.Load WHERE Id = (SELECT LoadId FROM dbo.Bid WHERE Id = @id);
        SELECT * FROM dbo.Bid WHERE Id = @id;
    END
    ELSE IF @action = 'decline'
    BEGIN
        UPDATE dbo.Bid SET Status = 'Declined', ChangedOn = GETDATE() WHERE Id = @id;
        
        -- Return load and bid
        SELECT * FROM dbo.Load WHERE Id = (SELECT LoadId FROM dbo.Bid WHERE Id = @id);
        SELECT * FROM dbo.Bid WHERE Id = @id;
    END
    ELSE IF @action = 'delete'
    BEGIN
        DECLARE @bidLoadId UNIQUEIDENTIFIER;
        SELECT @bidLoadId = LoadId FROM dbo.Bid WHERE Id = @id;
        
        DELETE FROM dbo.Bid WHERE Id = @id;
        
        -- Update bid count on load
        IF @bidLoadId IS NOT NULL
        BEGIN
            UPDATE dbo.Load SET BidCount = BidCount - 1, ChangedOn = GETDATE() WHERE Id = @bidLoadId AND BidCount > 0;
        END
        
        SELECT * FROM dbo.Load WHERE Id = @bidLoadId;
    END
END;
GO

PRINT 'Bid stored procedure updated successfully.';
GO

-- ============================================================================
-- VERIFICATION
-- ============================================================================

PRINT '';
PRINT '============================================================================';
PRINT 'STORED PROCEDURE UPDATES COMPLETE';
PRINT '============================================================================';
PRINT '';
PRINT 'Updated stored procedures:';
PRINT '  1. usp_action_branch - Added Email and Phone parameters';
PRINT '  2. usp_action_load - Added delivery/return tracking parameters';
PRINT '  3. usp_action_bid - Added delivery/return tracking parameters';
PRINT '';
PRINT 'Next steps:';
PRINT '  1. Restart the API application';
PRINT '  2. Test branch insert/update operations';
PRINT '  3. Test load insert/update operations';
PRINT '  4. Test bid insert/update operations';
PRINT '============================================================================';
GO

