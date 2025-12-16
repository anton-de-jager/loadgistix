USE [FindRisk];
GO

-- ============================================================================
-- LOADGISTIX SEED DATA
-- Complete seed data for the Loadgistix database
-- ============================================================================

PRINT 'Starting seed data insertion...';
GO

-- ============================================================================
-- AXEL (Axle configurations)
-- ============================================================================
INSERT INTO dbo.Axel (Id, Description) VALUES
    (NEWID(), '2 Axle'),
    (NEWID(), '3 Axle'),
    (NEWID(), '4 Axle'),
    (NEWID(), '5 Axle'),
    (NEWID(), '6 Axle'),
    (NEWID(), 'Single Axle'),
    (NEWID(), 'Tandem Axle'),
    (NEWID(), 'Tri-Axle');
GO

PRINT 'Axel data inserted.';
GO

-- ============================================================================
-- BODY TYPE (Vehicle body types)
-- ============================================================================
INSERT INTO dbo.BodyType (Id, Description) VALUES
    (NEWID(), 'Box Body'),
    (NEWID(), 'Curtain Side'),
    (NEWID(), 'Drop Side'),
    (NEWID(), 'Flatbed'),
    (NEWID(), 'Refrigerated'),
    (NEWID(), 'Tanker'),
    (NEWID(), 'Tipper'),
    (NEWID(), 'Container'),
    (NEWID(), 'Car Carrier'),
    (NEWID(), 'Livestock'),
    (NEWID(), 'Lowbed'),
    (NEWID(), 'Skeletal'),
    (NEWID(), 'Tautliner'),
    (NEWID(), 'Van Body');
GO

PRINT 'BodyType data inserted.';
GO

-- ============================================================================
-- BODY LOAD (Load body configurations with capacity)
-- ============================================================================
INSERT INTO dbo.BodyLoad (Id, Description, Height, Kilograms, Volume, Litres, Liquid) VALUES
    (NEWID(), '1 Ton', 180, 1000, 6, NULL, 0),
    (NEWID(), '2 Ton', 200, 2000, 12, NULL, 0),
    (NEWID(), '4 Ton', 220, 4000, 24, NULL, 0),
    (NEWID(), '8 Ton', 240, 8000, 40, NULL, 0),
    (NEWID(), '10 Ton', 250, 10000, 50, NULL, 0),
    (NEWID(), '14 Ton', 260, 14000, 60, NULL, 0),
    (NEWID(), '16 Ton', 270, 16000, 70, NULL, 0),
    (NEWID(), '22 Ton', 280, 22000, 80, NULL, 0),
    (NEWID(), '30 Ton', 290, 30000, 90, NULL, 0),
    (NEWID(), '34 Ton', 300, 34000, 100, NULL, 0),
    (NEWID(), 'Interlink', 300, 34000, 120, NULL, 0),
    (NEWID(), 'Super Link', 300, 36000, 130, NULL, 0),
    (NEWID(), '1000 Litres', NULL, NULL, NULL, 1000, 1),
    (NEWID(), '5000 Litres', NULL, NULL, NULL, 5000, 1),
    (NEWID(), '10000 Litres', NULL, NULL, NULL, 10000, 1),
    (NEWID(), '20000 Litres', NULL, NULL, NULL, 20000, 1),
    (NEWID(), '30000 Litres', NULL, NULL, NULL, 30000, 1),
    (NEWID(), '40000 Litres', NULL, NULL, NULL, 40000, 1);
GO

PRINT 'BodyLoad data inserted.';
GO

