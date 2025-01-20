# Aquarium Tracking Application

This repository contains a web application designed to track a virtual aquarium. Its main purpose is to monitor various fish attributes such as species, names, weights, feeding schedules, and overall health. You can feed the fish manually and observe how their health levels change in real-time.

<br />

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technologies](#technologies)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [Usage](#usage)
7. [Testing](#testing)
8. [Roadmap](#roadmap)
9. [Contribution Guide](#contribution-guide)
10. [Additional Notes](#additional-notes)

<br />

## Overview

This project implements:

- **API Integration**: Fetches a list of fish from a given API and stores them in a Pinia store (`stores/fish.ts`).
- **Accelerated Clock**: Displays a digital clock that can be sped up in increments (e.g., 1x, 60x, 120x, 3600x).
- **Fish Table**: Shows details about each fish (name, type, weight, feeding status, health status) and includes a "Feed" button for each fish.
- **Interactive Aquarium Visual**: Renders an aquarium graphic with animated fish. Hovering over any fish in the aquarium displays its corresponding details.
- **Health & Feeding Logic**:
  - Fish health changes based on the timeliness of feedings.
  - A fish that is **Bad** in health and misses a feeding will die.

<br />

## Features

1. **Fetch and Store Data**:

   - Uses a custom `useFetch` composable and `fishService.ts` to retrieve fish data from an external API.
   - Raw API data is transformed via `fishTransformer.ts` to:
     - Convert feeding schedule times to timestamps (e.g., '09:00' -> timestamp)
     - Initialize health tracking properties (status, skipped feedings)
     - Calculate daily feeding times and amounts
   - Transformed data is stored in Pinia (`stores/fish.ts`) for consistent state management

2. **Accelerated Clock**:

   - Implemented in the simulator store/composables (`stores/simulator.ts`) to track time progression at different speeds.

3. **Composables**:

   - `useFetch.ts`: Encapsulates fetching logic.
   - `useFish.ts`: Provides reactive helpers and computed properties for fish-related logic, including:
     - **Recommended feeding amounts** (daily vs. per meal)
     - **Time since last feed** (localized with `date-fns`)
     - **Feeding advice** (e.g., how long until next feeding or if it's time now)
     - **Health status** (including checks for dead fish)

4. **Feeding Mechanism**:

   - Clicking the **Feed** button updates the fish's `lastFeed` time, triggers a store action (`feedFish`), and recalculates health.
   - Check for missed feedings and update health accordingly.
   - Fish can die if they are **Bad** in health and miss a feeding.

5. **UI Components**:

   - `fish-tank`, `data-table`, `game-manager`, `icons`, `layout` — each addresses a specific portion of the UI.
   - All are located under `components/`.

6. **Transformers & Utils**:

   - `transformers/fishTransformer.ts`: Transforms API data into internal structures for consistency.
   - `utils/fishUtils.ts`: Helper functions, e.g. calculating the next feeding time or required feed amount.

7. **Constants & Types**:

   - `constants/feeding.ts`, `constants/simulation.ts`, and `constants/text.ts`: Holds various static values and text constants.
   - `types/api.ts`, `types/fish.ts`: Type definitions for stricter TypeScript usage.

8. **Testing**:
   - Under `components/__tests__` (or a dedicated testing directory). Tests cover both components and composables (unit and integration).

<br />

## Technologies

- **Vue 3** with the **Composition API**
- **Pinia** for state management
- **Vite**
- **TypeScript**
- **Testing Framework**: **Vitest**

<br />

## Getting Started

1. **Clone the repository**:

   ```bash
   git clone https://github.com/ugurkellecioglu/aquarium-management-vue-3
   cd aquarium-management-vue-3
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

3. **Configure environment variables**:

   - By default, the application will fetch fish data from the provided mock API:
     ```
     VITE_API_URL=https://run.mocky.io/v3/26669da8-eec0-4753-a001-99ea41760fe1
     ```
   - Create a `.env` file if needed and specify a custom URL if required.

4. **Run the application**:

   ```bash
   npm run dev
   ```

   or

   ```bash
   yarn dev
   ```

5. **Build for production**:

   ```bash
   npm run build
   ```

   or

   ```bash
   yarn build
   ```

<br />

## Project Structure

```plaintext
.
├── components
│   ├── __tests__             # Tests for component functionalities
│   ├── fish-tank             # Aquarium visual and fish animations
│   ├── data-table            # Table layout for fish data
│   ├── game-manager          # Game manager/control component
│   ├── icons                 # Icon components
│   └── layout                # General layout components
│
├── composables
│   ├── useFetch.ts           # Generic data fetching logic
│   └── useFish.ts            # Core fish logic and reactive properties
│
├── constants
│   ├── feeding.ts            # Feeding-related constants
│   ├── simulation.ts         # Simulation/time constants
│   └── text.ts               # UI text constants
│
├── plugins
│   └── apiClient.ts          # Axios initialization
│
├── services
│   └── fishService.ts        # API calls and data retrieval logic
│
├── stores
│   ├── fish.ts               # Pinia store for fish states & actions
│   └── simulator.ts          # Pinia store for time manipulation/simulation
│
├── transformers
│   └── fishTransformer.ts    # Transforms API data into local data structures
│
├── types
│   ├── api.ts                # Types for API responses
│   └── fish.ts               # Core fish data types
│
├── utils
│   └── fishUtils.ts          # Shared utility functions
│
└── ...
```

**Key Directories**

- `components/`: All Vue components for UI rendering.
- `composables/`: Custom hooks (Composition API functions) for code reusability (fetching, fish logic).
- `stores/`: Pinia modules for global state (fish data, time simulation).
- `services/`: Business logic for API calls.
- `transformers/` and `utils/`: Data transformations and utility helpers.
- `types/`: TypeScript interfaces and types.
- `constants/`: Static values and configurations.

<br />

## Usage

1. **Start the Application**:

   - Access the local URL (default `http://localhost:5173/`) in your browser.

2. **Time Simulation**:

   - A digital clock runs at different speeds (1x, 1m/s, 2m/s, 1h/s) managed via `stores/simulator.ts`.

3. **Fish Interaction** (via `useFish.ts`):

   - **Recommended Feed Amounts**: Computed properties for daily or per-meal feeding recommendations.
   - **Time Since Last Feed**: Displays a user-friendly duration using `date-fns`.
   - **Feeding Advice**: Whether it's time to feed, or how long until the next feeding window.
   - **Health Status**: Returns visual indicators (e.g., emoji, text label, CSS class).
   - **Feed Action**: Invokes `fishStore.feedFish(...)` to update feeding time and health.

4. **Data Table**:

   - The `data-table` displays fish data: name, type, weight, health status, etc. Each row includes a "Feed" button invoking `feedFish` action.

5. **Aquarium View**:
   - The `fish-tank` component displays fish animations. Hover to see a fish's name, health, or last feed info.

<br />

## Testing

1. **Run Unit Tests**:

   ```bash
   npm run test
   ```

   or

   ```bash
   yarn test
   ```

   - Look inside `components/__tests__` (or other designated test folders) for the test definitions.

2. **Coverage Reports**:

   ```bash
   npm run coverage
   ```

   or

   ```bash
   yarn coverage
   ```

**Tested Scenarios**:

- Correct state updates in `stores/fish.ts` and `stores/simulator.ts`.
- Proper feeding schedule and health transitions in `useFish.ts`.
- UI rendering tests of `data-table` and `fish-tank` components.

<br />

## Roadmap

Below are upcoming features and improvements planned for future releases:

- [ ] **More Intuitive UI**  
      Improve overall user experience and interface design (e.g., clearer layouts, better spacing, interactive feedback).

- [ ] **Fish Growth Mechanics**

  - As fish eat, their weight increases over time.
  - Adjust feeding amount dynamically based on the new weight (making the game more challenging).

- [ ] **Mobile Indicators**

  - Add a small exclamation mark (!) near fish in the tank on mobile devices to indicate it’s time to feed.

- [ ] **Additional Animations and Effects**

  - Animated transitions for feeding, fish death, and fish growth changes.

- [ ] **Expanded Error Handling**
  - Provide more robust fallback UIs and user feedback for edge cases (e.g., repeated feedings in short intervals).

Feel free to open an issue if you have ideas or suggestions you’d like to see in the roadmap.

<br />

## Contribution Guide

We welcome contributions from the community! To get started:

1. **Fork the Repository**

   - Click the "Fork" button at the top of this repository to create a copy on your GitHub account.

2. **Clone Your Fork**

   ```bash
   git clone https://github.com/<your-username>/aquarium-management-vue-3.git
   cd aquarium-management-vue-3
   ```

3. **Create a Branch**

   - Make a new branch for your feature or bugfix:
     ```bash
     git checkout -b feature/my-new-feature
     ```

4. **Implement Your Changes**

   - Add or modify code, documentation, or tests as needed to address the issue or feature.

5. **Run Tests Locally**

   - Make sure everything passes:
     ```bash
     npm run test
     ```
   - Also check coverage or linting if relevant:
     ```bash
     npm run coverage
     npm run lint
     ```

6. **Commit and Push**

   ```bash
   git add .
   git commit -m "feat: add my awesome new feature"
   git push origin feature/my-new-feature
   ```

7. **Open a Pull Request**

   - Go to your fork on GitHub, select your new branch, and create a Pull Request (PR) to the `main` branch of this repository.
   - Provide a clear and descriptive title and include any relevant details or screenshots.

8. **Review and Merge**
   - Project maintainers will review your PR, request changes if needed, and merge it once approved.

**Thank you for your contributions!**

<br />

## Additional Notes

- **Error Handling**: If the API request fails, the app can display a fallback UI or error notification.
- **Edge Cases**:
  - Fish with no name (use fallback).
  - Rapid time acceleration beyond feeding intervals.
  - Accidental multiple feeds in a short timeframe (health penalty or partial acceptance).
- **Customization**:
  - Adjust animation speed, aquarium styling, or feeding thresholds via constants in `constants/feeding.ts` or `constants/simulation.ts`.

## License

This project is open-sourced under the MIT License - see the [LICENSE](LICENSE) file for details.
