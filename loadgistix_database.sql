USE [FindRisk];
GO

-- ============================================================================
-- LOADGISTIX DATABASE SCHEMA
-- Complete database creation script for MSSQL Server
-- ============================================================================

-- ============================================================================
-- DROP EXISTING OBJECTS (if they exist) - for clean re-creation
-- ============================================================================

-- Drop stored procedures
IF OBJECT_ID('dbo.usp_action_advert', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_advert;
IF OBJECT_ID('dbo.usp_action_axel', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_axel;
IF OBJECT_ID('dbo.usp_action_bid', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_bid;
IF OBJECT_ID('dbo.usp_action_bodyLoad', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_bodyLoad;
IF OBJECT_ID('dbo.usp_action_bodyType', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_bodyType;
IF OBJECT_ID('dbo.usp_action_branch', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_branch;
IF OBJECT_ID('dbo.usp_action_companyType', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_companyType;
IF OBJECT_ID('dbo.usp_action_dashboard', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_dashboard;
IF OBJECT_ID('dbo.usp_action_directory', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_directory;
IF OBJECT_ID('dbo.usp_action_directoryCategory', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_directoryCategory;
IF OBJECT_ID('dbo.usp_action_directories_available', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_directories_available;
IF OBJECT_ID('dbo.usp_action_directory_by_category', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_directory_by_category;
IF OBJECT_ID('dbo.usp_action_directory_by_distance', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_directory_by_distance;
IF OBJECT_ID('dbo.usp_action_driver', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_driver;
IF OBJECT_ID('dbo.usp_action_fuel', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_fuel;
IF OBJECT_ID('dbo.usp_action_licenceType', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_licenceType;
IF OBJECT_ID('dbo.usp_action_load', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_load;
IF OBJECT_ID('dbo.usp_action_loadDestination', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_loadDestination;
IF OBJECT_ID('dbo.usp_action_loads_available', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_loads_available;
IF OBJECT_ID('dbo.usp_action_loadType', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_loadType;
IF OBJECT_ID('dbo.usp_action_maintenancePlanned', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_maintenancePlanned;
IF OBJECT_ID('dbo.usp_action_maintenancePlannedType', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_maintenancePlannedType;
IF OBJECT_ID('dbo.usp_action_maintenanceUnPlanned', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_maintenanceUnPlanned;
IF OBJECT_ID('dbo.usp_action_maintenanceUnPlannedType', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_maintenanceUnPlannedType;
IF OBJECT_ID('dbo.usp_action_make', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_make;
IF OBJECT_ID('dbo.usp_action_model', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_model;
IF OBJECT_ID('dbo.usp_action_pdp', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_pdp;
IF OBJECT_ID('dbo.usp_action_quote', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_quote;
IF OBJECT_ID('dbo.usp_action_returnReason', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_returnReason;
IF OBJECT_ID('dbo.usp_action_reviewDriver', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_reviewDriver;
IF OBJECT_ID('dbo.usp_action_reviewLoad', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_reviewLoad;
IF OBJECT_ID('dbo.usp_action_stockProblem', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_stockProblem;
IF OBJECT_ID('dbo.usp_action_subscription', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_subscription;
IF OBJECT_ID('dbo.usp_action_transaction', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_transaction;
IF OBJECT_ID('dbo.usp_action_user', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_user;
IF OBJECT_ID('dbo.usp_action_vehicle', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_vehicle;
IF OBJECT_ID('dbo.usp_action_vehicleCategory', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_vehicleCategory;
IF OBJECT_ID('dbo.usp_action_vehicleType', 'P') IS NOT NULL DROP PROCEDURE dbo.usp_action_vehicleType;
GO

-- Drop functions
IF OBJECT_ID('dbo.fn_CalculateDistanceKm', 'FN') IS NOT NULL DROP FUNCTION dbo.fn_CalculateDistanceKm;
GO

-- Drop views
IF OBJECT_ID('dbo.vw_Load', 'V') IS NOT NULL DROP VIEW dbo.vw_Load;
IF OBJECT_ID('dbo.vw_BidLoad', 'V') IS NOT NULL DROP VIEW dbo.vw_BidLoad;
IF OBJECT_ID('dbo.vw_Quote', 'V') IS NOT NULL DROP VIEW dbo.vw_Quote;
GO

-- Drop tables (in order due to foreign key constraints)
IF OBJECT_ID('dbo.ReviewDriver', 'U') IS NOT NULL DROP TABLE dbo.ReviewDriver;
IF OBJECT_ID('dbo.ReviewLoad', 'U') IS NOT NULL DROP TABLE dbo.ReviewLoad;
IF OBJECT_ID('dbo.MaintenancePlanned', 'U') IS NOT NULL DROP TABLE dbo.MaintenancePlanned;
IF OBJECT_ID('dbo.MaintenanceUnPlanned', 'U') IS NOT NULL DROP TABLE dbo.MaintenanceUnPlanned;
IF OBJECT_ID('dbo.Fuel', 'U') IS NOT NULL DROP TABLE dbo.Fuel;
IF OBJECT_ID('dbo.LoadDestination', 'U') IS NOT NULL DROP TABLE dbo.LoadDestination;
IF OBJECT_ID('dbo.Bid', 'U') IS NOT NULL DROP TABLE dbo.Bid;
IF OBJECT_ID('dbo.Load', 'U') IS NOT NULL DROP TABLE dbo.Load;
IF OBJECT_ID('dbo.Vehicle', 'U') IS NOT NULL DROP TABLE dbo.Vehicle;
IF OBJECT_ID('dbo.Driver', 'U') IS NOT NULL DROP TABLE dbo.Driver;
IF OBJECT_ID('dbo.Branch', 'U') IS NOT NULL DROP TABLE dbo.Branch;
IF OBJECT_ID('dbo.DirectoryLog', 'U') IS NOT NULL DROP TABLE dbo.DirectoryLog;
IF OBJECT_ID('dbo.Directory', 'U') IS NOT NULL DROP TABLE dbo.Directory;
IF OBJECT_ID('dbo.DirectoryCategory', 'U') IS NOT NULL DROP TABLE dbo.DirectoryCategory;
IF OBJECT_ID('dbo.AdvertLog', 'U') IS NOT NULL DROP TABLE dbo.AdvertLog;
IF OBJECT_ID('dbo.Advert', 'U') IS NOT NULL DROP TABLE dbo.Advert;
IF OBJECT_ID('dbo.QuoteTrailer', 'U') IS NOT NULL DROP TABLE dbo.QuoteTrailer;
IF OBJECT_ID('dbo.QuoteTruck', 'U') IS NOT NULL DROP TABLE dbo.QuoteTruck;
IF OBJECT_ID('dbo.Quote', 'U') IS NOT NULL DROP TABLE dbo.Quote;
IF OBJECT_ID('dbo.Transaction', 'U') IS NOT NULL DROP TABLE dbo.[Transaction];
IF OBJECT_ID('dbo.Subscription', 'U') IS NOT NULL DROP TABLE dbo.Subscription;
IF OBJECT_ID('dbo.Model', 'U') IS NOT NULL DROP TABLE dbo.Model;
IF OBJECT_ID('dbo.Make', 'U') IS NOT NULL DROP TABLE dbo.Make;
IF OBJECT_ID('dbo.VehicleType', 'U') IS NOT NULL DROP TABLE dbo.VehicleType;
IF OBJECT_ID('dbo.VehicleCategory', 'U') IS NOT NULL DROP TABLE dbo.VehicleCategory;
IF OBJECT_ID('dbo.BodyType', 'U') IS NOT NULL DROP TABLE dbo.BodyType;
IF OBJECT_ID('dbo.BodyLoad', 'U') IS NOT NULL DROP TABLE dbo.BodyLoad;
IF OBJECT_ID('dbo.LoadType', 'U') IS NOT NULL DROP TABLE dbo.LoadType;
IF OBJECT_ID('dbo.LicenceType', 'U') IS NOT NULL DROP TABLE dbo.LicenceType;
IF OBJECT_ID('dbo.Axel', 'U') IS NOT NULL DROP TABLE dbo.Axel;
IF OBJECT_ID('dbo.CompanyType', 'U') IS NOT NULL DROP TABLE dbo.CompanyType;
IF OBJECT_ID('dbo.Pdp', 'U') IS NOT NULL DROP TABLE dbo.Pdp;
IF OBJECT_ID('dbo.ReturnReason', 'U') IS NOT NULL DROP TABLE dbo.ReturnReason;
IF OBJECT_ID('dbo.StockProblem', 'U') IS NOT NULL DROP TABLE dbo.StockProblem;
IF OBJECT_ID('dbo.MaintenancePlannedType', 'U') IS NOT NULL DROP TABLE dbo.MaintenancePlannedType;
IF OBJECT_ID('dbo.MaintenanceUnPlannedType', 'U') IS NOT NULL DROP TABLE dbo.MaintenanceUnPlannedType;
GO

-- ============================================================================
-- CREATE TABLES
-- ============================================================================

-- ============================================================================
-- ASP.NET Identity Tables
-- ============================================================================

-- AspNetRoles
IF OBJECT_ID('dbo.AspNetRoles', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.AspNetRoles (
        Id NVARCHAR(450) NOT NULL PRIMARY KEY,
        Name NVARCHAR(256) NULL,
        NormalizedName NVARCHAR(256) NULL,
        ConcurrencyStamp NVARCHAR(MAX) NULL
    );
    CREATE UNIQUE NONCLUSTERED INDEX RoleNameIndex ON dbo.AspNetRoles(NormalizedName) WHERE NormalizedName IS NOT NULL;
END
GO

-- AspNetUsers (Extended with custom fields)
IF OBJECT_ID('dbo.AspNetUsers', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.AspNetUsers (
        Id NVARCHAR(450) NOT NULL PRIMARY KEY,
        UserName NVARCHAR(256) NULL,
        NormalizedUserName NVARCHAR(256) NULL,
        Email NVARCHAR(256) NULL,
        NormalizedEmail NVARCHAR(256) NULL,
        EmailConfirmed BIT NOT NULL DEFAULT 0,
        PasswordHash NVARCHAR(MAX) NULL,
        SecurityStamp NVARCHAR(MAX) NULL,
        ConcurrencyStamp NVARCHAR(MAX) NULL,
        PhoneNumber NVARCHAR(MAX) NULL,
        PhoneNumberConfirmed BIT NOT NULL DEFAULT 0,
        TwoFactorEnabled BIT NOT NULL DEFAULT 0,
        LockoutEnd DATETIMEOFFSET NULL,
        LockoutEnabled BIT NOT NULL DEFAULT 0,
        AccessFailedCount INT NOT NULL DEFAULT 0,
        -- Custom fields for Loadgistix
        Name NVARCHAR(250) NULL,
        Company NVARCHAR(250) NULL,
        Avatar NVARCHAR(250) NULL,
        Status NVARCHAR(250) NULL,
        ResetToken NVARCHAR(250) NULL,
        DeviceId NVARCHAR(250) NULL,
        Token NVARCHAR(MAX) NULL,
        LastLoggedIn DATETIME NULL
    );
    CREATE NONCLUSTERED INDEX EmailIndex ON dbo.AspNetUsers(NormalizedEmail);
    CREATE UNIQUE NONCLUSTERED INDEX UserNameIndex ON dbo.AspNetUsers(NormalizedUserName) WHERE NormalizedUserName IS NOT NULL;
END
GO

-- AspNetUserRoles
IF OBJECT_ID('dbo.AspNetUserRoles', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.AspNetUserRoles (
        UserId NVARCHAR(450) NOT NULL,
        RoleId NVARCHAR(450) NOT NULL,
        PRIMARY KEY (UserId, RoleId),
        FOREIGN KEY (RoleId) REFERENCES dbo.AspNetRoles(Id) ON DELETE CASCADE,
        FOREIGN KEY (UserId) REFERENCES dbo.AspNetUsers(Id) ON DELETE CASCADE
    );
    CREATE NONCLUSTERED INDEX IX_AspNetUserRoles_RoleId ON dbo.AspNetUserRoles(RoleId);
END
GO

-- AspNetUserClaims
IF OBJECT_ID('dbo.AspNetUserClaims', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.AspNetUserClaims (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        UserId NVARCHAR(450) NOT NULL,
        ClaimType NVARCHAR(MAX) NULL,
        ClaimValue NVARCHAR(MAX) NULL,
        FOREIGN KEY (UserId) REFERENCES dbo.AspNetUsers(Id) ON DELETE CASCADE
    );
    CREATE NONCLUSTERED INDEX IX_AspNetUserClaims_UserId ON dbo.AspNetUserClaims(UserId);
END
GO

-- AspNetUserLogins
IF OBJECT_ID('dbo.AspNetUserLogins', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.AspNetUserLogins (
        LoginProvider NVARCHAR(450) NOT NULL,
        ProviderKey NVARCHAR(450) NOT NULL,
        ProviderDisplayName NVARCHAR(MAX) NULL,
        UserId NVARCHAR(450) NOT NULL,
        PRIMARY KEY (LoginProvider, ProviderKey),
        FOREIGN KEY (UserId) REFERENCES dbo.AspNetUsers(Id) ON DELETE CASCADE
    );
    CREATE NONCLUSTERED INDEX IX_AspNetUserLogins_UserId ON dbo.AspNetUserLogins(UserId);
END
GO

-- AspNetUserTokens
IF OBJECT_ID('dbo.AspNetUserTokens', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.AspNetUserTokens (
        UserId NVARCHAR(450) NOT NULL,
        LoginProvider NVARCHAR(450) NOT NULL,
        Name NVARCHAR(450) NOT NULL,
        Value NVARCHAR(MAX) NULL,
        PRIMARY KEY (UserId, LoginProvider, Name),
        FOREIGN KEY (UserId) REFERENCES dbo.AspNetUsers(Id) ON DELETE CASCADE
    );
END
GO

-- AspNetRoleClaims
IF OBJECT_ID('dbo.AspNetRoleClaims', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.AspNetRoleClaims (
        Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        RoleId NVARCHAR(450) NOT NULL,
        ClaimType NVARCHAR(MAX) NULL,
        ClaimValue NVARCHAR(MAX) NULL,
        FOREIGN KEY (RoleId) REFERENCES dbo.AspNetRoles(Id) ON DELETE CASCADE
    );
    CREATE NONCLUSTERED INDEX IX_AspNetRoleClaims_RoleId ON dbo.AspNetRoleClaims(RoleId);
END
GO

PRINT 'ASP.NET Identity tables created/verified.';
GO

-- ============================================================================
-- Application Tables
-- ============================================================================

-- Axel (Axle types for vehicles)
CREATE TABLE dbo.Axel (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Description NVARCHAR(100) NULL
);
GO

-- BodyType (Vehicle body types)
CREATE TABLE dbo.BodyType (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Description NVARCHAR(100) NULL
);
GO

-- BodyLoad (Load body configurations)
CREATE TABLE dbo.BodyLoad (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Description NVARCHAR(100) NULL,
    Height INT NULL,
    Kilograms INT NULL,
    Volume INT NULL,
    Litres INT NULL,
    Liquid BIT NULL DEFAULT 0
);
GO

-- CompanyType (Types of companies)
CREATE TABLE dbo.CompanyType (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Description NVARCHAR(100) NULL
);
GO

-- LicenceType (Driver licence types)
CREATE TABLE dbo.LicenceType (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Code NVARCHAR(20) NULL,
    Description NVARCHAR(200) NULL
);
GO

-- LoadType (Types of loads)
CREATE TABLE dbo.LoadType (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Description NVARCHAR(100) NULL,
    Liquid BIT NULL DEFAULT 0
);
GO

-- VehicleCategory (Categories of vehicles)
CREATE TABLE dbo.VehicleCategory (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Description NVARCHAR(100) NULL
);
GO

-- VehicleType (Types of vehicles)
CREATE TABLE dbo.VehicleType (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Description NVARCHAR(100) NULL,
    VehicleCategoryId NVARCHAR(50) NULL,
    VehicleCategoryDescription NVARCHAR(100) NULL
);
GO

-- Make (Vehicle makes/brands)
CREATE TABLE dbo.Make (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Description NVARCHAR(100) NULL
);
GO

-- Model (Vehicle models)
CREATE TABLE dbo.Model (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Description NVARCHAR(100) NULL,
    MakeId NVARCHAR(50) NULL,
    MakeDescription NVARCHAR(100) NULL
);
GO

-- Pdp (Professional Driving Permit types)
CREATE TABLE dbo.Pdp (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Description NVARCHAR(100) NULL
);
GO

-- ReturnReason (Reasons for load returns)
CREATE TABLE dbo.ReturnReason (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Description NVARCHAR(200) NULL
);
GO

-- StockProblem (Stock/inventory problems)
CREATE TABLE dbo.StockProblem (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Description NVARCHAR(200) NULL
);
GO

-- MaintenancePlannedType (Types of planned maintenance)
CREATE TABLE dbo.MaintenancePlannedType (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Description NVARCHAR(200) NULL
);
GO

-- MaintenanceUnPlannedType (Types of unplanned maintenance)
CREATE TABLE dbo.MaintenanceUnPlannedType (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Description NVARCHAR(200) NULL
);
GO

-- DirectoryCategory (Business directory categories)
CREATE TABLE dbo.DirectoryCategory (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Description NVARCHAR(200) NULL,
    DirectoryCount INT NULL DEFAULT 0,
    ChangedOn DATETIME NULL DEFAULT GETDATE()
);
GO

-- Directory (Business directory listings)
CREATE TABLE dbo.Directory (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId NVARCHAR(450) NULL,
    UserDescription NVARCHAR(200) NULL,
    DirectoryCategoryId UNIQUEIDENTIFIER NULL,
    DirectoryCategoryDescription NVARCHAR(200) NULL,
    CompanyName NVARCHAR(200) NULL,
    Description NVARCHAR(MAX) NULL,
    Email NVARCHAR(200) NULL,
    Phone NVARCHAR(50) NULL,
    Website NVARCHAR(500) NULL,
    Instagram NVARCHAR(200) NULL,
    Facebook NVARCHAR(200) NULL,
    Twitter NVARCHAR(200) NULL,
    LinkedIn NVARCHAR(200) NULL,
    AddressLat FLOAT NULL,
    AddressLon FLOAT NULL,
    AddressLabel NVARCHAR(500) NULL,
    Avatar NVARCHAR(100) NULL,
    Status NVARCHAR(50) NULL DEFAULT 'Active',
    CreatedOn DATETIME NULL DEFAULT GETDATE(),
    ChangedOn DATETIME NULL DEFAULT GETDATE()
);
GO

-- DirectoryLog (Directory view/access logs)
CREATE TABLE dbo.DirectoryLog (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    DirectoryId UNIQUEIDENTIFIER NULL,
    DirectoryDate DATETIME NULL DEFAULT GETDATE(),
    DirectoryCount INT NULL DEFAULT 0
);
GO

-- Advert (Advertisements)
CREATE TABLE dbo.Advert (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId NVARCHAR(450) NULL,
    UserDescription NVARCHAR(200) NULL,
    Title NVARCHAR(200) NULL,
    SubTitle NVARCHAR(500) NULL,
    Content NVARCHAR(MAX) NULL,
    Phone NVARCHAR(50) NULL,
    Email NVARCHAR(200) NULL,
    Website NVARCHAR(500) NULL,
    AddressLabel NVARCHAR(500) NULL,
    AddressLat FLOAT NULL,
    AddressLon FLOAT NULL,
    Avatar NVARCHAR(100) NULL,
    Status NVARCHAR(50) NULL DEFAULT 'Active',
    CreatedOn DATETIME NULL DEFAULT GETDATE(),
    ChangedOn DATETIME NULL DEFAULT GETDATE()
);
GO

-- AdvertLog (Advertisement view/access logs)
CREATE TABLE dbo.AdvertLog (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    AdvertId UNIQUEIDENTIFIER NULL,
    AdvertDate DATETIME NULL DEFAULT GETDATE(),
    AdvertCount INT NULL DEFAULT 0
);
GO

-- Branch (Company branches/locations)
CREATE TABLE dbo.Branch (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId NVARCHAR(450) NULL,
    UserDescription NVARCHAR(200) NULL,
    Description NVARCHAR(200) NULL,
    AddressLat FLOAT NULL,
    AddressLon FLOAT NULL,
    AddressLabel NVARCHAR(500) NULL
);
GO

-- Driver (Drivers)
CREATE TABLE dbo.Driver (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId NVARCHAR(450) NULL,
    UserDescription NVARCHAR(200) NULL,
    FirstName NVARCHAR(100) NULL,
    LastName NVARCHAR(100) NULL,
    Phone NVARCHAR(50) NULL,
    Email NVARCHAR(200) NULL,
    Password NVARCHAR(200) NULL,
    IdNumber NVARCHAR(50) NULL,
    DateOfBirth DATETIME NULL,
    LicenceTypeId UNIQUEIDENTIFIER NULL,
    LicenceTypeDescription NVARCHAR(200) NULL,
    LicenceTypeCode NVARCHAR(20) NULL,
    LicenceExpiryDate DATETIME NULL,
    PdpExpiryDate DATETIME NULL,
    Avatar NVARCHAR(100) NULL,
    AvatarPdp NVARCHAR(100) NULL,
    Status NVARCHAR(50) NULL DEFAULT 'Active',
    PdpId NVARCHAR(50) NULL
);
GO

-- Vehicle (Vehicles)
CREATE TABLE dbo.Vehicle (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId NVARCHAR(450) NULL,
    UserDescription NVARCHAR(200) NULL,
    BranchId UNIQUEIDENTIFIER NULL,
    BranchDescription NVARCHAR(200) NULL,
    VehicleId NVARCHAR(50) NULL,
    VehicleCategoryId UNIQUEIDENTIFIER NULL,
    VehicleCategoryDescription NVARCHAR(100) NULL,
    VehicleTypeId UNIQUEIDENTIFIER NULL,
    VehicleTypeDescription NVARCHAR(100) NULL,
    MakeId UNIQUEIDENTIFIER NULL,
    MakeDescription NVARCHAR(100) NULL,
    ModelId UNIQUEIDENTIFIER NULL,
    ModelDescription NVARCHAR(100) NULL,
    BodyTypeId UNIQUEIDENTIFIER NULL,
    BodyTypeDescription NVARCHAR(100) NULL,
    BodyLoadId UNIQUEIDENTIFIER NULL,
    BodyLoadDescription NVARCHAR(100) NULL,
    Liquid BIT NULL DEFAULT 0,
    Description NVARCHAR(500) NULL,
    RegistrationNumber NVARCHAR(50) NULL,
    MaxLoadWeight INT NULL,
    MaxLoadHeight INT NULL,
    MaxLoadWidth INT NULL,
    MaxLoadLength INT NULL,
    MaxLoadVolume INT NULL,
    AvailableCapacity INT NULL,
    AvailableFrom DATETIME NULL,
    AvailableTo DATETIME NULL,
    OriginatingAddressLabel NVARCHAR(500) NULL,
    OriginatingAddressLat FLOAT NULL,
    OriginatingAddressLon FLOAT NULL,
    DestinationAddressLabel NVARCHAR(500) NULL,
    DestinationAddressLat FLOAT NULL,
    DestinationAddressLon FLOAT NULL,
    Avatar NVARCHAR(100) NULL,
    Status NVARCHAR(50) NULL DEFAULT 'Active',
    CreatedOn DATETIME NULL DEFAULT GETDATE()
);
GO

-- Load (Loads/shipments)
CREATE TABLE dbo.Load (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId NVARCHAR(450) NULL,
    UserDescription NVARCHAR(200) NULL,
    LoadTypeId UNIQUEIDENTIFIER NULL,
    LoadTypeDescription NVARCHAR(100) NULL,
    Liquid BIT NULL DEFAULT 0,
    Description NVARCHAR(500) NULL,
    Note NVARCHAR(MAX) NULL,
    Price FLOAT NULL,
    ItemCount INT NULL,
    Weight FLOAT NULL,
    Length FLOAT NULL,
    Width FLOAT NULL,
    Height FLOAT NULL,
    Volume FLOAT NULL,
    TotalValue FLOAT NULL,
    DateOut DATETIME NULL,
    DateIn DATETIME NULL,
    DateBidEnd DATETIME NULL,
    FridgeHours FLOAT NULL,
    KgsLoaded FLOAT NULL,
    CustomerLoadedForm NVARCHAR(200) NULL,
    ReviewAverageLoad FLOAT NULL DEFAULT 0,
    ReviewCountLoad INT NULL DEFAULT 0,
    BidCount INT NULL DEFAULT 0,
    LoadDestinationId UNIQUEIDENTIFIER NULL,
    OriginatingAddressLabel NVARCHAR(500) NULL,
    OriginatingAddressLat FLOAT NULL,
    OriginatingAddressLon FLOAT NULL,
    DestinationAddressLabel NVARCHAR(500) NULL,
    DestinationAddressLat FLOAT NULL,
    DestinationAddressLon FLOAT NULL,
    Route NVARCHAR(MAX) NULL,
    Meters FLOAT NULL,
    Minutes FLOAT NULL,
    OdoStart FLOAT NULL,
    OdoEnd FLOAT NULL,
    DestinationCount INT NULL DEFAULT 0,
    DestinationDelivered INT NULL DEFAULT 0,
    Status NVARCHAR(50) NULL DEFAULT 'Open',
    CreatedOn DATETIME NULL DEFAULT GETDATE(),
    ChangedOn DATETIME NULL DEFAULT GETDATE()
);
GO

-- LoadDestination (Load destinations/stops)
CREATE TABLE dbo.LoadDestination (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId NVARCHAR(450) NULL,
    LoadId UNIQUEIDENTIFIER NULL,
    Pos INT NULL DEFAULT 0,
    OriginatingAddressLabel NVARCHAR(500) NULL,
    OriginatingAddressLat FLOAT NULL,
    OriginatingAddressLon FLOAT NULL,
    DestinationAddressLabel NVARCHAR(500) NULL,
    DestinationAddressLat FLOAT NULL,
    DestinationAddressLon FLOAT NULL,
    OdoStart FLOAT NULL,
    OdoEnd FLOAT NULL,
    DeliveryNoteNumber NVARCHAR(100) NULL,
    WeighBridgeTicketNumber NVARCHAR(100) NULL,
    ReturnDocumentNumber NVARCHAR(100) NULL,
    ReturnKgs FLOAT NULL,
    ReturnReasonId UNIQUEIDENTIFIER NULL,
    StockProblemId UNIQUEIDENTIFIER NULL,
    ReturnPallets INT NULL,
    UserIdLoaded NVARCHAR(450) NULL,
    UserIdLoadedConfirmed NVARCHAR(450) NULL,
    UserIdDelivered NVARCHAR(450) NULL,
    UserIdDeliveredConfirmed NVARCHAR(450) NULL,
    Status NVARCHAR(50) NULL DEFAULT 'Pending',
    CreatedOn DATETIME NULL DEFAULT GETDATE(),
    ChangedOn DATETIME NULL DEFAULT GETDATE()
);
GO

-- Bid (Bids on loads)
CREATE TABLE dbo.Bid (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId NVARCHAR(450) NULL,
    UserDescription NVARCHAR(200) NULL,
    LoadId UNIQUEIDENTIFIER NULL,
    LoadDescription NVARCHAR(500) NULL,
    LoadTypeId UNIQUEIDENTIFIER NULL,
    LoadTypeDescription NVARCHAR(100) NULL,
    VehicleId UNIQUEIDENTIFIER NULL,
    VehicleDescription NVARCHAR(200) NULL,
    VehicleCategoryId UNIQUEIDENTIFIER NULL,
    VehicleCategoryDescription NVARCHAR(100) NULL,
    VehicleTypeId UNIQUEIDENTIFIER NULL,
    VehicleTypeDescription NVARCHAR(100) NULL,
    DriverId UNIQUEIDENTIFIER NULL,
    DriverDescription NVARCHAR(200) NULL,
    Price FLOAT NULL,
    DateOut DATETIME NULL,
    DateIn DATETIME NULL,
    FridgeHours FLOAT NULL,
    KgsLoaded FLOAT NULL,
    CustomerLoadedForm NVARCHAR(200) NULL,
    Status NVARCHAR(50) NULL DEFAULT 'Pending',
    LoadDestinationId UNIQUEIDENTIFIER NULL,
    OriginatingAddressLabel NVARCHAR(500) NULL,
    OriginatingAddressLat FLOAT NULL,
    OriginatingAddressLon FLOAT NULL,
    DestinationAddressLabel NVARCHAR(500) NULL,
    DestinationAddressLat FLOAT NULL,
    DestinationAddressLon FLOAT NULL,
    Route NVARCHAR(MAX) NULL,
    Meters FLOAT NULL,
    Minutes FLOAT NULL,
    OdoStart FLOAT NULL,
    OdoEnd FLOAT NULL,
    DestinationCount INT NULL DEFAULT 0,
    DestinationDelivered INT NULL DEFAULT 0,
    StatusLoad NVARCHAR(50) NULL,
    ReviewAverageLoad FLOAT NULL DEFAULT 0,
    ReviewCountLoad INT NULL DEFAULT 0,
    ReviewAverageDriver FLOAT NULL DEFAULT 0,
    ReviewCountDriver INT NULL DEFAULT 0,
    CreatedOn DATETIME NULL DEFAULT GETDATE(),
    ChangedOn DATETIME NULL DEFAULT GETDATE()
);
GO

-- ReviewDriver (Driver reviews)
CREATE TABLE dbo.ReviewDriver (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId NVARCHAR(450) NULL,
    DriverId UNIQUEIDENTIFIER NULL,
    LoadId UNIQUEIDENTIFIER NULL,
    LoadDestinationId UNIQUEIDENTIFIER NULL,
    RatingPunctuality INT NULL,
    RatingVehicleDescription INT NULL,
    RatingCare INT NULL,
    RatingCondition INT NULL,
    RatingAttitude INT NULL,
    Note NVARCHAR(MAX) NULL,
    Timestamp DATETIME NULL DEFAULT GETDATE()
);
GO

-- ReviewLoad (Load reviews)
CREATE TABLE dbo.ReviewLoad (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId NVARCHAR(450) NULL,
    LoadId UNIQUEIDENTIFIER NULL,
    LoadDestinationId UNIQUEIDENTIFIER NULL,
    RatingPunctuality INT NULL,
    RatingLoadDescription INT NULL,
    RatingPayment INT NULL,
    RatingCare INT NULL,
    RatingAttitude INT NULL,
    Note NVARCHAR(MAX) NULL,
    Timestamp DATETIME NULL DEFAULT GETDATE()
);
GO

-- Fuel (Fuel records)
CREATE TABLE dbo.Fuel (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId NVARCHAR(450) NULL,
    LoadId UNIQUEIDENTIFIER NULL,
    VehicleId UNIQUEIDENTIFIER NULL,
    DriverId UNIQUEIDENTIFIER NULL,
    AddressLat FLOAT NULL,
    AddressLon FLOAT NULL,
    AddressLabel NVARCHAR(500) NULL,
    Odo REAL NULL,
    Cost REAL NULL,
    CreatedOn DATETIME NULL DEFAULT GETDATE()
);
GO

-- MaintenancePlanned (Planned maintenance records)
CREATE TABLE dbo.MaintenancePlanned (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId NVARCHAR(450) NULL,
    VehicleId UNIQUEIDENTIFIER NULL,
    MaintenancePlannedTypeId UNIQUEIDENTIFIER NULL,
    Odo REAL NULL,
    Cost REAL NULL,
    CreatedOn DATETIME NULL DEFAULT GETDATE()
);
GO

-- MaintenanceUnPlanned (Unplanned maintenance records)
CREATE TABLE dbo.MaintenanceUnPlanned (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId NVARCHAR(450) NULL,
    LoadId UNIQUEIDENTIFIER NULL,
    MaintenanceUnPlannedTypeId UNIQUEIDENTIFIER NULL,
    Odo REAL NULL,
    Cost REAL NULL,
    CreatedOn DATETIME NULL DEFAULT GETDATE()
);
GO

-- Subscription (User subscriptions)
CREATE TABLE dbo.Subscription (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId NVARCHAR(450) NULL,
    Reference NVARCHAR(200) NULL,
    Amount_gross DECIMAL(18,2) NULL,
    Amount_net DECIMAL(18,2) NULL,
    Amount_fee DECIMAL(18,2) NULL,
    DateStart DATETIME NULL DEFAULT GETDATE(),
    Active BIT NULL DEFAULT 1
);
GO

-- Transaction (Payment transactions)
CREATE TABLE dbo.[Transaction] (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId NVARCHAR(450) NULL,
    SubscriptionId UNIQUEIDENTIFIER NULL,
    Advert INT NULL DEFAULT 0,
    Tms INT NULL DEFAULT 0,
    Directory INT NULL DEFAULT 0,
    Vehicle INT NULL DEFAULT 0,
    Load INT NULL DEFAULT 0,
    Amount_gross DECIMAL(18,2) NULL,
    Amount_net DECIMAL(18,2) NULL,
    Amount_fee DECIMAL(18,2) NULL,
    DateBilling DATETIME NULL,
    CreatedOn DATETIME NULL DEFAULT GETDATE()
);
GO

-- Quote (Insurance quotes)
CREATE TABLE dbo.Quote (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    NameFirst NVARCHAR(100) NULL,
    NameLast NVARCHAR(100) NULL,
    Email NVARCHAR(200) NULL,
    MobileNumber NVARCHAR(50) NULL,
    Company NVARCHAR(200) NULL,
    BusinessDescriptionId UNIQUEIDENTIFIER NULL,
    OwnedRentedId UNIQUEIDENTIFIER NULL,
    Premium FLOAT NULL,
    Status NVARCHAR(50) NULL DEFAULT 'New',
    CreatedOn DATETIME NULL DEFAULT GETDATE()
);
GO

-- QuoteTruck (Trucks in quote)
CREATE TABLE dbo.QuoteTruck (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    QuoteId UNIQUEIDENTIFIER NULL,
    Make NVARCHAR(100) NULL,
    Model NVARCHAR(100) NULL,
    Year INT NULL,
    Value INT NULL,
    CreatedOn DATETIME NULL DEFAULT GETDATE()
);
GO

-- QuoteTrailer (Trailers in quote)
CREATE TABLE dbo.QuoteTrailer (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    QuoteId UNIQUEIDENTIFIER NULL,
    Make NVARCHAR(100) NULL,
    Model NVARCHAR(100) NULL,
    Year INT NULL,
    Value INT NULL,
    CreatedOn DATETIME NULL DEFAULT GETDATE()
);
GO

PRINT 'Tables created successfully.';
GO
USE [FindRisk];
GO

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to calculate distance between two coordinates in kilometers (Haversine formula)
CREATE FUNCTION dbo.fn_CalculateDistanceKm (
    @lat1 FLOAT,
    @lon1 FLOAT,
    @lat2 FLOAT,
    @lon2 FLOAT
)
RETURNS FLOAT
AS
BEGIN
    DECLARE @R FLOAT = 6371; -- Earth's radius in kilometers
    DECLARE @dLat FLOAT;
    DECLARE @dLon FLOAT;
    DECLARE @a FLOAT;
    DECLARE @c FLOAT;
    DECLARE @distance FLOAT;

    -- Handle null values
    IF @lat1 IS NULL OR @lon1 IS NULL OR @lat2 IS NULL OR @lon2 IS NULL
        RETURN NULL;

    -- Convert degrees to radians
    SET @dLat = RADIANS(@lat2 - @lat1);
    SET @dLon = RADIANS(@lon2 - @lon1);

    -- Haversine formula
    SET @a = SIN(@dLat / 2) * SIN(@dLat / 2) + 
             COS(RADIANS(@lat1)) * COS(RADIANS(@lat2)) * 
             SIN(@dLon / 2) * SIN(@dLon / 2);
    SET @c = 2 * ATN2(SQRT(@a), SQRT(1 - @a));
    SET @distance = @R * @c;

    RETURN @distance;
END;
GO

PRINT 'Functions created successfully.';
GO

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View for Load with destination info
CREATE VIEW dbo.vw_Load AS
SELECT 
    l.Id,
    l.UserId,
    l.UserDescription,
    l.LoadTypeId,
    l.LoadTypeDescription,
    l.Liquid,
    l.Description,
    l.Note,
    l.Price,
    l.ItemCount,
    l.Weight,
    l.Length,
    l.Width,
    l.Height,
    l.Volume,
    l.TotalValue,
    l.DateOut,
    l.DateIn,
    l.DateBidEnd,
    l.FridgeHours,
    l.KgsLoaded,
    l.CustomerLoadedForm,
    l.ReviewAverageLoad,
    l.ReviewCountLoad,
    l.BidCount,
    l.LoadDestinationId,
    l.OriginatingAddressLabel,
    l.OriginatingAddressLat,
    l.OriginatingAddressLon,
    l.DestinationAddressLabel,
    l.DestinationAddressLat,
    l.DestinationAddressLon,
    l.Route,
    l.Meters,
    l.Minutes,
    l.OdoStart,
    l.OdoEnd,
    l.DestinationCount,
    l.DestinationDelivered,
    l.Status,
    l.CreatedOn,
    l.ChangedOn
FROM dbo.Load l;
GO

-- View for Bid with Load info
CREATE VIEW dbo.vw_BidLoad AS
SELECT 
    b.Id,
    b.UserId,
    b.UserDescription,
    b.LoadId,
    b.LoadDescription,
    b.LoadTypeId,
    b.LoadTypeDescription,
    b.VehicleId,
    b.VehicleDescription,
    b.VehicleCategoryId,
    b.VehicleCategoryDescription,
    b.VehicleTypeId,
    b.VehicleTypeDescription,
    b.DriverId,
    b.DriverDescription,
    b.Price,
    b.DateOut,
    b.DateIn,
    b.Status,
    b.CreatedOn,
    b.ChangedOn,
    b.ReviewAverageLoad,
    b.ReviewCountLoad,
    b.ReviewAverageDriver,
    b.ReviewCountDriver,
    b.OriginatingAddressLabel,
    b.OriginatingAddressLat,
    b.OriginatingAddressLon,
    b.DestinationAddressLabel,
    b.DestinationAddressLat,
    b.DestinationAddressLon,
    b.Route,
    b.Meters,
    b.Minutes,
    b.StatusLoad,
    l.Status AS LoadStatus
FROM dbo.Bid b
LEFT JOIN dbo.Load l ON b.LoadId = l.Id;
GO

-- View for Quote with descriptions
CREATE VIEW dbo.vw_Quote AS
SELECT 
    q.Id,
    q.NameFirst,
    q.NameLast,
    q.Email,
    q.MobileNumber,
    q.Company,
    q.BusinessDescriptionId,
    ct1.Description AS BusinessDescription,
    q.OwnedRentedId,
    ct2.Description AS OwnedRentedDescription,
    q.Premium,
    q.Status,
    q.CreatedOn
FROM dbo.Quote q
LEFT JOIN dbo.CompanyType ct1 ON q.BusinessDescriptionId = ct1.Id
LEFT JOIN dbo.CompanyType ct2 ON q.OwnedRentedId = ct2.Id;
GO

PRINT 'Views created successfully.';
GO

-- ============================================================================
-- STORED PROCEDURES - Lookup Tables
-- ============================================================================

-- Axel stored procedure
CREATE PROCEDURE dbo.usp_action_axel
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @description NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT Id, Description FROM dbo.Axel ORDER BY Description;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT Id, Description FROM dbo.Axel WHERE Id = @id;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.Axel (Id, Description) VALUES (@id, @description);
        SELECT Id, Description FROM dbo.Axel WHERE Id = @id;
    END
    ELSE IF @action = 'update'
    BEGIN
        UPDATE dbo.Axel SET Description = @description WHERE Id = @id;
        SELECT Id, Description FROM dbo.Axel WHERE Id = @id;
    END
    ELSE IF @action = 'delete'
    BEGIN
        DELETE FROM dbo.Axel WHERE Id = @id;
        SELECT 'Success' AS result;
    END
END;
GO

-- BodyType stored procedure
CREATE PROCEDURE dbo.usp_action_bodyType
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @description NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT Id, Description FROM dbo.BodyType ORDER BY Description;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT Id, Description FROM dbo.BodyType WHERE Id = @id;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.BodyType (Id, Description) VALUES (@id, @description);
        SELECT Id, Description FROM dbo.BodyType WHERE Id = @id;
    END
    ELSE IF @action = 'update'
    BEGIN
        UPDATE dbo.BodyType SET Description = @description WHERE Id = @id;
        SELECT Id, Description FROM dbo.BodyType WHERE Id = @id;
    END
    ELSE IF @action = 'delete'
    BEGIN
        DELETE FROM dbo.BodyType WHERE Id = @id;
        SELECT 'Success' AS result;
    END
END;
GO

-- BodyLoad stored procedure
CREATE PROCEDURE dbo.usp_action_bodyLoad
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @description NVARCHAR(100) = NULL,
    @height INT = NULL,
    @kilograms INT = NULL,
    @volume INT = NULL,
    @litres INT = NULL,
    @liquid BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT Id, Description, Height, Kilograms, Volume, Litres, Liquid FROM dbo.BodyLoad ORDER BY Description;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT Id, Description, Height, Kilograms, Volume, Litres, Liquid FROM dbo.BodyLoad WHERE Id = @id;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.BodyLoad (Id, Description, Height, Kilograms, Volume, Litres, Liquid) 
        VALUES (@id, @description, @height, @kilograms, @volume, @litres, @liquid);
        SELECT Id, Description, Height, Kilograms, Volume, Litres, Liquid FROM dbo.BodyLoad WHERE Id = @id;
    END
    ELSE IF @action = 'update'
    BEGIN
        UPDATE dbo.BodyLoad SET Description = @description, Height = @height, Kilograms = @kilograms, 
            Volume = @volume, Litres = @litres, Liquid = @liquid WHERE Id = @id;
        SELECT Id, Description, Height, Kilograms, Volume, Litres, Liquid FROM dbo.BodyLoad WHERE Id = @id;
    END
    ELSE IF @action = 'delete'
    BEGIN
        DELETE FROM dbo.BodyLoad WHERE Id = @id;
        SELECT 'Success' AS result;
    END
END;
GO

-- CompanyType stored procedure
CREATE PROCEDURE dbo.usp_action_companyType
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @description NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT Id, Description FROM dbo.CompanyType ORDER BY Description;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT Id, Description FROM dbo.CompanyType WHERE Id = @id;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.CompanyType (Id, Description) VALUES (@id, @description);
        SELECT Id, Description FROM dbo.CompanyType WHERE Id = @id;
    END
    ELSE IF @action = 'update'
    BEGIN
        UPDATE dbo.CompanyType SET Description = @description WHERE Id = @id;
        SELECT Id, Description FROM dbo.CompanyType WHERE Id = @id;
    END
    ELSE IF @action = 'delete'
    BEGIN
        DELETE FROM dbo.CompanyType WHERE Id = @id;
        SELECT 'Success' AS result;
    END
END;
GO

-- LicenceType stored procedure
CREATE PROCEDURE dbo.usp_action_licenceType
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @code NVARCHAR(20) = NULL,
    @description NVARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT Id, Code, Description FROM dbo.LicenceType ORDER BY Code;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT Id, Code, Description FROM dbo.LicenceType WHERE Id = @id;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.LicenceType (Id, Code, Description) VALUES (@id, @code, @description);
        SELECT Id, Code, Description FROM dbo.LicenceType WHERE Id = @id;
    END
    ELSE IF @action = 'update'
    BEGIN
        UPDATE dbo.LicenceType SET Code = @code, Description = @description WHERE Id = @id;
        SELECT Id, Code, Description FROM dbo.LicenceType WHERE Id = @id;
    END
    ELSE IF @action = 'delete'
    BEGIN
        DELETE FROM dbo.LicenceType WHERE Id = @id;
        SELECT 'Success' AS result;
    END
END;
GO

-- LoadType stored procedure
CREATE PROCEDURE dbo.usp_action_loadType
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @description NVARCHAR(100) = NULL,
    @liquid BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT Id, Description, Liquid FROM dbo.LoadType ORDER BY Description;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT Id, Description, Liquid FROM dbo.LoadType WHERE Id = @id;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.LoadType (Id, Description, Liquid) VALUES (@id, @description, @liquid);
        SELECT Id, Description, Liquid FROM dbo.LoadType WHERE Id = @id;
    END
    ELSE IF @action = 'update'
    BEGIN
        UPDATE dbo.LoadType SET Description = @description, Liquid = @liquid WHERE Id = @id;
        SELECT Id, Description, Liquid FROM dbo.LoadType WHERE Id = @id;
    END
    ELSE IF @action = 'delete'
    BEGIN
        DELETE FROM dbo.LoadType WHERE Id = @id;
        SELECT 'Success' AS result;
    END
END;
GO

-- VehicleCategory stored procedure
CREATE PROCEDURE dbo.usp_action_vehicleCategory
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @description NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT Id, Description FROM dbo.VehicleCategory ORDER BY Description;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT Id, Description FROM dbo.VehicleCategory WHERE Id = @id;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.VehicleCategory (Id, Description) VALUES (@id, @description);
        SELECT Id, Description FROM dbo.VehicleCategory WHERE Id = @id;
    END
    ELSE IF @action = 'update'
    BEGIN
        UPDATE dbo.VehicleCategory SET Description = @description WHERE Id = @id;
        SELECT Id, Description FROM dbo.VehicleCategory WHERE Id = @id;
    END
    ELSE IF @action = 'delete'
    BEGIN
        DELETE FROM dbo.VehicleCategory WHERE Id = @id;
        SELECT 'Success' AS result;
    END
END;
GO

-- VehicleType stored procedure
CREATE PROCEDURE dbo.usp_action_vehicleType
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @description NVARCHAR(100) = NULL,
    @vehicleCategoryId NVARCHAR(50) = NULL,
    @vehicleCategoryDescription NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT Id, Description, VehicleCategoryId, VehicleCategoryDescription FROM dbo.VehicleType ORDER BY Description;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT Id, Description, VehicleCategoryId, VehicleCategoryDescription FROM dbo.VehicleType WHERE Id = @id;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.VehicleType (Id, Description, VehicleCategoryId, VehicleCategoryDescription) 
        VALUES (@id, @description, @vehicleCategoryId, @vehicleCategoryDescription);
        SELECT Id, Description, VehicleCategoryId, VehicleCategoryDescription FROM dbo.VehicleType WHERE Id = @id;
    END
    ELSE IF @action = 'update'
    BEGIN
        UPDATE dbo.VehicleType SET Description = @description, VehicleCategoryId = @vehicleCategoryId, 
            VehicleCategoryDescription = @vehicleCategoryDescription WHERE Id = @id;
        SELECT Id, Description, VehicleCategoryId, VehicleCategoryDescription FROM dbo.VehicleType WHERE Id = @id;
    END
    ELSE IF @action = 'delete'
    BEGIN
        DELETE FROM dbo.VehicleType WHERE Id = @id;
        SELECT 'Success' AS result;
    END
END;
GO

-- Make stored procedure
CREATE PROCEDURE dbo.usp_action_make
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @description NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT Id, Description FROM dbo.Make ORDER BY Description;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT Id, Description FROM dbo.Make WHERE Id = @id;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.Make (Id, Description) VALUES (@id, @description);
        SELECT Id, Description FROM dbo.Make WHERE Id = @id;
    END
    ELSE IF @action = 'update'
    BEGIN
        UPDATE dbo.Make SET Description = @description WHERE Id = @id;
        SELECT Id, Description FROM dbo.Make WHERE Id = @id;
    END
    ELSE IF @action = 'delete'
    BEGIN
        DELETE FROM dbo.Make WHERE Id = @id;
        SELECT 'Success' AS result;
    END
END;
GO

-- Model stored procedure
CREATE PROCEDURE dbo.usp_action_model
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @description NVARCHAR(100) = NULL,
    @makeId NVARCHAR(50) = NULL,
    @makeDescription NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT Id, Description, MakeId, MakeDescription FROM dbo.Model ORDER BY Description;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT Id, Description, MakeId, MakeDescription FROM dbo.Model WHERE Id = @id;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.Model (Id, Description, MakeId, MakeDescription) VALUES (@id, @description, @makeId, @makeDescription);
        SELECT Id, Description, MakeId, MakeDescription FROM dbo.Model WHERE Id = @id;
    END
    ELSE IF @action = 'update'
    BEGIN
        UPDATE dbo.Model SET Description = @description, MakeId = @makeId, MakeDescription = @makeDescription WHERE Id = @id;
        SELECT Id, Description, MakeId, MakeDescription FROM dbo.Model WHERE Id = @id;
    END
    ELSE IF @action = 'delete'
    BEGIN
        DELETE FROM dbo.Model WHERE Id = @id;
        SELECT 'Success' AS result;
    END
END;
GO

-- Pdp stored procedure
CREATE PROCEDURE dbo.usp_action_pdp
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @description NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT Id, Description FROM dbo.Pdp ORDER BY Description;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT Id, Description FROM dbo.Pdp WHERE Id = @id;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.Pdp (Id, Description) VALUES (@id, @description);
        SELECT Id, Description FROM dbo.Pdp WHERE Id = @id;
    END
    ELSE IF @action = 'update'
    BEGIN
        UPDATE dbo.Pdp SET Description = @description WHERE Id = @id;
        SELECT Id, Description FROM dbo.Pdp WHERE Id = @id;
    END
    ELSE IF @action = 'delete'
    BEGIN
        DELETE FROM dbo.Pdp WHERE Id = @id;
        SELECT 'Success' AS result;
    END
END;
GO

-- ReturnReason stored procedure
CREATE PROCEDURE dbo.usp_action_returnReason
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @description NVARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT Id, Description FROM dbo.ReturnReason ORDER BY Description;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT Id, Description FROM dbo.ReturnReason WHERE Id = @id;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.ReturnReason (Id, Description) VALUES (@id, @description);
        SELECT Id, Description FROM dbo.ReturnReason WHERE Id = @id;
    END
    ELSE IF @action = 'update'
    BEGIN
        UPDATE dbo.ReturnReason SET Description = @description WHERE Id = @id;
        SELECT Id, Description FROM dbo.ReturnReason WHERE Id = @id;
    END
    ELSE IF @action = 'delete'
    BEGIN
        DELETE FROM dbo.ReturnReason WHERE Id = @id;
        SELECT 'Success' AS result;
    END
END;
GO

-- StockProblem stored procedure
CREATE PROCEDURE dbo.usp_action_stockProblem
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @description NVARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT Id, Description FROM dbo.StockProblem ORDER BY Description;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT Id, Description FROM dbo.StockProblem WHERE Id = @id;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.StockProblem (Id, Description) VALUES (@id, @description);
        SELECT Id, Description FROM dbo.StockProblem WHERE Id = @id;
    END
    ELSE IF @action = 'update'
    BEGIN
        UPDATE dbo.StockProblem SET Description = @description WHERE Id = @id;
        SELECT Id, Description FROM dbo.StockProblem WHERE Id = @id;
    END
    ELSE IF @action = 'delete'
    BEGIN
        DELETE FROM dbo.StockProblem WHERE Id = @id;
        SELECT 'Success' AS result;
    END
END;
GO

-- MaintenancePlannedType stored procedure
CREATE PROCEDURE dbo.usp_action_maintenancePlannedType
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @description NVARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT Id, Description FROM dbo.MaintenancePlannedType ORDER BY Description;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT Id, Description FROM dbo.MaintenancePlannedType WHERE Id = @id;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.MaintenancePlannedType (Id, Description) VALUES (@id, @description);
        SELECT Id, Description FROM dbo.MaintenancePlannedType WHERE Id = @id;
    END
    ELSE IF @action = 'update'
    BEGIN
        UPDATE dbo.MaintenancePlannedType SET Description = @description WHERE Id = @id;
        SELECT Id, Description FROM dbo.MaintenancePlannedType WHERE Id = @id;
    END
    ELSE IF @action = 'delete'
    BEGIN
        DELETE FROM dbo.MaintenancePlannedType WHERE Id = @id;
        SELECT 'Success' AS result;
    END
END;
GO

-- MaintenanceUnPlannedType stored procedure
CREATE PROCEDURE dbo.usp_action_maintenanceUnPlannedType
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @description NVARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT Id, Description FROM dbo.MaintenanceUnPlannedType ORDER BY Description;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT Id, Description FROM dbo.MaintenanceUnPlannedType WHERE Id = @id;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.MaintenanceUnPlannedType (Id, Description) VALUES (@id, @description);
        SELECT Id, Description FROM dbo.MaintenanceUnPlannedType WHERE Id = @id;
    END
    ELSE IF @action = 'update'
    BEGIN
        UPDATE dbo.MaintenanceUnPlannedType SET Description = @description WHERE Id = @id;
        SELECT Id, Description FROM dbo.MaintenanceUnPlannedType WHERE Id = @id;
    END
    ELSE IF @action = 'delete'
    BEGIN
        DELETE FROM dbo.MaintenanceUnPlannedType WHERE Id = @id;
        SELECT 'Success' AS result;
    END
END;
GO

PRINT 'Lookup table stored procedures created successfully.';
GO

USE [FindRisk];
GO

-- ============================================================================
-- STORED PROCEDURES - Main Entity Tables
-- ============================================================================

-- DirectoryCategory stored procedure
CREATE PROCEDURE dbo.usp_action_directoryCategory
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @description NVARCHAR(200) = NULL,
    @directoryCount INT = NULL,
    @changedOn DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT Id, Description, DirectoryCount, ChangedOn FROM dbo.DirectoryCategory ORDER BY Description;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT Id, Description, DirectoryCount, ChangedOn FROM dbo.DirectoryCategory WHERE Id = @id;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.DirectoryCategory (Id, Description, DirectoryCount, ChangedOn) 
        VALUES (@id, @description, 0, GETDATE());
        SELECT Id, Description, DirectoryCount, ChangedOn FROM dbo.DirectoryCategory WHERE Id = @id;
    END
    ELSE IF @action = 'update'
    BEGIN
        UPDATE dbo.DirectoryCategory SET Description = @description, ChangedOn = GETDATE() WHERE Id = @id;
        SELECT Id, Description, DirectoryCount, ChangedOn FROM dbo.DirectoryCategory WHERE Id = @id;
    END
    ELSE IF @action = 'delete'
    BEGIN
        DELETE FROM dbo.DirectoryCategory WHERE Id = @id;
        SELECT 'Success' AS result;
    END
END;
GO

-- Directory stored procedure
CREATE PROCEDURE dbo.usp_action_directory
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @userId NVARCHAR(450) = NULL,
    @userDescription NVARCHAR(200) = NULL,
    @directoryCategoryId UNIQUEIDENTIFIER = NULL,
    @directoryCategoryDescription NVARCHAR(200) = NULL,
    @companyName NVARCHAR(200) = NULL,
    @description NVARCHAR(MAX) = NULL,
    @email NVARCHAR(200) = NULL,
    @phone NVARCHAR(50) = NULL,
    @website NVARCHAR(500) = NULL,
    @instagram NVARCHAR(200) = NULL,
    @facebook NVARCHAR(200) = NULL,
    @twitter NVARCHAR(200) = NULL,
    @linkedIn NVARCHAR(200) = NULL,
    @addressLat FLOAT = NULL,
    @addressLon FLOAT = NULL,
    @addressLabel NVARCHAR(500) = NULL,
    @avatar NVARCHAR(100) = NULL,
    @status NVARCHAR(50) = NULL,
    @createdOn DATETIME = NULL,
    @changedOn DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT * FROM dbo.Directory WHERE UserId = @userId ORDER BY CompanyName;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT * FROM dbo.Directory WHERE Id = @id;
    END
    ELSE IF @action = 'select-available'
    BEGIN
        SELECT * FROM dbo.Directory WHERE Status = 'Active' ORDER BY CompanyName;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.Directory (Id, UserId, UserDescription, DirectoryCategoryId, DirectoryCategoryDescription,
            CompanyName, Description, Email, Phone, Website, Instagram, Facebook, Twitter, LinkedIn,
            AddressLat, AddressLon, AddressLabel, Avatar, Status, CreatedOn, ChangedOn)
        VALUES (@id, @userId, @userDescription, @directoryCategoryId, @directoryCategoryDescription,
            @companyName, @description, @email, @phone, @website, @instagram, @facebook, @twitter, @linkedIn,
            @addressLat, @addressLon, @addressLabel, @avatar, ISNULL(@status, 'Active'), GETDATE(), GETDATE());
        
        -- Update directory count
        UPDATE dbo.DirectoryCategory SET DirectoryCount = DirectoryCount + 1, ChangedOn = GETDATE() 
        WHERE Id = @directoryCategoryId;
        
        SELECT * FROM dbo.Directory WHERE Id = @id;
    END
    ELSE IF @action = 'update'
    BEGIN
        UPDATE dbo.Directory SET 
            UserDescription = @userDescription,
            DirectoryCategoryId = @directoryCategoryId,
            DirectoryCategoryDescription = @directoryCategoryDescription,
            CompanyName = @companyName,
            Description = @description,
            Email = @email,
            Phone = @phone,
            Website = @website,
            Instagram = @instagram,
            Facebook = @facebook,
            Twitter = @twitter,
            LinkedIn = @linkedIn,
            AddressLat = @addressLat,
            AddressLon = @addressLon,
            AddressLabel = @addressLabel,
            Status = @status,
            ChangedOn = GETDATE()
        WHERE Id = @id;
        SELECT * FROM dbo.Directory WHERE Id = @id;
    END
    ELSE IF @action = 'update-image'
    BEGIN
        UPDATE dbo.Directory SET Avatar = @avatar, ChangedOn = GETDATE() WHERE Id = @id;
        SELECT * FROM dbo.Directory WHERE Id = @id;
    END
    ELSE IF @action = 'delete'
    BEGIN
        DECLARE @catId UNIQUEIDENTIFIER;
        SELECT @catId = DirectoryCategoryId FROM dbo.Directory WHERE Id = @id;
        
        DELETE FROM dbo.Directory WHERE Id = @id;
        
        -- Update directory count
        IF @catId IS NOT NULL
        BEGIN
            UPDATE dbo.DirectoryCategory SET DirectoryCount = DirectoryCount - 1, ChangedOn = GETDATE() 
            WHERE Id = @catId AND DirectoryCount > 0;
        END
        
        SELECT 'Success' AS result;
    END
END;
GO

-- Directory by category stored procedure
CREATE PROCEDURE dbo.usp_action_directory_by_category
    @categoryId UNIQUEIDENTIFIER,
    @startIndex INT,
    @rows INT = 10
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT * FROM dbo.Directory 
    WHERE DirectoryCategoryId = @categoryId AND Status = 'Active'
    ORDER BY CompanyName
    OFFSET @startIndex ROWS FETCH NEXT @rows ROWS ONLY;
END;
GO

-- Directory by distance stored procedure (distance in kilometers)
CREATE PROCEDURE dbo.usp_action_directory_by_distance
    @lat FLOAT,
    @lon FLOAT,
    @distance FLOAT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT d.*,
           dbo.fn_CalculateDistanceKm(@lat, @lon, d.AddressLat, d.AddressLon) AS DistanceKm
    FROM dbo.Directory d
    WHERE d.Status = 'Active'
      AND dbo.fn_CalculateDistanceKm(@lat, @lon, d.AddressLat, d.AddressLon) <= @distance
    ORDER BY dbo.fn_CalculateDistanceKm(@lat, @lon, d.AddressLat, d.AddressLon);
END;
GO

-- Directories available stored procedure (with filters and distance)
CREATE PROCEDURE dbo.usp_action_directories_available
    @directoryCategories NVARCHAR(MAX) = NULL,
    @lat FLOAT = NULL,
    @lon FLOAT = NULL,
    @distance FLOAT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT d.*,
           CASE WHEN @lat IS NOT NULL AND @lon IS NOT NULL 
                THEN dbo.fn_CalculateDistanceKm(@lat, @lon, d.AddressLat, d.AddressLon) 
                ELSE NULL END AS DistanceKm
    FROM dbo.Directory d
    WHERE d.Status = 'Active'
      AND (@directoryCategories IS NULL OR @directoryCategories = '' 
           OR CAST(d.DirectoryCategoryId AS NVARCHAR(50)) IN (SELECT value FROM STRING_SPLIT(@directoryCategories, ',')))
      AND (@distance IS NULL OR @distance = 0 
           OR dbo.fn_CalculateDistanceKm(@lat, @lon, d.AddressLat, d.AddressLon) <= @distance)
    ORDER BY CASE WHEN @lat IS NOT NULL AND @lon IS NOT NULL 
                  THEN dbo.fn_CalculateDistanceKm(@lat, @lon, d.AddressLat, d.AddressLon) 
                  ELSE 0 END;
END;
GO

-- Advert stored procedure
CREATE PROCEDURE dbo.usp_action_advert
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @userId NVARCHAR(450) = NULL,
    @userDescription NVARCHAR(200) = NULL,
    @title NVARCHAR(200) = NULL,
    @subTitle NVARCHAR(500) = NULL,
    @content NVARCHAR(MAX) = NULL,
    @phone NVARCHAR(50) = NULL,
    @email NVARCHAR(200) = NULL,
    @website NVARCHAR(500) = NULL,
    @addressLabel NVARCHAR(500) = NULL,
    @addressLat FLOAT = NULL,
    @addressLon FLOAT = NULL,
    @avatar NVARCHAR(100) = NULL,
    @status NVARCHAR(50) = NULL,
    @createdOn DATETIME = NULL,
    @changedOn DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT * FROM dbo.Advert WHERE UserId = @userId ORDER BY CreatedOn DESC;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT * FROM dbo.Advert WHERE Id = @id;
    END
    ELSE IF @action = 'select-available'
    BEGIN
        SELECT * FROM dbo.Advert WHERE Status = 'Active' ORDER BY CreatedOn DESC;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.Advert (Id, UserId, UserDescription, Title, SubTitle, Content, Phone, Email, Website,
            AddressLabel, AddressLat, AddressLon, Avatar, Status, CreatedOn, ChangedOn)
        VALUES (@id, @userId, @userDescription, @title, @subTitle, @content, @phone, @email, @website,
            @addressLabel, @addressLat, @addressLon, @avatar, ISNULL(@status, 'Active'), GETDATE(), GETDATE());
        SELECT * FROM dbo.Advert WHERE Id = @id;
    END
    ELSE IF @action = 'update'
    BEGIN
        UPDATE dbo.Advert SET 
            UserDescription = @userDescription,
            Title = @title,
            SubTitle = @subTitle,
            Content = @content,
            Phone = @phone,
            Email = @email,
            Website = @website,
            AddressLabel = @addressLabel,
            AddressLat = @addressLat,
            AddressLon = @addressLon,
            Status = @status,
            ChangedOn = GETDATE()
        WHERE Id = @id;
        SELECT * FROM dbo.Advert WHERE Id = @id;
    END
    ELSE IF @action = 'update-image'
    BEGIN
        UPDATE dbo.Advert SET Avatar = @avatar, ChangedOn = GETDATE() WHERE Id = @id;
        SELECT * FROM dbo.Advert WHERE Id = @id;
    END
    ELSE IF @action = 'delete'
    BEGIN
        DELETE FROM dbo.Advert WHERE Id = @id;
        SELECT 'Success' AS result;
    END
END;
GO

-- Branch stored procedure
CREATE PROCEDURE dbo.usp_action_branch
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @userId NVARCHAR(450) = NULL,
    @userDescription NVARCHAR(200) = NULL,
    @description NVARCHAR(200) = NULL,
    @addressLat FLOAT = NULL,
    @addressLon FLOAT = NULL,
    @addressLabel NVARCHAR(500) = NULL
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
        INSERT INTO dbo.Branch (Id, UserId, UserDescription, Description, AddressLat, AddressLon, AddressLabel)
        VALUES (@id, @userId, @userDescription, @description, @addressLat, @addressLon, @addressLabel);
        SELECT * FROM dbo.Branch WHERE Id = @id;
    END
    ELSE IF @action = 'update'
    BEGIN
        UPDATE dbo.Branch SET 
            UserDescription = @userDescription,
            Description = @description,
            AddressLat = @addressLat,
            AddressLon = @addressLon,
            AddressLabel = @addressLabel
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

-- Driver stored procedure
CREATE PROCEDURE dbo.usp_action_driver
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @userId NVARCHAR(450) = NULL,
    @userDescription NVARCHAR(200) = NULL,
    @firstName NVARCHAR(100) = NULL,
    @lastName NVARCHAR(100) = NULL,
    @phone NVARCHAR(50) = NULL,
    @email NVARCHAR(200) = NULL,
    @password NVARCHAR(200) = NULL,
    @idNumber NVARCHAR(50) = NULL,
    @dateOfBirth DATETIME = NULL,
    @licenceTypeId UNIQUEIDENTIFIER = NULL,
    @licenceTypeDescription NVARCHAR(200) = NULL,
    @licenceTypeCode NVARCHAR(20) = NULL,
    @licenceExpiryDate DATETIME = NULL,
    @pdpExpiryDate DATETIME = NULL,
    @avatar NVARCHAR(100) = NULL,
    @avatarPdp NVARCHAR(100) = NULL,
    @status NVARCHAR(50) = NULL,
    @pdpId NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT * FROM dbo.Driver WHERE UserId = @userId ORDER BY FirstName, LastName;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT * FROM dbo.Driver WHERE Id = @id;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.Driver (Id, UserId, UserDescription, FirstName, LastName, Phone, Email, Password,
            IdNumber, DateOfBirth, LicenceTypeId, LicenceTypeDescription, LicenceTypeCode, LicenceExpiryDate,
            PdpExpiryDate, Avatar, AvatarPdp, Status, PdpId)
        VALUES (@id, @userId, @userDescription, @firstName, @lastName, @phone, @email, @password,
            @idNumber, @dateOfBirth, @licenceTypeId, @licenceTypeDescription, @licenceTypeCode, @licenceExpiryDate,
            @pdpExpiryDate, @avatar, @avatarPdp, ISNULL(@status, 'Active'), @pdpId);
        SELECT * FROM dbo.Driver WHERE Id = @id;
    END
    ELSE IF @action = 'update'
    BEGIN
        UPDATE dbo.Driver SET 
            UserDescription = @userDescription,
            FirstName = @firstName,
            LastName = @lastName,
            Phone = @phone,
            Email = @email,
            Password = @password,
            IdNumber = @idNumber,
            DateOfBirth = @dateOfBirth,
            LicenceTypeId = @licenceTypeId,
            LicenceTypeDescription = @licenceTypeDescription,
            LicenceTypeCode = @licenceTypeCode,
            LicenceExpiryDate = @licenceExpiryDate,
            PdpExpiryDate = @pdpExpiryDate,
            Status = @status,
            PdpId = @pdpId
        WHERE Id = @id;
        SELECT * FROM dbo.Driver WHERE Id = @id;
    END
    ELSE IF @action = 'update-image'
    BEGIN
        UPDATE dbo.Driver SET Avatar = @avatar WHERE Id = @id;
        SELECT * FROM dbo.Driver WHERE Id = @id;
    END
    ELSE IF @action = 'update-image-pdp'
    BEGIN
        UPDATE dbo.Driver SET AvatarPdp = @avatarPdp WHERE Id = @id;
        SELECT * FROM dbo.Driver WHERE Id = @id;
    END
    ELSE IF @action = 'delete'
    BEGIN
        DELETE FROM dbo.Driver WHERE Id = @id;
        SELECT 'Success' AS result;
    END
END;
GO

-- User stored procedure
CREATE PROCEDURE dbo.usp_action_user
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @name NVARCHAR(200) = NULL,
    @company NVARCHAR(200) = NULL,
    @avatar NVARCHAR(100) = NULL,
    @status NVARCHAR(50) = NULL,
    @resetToken UNIQUEIDENTIFIER = NULL,
    @phoneNumber NVARCHAR(50) = NULL,
    @email NVARCHAR(200) = NULL,
    @emailConfirmed BIT = NULL,
    @passwordHash NVARCHAR(MAX) = NULL,
    @deviceId NVARCHAR(200) = NULL,
    @token NVARCHAR(MAX) = NULL,
    @lastLoggedIn DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'update'
    BEGIN
        UPDATE dbo.AspNetUsers SET 
            Name = ISNULL(@name, Name),
            Company = ISNULL(@company, Company),
            Status = ISNULL(@status, Status),
            PhoneNumber = ISNULL(@phoneNumber, PhoneNumber)
        WHERE Id = CAST(@id AS NVARCHAR(450));
        
        SELECT Id, Name, Company, Avatar, Status, ResetToken, PhoneNumber, Email, EmailConfirmed, 
               PasswordHash, DeviceId, Token, LastLoggedIn
        FROM dbo.AspNetUsers WHERE Id = CAST(@id AS NVARCHAR(450));
    END
    ELSE IF @action = 'update-image'
    BEGIN
        UPDATE dbo.AspNetUsers SET Avatar = @avatar WHERE Id = CAST(@id AS NVARCHAR(450));
        
        SELECT Id, Name, Company, Avatar, Status, ResetToken, PhoneNumber, Email, EmailConfirmed, 
               PasswordHash, DeviceId, Token, LastLoggedIn
        FROM dbo.AspNetUsers WHERE Id = CAST(@id AS NVARCHAR(450));
    END
END;
GO

PRINT 'Main entity stored procedures created successfully.';
GO

USE [FindRisk];
GO

-- ============================================================================
-- STORED PROCEDURES - Vehicle, Load, Bid
-- ============================================================================

-- Vehicle stored procedure
CREATE PROCEDURE dbo.usp_action_vehicle
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @userId NVARCHAR(450) = NULL,
    @userDescription NVARCHAR(200) = NULL,
    @branchId UNIQUEIDENTIFIER = NULL,
    @branchDescription NVARCHAR(200) = NULL,
    @vehicleId NVARCHAR(50) = NULL,
    @vehicleCategoryId UNIQUEIDENTIFIER = NULL,
    @vehicleCategoryDescription NVARCHAR(100) = NULL,
    @vehicleTypeId UNIQUEIDENTIFIER = NULL,
    @vehicleTypeDescription NVARCHAR(100) = NULL,
    @makeId UNIQUEIDENTIFIER = NULL,
    @makeDescription NVARCHAR(100) = NULL,
    @modelId UNIQUEIDENTIFIER = NULL,
    @modelDescription NVARCHAR(100) = NULL,
    @bodyTypeId UNIQUEIDENTIFIER = NULL,
    @bodyTypeDescription NVARCHAR(100) = NULL,
    @bodyLoadId UNIQUEIDENTIFIER = NULL,
    @bodyLoadDescription NVARCHAR(100) = NULL,
    @liquid BIT = NULL,
    @description NVARCHAR(500) = NULL,
    @registrationNumber NVARCHAR(50) = NULL,
    @maxLoadWeight INT = NULL,
    @maxLoadHeight INT = NULL,
    @maxLoadWidth INT = NULL,
    @maxLoadLength INT = NULL,
    @maxLoadVolume INT = NULL,
    @availableCapacity INT = NULL,
    @availableFrom DATETIME = NULL,
    @availableTo DATETIME = NULL,
    @originatingAddressLabel NVARCHAR(500) = NULL,
    @originatingAddressLat FLOAT = NULL,
    @originatingAddressLon FLOAT = NULL,
    @destinationAddressLabel NVARCHAR(500) = NULL,
    @destinationAddressLat FLOAT = NULL,
    @destinationAddressLon FLOAT = NULL,
    @avatar NVARCHAR(100) = NULL,
    @status NVARCHAR(50) = NULL,
    @createdOn DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT * FROM dbo.Vehicle WHERE UserId = @userId ORDER BY Description;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT * FROM dbo.Vehicle WHERE Id = @id;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.Vehicle (Id, UserId, UserDescription, BranchId, BranchDescription, VehicleId,
            VehicleCategoryId, VehicleCategoryDescription, VehicleTypeId, VehicleTypeDescription,
            MakeId, MakeDescription, ModelId, ModelDescription, BodyTypeId, BodyTypeDescription,
            BodyLoadId, BodyLoadDescription, Liquid, Description, RegistrationNumber,
            MaxLoadWeight, MaxLoadHeight, MaxLoadWidth, MaxLoadLength, MaxLoadVolume, AvailableCapacity,
            AvailableFrom, AvailableTo, OriginatingAddressLabel, OriginatingAddressLat, OriginatingAddressLon,
            DestinationAddressLabel, DestinationAddressLat, DestinationAddressLon, Avatar, Status, CreatedOn)
        VALUES (@id, @userId, @userDescription, @branchId, @branchDescription, @vehicleId,
            @vehicleCategoryId, @vehicleCategoryDescription, @vehicleTypeId, @vehicleTypeDescription,
            @makeId, @makeDescription, @modelId, @modelDescription, @bodyTypeId, @bodyTypeDescription,
            @bodyLoadId, @bodyLoadDescription, @liquid, @description, @registrationNumber,
            @maxLoadWeight, @maxLoadHeight, @maxLoadWidth, @maxLoadLength, @maxLoadVolume, @availableCapacity,
            @availableFrom, @availableTo, @originatingAddressLabel, @originatingAddressLat, @originatingAddressLon,
            @destinationAddressLabel, @destinationAddressLat, @destinationAddressLon, @avatar, 
            ISNULL(@status, 'Active'), GETDATE());
        SELECT * FROM dbo.Vehicle WHERE Id = @id;
    END
    ELSE IF @action = 'update'
    BEGIN
        UPDATE dbo.Vehicle SET 
            UserDescription = @userDescription,
            BranchId = @branchId,
            BranchDescription = @branchDescription,
            VehicleId = @vehicleId,
            VehicleCategoryId = @vehicleCategoryId,
            VehicleCategoryDescription = @vehicleCategoryDescription,
            VehicleTypeId = @vehicleTypeId,
            VehicleTypeDescription = @vehicleTypeDescription,
            MakeId = @makeId,
            MakeDescription = @makeDescription,
            ModelId = @modelId,
            ModelDescription = @modelDescription,
            BodyTypeId = @bodyTypeId,
            BodyTypeDescription = @bodyTypeDescription,
            BodyLoadId = @bodyLoadId,
            BodyLoadDescription = @bodyLoadDescription,
            Liquid = @liquid,
            Description = @description,
            RegistrationNumber = @registrationNumber,
            MaxLoadWeight = @maxLoadWeight,
            MaxLoadHeight = @maxLoadHeight,
            MaxLoadWidth = @maxLoadWidth,
            MaxLoadLength = @maxLoadLength,
            MaxLoadVolume = @maxLoadVolume,
            AvailableCapacity = @availableCapacity,
            AvailableFrom = @availableFrom,
            AvailableTo = @availableTo,
            OriginatingAddressLabel = @originatingAddressLabel,
            OriginatingAddressLat = @originatingAddressLat,
            OriginatingAddressLon = @originatingAddressLon,
            DestinationAddressLabel = @destinationAddressLabel,
            DestinationAddressLat = @destinationAddressLat,
            DestinationAddressLon = @destinationAddressLon,
            Status = @status
        WHERE Id = @id;
        SELECT * FROM dbo.Vehicle WHERE Id = @id;
    END
    ELSE IF @action = 'update-image'
    BEGIN
        UPDATE dbo.Vehicle SET Avatar = @avatar WHERE Id = @id;
        SELECT * FROM dbo.Vehicle WHERE Id = @id;
    END
    ELSE IF @action = 'delete'
    BEGIN
        DELETE FROM dbo.Vehicle WHERE Id = @id;
        SELECT 'Success' AS result;
    END
END;
GO

-- Load stored procedure
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
            Route, Meters, Minutes, OdoStart, OdoEnd, DestinationCount, DestinationDelivered,
            Status, CreatedOn, ChangedOn)
        VALUES (@id, @userId, @userDescription, @loadTypeId, @loadTypeDescription, @liquid,
            @description, @note, @price, @itemCount, @weight, @length, @width, @height, @volume, @totalValue,
            @dateOut, @dateIn, @dateBidEnd, @fridgeHours, @kgsLoaded, @customerLoadedForm,
            ISNULL(@reviewAverageLoad, 0), ISNULL(@reviewCountLoad, 0), 0, @loadDestinationId,
            @originatingAddressLabel, @originatingAddressLat, @originatingAddressLon,
            @destinationAddressLabel, @destinationAddressLat, @destinationAddressLon,
            @route, @meters, @minutes, @odoStart, @odoEnd, ISNULL(@destinationCount, 0), 0,
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

-- Loads available stored procedure (with distance calculation in kilometers)
CREATE PROCEDURE dbo.usp_action_loads_available
    @userId NVARCHAR(450) = NULL,
    @input NVARCHAR(MAX) = NULL,
    @distance FLOAT = NULL,
    @origin FLOAT = NULL,
    @destination FLOAT = NULL,
    @lat FLOAT = NULL,
    @lon FLOAT = NULL,
    @weight FLOAT = NULL,
    @volumeCm FLOAT = NULL,
    @volumeLt FLOAT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT l.*,
           CASE WHEN @lat IS NOT NULL AND @lon IS NOT NULL AND l.OriginatingAddressLat IS NOT NULL AND l.OriginatingAddressLon IS NOT NULL
                THEN dbo.fn_CalculateDistanceKm(@lat, @lon, l.OriginatingAddressLat, l.OriginatingAddressLon) 
                ELSE NULL END AS DistanceFromOriginKm,
           CASE WHEN @lat IS NOT NULL AND @lon IS NOT NULL AND l.DestinationAddressLat IS NOT NULL AND l.DestinationAddressLon IS NOT NULL
                THEN dbo.fn_CalculateDistanceKm(@lat, @lon, l.DestinationAddressLat, l.DestinationAddressLon) 
                ELSE NULL END AS DistanceFromDestinationKm
    FROM dbo.Load l
    WHERE l.Status = 'Open'
      AND l.UserId != @userId
      AND (@weight IS NULL OR @weight = 0 OR l.Weight <= @weight)
      AND (@volumeCm IS NULL OR @volumeCm = 0 OR l.Volume <= @volumeCm)
      AND (@distance IS NULL OR @distance = 0 
           OR dbo.fn_CalculateDistanceKm(@lat, @lon, l.OriginatingAddressLat, l.OriginatingAddressLon) <= @distance)
    ORDER BY l.DateOut, l.CreatedOn DESC;
END;
GO

-- LoadDestination stored procedure
CREATE PROCEDURE dbo.usp_action_loadDestination
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @userId NVARCHAR(450) = NULL,
    @loadId UNIQUEIDENTIFIER = NULL,
    @pos INT = NULL,
    @originatingAddressLabel NVARCHAR(500) = NULL,
    @originatingAddressLat FLOAT = NULL,
    @originatingAddressLon FLOAT = NULL,
    @destinationAddressLabel NVARCHAR(500) = NULL,
    @destinationAddressLat FLOAT = NULL,
    @destinationAddressLon FLOAT = NULL,
    @odoStart FLOAT = NULL,
    @odoEnd FLOAT = NULL,
    @deliveryNoteNumber NVARCHAR(100) = NULL,
    @weighBridgeTicketNumber NVARCHAR(100) = NULL,
    @returnDocumentNumber NVARCHAR(100) = NULL,
    @returnKgs FLOAT = NULL,
    @returnReasonId UNIQUEIDENTIFIER = NULL,
    @stockProblemId UNIQUEIDENTIFIER = NULL,
    @returnPallets INT = NULL,
    @userIdLoaded NVARCHAR(450) = NULL,
    @userIdLoadedConfirmed NVARCHAR(450) = NULL,
    @userIdDelivered NVARCHAR(450) = NULL,
    @userIdDeliveredConfirmed NVARCHAR(450) = NULL,
    @status NVARCHAR(50) = NULL,
    @createdOn DATETIME = NULL,
    @changedOn DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT * FROM dbo.LoadDestination WHERE LoadId = @loadId ORDER BY Pos;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT * FROM dbo.LoadDestination WHERE Id = @id;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.LoadDestination (Id, UserId, LoadId, Pos, OriginatingAddressLabel, OriginatingAddressLat,
            OriginatingAddressLon, DestinationAddressLabel, DestinationAddressLat, DestinationAddressLon,
            OdoStart, OdoEnd, DeliveryNoteNumber, WeighBridgeTicketNumber, ReturnDocumentNumber,
            ReturnKgs, ReturnReasonId, StockProblemId, ReturnPallets, UserIdLoaded, UserIdLoadedConfirmed,
            UserIdDelivered, UserIdDeliveredConfirmed, Status, CreatedOn, ChangedOn)
        VALUES (@id, @userId, @loadId, @pos, @originatingAddressLabel, @originatingAddressLat,
            @originatingAddressLon, @destinationAddressLabel, @destinationAddressLat, @destinationAddressLon,
            @odoStart, @odoEnd, @deliveryNoteNumber, @weighBridgeTicketNumber, @returnDocumentNumber,
            @returnKgs, @returnReasonId, @stockProblemId, @returnPallets, @userIdLoaded, @userIdLoadedConfirmed,
            @userIdDelivered, @userIdDeliveredConfirmed, ISNULL(@status, 'Pending'), GETDATE(), GETDATE());
        
        -- Update load's first destination ID if not set
        IF NOT EXISTS (SELECT 1 FROM dbo.Load WHERE Id = @loadId AND LoadDestinationId IS NOT NULL)
        BEGIN
            UPDATE dbo.Load SET LoadDestinationId = @id WHERE Id = @loadId;
        END
        
        -- Update destination count
        UPDATE dbo.Load SET DestinationCount = (SELECT COUNT(*) FROM dbo.LoadDestination WHERE LoadId = @loadId) WHERE Id = @loadId;
        
        SELECT * FROM dbo.LoadDestination WHERE Id = @id;
    END
    ELSE IF @action = 'update'
    BEGIN
        UPDATE dbo.LoadDestination SET 
            Pos = @pos,
            OriginatingAddressLabel = @originatingAddressLabel,
            OriginatingAddressLat = @originatingAddressLat,
            OriginatingAddressLon = @originatingAddressLon,
            DestinationAddressLabel = @destinationAddressLabel,
            DestinationAddressLat = @destinationAddressLat,
            DestinationAddressLon = @destinationAddressLon,
            OdoStart = @odoStart,
            OdoEnd = @odoEnd,
            DeliveryNoteNumber = @deliveryNoteNumber,
            WeighBridgeTicketNumber = @weighBridgeTicketNumber,
            ReturnDocumentNumber = @returnDocumentNumber,
            ReturnKgs = @returnKgs,
            ReturnReasonId = @returnReasonId,
            StockProblemId = @stockProblemId,
            ReturnPallets = @returnPallets,
            Status = @status,
            ChangedOn = GETDATE()
        WHERE Id = @id;
        SELECT * FROM dbo.LoadDestination WHERE Id = @id;
    END
    ELSE IF @action = 'update-status'
    BEGIN
        UPDATE dbo.LoadDestination SET 
            Status = @status,
            UserIdLoaded = CASE WHEN @status = 'Loaded' THEN @userId ELSE UserIdLoaded END,
            UserIdLoadedConfirmed = CASE WHEN @status = 'LoadedConfirmed' THEN @userId ELSE UserIdLoadedConfirmed END,
            UserIdDelivered = CASE WHEN @status = 'Delivered' THEN @userId ELSE UserIdDelivered END,
            UserIdDeliveredConfirmed = CASE WHEN @status = 'DeliveredConfirmed' THEN @userId ELSE UserIdDeliveredConfirmed END,
            ChangedOn = GETDATE()
        WHERE Id = @id;
        
        SELECT * FROM dbo.LoadDestination WHERE Id = @id;
        
        -- Return bid info for SignalR
        SELECT * FROM dbo.Bid WHERE LoadId = @loadId AND Status = 'Accepted';
    END
    ELSE IF @action = 'delete'
    BEGIN
        DELETE FROM dbo.LoadDestination WHERE Id = @id;
        SELECT 'Success' AS result;
    END
END;
GO

PRINT 'Vehicle and Load stored procedures created successfully.';
GO

USE [FindRisk];
GO

-- ============================================================================
-- STORED PROCEDURES - Bid, Reviews, Maintenance, Dashboard
-- ============================================================================

-- Bid stored procedure
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
            Route, Meters, Minutes, OdoStart, OdoEnd, DestinationCount, DestinationDelivered,
            StatusLoad, ReviewAverageLoad, ReviewCountLoad, ReviewAverageDriver, ReviewCountDriver,
            CreatedOn, ChangedOn)
        SELECT @id, @userId, @userDescription, @loadId, @loadDescription, @loadTypeId, @loadTypeDescription,
            @vehicleId, @vehicleDescription, @vehicleCategoryId, @vehicleCategoryDescription,
            @vehicleTypeId, @vehicleTypeDescription, @driverId, @driverDescription, @price, @dateOut, @dateIn,
            @fridgeHours, @kgsLoaded, @customerLoadedForm, 'Pending', ld.LoadDestinationId,
            ld.OriginatingAddressLabel, ld.OriginatingAddressLat, ld.OriginatingAddressLon,
            ld.DestinationAddressLabel, ld.DestinationAddressLat, ld.DestinationAddressLon,
            ld.Route, ld.Meters, ld.Minutes, @odoStart, @odoEnd, ld.DestinationCount, 0,
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

-- ReviewDriver stored procedure
CREATE PROCEDURE dbo.usp_action_reviewDriver
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @userId NVARCHAR(450) = NULL,
    @driverId UNIQUEIDENTIFIER = NULL,
    @loadId UNIQUEIDENTIFIER = NULL,
    @loadDestinationId UNIQUEIDENTIFIER = NULL,
    @ratingPunctuality INT = NULL,
    @ratingVehicleDescription INT = NULL,
    @ratingCare INT = NULL,
    @ratingCondition INT = NULL,
    @ratingAttitude INT = NULL,
    @note NVARCHAR(MAX) = NULL,
    @timestamp DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT * FROM dbo.ReviewDriver WHERE DriverId = @driverId ORDER BY Timestamp DESC;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT * FROM dbo.ReviewDriver WHERE Id = @id;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.ReviewDriver (Id, UserId, DriverId, LoadId, LoadDestinationId, RatingPunctuality,
            RatingVehicleDescription, RatingCare, RatingCondition, RatingAttitude, Note, Timestamp)
        VALUES (@id, @userId, @driverId, @loadId, @loadDestinationId, @ratingPunctuality,
            @ratingVehicleDescription, @ratingCare, @ratingCondition, @ratingAttitude, @note, GETDATE());
        
        -- Update average rating on bid
        UPDATE dbo.Bid SET 
            ReviewAverageDriver = (SELECT AVG(CAST((RatingPunctuality + RatingVehicleDescription + RatingCare + RatingCondition + RatingAttitude) AS FLOAT) / 5) 
                                   FROM dbo.ReviewDriver WHERE DriverId = @driverId),
            ReviewCountDriver = (SELECT COUNT(*) FROM dbo.ReviewDriver WHERE DriverId = @driverId)
        WHERE DriverId = @driverId;
        
        SELECT * FROM dbo.ReviewDriver WHERE Id = @id;
    END
    ELSE IF @action = 'delete'
    BEGIN
        DELETE FROM dbo.ReviewDriver WHERE Id = @id;
        SELECT 'Success' AS result;
    END
END;
GO

-- ReviewLoad stored procedure
CREATE PROCEDURE dbo.usp_action_reviewLoad
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @userId NVARCHAR(450) = NULL,
    @loadId UNIQUEIDENTIFIER = NULL,
    @loadDestinationId UNIQUEIDENTIFIER = NULL,
    @ratingPunctuality INT = NULL,
    @ratingLoadDescription INT = NULL,
    @ratingPayment INT = NULL,
    @ratingCare INT = NULL,
    @ratingAttitude INT = NULL,
    @note NVARCHAR(MAX) = NULL,
    @timestamp DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT * FROM dbo.ReviewLoad WHERE LoadId = @loadId ORDER BY Timestamp DESC;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT * FROM dbo.ReviewLoad WHERE Id = @id;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.ReviewLoad (Id, UserId, LoadId, LoadDestinationId, RatingPunctuality,
            RatingLoadDescription, RatingPayment, RatingCare, RatingAttitude, Note, Timestamp)
        VALUES (@id, @userId, @loadId, @loadDestinationId, @ratingPunctuality,
            @ratingLoadDescription, @ratingPayment, @ratingCare, @ratingAttitude, @note, GETDATE());
        
        -- Update average rating on load and bid
        DECLARE @avgRating FLOAT;
        DECLARE @countRating INT;
        
        SELECT @avgRating = AVG(CAST((RatingPunctuality + RatingLoadDescription + RatingPayment + RatingCare + RatingAttitude) AS FLOAT) / 5),
               @countRating = COUNT(*)
        FROM dbo.ReviewLoad WHERE LoadId = @loadId;
        
        UPDATE dbo.Load SET ReviewAverageLoad = @avgRating, ReviewCountLoad = @countRating WHERE Id = @loadId;
        UPDATE dbo.Bid SET ReviewAverageLoad = @avgRating, ReviewCountLoad = @countRating WHERE LoadId = @loadId;
        
        SELECT * FROM dbo.ReviewLoad WHERE Id = @id;
    END
    ELSE IF @action = 'delete'
    BEGIN
        DELETE FROM dbo.ReviewLoad WHERE Id = @id;
        SELECT 'Success' AS result;
    END
END;
GO

-- Fuel stored procedure
CREATE PROCEDURE dbo.usp_action_fuel
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @userId NVARCHAR(450) = NULL,
    @loadId UNIQUEIDENTIFIER = NULL,
    @vehicleId UNIQUEIDENTIFIER = NULL,
    @driverId UNIQUEIDENTIFIER = NULL,
    @addressLat FLOAT = NULL,
    @addressLon FLOAT = NULL,
    @addressLabel NVARCHAR(500) = NULL,
    @odo REAL = NULL,
    @cost REAL = NULL,
    @createdOn DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT * FROM dbo.Fuel WHERE UserId = @userId ORDER BY CreatedOn DESC;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT * FROM dbo.Fuel WHERE Id = @id;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.Fuel (Id, UserId, LoadId, VehicleId, DriverId, AddressLat, AddressLon, AddressLabel, Odo, Cost, CreatedOn)
        VALUES (@id, @userId, @loadId, @vehicleId, @driverId, @addressLat, @addressLon, @addressLabel, @odo, @cost, GETDATE());
        SELECT * FROM dbo.Fuel WHERE Id = @id;
    END
    ELSE IF @action = 'delete'
    BEGIN
        DELETE FROM dbo.Fuel WHERE Id = @id;
        SELECT 'Success' AS result;
    END
END;
GO

-- MaintenancePlanned stored procedure
CREATE PROCEDURE dbo.usp_action_maintenancePlanned
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @userId NVARCHAR(450) = NULL,
    @vehicleId UNIQUEIDENTIFIER = NULL,
    @maintenancePlannedTypeId UNIQUEIDENTIFIER = NULL,
    @odo REAL = NULL,
    @cost REAL = NULL,
    @createdOn DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT * FROM dbo.MaintenancePlanned WHERE UserId = @userId ORDER BY CreatedOn DESC;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT * FROM dbo.MaintenancePlanned WHERE Id = @id;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.MaintenancePlanned (Id, UserId, VehicleId, MaintenancePlannedTypeId, Odo, Cost, CreatedOn)
        VALUES (@id, @userId, @vehicleId, @maintenancePlannedTypeId, @odo, @cost, GETDATE());
        SELECT * FROM dbo.MaintenancePlanned WHERE Id = @id;
    END
    ELSE IF @action = 'delete'
    BEGIN
        DELETE FROM dbo.MaintenancePlanned WHERE Id = @id;
        SELECT 'Success' AS result;
    END
END;
GO

-- MaintenanceUnPlanned stored procedure
CREATE PROCEDURE dbo.usp_action_maintenanceUnPlanned
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @userId NVARCHAR(450) = NULL,
    @loadId UNIQUEIDENTIFIER = NULL,
    @maintenanceUnPlannedTypeId UNIQUEIDENTIFIER = NULL,
    @odo REAL = NULL,
    @cost REAL = NULL,
    @createdOn DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT * FROM dbo.MaintenanceUnPlanned WHERE UserId = @userId ORDER BY CreatedOn DESC;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT * FROM dbo.MaintenanceUnPlanned WHERE Id = @id;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.MaintenanceUnPlanned (Id, UserId, LoadId, MaintenanceUnPlannedTypeId, Odo, Cost, CreatedOn)
        VALUES (@id, @userId, @loadId, @maintenanceUnPlannedTypeId, @odo, @cost, GETDATE());
        SELECT * FROM dbo.MaintenanceUnPlanned WHERE Id = @id;
    END
    ELSE IF @action = 'delete'
    BEGIN
        DELETE FROM dbo.MaintenanceUnPlanned WHERE Id = @id;
        SELECT 'Success' AS result;
    END
END;
GO

-- Dashboard stored procedure
CREATE PROCEDURE dbo.usp_action_dashboard
    @action NVARCHAR(50),
    @userId NVARCHAR(450) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select-single'
    BEGIN
        SELECT 
            (SELECT COUNT(*) FROM dbo.Load) AS LoadCountTotal,
            (SELECT COUNT(*) FROM dbo.Load WHERE CreatedOn >= DATEADD(DAY, -7, GETDATE())) AS LoadCountNew,
            (SELECT COUNT(*) FROM dbo.Vehicle) AS VehicleCountTotal,
            (SELECT COUNT(*) FROM dbo.Vehicle WHERE CreatedOn >= DATEADD(DAY, -7, GETDATE())) AS VehicleCountNew,
            (SELECT COUNT(*) FROM dbo.Advert WHERE Status = 'Active') AS AdvertCountTotal,
            (SELECT COUNT(*) FROM dbo.Advert WHERE CreatedOn >= DATEADD(DAY, -7, GETDATE())) AS AdvertCountNew,
            (SELECT COUNT(*) FROM dbo.Directory WHERE Status = 'Active') AS DirectoryCountTotal,
            (SELECT COUNT(*) FROM dbo.Directory WHERE CreatedOn >= DATEADD(DAY, -7, GETDATE())) AS DirectoryCountNew,
            (SELECT COUNT(DISTINCT UserId) FROM dbo.Load) AS UserCountLoadTotal,
            (SELECT COUNT(DISTINCT UserId) FROM dbo.Load WHERE CreatedOn >= DATEADD(DAY, -7, GETDATE())) AS UserCountLoadNew,
            (SELECT COUNT(DISTINCT UserId) FROM dbo.Vehicle) AS UserCountVehicleTotal,
            (SELECT COUNT(DISTINCT UserId) FROM dbo.Vehicle WHERE CreatedOn >= DATEADD(DAY, -7, GETDATE())) AS UserCountVehicleNew;
    END
END;
GO

-- Subscription stored procedure
CREATE PROCEDURE dbo.usp_action_subscription
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @userId NVARCHAR(450) = NULL,
    @reference NVARCHAR(200) = NULL,
    @amount_gross DECIMAL(18,2) = NULL,
    @amount_net DECIMAL(18,2) = NULL,
    @amount_fee DECIMAL(18,2) = NULL,
    @dateStart DATETIME = NULL,
    @active BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT * FROM dbo.Subscription WHERE UserId = @userId ORDER BY DateStart DESC;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT * FROM dbo.Subscription WHERE Id = @id;
    END
    ELSE IF @action = 'active'
    BEGIN
        SELECT TOP 1 * FROM dbo.Subscription WHERE UserId = @userId AND Active = 1 ORDER BY DateStart DESC;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.Subscription (Id, UserId, Reference, Amount_gross, Amount_net, Amount_fee, DateStart, Active)
        VALUES (@id, @userId, @reference, @amount_gross, @amount_net, @amount_fee, GETDATE(), 1);
        SELECT * FROM dbo.Subscription WHERE Id = @id;
    END
    ELSE IF @action = 'update'
    BEGIN
        UPDATE dbo.Subscription SET Active = @active WHERE Id = @id;
        SELECT * FROM dbo.Subscription WHERE Id = @id;
    END
END;
GO

-- Transaction stored procedure
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
END;
GO

-- Quote stored procedure
CREATE PROCEDURE dbo.usp_action_quote
    @action NVARCHAR(50),
    @id UNIQUEIDENTIFIER = NULL,
    @nameFirst NVARCHAR(100) = NULL,
    @nameLast NVARCHAR(100) = NULL,
    @email NVARCHAR(200) = NULL,
    @mobileNumber NVARCHAR(50) = NULL,
    @company NVARCHAR(200) = NULL,
    @businessDescriptionId UNIQUEIDENTIFIER = NULL,
    @ownedRentedId UNIQUEIDENTIFIER = NULL,
    @premium FLOAT = NULL,
    @status NVARCHAR(50) = NULL,
    @createdOn DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @action = 'select'
    BEGIN
        SELECT * FROM dbo.vw_Quote ORDER BY CreatedOn DESC;
    END
    ELSE IF @action = 'select-single'
    BEGIN
        SELECT * FROM dbo.vw_Quote WHERE Id = @id;
    END
    ELSE IF @action = 'insert'
    BEGIN
        SET @id = NEWID();
        INSERT INTO dbo.Quote (Id, NameFirst, NameLast, Email, MobileNumber, Company, BusinessDescriptionId, OwnedRentedId, Premium, Status, CreatedOn)
        VALUES (@id, @nameFirst, @nameLast, @email, @mobileNumber, @company, @businessDescriptionId, @ownedRentedId, @premium, 'New', GETDATE());
        SELECT * FROM dbo.vw_Quote WHERE Id = @id;
    END
    ELSE IF @action = 'update'
    BEGIN
        UPDATE dbo.Quote SET 
            NameFirst = @nameFirst,
            NameLast = @nameLast,
            Email = @email,
            MobileNumber = @mobileNumber,
            Company = @company,
            BusinessDescriptionId = @businessDescriptionId,
            OwnedRentedId = @ownedRentedId,
            Premium = @premium,
            Status = @status
        WHERE Id = @id;
        SELECT * FROM dbo.vw_Quote WHERE Id = @id;
    END
    ELSE IF @action = 'delete'
    BEGIN
        DELETE FROM dbo.QuoteTruck WHERE QuoteId = @id;
        DELETE FROM dbo.QuoteTrailer WHERE QuoteId = @id;
        DELETE FROM dbo.Quote WHERE Id = @id;
        SELECT 'Success' AS result;
    END
END;
GO

PRINT 'All stored procedures created successfully.';
GO

PRINT '';
PRINT '============================================================================';
PRINT 'DATABASE SCHEMA CREATION COMPLETE';
PRINT '============================================================================';
PRINT '';
GO

