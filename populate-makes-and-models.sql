-- =============================================
-- Populate Makes and Models - Comprehensive List
-- =============================================
-- This script adds a comprehensive list of vehicle makes and models
-- commonly used in logistics and transportation
-- =============================================

USE [findrisk]; -- Update this to your database name if different
GO

PRINT '==============================================';
PRINT 'POPULATING VEHICLE MAKES AND MODELS';
PRINT '==============================================';
PRINT '';

-- Clear existing data (optional - comment out if you want to keep existing data)
-- DELETE FROM [dbo].[Model];
-- DELETE FROM [dbo].[Make];
-- PRINT 'Cleared existing makes and models.';
-- PRINT '';

-- =============================================
-- SECTION 1: MAKES (Vehicle Manufacturers)
-- =============================================

PRINT 'Adding Vehicle Makes...';

-- Declare variables for Make IDs
DECLARE @MercedezBenzId UNIQUEIDENTIFIER = NEWID();
DECLARE @VolvoId UNIQUEIDENTIFIER = NEWID();
DECLARE @ScaniaId UNIQUEIDENTIFIER = NEWID();
DECLARE @MANId UNIQUEIDENTIFIER = NEWID();
DECLARE @IvecoId UNIQUEIDENTIFIER = NEWID();
DECLARE @DAFId UNIQUEIDENTIFIER = NEWID();
DECLARE @RenaultId UNIQUEIDENTIFIER = NEWID();
DECLARE @IsuZuId UNIQUEIDENTIFIER = NEWID();
DECLARE @FAWId UNIQUEIDENTIFIER = NEWID();
DECLARE @HinoId UNIQUEIDENTIFIER = NEWID();
DECLARE @TataId UNIQUEIDENTIFIER = NEWID();
DECLARE @FordId UNIQUEIDENTIFIER = NEWID();
DECLARE @ToyotaId UNIQUEIDENTIFIER = NEWID();
DECLARE @NissanId UNIQUEIDENTIFIER = NEWID();
DECLARE @MitsubishiId UNIQUEIDENTIFIER = NEWID();
DECLARE @FusoId UNIQUEIDENTIFIER = NEWID();
DECLARE @FreightlinerId UNIQUEIDENTIFIER = NEWID();
DECLARE @KenworthId UNIQUEIDENTIFIER = NEWID();
DECLARE @PeterbiltId UNIQUEIDENTIFIER = NEWID();
DECLARE @InternationalId UNIQUEIDENTIFIER = NEWID();

-- Insert Makes
INSERT INTO [dbo].[Make] (Id, Description) VALUES
    (@MercedezBenzId, 'Mercedes-Benz'),
    (@VolvoId, 'Volvo'),
    (@ScaniaId, 'Scania'),
    (@MANId, 'MAN'),
    (@IvecoId, 'Iveco'),
    (@DAFId, 'DAF'),
    (@RenaultId, 'Renault Trucks'),
    (@IsuZuId, 'Isuzu'),
    (@FAWId, 'FAW'),
    (@HinoId, 'Hino'),
    (@TataId, 'Tata'),
    (@FordId, 'Ford'),
    (@ToyotaId, 'Toyota'),
    (@NissanId, 'Nissan'),
    (@MitsubishiId, 'Mitsubishi'),
    (@FusoId, 'Fuso'),
    (@FreightlinerId, 'Freightliner'),
    (@KenworthId, 'Kenworth'),
    (@PeterbiltId, 'Peterbilt'),
    (@InternationalId, 'International');

PRINT 'Added 20 vehicle makes.';
PRINT '';

-- =============================================
-- SECTION 2: MODELS (Organized by Make)
-- =============================================

PRINT 'Adding Vehicle Models...';
PRINT '';

-- Mercedes-Benz Models
PRINT '  - Mercedes-Benz models...';
INSERT INTO [dbo].[Model] (Id, MakeId, Description) VALUES
    (NEWID(), @MercedezBenzId, 'Actros 1845'),
    (NEWID(), @MercedezBenzId, 'Actros 2545'),
    (NEWID(), @MercedezBenzId, 'Actros 2645'),
    (NEWID(), @MercedezBenzId, 'Actros 3340'),
    (NEWID(), @MercedezBenzId, 'Atego 1218'),
    (NEWID(), @MercedezBenzId, 'Atego 1518'),
    (NEWID(), @MercedezBenzId, 'Atego 1823'),
    (NEWID(), @MercedezBenzId, 'Axor 1833'),
    (NEWID(), @MercedezBenzId, 'Axor 2533'),
    (NEWID(), @MercedezBenzId, 'Axor 3340'),
    (NEWID(), @MercedezBenzId, 'Sprinter 314 CDI'),
    (NEWID(), @MercedezBenzId, 'Sprinter 516 CDI'),
    (NEWID(), @MercedezBenzId, 'Vito 111 CDI');

