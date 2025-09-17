# Hotel Page Components Structure

This directory contains all components related to the hotel page, organized into logical folders for better maintainability and code organization.

## Folder Structure

```
hotelPage/
├── header/                    # Hotel header components
│   ├── HotelHeader.tsx       # Main hotel header with name, location, actions
│   └── PriceMatchBanner.tsx  # "We Price Match" banner component
│
├── gallery/                   # Image gallery components
│   └── HotelGallery.tsx      # Hotel photo gallery with modal view
│
├── overview/                  # Hotel overview components
│   └── HotelOverview.tsx     # Hotel description and facilities
│
├── navigation/                # Page navigation components
│   └── HotelNavigation.tsx   # Section navigation tabs
│
├── info/                      # Information and pricing components
│   ├── HotelInfoPrices.tsx   # Main pricing table component
│   ├── SearchBar.tsx         # Search form for dates/guests
│   ├── RoomTableHeader.tsx   # Sticky table header
│   ├── PriceSummary.tsx      # Price calculation and booking summary
│   └── EmptyState.tsx        # No rooms available state
│
├── rooms/                     # Room-related components
│   ├── RoomSelection.tsx     # Room selection table (alternative)
│   ├── RoomRow.tsx           # Individual room row component
│   ├── RoomSpecifications.tsx # Room specs (bedrooms, bathrooms, etc.)
│   ├── RoomAmenities.tsx     # Room amenities and facilities
│   └── RoomSelector.tsx      # Room quantity selector dropdown
│
└── reviews/                   # Guest review components
    └── GuestReviews.tsx      # Guest reviews and ratings
```

## Component Relationships

### Main Components

- **HotelPage.tsx** (in pages/) - Main page that imports and orchestrates all components
- **HotelInfoPrices.tsx** - Main pricing component that uses room-related components

### Component Dependencies

- `HotelInfoPrices` uses: `SearchBar`, `RoomTableHeader`, `RoomRow`, `EmptyState`, `PriceMatchBanner`
- `RoomRow` uses: `RoomSpecifications`, `RoomAmenities`, `RoomSelector`, `PriceSummary`
- `HotelPage` imports all main components from their respective folders

## Benefits of This Structure

1. **Logical Grouping**: Components are grouped by functionality rather than file type
2. **Easy Navigation**: Developers can quickly find components related to specific features
3. **Maintainability**: Changes to specific features are isolated to their respective folders
4. **Scalability**: New components can be easily added to the appropriate folder
5. **Clear Dependencies**: Import paths clearly show component relationships

## Import Examples

```typescript
// From HotelPage.tsx
import HotelHeader from "@/components/hotelPage/header/HotelHeader";
import HotelGallery from "@/components/hotelPage/gallery/HotelGallery";
import HotelInfoPrices from "@/components/hotelPage/info/HotelInfoPrices";

// From HotelInfoPrices.tsx
import SearchBar from "./SearchBar";
import RoomRow from "../rooms/RoomRow";
import PriceMatchBanner from "../header/PriceMatchBanner";
```
