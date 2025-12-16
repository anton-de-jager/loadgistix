-- =============================================
-- Populate Vehicle Categories and Types (Load Types)
-- =============================================
-- This script adds vehicle categories and their associated vehicle types
-- with proper foreign key relationships
-- =============================================

USE [findrisk]; -- Update this to your database name if different
GO

PRINT '==============================================';
PRINT 'POPULATING VEHICLE CATEGORIES AND TYPES';
PRINT '==============================================';
PRINT '';

-- =============================================
-- SECTION 1: VEHICLE CATEGORIES
-- =============================================

PRINT 'Adding Vehicle Categories...';

-- Declare variables for Category IDs
DECLARE @LightCommercialId UNIQUEIDENTIFIER = NEWID();
DECLARE @MediumTruckId UNIQUEIDENTIFIER = NEWID();
DECLARE @HeavyTruckId UNIQUEIDENTIFIER = NEWID();
DECLARE @ArticulatedTruckId UNIQUEIDENTIFIER = NEWID();
DECLARE @SpecializedId UNIQUEIDENTIFIER = NEWID();
DECLARE @VanId UNIQUEIDENTIFIER = NEWID();

-- Insert Vehicle Categories
INSERT INTO [dbo].[VehicleCategory] (Id, Description) VALUES
    (@LightCommercialId, 'Light Commercial Vehicle'),
    (@MediumTruckId, 'Medium Truck'),
    (@HeavyTruckId, 'Heavy Truck'),
    (@ArticulatedTruckId, 'Articulated Truck'),
    (@SpecializedId, 'Specialized Vehicle'),
    (@VanId, 'Van');

PRINT 'Added 6 vehicle categories.';
PRINT '';

-- =============================================
-- SECTION 2: VEHICLE TYPES (LOAD TYPES)
-- =============================================

PRINT 'Adding Vehicle Types (Load Types) with category relationships...';
PRINT '';

-- Light Commercial Vehicle Types
PRINT '  - Light Commercial Vehicle types...';
INSERT INTO [dbo].[VehicleType] (Id, VehicleCategoryId, VehicleCategoryDescription, Description) VALUES
    (NEWID(), @LightCommercialId, 'Light Commercial Vehicle', 'Dry Freight'),
    (NEWID(), @LightCommercialId, 'Light Commercial Vehicle', 'Refrigerated'),
    (NEWID(), @LightCommercialId, 'Light Commercial Vehicle', 'Curtain Side'),
    (NEWID(), @LightCommercialId, 'Light Commercial Vehicle', 'Flatbed'),
    (NEWID(), @LightCommercialId, 'Light Commercial Vehicle', 'Box Body'),
    (NEWID(), @LightCommercialId, 'Light Commercial Vehicle', 'Tipper'),
    (NEWID(), @LightCommercialId, 'Light Commercial Vehicle', 'Dropside');

-- Medium Truck Types
PRINT '  - Medium Truck types...';
INSERT INTO [dbo].[VehicleType] (Id, VehicleCategoryId, VehicleCategoryDescription, Description) VALUES
    (NEWID(), @MediumTruckId, 'Medium Truck', 'Dry Freight'),
    (NEWID(), @MediumTruckId, 'Medium Truck', 'Refrigerated'),
    (NEWID(), @MediumTruckId, 'Medium Truck', 'Curtain Side'),
    (NEWID(), @MediumTruckId, 'Medium Truck', 'Flatbed'),
    (NEWID(), @MediumTruckId, 'Medium Truck', 'Box Body'),
    (NEWID(), @MediumTruckId, 'Medium Truck', 'Tipper'),
    (NEWID(), @MediumTruckId, 'Medium Truck', 'Crane Truck'),
    (NEWID(), @MediumTruckId, 'Medium Truck', 'Livestock Carrier'),
    (NEWID(), @MediumTruckId, 'Medium Truck', 'Beverage Truck');

-- Heavy Truck Types
PRINT '  - Heavy Truck types...';
INSERT INTO [dbo].[VehicleType] (Id, VehicleCategoryId, VehicleCategoryDescription, Description) VALUES
    (NEWID(), @HeavyTruckId, 'Heavy Truck', 'Dry Freight'),
    (NEWID(), @HeavyTruckId, 'Heavy Truck', 'Refrigerated'),
    (NEWID(), @HeavyTruckId, 'Heavy Truck', 'Curtain Side'),
    (NEWID(), @HeavyTruckId, 'Heavy Truck', 'Flatbed'),
    (NEWID(), @HeavyTruckId, 'Heavy Truck', 'Box Body'),
    (NEWID(), @HeavyTruckId, 'Heavy Truck', 'Tipper'),
    (NEWID(), @HeavyTruckId, 'Heavy Truck', 'Crane Truck'),
    (NEWID(), @HeavyTruckId, 'Heavy Truck', 'Livestock Carrier'),
    (NEWID(), @HeavyTruckId, 'Heavy Truck', 'Tanker'),
    (NEWID(), @HeavyTruckId, 'Heavy Truck', 'Concrete Mixer'),
    (NEWID(), @HeavyTruckId, 'Heavy Truck', 'Car Carrier'),
    (NEWID(), @HeavyTruckId, 'Heavy Truck', 'Logging Truck');

