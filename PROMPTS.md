# PROMPTS.md

This document outlines the guidance and references I used during the development of the Anime Search App.

---

## 1. Redux & State Management

**Context:** Structure a Redux slice to fetch search results and anime details
**Outcome:** Created `searchSlice` with async thunks managing search results, top anime, loading states, errors, and filters.

---

## 2. Instant Search with Debounce

**Context:** Input that updates results instantly but 250 debounce
**Outcome:** Implemented a 250ms debounced search input, cancelling previous requests when the user types continuously, keeping Redux state in sync with the current query.

---

## 3. Error Handling & Edge Cases

**Context:** Handle network offline, 429 error, and retry automatically  
**Outcome:** Added error messages, automatic retry for rate limit responses, and fetch retry on network reconnection, improving reliability.

---

## 4. Pagination

**Context:** Need pagination for search results, and set page limit as 10  
**Outcome:** Users can navigate pages while keeping state consistent and avoiding unnecessary refetches.

---

## 5. User Experience Enhancements

**Context:** Improve UX with skeleton loaders and responsive layout using tailwind css.  
**Outcome:** Implemented skeletons for search and detail pages, proper empty/error state messaging, and responsive grid layouts for mobile, tablet, and desktop.

---

## 6. Bonus Features

**Context:** Add trending anime display, filters (Type, Status, Rating), trailers, and related anime links.  
**Outcome:** These features enhance functionality and visual appeal, going beyond core requirements.

---

## 7. Managing Search vs Trending Data & Skeleton Loading

**Context:** The search page displays both top anime and search results, causing conflicts that both fetches could run simultaneously, skeleton loaders could flicker, and stale data could appear.  
**Outcome:**

- Separated loading states (`loadingSearch` vs `loadingTop`) and managed request cancellation properly.
- Used debounced search with careful effect cleanup to prevent race conditions.
- Skeleton loaders now display at the correct times, and errors/empty states are consistent.
- Ensured Redux state reflects the correct results at all times.

---
