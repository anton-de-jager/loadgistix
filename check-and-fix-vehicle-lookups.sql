-- =============================================
-- Check and Fix Vehicle Lookup Tables
-- =============================================
-- This script checks if the vehicle lookup tables have data
-- and shows the relationships between them
-- =============================================

USE [findrisk]; -- Update this to your database name if different
GO

PRINT '==============================================';
PRINT 'CHECKING VEHICLE LOOKUP TABLES';
PRINT '==============================================';
PRINT '';

-- Check Vehicle Categories
PRINT '1. Vehicle Categories:';
SELECT COUNT(*) AS Count FROM [dbo].[VehicleCategory];
SELECT TOP 5 * FROM [dbo].[VehicleCategory];
PRINT '';

-- Check Vehicle Types (Load Types)
PRINT '2. Vehicle Types (Load Types):';
SELECT COUNT(*) AS Count FROM [dbo].[VehicleType];
SELECT TOP 10 
    vt.Id,
    vt.Description AS VehicleType,
    vt.VehicleCategoryId,
    vc.Description AS VehicleCategory
FROM [dbo].[VehicleType] vt
LEFT JOIN [dbo].[VehicleCategory] vc ON vt.VehicleCategoryId = vc.Id;
PRINT '';

-- Check Makes
PRINT '3. Vehicle Makes:';
SELECT COUNT(*) AS Count FROM [dbo].[Make];
SELECT TOP 10 * FROM [dbo].[Make] ORDER BY Description;
PRINT '';

-- Check Models
PRINT '4. Vehicle Models:';
SELECT COUNT(*) AS Count FROM [dbo].[Model];
SELECT TOP 10 
    m.Id,
    m.Description AS Model,
    m.MakeId,
    mk.Description AS Make
FROM [dbo].[Model] m
LEFT JOIN [dbo].[Make] mk ON m.MakeId = mk.Id
ORDER BY mk.Description, m.Description;
PRINT '';

-- Check Body Types
PRINT '5. Body Types:';
SELECT COUNT(*) AS Count FROM [dbo].[BodyType];
SELECT TOP 5 * FROM [dbo].[BodyType];
PRINT '';

-- Check Body Loads
PRINT '6. Body Loads:';
SELECT COUNT(*) AS Count FROM [dbo].[BodyLoad];
SELECT TOP 5 * FROM [dbo].[BodyLoad];
PRINT '';

PRINT '==============================================';
PRINT 'ANALYSIS';
PRINT '==============================================';
PRINT '';

-- Check if FAW has models
DECLARE @FAWId UNIQUEIDENTIFIER;
SELECT @FAWId = Id FROM [dbo].[Make] WHERE Description LIKE '%FAW%';

IF @FAWId IS NOT NULL
BEGIN
    PRINT 'FAW Make found with ID: ' + CAST(@FAWId AS NVARCHAR(50));
    PRINT 'Models for FAW:';
    SELECT 
        Id,
        Description,
        MakeId
    FROM [dbo].[Model]
    WHERE MakeId = @FAWId;
    
    DECLARE @FAWModelCount INT;
    SELECT @FAWModelCount = COUNT(*) FROM [dbo].[Model] WHERE MakeId = @FAWId;
    
    IF @FAWModelCount = 0
    BEGIN
        PRINT '';
        PRINT 'WARNING: FAW has no models! This is why the Vehicle Model dropdown is empty.';
        PRINT 'You need to add models for FAW.';
    END
END
ELSE
BEGIN
    PRINT 'WARNING: FAW make not found in database!';
END
PRINT '';

-- Check if Light Commercial Vehicle category has vehicle types
DECLARE @LCVId UNIQUEIDENTIFIER;
SELECT @LCVId = Id FROM [dbo].[VehicleCategory] WHERE Description LIKE '%Light Commercial%';

IF @LCVId IS NOT NULL
BEGIN
    PRINT 'Light Commercial Vehicle category found with ID: ' + CAST(@LCVId AS NVARCHAR(50));
    PRINT 'Vehicle Types (Load Types) for Light Commercial Vehicle:';
    SELECT 
        Id,
        Description,
        VehicleCategoryId
    FROM [dbo].[VehicleType]
    WHERE VehicleCategoryId = @LCVId;
    
    DECLARE @LCVTypeCount INT;
    SELECT @LCVTypeCount = COUNT(*) FROM [dbo].[VehicleType] WHERE VehicleCategoryId = @LCVId;
    
    IF @LCVTypeCount = 0
    BEGIN
        PRINT '';
        PRINT 'WARNING: Light Commercial Vehicle has no vehicle types (load types)!';
        PRINT 'This is why the Load Type dropdown is empty.';
        PRINT 'You need to add vehicle types for this category.';
    END
END
ELSE
BEGIN
    PRINT 'WARNING: Light Commercial Vehicle category not found in database!';
END
PRINT '';

PRINT '==============================================';
PRINT 'RECOMMENDATIONS';
PRINT '==============================================';
PRINT '';
PRINT 'To fix the empty dropdowns:';
PRINT '1. Add Vehicle Types (Load Types) for each Vehicle Category';
PRINT '2. Add Models for each Make (especially FAW)';
PRINT '3. Ensure the foreign key relationships are correct:';
PRINT '   - VehicleType.VehicleCategoryId -> VehicleCategory.Id';
PRINT '   - Model.MakeId -> Make.Id';
PRINT '';
PRINT 'Would you like me to create sample data? (Run the insert script separately)';
PRINT '==============================================';
GO