-- Articulated Truck Types
PRINT '  - Articulated Truck types...';
INSERT INTO [dbo].[VehicleType] (Id, VehicleCategoryId, VehicleCategoryDescription, Description) VALUES
    (NEWID(), @ArticulatedTruckId, 'Articulated Truck', 'Dry Freight Trailer'),
    (NEWID(), @ArticulatedTruckId, 'Articulated Truck', 'Refrigerated Trailer'),
    (NEWID(), @ArticulatedTruckId, 'Articulated Truck', 'Curtain Side Trailer'),
    (NEWID(), @ArticulatedTruckId, 'Articulated Truck', 'Flatbed Trailer'),
    (NEWID(), @ArticulatedTruckId, 'Articulated Truck', 'Container Trailer'),
    (NEWID(), @ArticulatedTruckId, 'Articulated Truck', 'Tanker Trailer'),
    (NEWID(), @ArticulatedTruckId, 'Articulated Truck', 'Low Loader'),
    (NEWID(), @ArticulatedTruckId, 'Articulated Truck', 'Car Carrier Trailer'),
    (NEWID(), @ArticulatedTruckId, 'Articulated Truck', 'Livestock Trailer'),
    (NEWID(), @ArticulatedTruckId, 'Articulated Truck', 'Tipper Trailer'),
    (NEWID(), @ArticulatedTruckId, 'Articulated Truck', 'Interlink'),
    (NEWID(), @ArticulatedTruckId, 'Articulated Truck', 'B-Double'),
    (NEWID(), @ArticulatedTruckId, 'Articulated Truck', 'Road Train');

-- Specialized Vehicle Types
PRINT '  - Specialized Vehicle types...';
INSERT INTO [dbo].[VehicleType] (Id, VehicleCategoryId, VehicleCategoryDescription, Description) VALUES
    (NEWID(), @SpecializedId, 'Specialized Vehicle', 'Hazmat Tanker'),
    (NEWID(), @SpecializedId, 'Specialized Vehicle', 'Bulk Powder'),
    (NEWID(), @SpecializedId, 'Specialized Vehicle', 'Silo Trailer'),
    (NEWID(), @SpecializedId, 'Specialized Vehicle', 'Abnormal Load'),
    (NEWID(), @SpecializedId, 'Specialized Vehicle', 'Heavy Haulage'),
    (NEWID(), @SpecializedId, 'Specialized Vehicle', 'Waste Collection'),
    (NEWID(), @SpecializedId, 'Specialized Vehicle', 'Recovery Vehicle'),
    (NEWID(), @SpecializedId, 'Specialized Vehicle', 'Mobile Crane');

-- Van Types
PRINT '  - Van types...';
INSERT INTO [dbo].[VehicleType] (Id, VehicleCategoryId, VehicleCategoryDescription, Description) VALUES
    (NEWID(), @VanId, 'Van', 'Panel Van'),
    (NEWID(), @VanId, 'Van', 'Refrigerated Van'),
    (NEWID(), @VanId, 'Van', 'Luton Van'),
    (NEWID(), @VanId, 'Van', 'Dropside Van'),
    (NEWID(), @VanId, 'Van', 'Tipper Van'),
    (NEWID(), @VanId, 'Van', 'Minibus'),
    (NEWID(), @VanId, 'Van', 'Crew Cab Van');

PRINT '';
PRINT '==============================================';
PRINT 'SUMMARY';
PRINT '==============================================';

-- Count totals
DECLARE @CategoryCount INT, @TypeCount INT;
SELECT @CategoryCount = COUNT(*) FROM [dbo].[VehicleCategory];
SELECT @TypeCount = COUNT(*) FROM [dbo].[VehicleType];

PRINT 'Total Vehicle Categories: ' + CAST(@CategoryCount AS NVARCHAR(10));
PRINT 'Total Vehicle Types (Load Types): ' + CAST(@TypeCount AS NVARCHAR(10));
PRINT '';

-- Show breakdown by category
PRINT 'Vehicle Types per Category:';
SELECT 
    vc.Description AS Category,
    COUNT(vt.Id) AS TypeCount
FROM [dbo].[VehicleCategory] vc
LEFT JOIN [dbo].[VehicleType] vt ON vc.Id = vt.VehicleCategoryId
GROUP BY vc.Description
ORDER BY COUNT(vt.Id) DESC, vc.Description;

PRINT '';

-- Verify the Light Commercial Vehicle specifically
PRINT 'Verification for "Light Commercial Vehicle":';
SELECT 
    vt.Description AS LoadType,
    vt.VehicleCategoryDescription AS Category
FROM [dbo].[VehicleType] vt
INNER JOIN [dbo].[VehicleCategory] vc ON vt.VehicleCategoryId = vc.Id
WHERE vc.Description = 'Light Commercial Vehicle'
ORDER BY vt.Description;

PRINT '';
PRINT '==============================================';
PRINT 'COMPLETE!';
PRINT '==============================================';
PRINT 'All vehicle categories and types have been added successfully.';
PRINT '';
PRINT 'When you select "Light Commercial Vehicle" as the category,';
PRINT 'you will now see 7 load types in the dropdown:';
PRINT '  - Dry Freight';
PRINT '  - Refrigerated';
PRINT '  - Curtain Side';
PRINT '  - Flatbed';
PRINT '  - Box Body';
PRINT '  - Tipper';
PRINT '  - Dropside';
PRINT '==============================================';
GO