-- ============================================================================
-- COMPANY TYPE (Types of companies and business descriptions)
-- ============================================================================
INSERT INTO dbo.CompanyType (Id, Description) VALUES
    (NEWID(), 'Owner Operator'),
    (NEWID(), 'Fleet Owner'),
    (NEWID(), 'Transport Company'),
    (NEWID(), 'Logistics Company'),
    (NEWID(), 'Freight Broker'),
    (NEWID(), 'Manufacturer'),
    (NEWID(), 'Wholesaler'),
    (NEWID(), 'Retailer'),
    (NEWID(), 'Distributor'),
    (NEWID(), 'Warehouse'),
    (NEWID(), 'Owned'),
    (NEWID(), 'Rented'),
    (NEWID(), 'Leased'),
    (NEWID(), 'General Freight'),
    (NEWID(), 'Refrigerated Transport'),
    (NEWID(), 'Hazardous Materials'),
    (NEWID(), 'Livestock Transport'),
    (NEWID(), 'Vehicle Transport'),
    (NEWID(), 'Construction Materials'),
    (NEWID(), 'Agricultural Products');
GO

PRINT 'CompanyType data inserted.';
GO

-- ============================================================================
-- LICENCE TYPE (South African driver licence types)
-- ============================================================================
INSERT INTO dbo.LicenceType (Id, Code, Description) VALUES
    (NEWID(), 'A', 'Motorcycle'),
    (NEWID(), 'A1', 'Motorcycle (Light)'),
    (NEWID(), 'B', 'Light Motor Vehicle (Car)'),
    (NEWID(), 'C', 'Heavy Motor Vehicle (Truck)'),
    (NEWID(), 'C1', 'Heavy Motor Vehicle (Medium Truck)'),
    (NEWID(), 'EB', 'Light Motor Vehicle with Trailer'),
    (NEWID(), 'EC', 'Heavy Motor Vehicle with Trailer'),
    (NEWID(), 'EC1', 'Medium Truck with Trailer');
GO

PRINT 'LicenceType data inserted.';
GO

-- ============================================================================
-- LOAD TYPE (Types of loads/cargo)
-- ============================================================================
INSERT INTO dbo.LoadType (Id, Description, Liquid) VALUES
    (NEWID(), 'General Cargo', 0),
    (NEWID(), 'Palletised Goods', 0),
    (NEWID(), 'Loose Cargo', 0),
    (NEWID(), 'Containerised', 0),
    (NEWID(), 'Refrigerated Goods', 0),
    (NEWID(), 'Frozen Goods', 0),
    (NEWID(), 'Hazardous Materials', 0),
    (NEWID(), 'Livestock', 0),
    (NEWID(), 'Vehicles', 0),
    (NEWID(), 'Machinery', 0),
    (NEWID(), 'Construction Materials', 0),
    (NEWID(), 'Agricultural Products', 0),
    (NEWID(), 'Furniture', 0),
    (NEWID(), 'Electronics', 0),
    (NEWID(), 'Textiles', 0),
    (NEWID(), 'Fuel', 1),
    (NEWID(), 'Chemicals', 1),
    (NEWID(), 'Water', 1),
    (NEWID(), 'Milk', 1),
    (NEWID(), 'Oil', 1);
GO

PRINT 'LoadType data inserted.';
GO

-- ============================================================================
-- VEHICLE CATEGORY (Categories of vehicles)
-- ============================================================================
DECLARE @catLCV UNIQUEIDENTIFIER = NEWID();
DECLARE @catMCV UNIQUEIDENTIFIER = NEWID();
DECLARE @catHCV UNIQUEIDENTIFIER = NEWID();
DECLARE @catTrailer UNIQUEIDENTIFIER = NEWID();
DECLARE @catSpecial UNIQUEIDENTIFIER = NEWID();

INSERT INTO dbo.VehicleCategory (Id, Description) VALUES
    (@catLCV, 'Light Commercial Vehicle'),
    (@catMCV, 'Medium Commercial Vehicle'),
    (@catHCV, 'Heavy Commercial Vehicle'),
    (@catTrailer, 'Trailer'),
    (@catSpecial, 'Specialised Vehicle');

