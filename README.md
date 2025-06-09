# JET Restaurants

A modern restaurant discovery application built with React and TypeScript.

## Important

- **Google Maps API Origin Restriction**: Since the api key is not securely stored, the Google Maps API will only work when the application is accessed from `http://localhost:4173/` or `http://localhost:5173/`. Make sure to run your development server on one of these ports for the maps functionality to work properly.

## Technologies Used

### Core Technologies

- **React 19** - Modern React with the latest features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server

### State Management

- **Redux Toolkit** - Modern Redux with simplified syntax
- **Redux-Saga** - Asynchronous action handling
- **React Redux** - React bindings for Redux

### UI & Mapping

- **React Google Maps API** - Interactive map functionality
- **React Router** - Client-side routing

### Development Tools

- **ESLint** - Code linting and formatting
- **Jest** - Unit testing framework
- **Testing Library** - React component testing utilities
- **Axios** - HTTP client for API requests

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
