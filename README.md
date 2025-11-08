# Anime Search App

A responsive React application that allows users to search for anime and view detailed information. The app uses the **Jikan API** and implements debounced instant search, server-side pagination, and Redux state management.

## Live Demo

https://yoprint-anime-search-lyymnkusq-teohoiyi1124-gmailcoms-projects.vercel.app

## Features

### Core Functionality

- Search anime using the Jikan REST API
- Instant search with 250ms debounce behavior
- Cancels in-flight requests when typing continues (prevents unnecessary API calls)
- Server-side pagination for efficient data loading
- Detail page to view anime information such as synopsis, genres, rating, and more
- Navigation via `react-router-dom`
- State management handled via Redux
- Fully typed with TypeScript

### User Experience Enhancements

- Skeleton loaders for both search results and detail pages
- Error handling with retry on network reconnection
- Empty state messaging for no results or errors
- Responsive grid layout for mobile, tablet, and desktop
- Dark mode support (adapts based on theme state)

### Bonus Implementation

- Trending / Top Anime display when no search query is entered
- Filters for Type, Status, and Rating on the search page
- Trailer embedded in the anime detail page
- Related anime links (prequel, sequel, adaptations)
- Smooth scrolling to top when changing pages
- Hover effects on anime cards for improved visual feedback