-- ============================================================================
-- VEHICLE TYPE (Types of vehicles linked to categories)
-- ============================================================================
INSERT INTO dbo.VehicleType (Id, Description, VehicleCategoryId, VehicleCategoryDescription) VALUES
    -- Light Commercial Vehicles
    (NEWID(), 'Bakkie', CAST(@catLCV AS NVARCHAR(50)), 'Light Commercial Vehicle'),
    (NEWID(), 'Panel Van', CAST(@catLCV AS NVARCHAR(50)), 'Light Commercial Vehicle'),
    (NEWID(), 'LDV', CAST(@catLCV AS NVARCHAR(50)), 'Light Commercial Vehicle'),
    (NEWID(), '1 Ton', CAST(@catLCV AS NVARCHAR(50)), 'Light Commercial Vehicle'),
    -- Medium Commercial Vehicles
    (NEWID(), '2 Ton Truck', CAST(@catMCV AS NVARCHAR(50)), 'Medium Commercial Vehicle'),
    (NEWID(), '4 Ton Truck', CAST(@catMCV AS NVARCHAR(50)), 'Medium Commercial Vehicle'),
    (NEWID(), '8 Ton Truck', CAST(@catMCV AS NVARCHAR(50)), 'Medium Commercial Vehicle'),
    -- Heavy Commercial Vehicles
    (NEWID(), '10 Ton Truck', CAST(@catHCV AS NVARCHAR(50)), 'Heavy Commercial Vehicle'),
    (NEWID(), '14 Ton Truck', CAST(@catHCV AS NVARCHAR(50)), 'Heavy Commercial Vehicle'),
    (NEWID(), '16 Ton Truck', CAST(@catHCV AS NVARCHAR(50)), 'Heavy Commercial Vehicle'),
    (NEWID(), 'Horse (Truck Tractor)', CAST(@catHCV AS NVARCHAR(50)), 'Heavy Commercial Vehicle'),
    (NEWID(), 'Rigid Truck', CAST(@catHCV AS NVARCHAR(50)), 'Heavy Commercial Vehicle'),
    -- Trailers
    (NEWID(), 'Tri-Axle Trailer', CAST(@catTrailer AS NVARCHAR(50)), 'Trailer'),
    (NEWID(), 'Super Link Trailer', CAST(@catTrailer AS NVARCHAR(50)), 'Trailer'),
    (NEWID(), 'Interlink Trailer', CAST(@catTrailer AS NVARCHAR(50)), 'Trailer'),
    (NEWID(), 'Flatbed Trailer', CAST(@catTrailer AS NVARCHAR(50)), 'Trailer'),
    (NEWID(), 'Lowbed Trailer', CAST(@catTrailer AS NVARCHAR(50)), 'Trailer'),
    (NEWID(), 'Tanker Trailer', CAST(@catTrailer AS NVARCHAR(50)), 'Trailer'),
    -- Specialised
    (NEWID(), 'Car Carrier', CAST(@catSpecial AS NVARCHAR(50)), 'Specialised Vehicle'),
    (NEWID(), 'Livestock Carrier', CAST(@catSpecial AS NVARCHAR(50)), 'Specialised Vehicle'),
    (NEWID(), 'Crane Truck', CAST(@catSpecial AS NVARCHAR(50)), 'Specialised Vehicle');
GO

PRINT 'VehicleCategory and VehicleType data inserted.';
GO

-- ============================================================================
-- MAKE (Vehicle makes/brands)
-- ============================================================================
DECLARE @makeMercedes UNIQUEIDENTIFIER = NEWID();
DECLARE @makeScania UNIQUEIDENTIFIER = NEWID();
DECLARE @makeVolvo UNIQUEIDENTIFIER = NEWID();
DECLARE @makeMAN UNIQUEIDENTIFIER = NEWID();
DECLARE @makeIsuzu UNIQUEIDENTIFIER = NEWID();
DECLARE @makeHino UNIQUEIDENTIFIER = NEWID();
DECLARE @makeToyota UNIQUEIDENTIFIER = NEWID();
DECLARE @makeFord UNIQUEIDENTIFIER = NEWID();
DECLARE @makeNissan UNIQUEIDENTIFIER = NEWID();
DECLARE @makeUD UNIQUEIDENTIFIER = NEWID();
DECLARE @makeDAF UNIQUEIDENTIFIER = NEWID();
DECLARE @makeIveco UNIQUEIDENTIFIER = NEWID();
DECLARE @makeFAW UNIQUEIDENTIFIER = NEWID();
DECLARE @makeTATA UNIQUEIDENTIFIER = NEWID();
DECLARE @makeVW UNIQUEIDENTIFIER = NEWID();

