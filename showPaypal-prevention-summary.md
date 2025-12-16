# showPaypal Prevention - Complete Solution

## Overview
This document explains how the `showPaypal()` function is triggered throughout the application and how the SQL script prevents it from being called.

## Where showPaypal() is Called

### 1. **Directories Component** (`directories.component.ts`)
- **Trigger**: When `quantity <= 0` for the `directory` field
- **Code Location**: Line 191-193
```typescript
if (this.quantity <= 0) {
    this.form.disable();
    this.showPaypal();
}
```
- **Prevention**: Set `Directory` transaction value to `999999` (always > 0)

### 2. **Vehicles Component** (`vehicles.component.ts`)
- **Trigger**: When trying to add a vehicle and user has reached their limit
- **Code Location**: Line 503
```typescript
if ((this.dataSource.data.length < this.quantity) || 
    (this.dataSource.data.length == this.quantity && row !== null) || 
    (this.quantity === -1)) {
    // Allow add/edit
} else {
    this.showPaypal(); // Called when limit reached
}
```
- **Prevention**: Set `Vehicle` transaction value to `999999` (dataSource.length will never reach 999999)

### 3. **Loads Component** (`loads.component.ts`)
- **Trigger**: When trying to add a load and user has reached their limit
- **Code Location**: Line 466
```typescript
if ((this.dataSource.data.length < this.quantity) || 
    (this.dataSource.data.length == this.quantity && row !== null) || 
    (this.quantity === -1)) {
    // Allow add/edit
} else {
    this.showPaypal(); // Called when limit reached
}
```
- **Prevention**: Set `Load` transaction value to `999999` (dataSource.length will never reach 999999)

### 4. **Drivers Component** (`drivers.component.ts`)
- **Trigger**: When trying to add a driver and user has reached their limit
- **Code Location**: Line 405
```typescript
if ((this.dataSource.data.length < this.quantity) || 
    (this.dataSource.data.length == this.quantity && row !== null) || 
    (this.quantity === -1)) {
    // Allow add/edit
} else {
    this.showPaypal(); // Called when limit reached
}
```
- **Prevention**: Set `Vehicle` transaction value to `999999` (drivers use vehicle quota)

### 5. **Adverts Component** (`adverts.component.ts`)
- **Trigger**: When trying to add an advert and user has reached their limit
- **Code Location**: Line 269
```typescript
if ((this.dataSource.data.length < this.quantity) || 
    (this.dataSource.data.length == this.quantity && row !== null) || 
    (this.quantity === -1)) {
    // Allow add/edit
} else {
    this.showPaypal(); // Called when limit reached
}
```
- **Prevention**: Set `Advert` transaction value to `999999` (dataSource.length will never reach 999999)

## How Quantities are Retrieved

Each component calls `getTransactions()` which fetches the user's transaction record from the database:

```typescript
getTransactions(): Promise<any[]> {
    return this.sqlService.getItems('transactions').pipe(
        map(apiResult => apiResult.data)
    ).toPromise();
}
```

Then `getSubscription()` extracts the relevant quantity:
```typescript
getSubscription() {
    this.getTransactions().then(res => {
        if (res.length > 0) {
            this.quantity = res[0].vehicle; // or .load, .directory, .advert depending on component
        }
    });
}
```

## SQL Solution

The `update-user-transactions.sql` script:

1. **Finds the user** by email `anton@madproducts.co.za` in the `AspNetUsers` table
2. **Checks if a transaction record exists** for this user
3. **Inserts or updates** the transaction with these values:
   - `Advert`: 999999
   - `Tms`: 999999
   - `Directory`: 999999
   - `Vehicle`: 999999
   - `Load`: 999999

## Why 999999 Works

### For Directory Check (quantity <= 0):
- `999999 <= 0` = `false` ✓
- Form stays enabled, showPaypal() not called

### For Add Item Checks (dataSource.data.length < quantity):
- Even if user has 1000 items, `1000 < 999999` = `true` ✓
- User can always add more items, showPaypal() not called

### Special Case (-1):
Some components have special handling where `quantity === -1` means unlimited:
```typescript
if ((this.dataSource.data.length < this.quantity) || ... || (this.quantity === -1))
```
While we could use `-1`, using `999999` is safer because:
- It's a positive number (avoids potential negative number bugs)
- It's practically unlimited (user will never create 999999 items)
- It works consistently across all checks

## Database Schema

### Transaction Table
```sql
CREATE TABLE [dbo].[Transaction] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY,
    [UserId] NVARCHAR(450),
    [SubscriptionId] UNIQUEIDENTIFIER,
    [Advert] INT,
    [Tms] INT,
    [Directory] INT,
    [Vehicle] INT,
    [Load] INT,
    [Amount_gross] DECIMAL(18,2),
    [Amount_net] DECIMAL(18,2),
    [Amount_fee] DECIMAL(18,2),
    [DateBilling] DATETIME,
    [CreatedOn] DATETIME
)
```

### AspNetUsers Table
```sql
CREATE TABLE [dbo].[AspNetUsers] (
    [Id] NVARCHAR(450) PRIMARY KEY,
    [Email] NVARCHAR(256),
    [Name] NVARCHAR(250),
    -- ... other Identity fields
)
```

## Testing the Solution

After running the SQL script:

1. **Login** as `anton@madproducts.co.za`
2. **Navigate to each section**:
   - Directories: Should be able to view/edit without showPaypal dialog
   - Vehicles: Should be able to add unlimited vehicles
   - Loads: Should be able to add unlimited loads
   - Drivers: Should be able to add unlimited drivers
   - Adverts: Should be able to add unlimited adverts
3. **Verify** the transaction record in the database:
```sql
SELECT t.*, u.Email 
FROM [Transaction] t
JOIN [AspNetUsers] u ON t.UserId = u.Id
WHERE u.Email = 'anton@madproducts.co.za'
```

## Result

✅ **showPaypal() will NEVER be called for this user anywhere in the application**

The user has unlimited access to all features without any payment prompts.

