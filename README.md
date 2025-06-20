# JET Restaurants

A modern restaurant discovery application built with React and TypeScript, showcasing advanced state management patterns, API integration, and scalable architecture.

## Important

- **Google Maps API Origin Restriction**: Since the API key is not securely stored, the Google Maps API will only work when the application is accessed from `http://localhost:4173/` or `http://localhost:5173/`. Make sure to run your development server on one of these ports for the maps functionality to work properly.

## ✨ Key Features

### Restaurant Discovery

- **Postcode-based Search**: Find restaurants by UK postcode
- **Real-time Filtering**: Search by name, cuisine type, open status, new restaurants, and free delivery
- **Advanced Sorting**: Sort by best match, rating, delivery time, minimum order, or delivery cost
- **Interactive Map View**: Visual restaurant locations with Google Maps integration
- **Detailed Restaurant Cards**: Comprehensive restaurant information with ratings and delivery details

### User Experience

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Pagination**: Efficient handling of large restaurant lists
- **URL State Management**: Shareable links with preserved filter states
- **Loading States**: Loading indicators and error handling
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
  
<img width="363" alt="image" src="https://github.com/user-attachments/assets/66e21ddd-f489-4125-b503-8dd2948e7494" /><img width="356" alt="image" src="https://github.com/user-attachments/assets/888b3713-23b1-4bb8-8506-359ded7e8bba" />


## 🏗️ Architecture Overview

This application demonstrates several key architectural patterns and best practices:

### API Integration

The application integrates with the Just Eat API through a well-structured API layer:

- **`src/api/jetApi.ts`** - Centralized API client using Axios
- **CORS Proxy Setup** - Configured in `vite.config.ts` to proxy `/api/jet` requests to `https://uk.api.just-eat.io`
- **Type-Safe Responses** - All API responses are properly typed with TypeScript interfaces
- **Error Handling** - Error handling throughout the API layer

### State Management Strategy

The application employs a hybrid state management approach:

#### Redux + Redux Saga for Global State

- **Restaurant Data**: Managed through Redux store (`src/store/slices/restaurant/restaurantsSlice.ts`)
- **User Information**: Handled via Redux for postcode and user preferences
- **Asynchronous Operations**: Redux Saga middleware manages API calls and side effects
- **Scalable Design**: Architecture ready for future features like theme management, user authentication, and shopping cart

#### URL Search Params for UI State

- **`useRestaurantListState`** - Custom hook managing search query, filters, sorting, and pagination through URL parameters
- **Deep Linking**: All filter states are reflected in the URL for shareability

### Restaurant List Processing with Strategy Pattern

The application implements the **Strategy Pattern** for flexible and maintainable restaurant filtering and sorting:

#### Filtering Strategies (`src/features/restaurants/strategies/filter/`)

```typescript
interface RestaurantFilterStrategy {
  apply(data: Restaurant[]): Restaurant[];
}
```

- **`FilterBySearchQuery`** - Searches restaurant names and cuisines
- **`FilterByOpenNow`** - Shows only currently open restaurants
- **`FilterByNew`** - Filters for newly added restaurants
- **`FilterByFreeDelivery`** - Shows restaurants with free delivery
- **`RestaurantFilterRegistry`** - Factory for creating filter combinations

#### Sorting Strategies (`src/features/restaurants/strategies/sort/`)

```typescript
interface SortStrategy {
  sort(restaurants: Restaurant[]): Restaurant[];
}
```

- **`SortByBestMatch`** - Default relevance-based sorting
- **`SortByReviews`** - Sorts by rating (high to low)
- **`SortByEstimatedDeliveryTime`** - Sorts by fastest delivery
- **`SortByMinOrderAmount`** - Sorts by minimum order value
- **`SortByDeliveryCost`** - Sorts by delivery cost (low to high)
- **`RestaurantSortStrategyRegistry`** - Manages strategy selection

#### Restaurant Processing Pipeline

The `processRestaurants` utility function in `src/features/restaurants/utils/restaurantUtils.ts` orchestrates the filtering and sorting:

1. **Sequential Filtering**: Applies multiple filter strategies in order
2. **Final Sorting**: Applies the selected sort strategy to filtered results
3. **Immutable Operations**: Preserves original data integrity
4. **Performance Optimized**: Efficient processing pipeline with memoization

## 🧪 Testing Strategy

The application maintains high test coverage with comprehensive testing strategies:

### Unit Testing

- **Component Testing**: React components tested with React Testing Library
- **Hook Testing**: Custom hooks tested in isolation
- **Strategy Pattern Testing**: Individual filter and sort strategies tested
- **Utility Function Testing**: Pure functions tested with various inputs
- **API Integration Testing**: Mocked API calls and error scenarios

### Test Coverage

- **Target**: 70%+ code coverage
- **Coverage Report**: Run `npm run test:coverage:report` to view detailed coverage
- **Strategy Testing**: All filtering and sorting strategies have dedicated test suites
- **Edge Cases**: Comprehensive testing of error states and edge conditions

## 🎯 Design Patterns & Best Practices

### Architecture Patterns

- **Strategy Pattern**: Flexible filtering and sorting implementations
- **Custom Hooks**: Encapsulated state logic and reusable functionality
- **Component Composition**: Modular and reusable component design
- **Feature-based Structure**: Organized by business domain rather than technical layers

## Technologies Used

### Core Technologies

- **React 19** - Modern React with the latest features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server

### State Management

- **Redux Toolkit** - Modern Redux with simplified syntax
- **Redux-Saga** - Asynchronous action handling for API calls
- **React Redux** - React bindings for Redux store
- **URL Search Params** - Client-side state management for UI filters

### UI & Mapping

- **React Google Maps API** - Interactive map functionality with custom markers
- **React Router** - Client-side routing with search parameter integration

### Development Tools

- **ESLint** - Code linting and formatting
- **Jest** - Unit testing framework with 70%+ coverage
- **Testing Library** - React component testing utilities
- **Axios** - HTTP client for API requests

## 🚀 Development Workflow

### Code Organization Principles

- **Feature-First Structure**: Code organized by business domain
- **Separation of Concerns**: Clear boundaries between API, state, and UI layers
- **Reusable Components**: Modular UI components with consistent interfaces
- **Type Safety**: Comprehensive TypeScript coverage for better developer experience

### Performance Considerations

- **Memoization**: Strategic use of `useMemo` and `useCallback` for expensive operations
- **Efficient Filtering**: Strategy pattern enables optimized filtering algorithms
- **Lazy Loading**: Components and routes loaded on demand

## 🔮 Future Enhancements

The current architecture supports easy extension for additional features:

### Planned Features

- **User Authentication**: Redux store ready for user session management
- **Favorites System**: Infrastructure in place for user preferences
- **Theme Management**: Redux store can handle theme preferences
- **Advanced Filters**: Strategy pattern easily accommodates new filter types
- **Extensive Testing**: E2E and integration tests using Playwright.

## Getting Started

### Prerequisites

- Node.js (latest LTS version)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Testing

```bash
# Run unit tests
npm run test:unit

# Run tests with coverage
npm run test:coverage

# Open coverage report
npm run test:coverage:report
```

### Building

```bash
npm run build
```

### Preview

```bash
npm run preview
```