INSERT INTO dbo.Make (Id, Description) VALUES
    (@makeMercedes, 'Mercedes-Benz'),
    (@makeScania, 'Scania'),
    (@makeVolvo, 'Volvo'),
    (@makeMAN, 'MAN'),
    (@makeIsuzu, 'Isuzu'),
    (@makeHino, 'Hino'),
    (@makeToyota, 'Toyota'),
    (@makeFord, 'Ford'),
    (@makeNissan, 'Nissan'),
    (@makeUD, 'UD Trucks'),
    (@makeDAF, 'DAF'),
    (@makeIveco, 'Iveco'),
    (@makeFAW, 'FAW'),
    (@makeTATA, 'TATA'),
    (@makeVW, 'Volkswagen');

-- ============================================================================
-- MODEL (Vehicle models linked to makes)
-- ============================================================================
INSERT INTO dbo.Model (Id, Description, MakeId, MakeDescription) VALUES
    -- Mercedes-Benz
    (NEWID(), 'Actros', CAST(@makeMercedes AS NVARCHAR(50)), 'Mercedes-Benz'),
    (NEWID(), 'Axor', CAST(@makeMercedes AS NVARCHAR(50)), 'Mercedes-Benz'),
    (NEWID(), 'Atego', CAST(@makeMercedes AS NVARCHAR(50)), 'Mercedes-Benz'),
    (NEWID(), 'Sprinter', CAST(@makeMercedes AS NVARCHAR(50)), 'Mercedes-Benz'),
    -- Scania
    (NEWID(), 'R Series', CAST(@makeScania AS NVARCHAR(50)), 'Scania'),
    (NEWID(), 'S Series', CAST(@makeScania AS NVARCHAR(50)), 'Scania'),
    (NEWID(), 'G Series', CAST(@makeScania AS NVARCHAR(50)), 'Scania'),
    (NEWID(), 'P Series', CAST(@makeScania AS NVARCHAR(50)), 'Scania'),
    -- Volvo
    (NEWID(), 'FH', CAST(@makeVolvo AS NVARCHAR(50)), 'Volvo'),
    (NEWID(), 'FM', CAST(@makeVolvo AS NVARCHAR(50)), 'Volvo'),
    (NEWID(), 'FMX', CAST(@makeVolvo AS NVARCHAR(50)), 'Volvo'),
    (NEWID(), 'FL', CAST(@makeVolvo AS NVARCHAR(50)), 'Volvo'),
    -- MAN
    (NEWID(), 'TGX', CAST(@makeMAN AS NVARCHAR(50)), 'MAN'),
    (NEWID(), 'TGS', CAST(@makeMAN AS NVARCHAR(50)), 'MAN'),
    (NEWID(), 'TGM', CAST(@makeMAN AS NVARCHAR(50)), 'MAN'),
    (NEWID(), 'TGL', CAST(@makeMAN AS NVARCHAR(50)), 'MAN'),
    -- Isuzu
    (NEWID(), 'N Series', CAST(@makeIsuzu AS NVARCHAR(50)), 'Isuzu'),
    (NEWID(), 'F Series', CAST(@makeIsuzu AS NVARCHAR(50)), 'Isuzu'),
    (NEWID(), 'FX Series', CAST(@makeIsuzu AS NVARCHAR(50)), 'Isuzu'),
    (NEWID(), 'D-Max', CAST(@makeIsuzu AS NVARCHAR(50)), 'Isuzu'),
    -- Hino
    (NEWID(), '300 Series', CAST(@makeHino AS NVARCHAR(50)), 'Hino'),
    (NEWID(), '500 Series', CAST(@makeHino AS NVARCHAR(50)), 'Hino'),
    (NEWID(), '700 Series', CAST(@makeHino AS NVARCHAR(50)), 'Hino'),
    -- Toyota
    (NEWID(), 'Hilux', CAST(@makeToyota AS NVARCHAR(50)), 'Toyota'),
    (NEWID(), 'Land Cruiser', CAST(@makeToyota AS NVARCHAR(50)), 'Toyota'),
    (NEWID(), 'Dyna', CAST(@makeToyota AS NVARCHAR(50)), 'Toyota'),
    -- Ford
    (NEWID(), 'Ranger', CAST(@makeFord AS NVARCHAR(50)), 'Ford'),
    (NEWID(), 'Transit', CAST(@makeFord AS NVARCHAR(50)), 'Ford'),
    -- Nissan
    (NEWID(), 'NP200', CAST(@makeNissan AS NVARCHAR(50)), 'Nissan'),
    (NEWID(), 'NP300', CAST(@makeNissan AS NVARCHAR(50)), 'Nissan'),
    (NEWID(), 'Navara', CAST(@makeNissan AS NVARCHAR(50)), 'Nissan'),
    -- UD Trucks
    (NEWID(), 'Quon', CAST(@makeUD AS NVARCHAR(50)), 'UD Trucks'),
    (NEWID(), 'Quester', CAST(@makeUD AS NVARCHAR(50)), 'UD Trucks'),
    (NEWID(), 'Croner', CAST(@makeUD AS NVARCHAR(50)), 'UD Trucks'),
    -- Volkswagen
    (NEWID(), 'Amarok', CAST(@makeVW AS NVARCHAR(50)), 'Volkswagen'),
    (NEWID(), 'Transporter', CAST(@makeVW AS NVARCHAR(50)), 'Volkswagen'),
    (NEWID(), 'Crafter', CAST(@makeVW AS NVARCHAR(50)), 'Volkswagen');
