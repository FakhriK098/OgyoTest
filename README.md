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

## 🏠 Home page
<img width="300" height="800" alt="Simulator Screenshot - IPhone Seva 13 - 2025-08-10 at 09 33 25" src="https://github.com/user-attachments/assets/00bfd69d-0cdb-4c14-9cad-a99ed811c276" />
<img width="300" height="800" alt="Simulator Screenshot - IPhone Seva 13 - 2025-08-10 at 09 33 38" src="https://github.com/user-attachments/assets/84ac231f-a839-415e-884c-84575f1aed8b" />
<img width="300" height="800" alt="Simulator Screenshot - IPhone Seva 13 - 2025-08-10 at 09 33 47" src="https://github.com/user-attachments/assets/907303e9-21f6-4710-883e-d9179f0667cf" />
<img width="300" height="800" alt="Simulator Screenshot - IPhone Seva 13 - 2025-08-10 at 09 33 54" src="https://github.com/user-attachments/assets/433ab067-fead-4786-be2d-a67907ed3545" />

## 📋 Detail Repository
<img width="300" height="800" alt="Simulator Screenshot - IPhone Seva 13 - 2025-08-10 at 09 34 09" src="https://github.com/user-attachments/assets/a96f7b36-e31e-4142-996a-90c5d9621df2" />

## 👤 Profile
<img width="300" height="800" alt="Simulator Screenshot - IPhone Seva 13 - 2025-08-10 at 09 34 26" src="https://github.com/user-attachments/assets/8ea38a70-7a89-4d3c-83f9-648a1ca4a064" />
<img width="300" height="800" alt="Simulator Screenshot - IPhone Seva 13 - 2025-08-10 at 09 34 33" src="https://github.com/user-attachments/assets/073d5891-6036-4b0d-a000-dc8cd253848d" />

## Coverage Unit Test
<img width="1800" height="1004" alt="Screenshot 2025-08-10 at 09 28 09" src="https://github.com/user-attachments/assets/3190423f-2742-450d-9e89-0bad9e464322" />


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
