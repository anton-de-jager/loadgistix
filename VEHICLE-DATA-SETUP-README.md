# Vehicle Data Setup Guide

## Problem
When trying to insert a vehicle, the dropdowns are empty:
- **Load Type** dropdown is empty
- **Vehicle Model** dropdown is empty (after selecting a make)

## Root Cause
The database lookup tables are either empty or missing the proper foreign key relationships:
- `VehicleType` records need `VehicleCategoryId` to link to `VehicleCategory`
- `Model` records need `MakeId` to link to `Make`

## Solution - Run ONE Script

### Option 1: Master Script (Recommended) ⭐
Run this single script to populate everything:
```sql
MASTER-populate-all-vehicle-data.sql
```

**This script adds:**
- ✅ 6 Vehicle Categories
- ✅ 58 Vehicle Types (Load Types) with proper category links
- ✅ 20 Vehicle Makes
- ✅ 180+ Vehicle Models with proper make links

**Time:** ~5-10 seconds

---

### Option 2: Individual Scripts (If you prefer step-by-step)

If you want more control, run these in order:

1. **First:** Populate categories and types
   ```sql
   populate-vehicle-categories-and-types.sql
   ```

2. **Second:** Populate makes and models
   ```sql
   populate-makes-and-models.sql
   ```

---

## What Gets Added

### Vehicle Categories (6)
1. Light Commercial Vehicle
2. Medium Truck
3. Heavy Truck
4. Articulated Truck
5. Specialized Vehicle
6. Van

### Vehicle Types (Load Types) by Category

**Light Commercial Vehicle** (7 types):
- Dry Freight, Refrigerated, Curtain Side, Flatbed, Box Body, Tipper, Dropside

**Medium Truck** (9 types):
- Dry Freight, Refrigerated, Curtain Side, Flatbed, Box Body, Tipper, Crane Truck, Livestock Carrier, Beverage Truck

**Heavy Truck** (12 types):
- Dry Freight, Refrigerated, Curtain Side, Flatbed, Box Body, Tipper, Crane Truck, Livestock Carrier, Tanker, Concrete Mixer, Car Carrier, Logging Truck

**Articulated Truck** (13 types):
- Dry Freight Trailer, Refrigerated Trailer, Curtain Side Trailer, Flatbed Trailer, Container Trailer, Tanker Trailer, Low Loader, Car Carrier Trailer, Livestock Trailer, Tipper Trailer, Interlink, B-Double, Road Train

**Specialized Vehicle** (8 types):
- Hazmat Tanker, Bulk Powder, Silo Trailer, Abnormal Load, Heavy Haulage, Waste Collection, Recovery Vehicle, Mobile Crane

**Van** (7 types):
- Panel Van, Refrigerated Van, Luton Van, Dropside Van, Tipper Van, Minibus, Crew Cab Van

### Vehicle Makes (20)
Mercedes-Benz, Volvo, Scania, MAN, Iveco, DAF, Renault Trucks, Isuzu, **FAW**, Hino, Tata, Ford, Toyota, Nissan, Mitsubishi, Fuso, Freightliner, Kenworth, Peterbilt, International

### Vehicle Models (180+)

Each make has multiple models. For example:

**FAW Models** (9):
- 8.140FL
- 15.180FL
- 28.280FL
- 33.330FC
- 28.330FD
- 15.180FD
- 8.140FD
- 6.130FL
- 25.280FC

**Mercedes-Benz Models** (13):
- Actros 1845, Actros 2545, Actros 2645, Actros 3340
- Atego 1218, Atego 1518, Atego 1823
- Axor 1833, Axor 2533, Axor 3340
- Sprinter 314 CDI, Sprinter 516 CDI, Vito 111 CDI

*(And many more for all 20 makes)*

---

## After Running the Script

### Test the Fix

1. **Refresh your frontend** (Ctrl+F5 or clear cache)
2. **Navigate to Vehicles** and click "Add Vehicle"
3. **Select "Light Commercial Vehicle"** as Vehicle Category
4. **Load Type dropdown** should now show 7 options:
   - Dry Freight
   - Refrigerated
   - Curtain Side
   - Flatbed
   - Box Body
   - Tipper
   - Dropside
5. **Select "FAW"** as Vehicle Make
6. **Vehicle Model dropdown** should now show 9 options:
   - 8.140FL
   - 15.180FL
   - 28.280FL
   - etc.

### Expected Result
✅ All dropdowns work correctly
✅ No more empty dropdowns
✅ Proper cascading filtering (Load Types filter by Category, Models filter by Make)

---

## Diagnostic Script (Optional)

If you want to check the current state of your database first:
```sql
check-and-fix-vehicle-lookups.sql
```

This will show you:
- What data currently exists
- What relationships are set up
- Specific analysis for FAW and Light Commercial Vehicle

---

## Files Created

| File | Purpose |
|------|---------|
| `MASTER-populate-all-vehicle-data.sql` | ⭐ **Run this one** - Does everything |
| `populate-vehicle-categories-and-types.sql` | Categories and Load Types only |
| `populate-makes-and-models.sql` | Makes and Models only |
| `check-and-fix-vehicle-lookups.sql` | Diagnostic tool to check current data |
| `VEHICLE-DROPDOWNS-ISSUE.md` | Technical explanation of the issue |
| `VEHICLE-DATA-SETUP-README.md` | This file |

---

## Database Schema

```
VehicleCategory
    ├── Id (UNIQUEIDENTIFIER)
    └── Description (NVARCHAR)
        │
        └── VehicleType (Load Types)
            ├── Id (UNIQUEIDENTIFIER)
            ├── VehicleCategoryId (NVARCHAR) ← Links to VehicleCategory.Id
            ├── VehicleCategoryDescription (NVARCHAR)
            └── Description (NVARCHAR)

Make
    ├── Id (UNIQUEIDENTIFIER)
    └── Description (NVARCHAR)
        │
        └── Model
            ├── Id (UNIQUEIDENTIFIER)
            ├── MakeId (UNIQUEIDENTIFIER) ← Links to Make.Id
            └── Description (NVARCHAR)
```

---

## Need More Data?

The scripts are designed to be comprehensive but you can easily add more:

### Add a new Vehicle Type (Load Type):
```sql
DECLARE @CategoryId UNIQUEIDENTIFIER;
SELECT @CategoryId = Id FROM VehicleCategory WHERE Description = 'Light Commercial Vehicle';

INSERT INTO VehicleType (Id, VehicleCategoryId, VehicleCategoryDescription, Description)
VALUES (NEWID(), @CategoryId, 'Light Commercial Vehicle', 'Your New Type');
```

### Add a new Model:
```sql
DECLARE @MakeId UNIQUEIDENTIFIER;
SELECT @MakeId = Id FROM Make WHERE Description = 'FAW';

INSERT INTO Model (Id, MakeId, Description)
VALUES (NEWID(), @MakeId, 'Your New Model');
```

---

## Questions?

If the dropdowns are still empty after running the script:
1. Check that the script completed successfully (no errors)
2. Run `check-and-fix-vehicle-lookups.sql` to verify data exists
3. Check browser console for API errors
4. Verify the API is returning the data correctly

---

**Ready to fix it? Run `MASTER-populate-all-vehicle-data.sql` now!** 🚀

