# Anime Search App

A responsive React application that allows users to search for anime and view detailed information. The app uses the **Jikan API** and implements debounced instant search, server-side pagination, and Redux state management.

## Live Demo

_(Add your deployed URL here once hosted)_

---

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