-- Volvo Models
PRINT '  - Volvo models...';
INSERT INTO [dbo].[Model] (Id, MakeId, Description) VALUES
    (NEWID(), @VolvoId, 'FH 440'),
    (NEWID(), @VolvoId, 'FH 460'),
    (NEWID(), @VolvoId, 'FH 500'),
    (NEWID(), @VolvoId, 'FH 540'),
    (NEWID(), @VolvoId, 'FM 330'),
    (NEWID(), @VolvoId, 'FM 370'),
    (NEWID(), @VolvoId, 'FM 420'),
    (NEWID(), @VolvoId, 'FMX 440'),
    (NEWID(), @VolvoId, 'FL 240'),
    (NEWID(), @VolvoId, 'FL 280'),
    (NEWID(), @VolvoId, 'FE 280');

-- Scania Models
PRINT '  - Scania models...';
INSERT INTO [dbo].[Model] (Id, MakeId, Description) VALUES
    (NEWID(), @ScaniaId, 'R 410'),
    (NEWID(), @ScaniaId, 'R 450'),
    (NEWID(), @ScaniaId, 'R 500'),
    (NEWID(), @ScaniaId, 'R 580'),
    (NEWID(), @ScaniaId, 'P 320'),
    (NEWID(), @ScaniaId, 'P 360'),
    (NEWID(), @ScaniaId, 'P 410'),
    (NEWID(), @ScaniaId, 'G 410'),
    (NEWID(), @ScaniaId, 'G 450'),
    (NEWID(), @ScaniaId, 'S 500'),
    (NEWID(), @ScaniaId, 'S 580');

-- MAN Models
PRINT '  - MAN models...';
INSERT INTO [dbo].[Model] (Id, MakeId, Description) VALUES
    (NEWID(), @MANId, 'TGX 18.440'),
    (NEWID(), @MANId, 'TGX 18.480'),
    (NEWID(), @MANId, 'TGX 26.440'),
    (NEWID(), @MANId, 'TGS 26.360'),
    (NEWID(), @MANId, 'TGS 33.400'),
    (NEWID(), @MANId, 'TGM 18.280'),
    (NEWID(), @MANId, 'TGM 15.250'),
    (NEWID(), @MANId, 'TGL 8.180'),
    (NEWID(), @MANId, 'TGL 12.220');

-- Iveco Models
PRINT '  - Iveco models...';
INSERT INTO [dbo].[Model] (Id, MakeId, Description) VALUES
    (NEWID(), @IvecoId, 'Stralis 420'),
    (NEWID(), @IvecoId, 'Stralis 460'),
    (NEWID(), @IvecoId, 'Stralis 500'),
    (NEWID(), @IvecoId, 'Trakker 380'),
    (NEWID(), @IvecoId, 'Trakker 410'),
    (NEWID(), @IvecoId, 'Eurocargo 120E25'),
    (NEWID(), @IvecoId, 'Eurocargo 150E28'),
    (NEWID(), @IvecoId, 'Eurocargo 180E28'),
    (NEWID(), @IvecoId, 'Daily 35S14'),
    (NEWID(), @IvecoId, 'Daily 50C15'),
    (NEWID(), @IvecoId, 'Daily 70C17');

-- DAF Models
PRINT '  - DAF models...';
INSERT INTO [dbo].[Model] (Id, MakeId, Description) VALUES
    (NEWID(), @DAFId, 'XF 440'),
    (NEWID(), @DAFId, 'XF 480'),
    (NEWID(), @DAFId, 'XF 530'),
    (NEWID(), @DAFId, 'CF 340'),
    (NEWID(), @DAFId, 'CF 370'),
    (NEWID(), @DAFId, 'CF 410'),
    (NEWID(), @DAFId, 'LF 180'),
    (NEWID(), @DAFId, 'LF 220'),
    (NEWID(), @DAFId, 'LF 280');

-- Renault Trucks Models
PRINT '  - Renault Trucks models...';
INSERT INTO [dbo].[Model] (Id, MakeId, Description) VALUES
    (NEWID(), @RenaultId, 'T 440'),
    (NEWID(), @RenaultId, 'T 460'),
    (NEWID(), @RenaultId, 'T 480'),
    (NEWID(), @RenaultId, 'C 380'),
    (NEWID(), @RenaultId, 'C 430'),
    (NEWID(), @RenaultId, 'D 280'),
    (NEWID(), @RenaultId, 'D 320'),
    (NEWID(), @RenaultId, 'K 380');

