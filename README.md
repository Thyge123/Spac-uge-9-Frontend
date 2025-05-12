# Space Uge 9 Frontend - Cereal Catalog

This is a frontend application for browsing and managing a catalog of cereals. It interacts with a backend API to fetch and display cereal data, and allows users to perform CRUD operations on cereals, as well as register and log in.

## Tech Stack

*   **Vue.js 3:** A progressive JavaScript framework for building user interfaces.
*   **Vite:** A fast frontend build tool.
*   **Pinia:** State management library for Vue.js.
*   **Vue Router:** For client-side routing.
*   **Vuetify:** Material Design component framework for Vue.
*   **Axios:** Promise-based HTTP client for making API requests.
*   **ESLint & Prettier:** For code linting and formatting.
*   **Oxlint:** An alternative linter.

## Features

*   View a list of all cereals with images.
*   View detailed information for a specific cereal.
*   User authentication (Login/Logout).
*   User registration.
*   (Authenticated users) Create new cereal entries.
*   (Authenticated users) Update existing cereal entries.
*   (Authenticated users) Delete cereal entries.
*   Filter cereals by manufacturer.
*   Display cereal type (Cold/Hot).

## Project Setup

### Prerequisites

*   Node.js (version compatible with Vite and other dependencies)
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd Space-uge-9-Frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

### Development Server

To run the application in development mode with hot-reloading:

```bash
npm run dev
```

This will typically start the server at `http://localhost:5173` (or the port configured by Vite).

### Build for Production

To create a production-ready build:

```bash
npm run build
```

The output files will be in the `dist` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Available Scripts

In the project directory, you can run the following scripts:

*   `npm run dev`: Starts the development server.
*   `npm run build`: Builds the app for production.
*   `npm run preview`: Serves the production build locally for preview.
*   `npm run lint:oxlint`: Lints files with Oxlint and attempts to fix issues.
*   `npm run lint:eslint`: Lints files with ESLint and attempts to fix issues.
*   `npm run lint`: Runs all linters (Oxlint and ESLint).
*   `npm run format`: Formats code in the `src/` directory using Prettier.

## API Endpoints

The application interacts with a backend API. The base URL for the API is configured in `src/apis/apiservice.js` as `https://localhost:7226/api/`.

Key API interactions include:
*   Fetching all cereals: `GET /products/cereals/pictures`
*   Fetching a single cereal: `GET /products/cereal/picture/{id}`
*   Creating a cereal: `POST /products/cereal/add`
*   Updating a cereal: `PUT /products/cereal/update`
*   Deleting a cereal: `DELETE /products/cereal/delete/{id}`
*   User registration: `POST /users`
*   User login: `POST /login` (full URL: `https://localhost:7226/api/login`)

## Project Structure (Key Files & Directories)

*   `public/`: Static assets.
*   `src/`: Main application source code.
    *   `assets/`: CSS and other static assets processed by Vite.
    *   `components/`: Reusable Vue components (e.g., `TheHeader.vue`, `TheFooter.vue`).
    *   `router/`: Vue Router configuration (`index.js`).
    *   `stores/`: Pinia store modules (e.g., `cerealStore.js`).
    *   `views/`: Vue components mapped to routes (pages).
    *   `apis/`: API service logic (`apiservice.js`).
    *   `App.vue`: The main root Vue component.
    *   `main.js`: The entry point of the application, where Vue is initialized.
*   `vite.config.js`: Vite configuration file.
*   `package.json`: Project metadata and dependencies.
*   `eslint.config.js`: ESLint configuration.
