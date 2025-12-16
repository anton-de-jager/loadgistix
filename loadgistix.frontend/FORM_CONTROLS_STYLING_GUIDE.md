# Form Controls Styling Guide

## Overview
This guide documents the modern, clean styling applied to all form controls across the application. The styling is inspired by modern filter interfaces with lighter borders, better spacing, and enhanced user experience.

## Key Features

### 1. **Cleaner Visual Design**
- Lighter, more subtle borders (1px instead of heavy borders)
- Softer color palette with better contrast
- Rounded corners (6px border-radius)
- Consistent spacing and padding

### 2. **Enhanced Focus States**
- Primary color (#5db1de) highlights on focus
- Smooth transitions between states
- Clear visual feedback for user interactions

### 3. **Improved Search Experience**
- Integrated `ngx-mat-select-search` with clean styling
- Search input at the top of dropdowns
- Subtle background differentiation
- Clear "no results" messaging

### 4. **Dark Mode Support**
- All controls adapt to dark theme
- Proper contrast ratios maintained
- Consistent visual hierarchy

## Component Styling

### Mat-Form-Field (Outline Appearance)

```html
<mat-form-field appearance="outline">
    <mat-label>Field Label</mat-label>
    <input matInput placeholder="Enter value...">
</mat-form-field>
```

**Features:**
- White background (light mode) / Semi-transparent (dark mode)
- 1px border with rgba(0, 0, 0, 0.12) color
- 2px border on focus with primary color
- Hover state with slightly darker border

### Mat-Select with Search

```html
<mat-form-field appearance="outline">
    <mat-label>Select Option</mat-label>
    <mat-select placeholder="Select Option">
        <mat-option>
            <ngx-mat-select-search 
                [formControl]="searchControl"
                placeholderLabel="Search..." 
                noEntriesFoundLabel="No matching items found">
            </ngx-mat-select-search>
        </mat-option>
        <mat-option *ngFor="let item of filteredItems" [value]="item.id">
            {{ item.description }}
        </mat-option>
    </mat-select>
</mat-form-field>
```

**Features:**
- Search input fixed at top of dropdown
- Light gray background for search area
- Clean separation from options list
- Searchable options with real-time filtering

### Date Picker

```html
<mat-form-field appearance="outline">
    <mat-label>Select Date</mat-label>
    <input matInput [matDatepicker]="picker" placeholder="MM/DD/YYYY">
    <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
    <mat-datepicker #picker></mat-datepicker>
</mat-form-field>
```

**Features:**
- Calendar icon with proper color
- Focus state highlights the icon
- Consistent with other form controls

### Autocomplete

```html
<mat-form-field appearance="outline">
    <mat-label>Search</mat-label>
    <input matInput [matAutocomplete]="auto" placeholder="Type to search...">
    <mat-autocomplete #auto="matAutocomplete">
        <mat-option *ngFor="let option of filteredOptions" [value]="option">
            {{ option }}
        </mat-option>
    </mat-autocomplete>
</mat-form-field>
```

**Features:**
- Dropdown panel with rounded corners
- Subtle shadow for depth
- Hover effects on options

## Color Palette

### Primary Colors
- **Primary Blue**: `#5db1de` - Used for focus states, active elements
- **Light Blue**: `#aed8ef` - Used for subtle backgrounds
- **Dark Blue**: `#345177` - Used for headers, emphasis

### Neutral Colors
- **Border (Light)**: `rgba(0, 0, 0, 0.12)` - Default border color
- **Border (Hover)**: `rgba(0, 0, 0, 0.24)` - Hover state
- **Text Primary**: `rgba(0, 0, 0, 0.87)` - Main text
- **Text Secondary**: `rgba(0, 0, 0, 0.6)` - Labels, placeholders
- **Background**: `#ffffff` - Form field backgrounds

### Dark Mode Colors
- **Border (Light)**: `rgba(255, 255, 255, 0.12)`
- **Border (Hover)**: `rgba(255, 255, 255, 0.24)`
- **Text Primary**: `rgba(255, 255, 255, 0.87)`
- **Text Secondary**: `rgba(255, 255, 255, 0.6)`
- **Background**: `rgba(255, 255, 255, 0.05)`

### State Colors
- **Error**: `#f44336` - Validation errors
- **Success**: `#4caf50` - Success states
- **Warning**: `#ff9800` - Warning states

## Spacing Guidelines

### Form Field Spacing
- **Padding (Horizontal)**: `12px` - Inside form fields
- **Padding (Vertical)**: `12px` - Top and bottom padding
- **Gap Between Fields**: `8px` - Using `pl-2 pr-2` classes
- **Height**: `44px` - Standard form field height

### Option Spacing
- **Min Height**: `40px` - Dropdown options
- **Padding**: `0 16px` - Option horizontal padding
- **Font Size**: `14px` - Option text size

## Best Practices

### 1. **Consistent Placeholder Text**
Always use descriptive placeholders that start with "Select" for dropdowns or describe the expected input:
```html
<!-- Good -->
<mat-select placeholder="Select Vehicle Category">

<!-- Avoid -->
<mat-select placeholder="Vehicle Category">
```

### 2. **Search Integration**
For dropdowns with many options (>10), always include search:
```html
<mat-select>
    <mat-option>
        <ngx-mat-select-search 
            [formControl]="searchControl"
            placeholderLabel="Search..." 
            noEntriesFoundLabel="No matching items found">
        </ngx-mat-select-search>
    </mat-option>
    <!-- options here -->
</mat-select>
```

### 3. **Error Messaging**
Provide clear, actionable error messages:
```html
<mat-error *ngIf="hasError('fieldName', 'required')">
    This field is required
</mat-error>
<mat-error *ngIf="hasError('fieldName', 'email')">
    Please enter a valid email address
</mat-error>
```

### 4. **Loading States**
Use the `mat-form-field-loading` class for loading indicators:
```html
<mat-form-field 
    [ngClass]="loading ? 'mat-form-field-loading' : ''">
    <!-- field content -->
</mat-form-field>
```

### 5. **Disabled States**
Disabled fields have reduced opacity and lighter borders:
```html
<mat-form-field appearance="outline">
    <mat-label>Disabled Field</mat-label>
    <input matInput [disabled]="true">
</mat-form-field>
```

## Responsive Behavior

### Mobile (< 640px)
- Full width fields: `w-full`
- Stacked layout
- Larger touch targets

### Tablet (640px - 1024px)
- Two-column layout: `sm:w-2/4`
- Flexible spacing
- Optimized for touch

### Desktop (> 1024px)
- Multi-column layouts
- Hover effects enabled
- Keyboard navigation optimized

## Accessibility

### Keyboard Navigation
- Tab through fields in logical order
- Enter to open dropdowns
- Arrow keys to navigate options
- Escape to close dropdowns

### Screen Readers
- Proper ARIA labels
- Error announcements
- State changes communicated

### Color Contrast
- All text meets WCAG AA standards (4.5:1 minimum)
- Focus indicators clearly visible
- Error states distinguishable

## Migration Checklist

When updating existing forms to the new styling:

- [ ] Change all `appearance` to `"outline"`
- [ ] Update placeholder text to be descriptive
- [ ] Add `ngx-mat-select-search` to large dropdowns
- [ ] Ensure consistent spacing with `pl-2 pr-2` classes
- [ ] Test in both light and dark modes
- [ ] Verify error states display correctly
- [ ] Check responsive behavior on mobile
- [ ] Test keyboard navigation
- [ ] Validate with screen readers

## Examples

### Simple Text Input
```html
<mat-form-field appearance="outline" class="w-full sm:w-2/4 pl-2 pr-2">
    <mat-label>Description</mat-label>
    <input matInput placeholder="Enter description" formControlName="description">
    <mat-error *ngIf="hasError('description', 'required')">
        Description is required
    </mat-error>
</mat-form-field>
```

### Searchable Dropdown
```html
<mat-form-field appearance="outline" class="w-full sm:w-2/4 pl-2 pr-2">
    <mat-label>Vehicle Make</mat-label>
    <mat-select placeholder="Select Vehicle Make" formControlName="makeId">
        <mat-option>
            <ngx-mat-select-search 
                [formControl]="makeSearch"
                placeholderLabel="Search Make..." 
                noEntriesFoundLabel="No matching make found">
            </ngx-mat-select-search>
        </mat-option>
        <mat-option *ngFor="let make of filteredMakes" [value]="make.id">
            {{ make.description }}
        </mat-option>
    </mat-select>
    <mat-error>Vehicle Make is required</mat-error>
</mat-form-field>
```

### Date Range
```html
<mat-form-field appearance="outline" class="w-full sm:w-2/4 pl-2 pr-2">
    <mat-label>Select Availability</mat-label>
    <mat-date-range-input [formGroup]="form" [rangePicker]="picker">
        <input matStartDate formControlName="availableFrom" placeholder="Available From">
        <input matEndDate formControlName="availableTo" placeholder="Available To">
    </mat-date-range-input>
    <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
    <mat-date-range-picker #picker></mat-date-range-picker>
</mat-form-field>
```

### Autocomplete with Address
```html
<mat-form-field appearance="outline" class="w-full sm:w-2/4 pl-2 pr-2">
    <mat-label>Address</mat-label>
    <input matInput 
        formControlName="address"
        placeholder="Enter address"
        [matAutocomplete]="auto"
        (input)="onAddressInput($event)">
    <mat-autocomplete #auto="matAutocomplete" 
        (optionSelected)="onAddressSelected($event.option.value)">
        <mat-option *ngFor="let suggestion of addressSuggestions" [value]="suggestion">
            {{ suggestion.display_name }}
        </mat-option>
    </mat-autocomplete>
    <mat-error>Address is required</mat-error>
</mat-form-field>
```

## Troubleshooting

### Issue: Search not working in dropdown
**Solution**: Ensure you have a FormControl for the search and proper filtering logic:
```typescript
searchControl = new FormControl();
filteredItems: any[] = [];

ngOnInit() {
    this.searchControl.valueChanges.subscribe(value => {
        this.filteredItems = this.filterItems(value);
    });
}

filterItems(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.allItems.filter(item => 
        item.description.toLowerCase().includes(filterValue)
    );
}
```

### Issue: Borders too thick or wrong color
**Solution**: Ensure you're using `appearance="outline"` and the global styles are loaded.

### Issue: Dark mode not working
**Solution**: Check that your theme includes the `.dark` class on the root element.

### Issue: Focus state not showing
**Solution**: Verify the primary color is defined correctly in your theme.

## Resources

- [Angular Material Documentation](https://material.angular.io/)
- [ngx-mat-select-search](https://github.com/bithost-gmbh/ngx-mat-select-search)
- [Material Design Guidelines](https://material.io/design)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

