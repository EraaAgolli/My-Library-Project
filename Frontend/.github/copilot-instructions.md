# GitHub Copilot Instructions for My App

## Overview
This project is a React application that manages a library system, allowing users to manage authors, books, and loans. The architecture is based on a component-driven approach, utilizing functional components and hooks for state management.

## Architecture
- **Components**: The application is structured into reusable components located in the `src/components` directory. Key components include:
  - `AuthorList.js`: Displays a list of authors and allows deletion.
  - `BookList.js`: Manages the display of books (not fully detailed here).
  - `LoanList.js`: Handles loan management (not fully detailed here).

- **Services**: API interactions are handled through service files in the `src/services` directory. Each service corresponds to a resource:
  - `userService.js`: Manages user-related API calls.
  - `bookService.js`: Handles book-related API calls.
  - `loanService.js`: Manages loan-related API calls.
  - `authorService.js`: Handles author-related API calls.

## Developer Workflows
- **Running the Application**: Use `npm start` to run the app in development mode. The app will be available at [http://localhost:3000](http://localhost:3000).
- **Testing**: Use `npm test` to run tests using Jest. Tests are located in the `src` directory, with `App.test.js` as an example.
- **Building for Production**: Use `npm run build` to create an optimized production build.

## Project-Specific Conventions
- **State Management**: The application uses React hooks (`useState`, `useEffect`) for managing component state and side effects.
- **API Endpoints**: All API calls are made to a local server running at `http://localhost:8080`. Ensure the backend is running before testing the frontend.

## Integration Points
- **Cross-Component Communication**: Components communicate through props and state management. For example, `AuthorList` fetches data from `authorService` and updates its state accordingly.
- **External Dependencies**: The project relies on several libraries, including `axios` for HTTP requests and `@testing-library/react` for testing.

## Examples
- To fetch authors, the `AuthorList` component uses:
  ```javascript
  const loadAuthors = async () => {
      const result = await getAuthors();
      setAuthors(result.data);
  };
  ```
- For adding a new author, the `addAuthor` function in `authorService.js` is used:
  ```javascript
  export const addAuthor = (author) => axios.post(API, author);
  ```

## Conclusion
This document serves as a guide for AI coding agents to understand the structure and workflows of the My App project. For further details, refer to the individual component and service files as needed.