-- Isuzu Models
PRINT '  - Isuzu models...';
INSERT INTO [dbo].[Model] (Id, MakeId, Description) VALUES
    (NEWID(), @IsuZuId, 'FTR 850'),
    (NEWID(), @IsuZuId, 'FSR 800'),
    (NEWID(), @IsuZuId, 'FVR 1000'),
    (NEWID(), @IsuZuId, 'FVZ 1400'),
    (NEWID(), @IsuZuId, 'NPR 300'),
    (NEWID(), @IsuZuId, 'NPR 400'),
    (NEWID(), @IsuZuId, 'NQR 500'),
    (NEWID(), @IsuZuId, 'NQR 700'),
    (NEWID(), @IsuZuId, 'NLR 200'),
    (NEWID(), @IsuZuId, 'NMR 250');

-- FAW Models
PRINT '  - FAW models...';
INSERT INTO [dbo].[Model] (Id, MakeId, Description) VALUES
    (NEWID(), @FAWId, '8.140FL'),
    (NEWID(), @FAWId, '15.180FL'),
    (NEWID(), @FAWId, '28.280FL'),
    (NEWID(), @FAWId, '33.330FC'),
    (NEWID(), @FAWId, '28.330FD'),
    (NEWID(), @FAWId, '15.180FD'),
    (NEWID(), @FAWId, '8.140FD'),
    (NEWID(), @FAWId, '6.130FL'),
    (NEWID(), @FAWId, '25.280FC');

-- Hino Models
PRINT '  - Hino models...';
INSERT INTO [dbo].[Model] (Id, MakeId, Description) VALUES
    (NEWID(), @HinoId, '300 Series 614'),
    (NEWID(), @HinoId, '300 Series 714'),
    (NEWID(), @HinoId, '300 Series 816'),
    (NEWID(), @HinoId, '500 Series 1124'),
    (NEWID(), @HinoId, '500 Series 1324'),
    (NEWID(), @HinoId, '500 Series 1626'),
    (NEWID(), @HinoId, '500 Series 2628'),
    (NEWID(), @HinoId, '700 Series 2848');

-- Tata Models
PRINT '  - Tata models...';
INSERT INTO [dbo].[Model] (Id, MakeId, Description) VALUES
    (NEWID(), @TataId, 'LPT 1518'),
    (NEWID(), @TataId, 'LPT 1623'),
    (NEWID(), @TataId, 'LPT 2523'),
    (NEWID(), @TataId, 'Prima 2528.K'),
    (NEWID(), @TataId, 'Prima 3338.K'),
    (NEWID(), @TataId, 'Prima 4038.S'),
    (NEWID(), @TataId, 'Ultra 1014'),
    (NEWID(), @TataId, 'Ultra 1518'),
    (NEWID(), @TataId, 'Ace'),
    (NEWID(), @TataId, 'Super Ace');

-- Ford Models
PRINT '  - Ford models...';
INSERT INTO [dbo].[Model] (Id, MakeId, Description) VALUES
    (NEWID(), @FordId, 'F-150'),
    (NEWID(), @FordId, 'F-250 Super Duty'),
    (NEWID(), @FordId, 'F-350 Super Duty'),
    (NEWID(), @FordId, 'F-450 Super Duty'),
    (NEWID(), @FordId, 'F-550 Super Duty'),
    (NEWID(), @FordId, 'Transit 350'),
    (NEWID(), @FordId, 'Transit 350 HD'),
    (NEWID(), @FordId, 'Transit Connect'),
    (NEWID(), @FordId, 'Ranger 2.2 TDCi'),
    (NEWID(), @FordId, 'Ranger 3.2 TDCi');

-- Toyota Models
PRINT '  - Toyota models...';
INSERT INTO [dbo].[Model] (Id, MakeId, Description) VALUES
    (NEWID(), @ToyotaId, 'Hilux 2.4 GD-6'),
    (NEWID(), @ToyotaId, 'Hilux 2.8 GD-6'),
    (NEWID(), @ToyotaId, 'Land Cruiser 79'),
    (NEWID(), @ToyotaId, 'Dyna 150'),
    (NEWID(), @ToyotaId, 'Dyna 200'),
    (NEWID(), @ToyotaId, 'Hino 300 614'),
    (NEWID(), @ToyotaId, 'Hiace Panel Van'),
    (NEWID(), @ToyotaId, 'Quantum 2.5 D-4D');

-- Nissan Models
PRINT '  - Nissan models...';
INSERT INTO [dbo].[Model] (Id, MakeId, Description) VALUES
    (NEWID(), @NissanId, 'Navara 2.3D'),
    (NEWID(), @NissanId, 'NP200 1.6'),
    (NEWID(), @NissanId, 'NP300 Hardbody 2.5 TDi'),
    (NEWID(), @NissanId, 'Cabstar 35.13'),
    (NEWID(), @NissanId, 'Cabstar 45.13'),
    (NEWID(), @NissanId, 'UD40'),
    (NEWID(), @NissanId, 'UD80'),
    (NEWID(), @NissanId, 'NV350 Panel Van');