GO

PRINT 'Make and Model data inserted.';
GO

-- ============================================================================
-- PDP (Professional Driving Permit categories)
-- ============================================================================
INSERT INTO dbo.Pdp (Id, Description) VALUES
    (NEWID(), 'PrDP G - Goods'),
    (NEWID(), 'PrDP P - Passengers'),
    (NEWID(), 'PrDP D - Dangerous Goods');
GO

PRINT 'Pdp data inserted.';
GO

-- ============================================================================
-- RETURN REASON (Reasons for load returns)
-- ============================================================================
INSERT INTO dbo.ReturnReason (Id, Description) VALUES
    (NEWID(), 'Damaged Goods'),
    (NEWID(), 'Wrong Quantity'),
    (NEWID(), 'Wrong Product'),
    (NEWID(), 'Customer Refused'),
    (NEWID(), 'Address Not Found'),
    (NEWID(), 'Customer Not Available'),
    (NEWID(), 'Quality Issues'),
    (NEWID(), 'Expired Products'),
    (NEWID(), 'Temperature Non-Compliance'),
    (NEWID(), 'Documentation Issues'),
    (NEWID(), 'Other');
GO

PRINT 'ReturnReason data inserted.';
GO

-- ============================================================================
-- STOCK PROBLEM (Stock/inventory problems)
-- ============================================================================
INSERT INTO dbo.StockProblem (Id, Description) VALUES
    (NEWID(), 'Shortage'),
    (NEWID(), 'Overage'),
    (NEWID(), 'Damaged'),
    (NEWID(), 'Missing'),
    (NEWID(), 'Wrong SKU'),
    (NEWID(), 'Expired'),
    (NEWID(), 'Quality Issue'),
    (NEWID(), 'Packaging Damage'),
    (NEWID(), 'Contamination'),
    (NEWID(), 'Other');
GO

PRINT 'StockProblem data inserted.';
GO

-- ============================================================================
-- MAINTENANCE PLANNED TYPE (Types of planned maintenance)
-- ============================================================================
INSERT INTO dbo.MaintenancePlannedType (Id, Description) VALUES
    (NEWID(), 'Oil Change'),
    (NEWID(), 'Tyre Rotation'),
    (NEWID(), 'Tyre Replacement'),
    (NEWID(), 'Brake Service'),
    (NEWID(), 'Filter Replacement'),
    (NEWID(), 'Battery Check'),
    (NEWID(), 'Coolant Flush'),
    (NEWID(), 'Transmission Service'),
    (NEWID(), 'Wheel Alignment'),
    (NEWID(), 'General Service'),
    (NEWID(), 'COF Inspection'),
    (NEWID(), 'Licence Renewal');
