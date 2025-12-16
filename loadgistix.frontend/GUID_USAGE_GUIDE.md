# GUID Usage Guide for Developers

## Quick Reference

### ✅ DO: Use These Patterns

#### 1. In TypeScript Components
```typescript
// Import the helper
import { GuidHelper } from 'app/services/guid.helper';

// Add method to your component
guidsEqual(guid1: string | null | undefined, guid2: string | null | undefined): boolean {
    return GuidHelper.equals(guid1, guid2);
}
```

#### 2. In HTML Templates
```html
<!-- Use the component method for comparisons -->
<mat-option *ngIf="guidsEqual(item.categoryId, form.value.categoryId)" [value]="item.id">
    {{ item.description }}
</mat-option>
```

#### 3. In Services (Already Done)
All API responses are automatically normalized in `sql.service.ts`. No action needed!

### ❌ DON'T: Avoid These Patterns

#### 1. Direct Strict Equality
```typescript
// ❌ BAD - Case sensitive
if (item.categoryId === form.value.categoryId) { }

// ✅ GOOD - Case insensitive
if (GuidHelper.equals(item.categoryId, form.value.categoryId)) { }
```

#### 2. Manual Case Conversion
```typescript
// ❌ BAD - Unnecessary, already normalized
const normalizedId = apiResponse.data.id.toUpperCase();

// ✅ GOOD - Already normalized by sql.service
const id = apiResponse.data.id;
```

## Common Scenarios

### Scenario 1: Filtering Dropdown Options
**Problem**: Dropdown doesn't show filtered options based on parent selection.

**Solution**:
```html
<!-- In your component HTML -->
<mat-select formControlName="parentId" (selectionChange)="parentChanged()">
    <mat-option *ngFor="let parent of parentList" [value]="parent.id">
        {{ parent.description }}
    </mat-option>
</mat-select>

<mat-select formControlName="childId">
    <ng-container *ngFor="let child of childList">
        <!-- Use guidsEqual for filtering -->
        <mat-option *ngIf="guidsEqual(child.parentId, form.value.parentId)" [value]="child.id">
            {{ child.description }}
        </mat-option>
    </ng-container>
</mat-select>
```

```typescript
// In your component TypeScript
guidsEqual(guid1: string | null | undefined, guid2: string | null | undefined): boolean {
    return GuidHelper.equals(guid1, guid2);
}
```

### Scenario 2: Conditional Button Visibility
**Problem**: Button doesn't show/hide based on GUID comparison.

**Solution**:
```html
<!-- Check if current user owns the item -->
<button *ngIf="guidsEqual(item.userId, currentUser.id)" (click)="deleteItem()">
    Delete
</button>
```

### Scenario 3: Finding Items in Arrays
**Problem**: `.find()` returns undefined even though item exists.

**Solution**:
```typescript
// ✅ GOOD - Use loose equality (already works)
const item = this.items.find(x => x.id == searchId);

// ✅ ALSO GOOD - Use GuidHelper for clarity
const item = this.items.find(x => GuidHelper.equals(x.id, searchId));
```

### Scenario 4: Custom API Calls (Not Using sql.service)
**Problem**: Custom HTTP calls don't have normalized GUIDs.

**Solution**:
```typescript
import { GuidHelper } from 'app/services/guid.helper';
import { map } from 'rxjs';

// Normalize the response manually
this.http.get<MyType>('custom-endpoint').pipe(
    map(response => GuidHelper.normalizeObject(response))
).subscribe(data => {
    // data now has normalized GUIDs
});
```

## Helper Methods Reference

### GuidHelper.equals()
Compares two GUIDs in a case-insensitive manner.
```typescript
GuidHelper.equals('abc-123', 'ABC-123') // returns true
GuidHelper.equals('abc-123', 'def-456') // returns false
GuidHelper.equals(null, 'abc-123')      // returns false
```

### GuidHelper.normalize()
Converts a GUID to uppercase.
```typescript
GuidHelper.normalize('abc-123')  // returns 'ABC-123'
GuidHelper.normalize(null)       // returns null
```

### GuidHelper.normalizeObject()
Normalizes all GUID properties in an object (properties ending in 'Id' or named 'id').
```typescript
const obj = { id: 'abc-123', userId: 'def-456', name: 'Test' };
const normalized = GuidHelper.normalizeObject(obj);
// { id: 'ABC-123', userId: 'DEF-456', name: 'Test' }
```

### GuidHelper.normalizeArray()
Normalizes all objects in an array.
```typescript
const array = [
    { id: 'abc-123', name: 'Item 1' },
    { id: 'def-456', name: 'Item 2' }
];
const normalized = GuidHelper.normalizeArray(array);
// All ids are now uppercase
```

## Troubleshooting

### Issue: Dropdown still not filtering correctly
**Check**:
1. Are you using `guidsEqual()` in the `*ngIf` condition?
2. Is the parent selection triggering correctly?
3. Are both GUIDs defined (not null/undefined)?

**Debug**:
```typescript
console.log('Parent ID:', form.value.parentId);
console.log('Child Parent ID:', child.parentId);
console.log('Match:', GuidHelper.equals(child.parentId, form.value.parentId));
```

### Issue: Button visibility not working
**Check**:
1. Are both GUIDs being compared correctly?
2. Is the `guidsEqual()` method added to your component?
3. Are the GUID values populated (check for null/undefined)?

**Debug**:
```html
<!-- Temporarily show the GUIDs for debugging -->
<div>Item User ID: {{ item.userId }}</div>
<div>Current User ID: {{ currentUser.id }}</div>
<div>Match: {{ guidsEqual(item.userId, currentUser.id) }}</div>
```

## Best Practices

1. **Always use `guidsEqual()` for strict comparisons in templates**
2. **Loose equality (`==`) works fine in TypeScript for backward compatibility**
3. **Don't manually normalize GUIDs from API responses** (already done in sql.service)
4. **Add `guidsEqual()` method to components that need GUID comparisons in templates**
5. **Use descriptive variable names** to make GUID comparisons clear

## Questions?
If you encounter any GUID-related issues not covered in this guide, please:
1. Check the `GUID_NORMALIZATION_SUMMARY.md` for technical details
2. Review the `guid.helper.ts` source code
3. Look at examples in `dialog-vehicle.component.ts` and `dialog-load.component.ts`