-- Mitsubishi Models
PRINT '  - Mitsubishi models...';
INSERT INTO [dbo].[Model] (Id, MakeId, Description) VALUES
    (NEWID(), @MitsubishiId, 'Triton 2.4 DI-D'),
    (NEWID(), @MitsubishiId, 'Canter FE7-136'),
    (NEWID(), @MitsubishiId, 'Canter FE8-150'),
    (NEWID(), @MitsubishiId, 'Canter FG7-136'),
    (NEWID(), @MitsubishiId, 'Fuso FM16-270'),
    (NEWID(), @MitsubishiId, 'Fuso FP25-270');

-- Fuso Models
PRINT '  - Fuso models...';
INSERT INTO [dbo].[Model] (Id, MakeId, Description) VALUES
    (NEWID(), @FusoId, 'Canter 3C13'),
    (NEWID(), @FusoId, 'Canter 4C13'),
    (NEWID(), @FusoId, 'Canter 7C15'),
    (NEWID(), @FusoId, 'Canter 8C18'),
    (NEWID(), @FusoId, 'Fighter 1124'),
    (NEWID(), @FusoId, 'Fighter 1424'),
    (NEWID(), @FusoId, 'Shogun FV26-280');

-- Freightliner Models
PRINT '  - Freightliner models...';
INSERT INTO [dbo].[Model] (Id, MakeId, Description) VALUES
    (NEWID(), @FreightlinerId, 'Cascadia'),
    (NEWID(), @FreightlinerId, 'Cascadia Evolution'),
    (NEWID(), @FreightlinerId, 'Coronado'),
    (NEWID(), @FreightlinerId, 'M2 106'),
    (NEWID(), @FreightlinerId, 'M2 112'),
    (NEWID(), @FreightlinerId, '114SD'),
    (NEWID(), @FreightlinerId, '122SD');

-- Kenworth Models
PRINT '  - Kenworth models...';
INSERT INTO [dbo].[Model] (Id, MakeId, Description) VALUES
    (NEWID(), @KenworthId, 'T680'),
    (NEWID(), @KenworthId, 'T880'),
    (NEWID(), @KenworthId, 'W900'),
    (NEWID(), @KenworthId, 'T800'),
    (NEWID(), @KenworthId, 'T370'),
    (NEWID(), @KenworthId, 'T470');

-- Peterbilt Models
PRINT '  - Peterbilt models...';
INSERT INTO [dbo].[Model] (Id, MakeId, Description) VALUES
    (NEWID(), @PeterbiltId, '579'),
    (NEWID(), @PeterbiltId, '567'),
    (NEWID(), @PeterbiltId, '389'),
    (NEWID(), @PeterbiltId, '367'),
    (NEWID(), @PeterbiltId, '348'),
    (NEWID(), @PeterbiltId, '337');

-- International Models
PRINT '  - International models...';
INSERT INTO [dbo].[Model] (Id, MakeId, Description) VALUES
    (NEWID(), @InternationalId, 'LT Series'),
    (NEWID(), @InternationalId, 'RH Series'),
    (NEWID(), @InternationalId, 'HX Series'),
    (NEWID(), @InternationalId, 'MV Series'),
    (NEWID(), @InternationalId, 'CV Series'),
    (NEWID(), @InternationalId, 'HV Series');

PRINT '';
PRINT '==============================================';
PRINT 'SUMMARY';
PRINT '==============================================';

-- Count totals
DECLARE @MakeCount INT, @ModelCount INT;
SELECT @MakeCount = COUNT(*) FROM [dbo].[Make];
SELECT @ModelCount = COUNT(*) FROM [dbo].[Model];

PRINT 'Total Makes: ' + CAST(@MakeCount AS NVARCHAR(10));
PRINT 'Total Models: ' + CAST(@ModelCount AS NVARCHAR(10));
PRINT '';

-- Show breakdown by make
PRINT 'Models per Make:';
SELECT 
    mk.Description AS Make,
    COUNT(m.Id) AS ModelCount
FROM [dbo].[Make] mk
LEFT JOIN [dbo].[Model] m ON mk.Id = m.MakeId
GROUP BY mk.Description
ORDER BY COUNT(m.Id) DESC, mk.Description;

PRINT '';
PRINT '==============================================';
PRINT 'COMPLETE!';
PRINT '==============================================';
PRINT 'All makes and models have been added successfully.';
PRINT 'You can now select FAW and see its models in the dropdown.';
PRINT '==============================================';
GO