GO

PRINT 'MaintenancePlannedType data inserted.';
GO

-- ============================================================================
-- MAINTENANCE UNPLANNED TYPE (Types of unplanned maintenance)
-- ============================================================================
INSERT INTO dbo.MaintenanceUnPlannedType (Id, Description) VALUES
    (NEWID(), 'Breakdown'),
    (NEWID(), 'Accident Repair'),
    (NEWID(), 'Tyre Puncture'),
    (NEWID(), 'Engine Problem'),
    (NEWID(), 'Electrical Fault'),
    (NEWID(), 'Brake Failure'),
    (NEWID(), 'Cooling System'),
    (NEWID(), 'Transmission Problem'),
    (NEWID(), 'Fuel System'),
    (NEWID(), 'Suspension Issue'),
    (NEWID(), 'Other');
GO

PRINT 'MaintenanceUnPlannedType data inserted.';
GO

-- ============================================================================
-- DIRECTORY CATEGORY (Business directory categories)
-- ============================================================================
INSERT INTO dbo.DirectoryCategory (Id, Description, DirectoryCount, ChangedOn) VALUES
    (NEWID(), 'Transport Companies', 0, GETDATE()),
    (NEWID(), 'Freight Brokers', 0, GETDATE()),
    (NEWID(), 'Truck Dealers', 0, GETDATE()),
    (NEWID(), 'Trailer Dealers', 0, GETDATE()),
    (NEWID(), 'Parts Suppliers', 0, GETDATE()),
    (NEWID(), 'Tyre Suppliers', 0, GETDATE()),
    (NEWID(), 'Fuel Stations', 0, GETDATE()),
    (NEWID(), 'Truck Stops', 0, GETDATE()),
    (NEWID(), 'Repair Workshops', 0, GETDATE()),
    (NEWID(), 'Insurance Companies', 0, GETDATE()),
    (NEWID(), 'Finance Companies', 0, GETDATE()),
    (NEWID(), 'Training Schools', 0, GETDATE()),
    (NEWID(), 'Tracking Companies', 0, GETDATE()),
    (NEWID(), 'Weighbridges', 0, GETDATE()),
    (NEWID(), 'Warehousing', 0, GETDATE()),
    (NEWID(), 'Cold Storage', 0, GETDATE()),
    (NEWID(), 'Customs Agents', 0, GETDATE()),
    (NEWID(), 'Border Posts', 0, GETDATE()),
    (NEWID(), 'Accommodation', 0, GETDATE()),
    (NEWID(), 'Legal Services', 0, GETDATE());
GO

PRINT 'DirectoryCategory data inserted.';
GO

-- ============================================================================
-- Sample Directory Entries (Business listings)
-- ============================================================================
DECLARE @catTransport UNIQUEIDENTIFIER;
DECLARE @catFuel UNIQUEIDENTIFIER;
DECLARE @catRepair UNIQUEIDENTIFIER;
DECLARE @catTyre UNIQUEIDENTIFIER;

SELECT @catTransport = Id FROM dbo.DirectoryCategory WHERE Description = 'Transport Companies';
SELECT @catFuel = Id FROM dbo.DirectoryCategory WHERE Description = 'Fuel Stations';
SELECT @catRepair = Id FROM dbo.DirectoryCategory WHERE Description = 'Repair Workshops';
SELECT @catTyre = Id FROM dbo.DirectoryCategory WHERE Description = 'Tyre Suppliers';

-- Sample transport companies
INSERT INTO dbo.Directory (Id, UserId, UserDescription, DirectoryCategoryId, DirectoryCategoryDescription, 
    CompanyName, Description, Email, Phone, Website, AddressLat, AddressLon, AddressLabel, Status, CreatedOn, ChangedOn)
