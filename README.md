# URL Shortener

A React-based URL Shortener application that allows users to shorten up to 5 URLs concurrently, specify validity periods, and use custom shortcodes. The application includes a statistics page to view click data and uses Material UI for styling.

## Setup Instructions
1. Ensure Node.js is installed.
2. Clone the repository or create the project structure as shown above.
3. Run `npm install` to install dependencies.
4. Run `npm start` to start the development server at `http://localhost:3000`.

## Features
- Shorten up to 5 URLs concurrently with optional validity periods (default: 30 minutes) and custom shortcodes.
- Client-side validation for URLs, validity periods, and shortcodes.
- Statistics page showing creation/expiry dates, click counts, and detailed click data (timestamp, source, location).
- Client-side routing for redirection to original URLs.
- Persistent storage using localStorage.
- Logging middleware for all key actions.

## Dependencies
- React 18.2.0
- Material UI 5.15.0
- React Router DOM 6.22.0