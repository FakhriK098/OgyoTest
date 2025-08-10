# OgyoTest - GitHub Repository Browser

A React Native application for browsing GitHub repositories with search, sort, and detail view capabilities.

## Features

### 🏠 Home Screen

- **Browse GitHub Repositories**: View a list of public GitHub repositories
- **Search Functionality**: Search for repositories by name with real-time results
- **Sort Options**: Sort repositories alphabetically (A-Z or Z-A)
- **Infinite Scroll**: Load more repositories as you scroll
- **Pull to Refresh**: Refresh the repository list with a pull gesture

### 📋 Detail Screen

- **Repository Information**: View detailed information about a selected repository including:
  - Repository name and full name
  - Owner information and avatar
  - Programming language
  - License information
  - Topics/tags
  - Repository size
  - Statistics (stars, watchers, forks, issues, etc.)
  - Creation and update dates

### 👤 Profile Screen

- **User Profile**: View GitHub user profile information
- **Avatar Management**: Change profile avatar by:
  - Taking a photo with camera
  - Selecting from gallery
- **User Statistics**: View followers, following, and repository counts

## Tech Stack

- **React Native**: Cross-platform mobile development
- **TypeScript**: Type-safe development
- **Redux Toolkit**: State management
- **Redux Saga**: Side effects management
- **React Navigation**: Navigation between screens
- **React Native Image Picker**: Camera and gallery access
- **React Native Testing Library**: Component testing
- **Jest**: Unit testing framework

## Prerequisites

- Node.js (v18 or higher)
- npm or Yarn
- React Native development environment set up
- For iOS: macOS with Xcode installed
- For Android: Android Studio with emulator or physical device

## Installation

1. Clone the repository:

```sh
git clone <repository-url>
cd OgyoTest
```

2. Install dependencies:

```sh
# Using npm
npm install

# OR using Yarn
yarn install
```

3. For iOS, install CocoaPods dependencies:

```sh
cd ios
pod install
cd ..
```

## Running the Application

### Step 1: Start Metro

First, start the Metro bundler:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

### Step 2: Run the app

With Metro running, open a new terminal and run:

#### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

#### iOS

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

## Testing

Run the test suite with coverage:

```sh
# Using npm
npm test

# OR using Yarn
yarn test
```

Run tests in watch mode:

```sh
# Using npm
npm test -- --watch

# OR using Yarn
yarn test --watch
```

## Project Structure

```
OgyoTest/
├── src/
│   ├── components/        # Reusable components
│   ├── screens/           # Screen components
│   │   ├── home/         # Home screen and components
│   │   ├── detail/       # Detail screen
│   │   └── profile/      # Profile screen
│   ├── navigation/        # Navigation configuration
│   ├── services/         # API services
│   ├── store/            # Redux store configuration
│   │   ├── slices/       # Redux slices
│   │   └── sagas/        # Redux sagas
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   └── themes/           # Theme configuration
├── __tests__/            # Test files
├── ios/                  # iOS native code
├── android/              # Android native code
└── package.json          # Project dependencies
```

## API Integration

The app integrates with the GitHub API to fetch:

- Public repositories list
- Repository search results
- User profile information
- Repository details

## Key Features Implementation

### State Management

- Uses Redux Toolkit for predictable state management
- Redux Saga handles API calls and side effects
- Separate slices for repositories, user, and profile data

### Navigation

- Bottom tab navigation with Home and Profile tabs
- Stack navigation for repository details
- Type-safe navigation with TypeScript

### Performance Optimizations

- Infinite scrolling with pagination
- Debounced search input
- Memoized sorted lists
- Lazy loading of images
