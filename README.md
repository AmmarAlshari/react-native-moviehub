# MovieBrowser

A modern React Native app to browse, search, and save movies, built with Expo, Appwrite, and TMDB API.

## Features

- 🔍 Search for movies using TMDB API
- 🎬 View trending and latest movies
- 💾 Save favorite movies to your profile
- 👤 User authentication (sign up, sign in, sign out) via Appwrite
- 🏆 Trending movies tracked by search popularity
- 🖼️ Beautiful UI with Tailwind CSS (NativeWind)
- ⚡ Fast, responsive, and mobile-first


## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Appwrite](https://appwrite.io/) project (see `.env` for required IDs)
- TMDB API Key

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/movie-app.git
   cd movie-app
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up environment variables:

   - Copy `.env` and fill in your Appwrite and TMDB credentials.

4. Start the app:

   ```sh
   npm run start
   ```

   Or use the provided script:

   ```sh
   ./start.sh
   ```

5. Open on your device with Expo Go or an emulator.

## Project Structure

- `app/` — App screens and navigation
- `components/` — Reusable UI components
- `constants/` — Static assets (icons, images)
- `services/` — API and Appwrite logic
- `interfaces/` — TypeScript interfaces
- `assets/` — Fonts, images, icons

## Environment Variables

See `.env` for required variables:

- `EXPO_PUBLIC_MOVIE_API_KEY`
- `EXPO_PUBLIC_APPWRITE_PROJECT_ID`
- `EXPO_PUBLIC_APPWRITE_DATABASE_ID`
- `EXPO_PUBLIC_APPWRITE_COLLECTION_ID_METRICS`
- `EXPO_PUBLIC_APPWRITE_COLLECTION_ID_USERS`
- `EXPO_PUBLIC_APPWRITE_COLLECTION_ID_SAVED_MOVIES`

## Scripts

- `npm run start` — Start Expo dev server
- `npm run android` — Run on Android
- `npm run ios` — Run on iOS
- `npm run web` — Run on web
- `npm run lint` — Lint code

## License

MIT

---

Made with ❤️ using Expo, Appwrite, and TMDB.
