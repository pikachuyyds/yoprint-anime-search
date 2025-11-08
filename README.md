# Anime Search App

A responsive React application that allows users to search for anime and view detailed information. The app uses the **Jikan API** and implements debounced instant search, server-side pagination, and Redux state management.

## Live Demo

https://yoprint-anime-search.vercel.app

## Getting Started

1. Clone the repository:
   ```powershell
   git clone <repo-url>
   cd <project-folder>
   ```
2. Install dependencies:
   npm install
3. Start development:
   npm run dev
4. Open http://localhost:4000/ in your browser

## Tech Stack

- React 19
- TypeScript
- Redux Toolkit
- react-router-dom
- Tailwind CSS
- Jikan REST API
- Vite
- Axios
- React Icons
- React Tooltip

## Features

### Core Functionality

- Search anime using the Jikan REST API
- Instant search with 250ms debounce behavior
- Cancels in-flight requests when typing continues (prevents unnecessary API calls)
- Server-side pagination for efficient data loading
- Detail page to view anime information such as synopsis, genres, score, and more
- Navigation via `react-router-dom`
- State management handled via Redux
- Fully typed with TypeScript

### User Experience Enhancements

- Skeleton loaders for both search results and detail pages
- Error handling with retry on network reconnection
- Empty state messaging for no results or errors
- Responsive grid layout for mobile, tablet, and desktop
- Dark mode support

### Bonus Implementation

- Trending / Top Anime display when no search query is entered
- Filters for Type, Status, and Rating on the search page
- Trailer embedded in the anime detail page
- Related anime links (prequel, sequel, adaptations)
- Smooth scrolling to top when changing pages
- Hover effects on anime cards for improved visual feedback

### Technical Handling Notes

- Network Errors: detect offline status and show message
- Request Abortion: cancel previous search requests when typing continues
- Rate Limiting: automatically retry fetching anime details if API returns 429
- Race Conditions: ensure only latest search result or detail data is applied to state