VALUES
    (NEWID(), NULL, NULL, @catTransport, 'Transport Companies', 
     'Gauteng Logistics', 'Full load and part load transport services throughout South Africa', 
     'info@gautenglogistics.co.za', '+27 11 123 4567', 'www.gautenglogistics.co.za',
     -26.2041, 28.0473, 'Johannesburg, Gauteng', 'Active', GETDATE(), GETDATE()),
    (NEWID(), NULL, NULL, @catTransport, 'Transport Companies', 
     'Cape Town Freight', 'Specialising in refrigerated transport to and from the Western Cape', 
     'info@ctfreight.co.za', '+27 21 987 6543', 'www.ctfreight.co.za',
     -33.9249, 18.4241, 'Cape Town, Western Cape', 'Active', GETDATE(), GETDATE()),
    (NEWID(), NULL, NULL, @catTransport, 'Transport Companies', 
     'Durban Express', 'Fast and reliable transport services along the N3 corridor', 
     'info@durbanexpress.co.za', '+27 31 456 7890', 'www.durbanexpress.co.za',
     -29.8587, 31.0218, 'Durban, KwaZulu-Natal', 'Active', GETDATE(), GETDATE());

-- Update directory counts
UPDATE dbo.DirectoryCategory SET DirectoryCount = 3, ChangedOn = GETDATE() WHERE Id = @catTransport;
GO

PRINT 'Sample Directory data inserted.';
GO

-- ============================================================================
-- Sample Adverts
-- ============================================================================
INSERT INTO dbo.Advert (Id, UserId, UserDescription, Title, SubTitle, Content, Phone, Email, Website,
    AddressLabel, AddressLat, AddressLon, Status, CreatedOn, ChangedOn)
VALUES
    (NEWID(), NULL, NULL, 'Premium Truck Insurance', 'Protect your fleet with comprehensive coverage',
     'Get a quote today for competitive rates on truck and trailer insurance. We offer breakdown cover, goods in transit, and liability protection.',
     '+27 11 555 1234', 'insurance@loadgistix.com', 'www.loadgistix.com',
     'Johannesburg, Gauteng', -26.2041, 28.0473, 'Active', GETDATE(), GETDATE()),
    (NEWID(), NULL, NULL, 'Fuel Card Special', 'Save up to 15% on diesel',
     'Sign up for our fuel card program and enjoy discounts at over 500 fuel stations nationwide. Track all your fuel expenses in one place.',
     '+27 21 555 5678', 'fuel@loadgistix.com', 'www.loadgistix.com',
     'Cape Town, Western Cape', -33.9249, 18.4241, 'Active', GETDATE(), GETDATE()),
    (NEWID(), NULL, NULL, 'Driver Training Course', 'Professional driving skills development',
     'Improve your drivers skills with our accredited training programs. Defensive driving, load securing, and customer service excellence.',
     '+27 31 555 9012', 'training@loadgistix.com', 'www.loadgistix.com',
     'Durban, KwaZulu-Natal', -29.8587, 31.0218, 'Active', GETDATE(), GETDATE());
GO

PRINT 'Sample Advert data inserted.';
GO

PRINT '';
PRINT '============================================================================';
PRINT 'SEED DATA INSERTION COMPLETE';
PRINT '============================================================================';
PRINT '';
PRINT 'Summary of inserted data:';
PRINT '- Axel types: 8 records';
PRINT '- Body types: 14 records';
PRINT '- Body load configurations: 18 records';
PRINT '- Company types: 20 records';
PRINT '- Licence types: 8 records';
PRINT '- Load types: 20 records';
PRINT '- Vehicle categories: 5 records';
PRINT '- Vehicle types: 21 records';
PRINT '- Makes: 15 records';
PRINT '- Models: 37 records';
PRINT '- PDP types: 3 records';
PRINT '- Return reasons: 11 records';
PRINT '- Stock problems: 10 records';
PRINT '- Maintenance planned types: 12 records';
PRINT '- Maintenance unplanned types: 11 records';
PRINT '- Directory categories: 20 records';
PRINT '- Sample directories: 3 records';
PRINT '- Sample adverts: 3 records';
PRINT '';
GO
