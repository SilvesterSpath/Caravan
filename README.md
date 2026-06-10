# Caravan 🚐

A full-stack caravan & camper **rental/sale marketplace** where users can list, browse, and book caravans — built with React and Firebase. Users sign in (email/password or Google), publish listings with photos and a geocoded map location, mark special offers, and contact owners directly.

**Live demo:** [caravan-ashy.vercel.app](https://caravan-ashy.vercel.app)

![React](https://img.shields.io/badge/React-17-61DAFB?logo=react&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-9-FFCA28?logo=firebase&logoColor=black)
![React Router](https://img.shields.io/badge/React%20Router-6-CA4245?logo=reactrouter&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Features

- **Authentication** — email/password sign-up & sign-in, Google OAuth, and password reset (Firebase Auth).
- **Listings management** — create, edit, and delete your own listings with up to 6 images.
- **Image uploads** — photos stored in Firebase Storage with live upload progress.
- **Geolocation** — addresses are geocoded via the Geoapify API and shown on an interactive Leaflet map.
- **Browse by category** — separate **Rent** and **Sale** categories, plus a dedicated **Offers** page for discounted listings.
- **Image galleries** — Swiper-powered sliders on the home and listing pages.
- **User profile** — update display name/email and manage your own listings.
- **Protected routes** — profile and create/edit pages are guarded for authenticated users only.
- **Toast notifications** — instant feedback for actions and errors.

---

## 🛠 Tech Stack

| Area | Technology |
| --- | --- |
| Frontend | React 17 (Create React App) |
| Routing | React Router DOM v6 |
| Backend / Data | Firebase 9 — Firestore, Authentication, Storage |
| Maps | Leaflet + React-Leaflet |
| Geocoding | Geoapify Geocoding API |
| UI / UX | Swiper, React Icons, React Toastify |
| Utilities | uuid |

---

## 📂 Project Structure

```text
src/
├── assets/            # fonts, images, and SVG icons
├── components/        # reusable UI (Navbar, Slider, ListingItem, Spinner, OAuth, PrivateRoute)
├── hooks/
│   └── useAuthStatus.js   # custom hook for auth state
├── pages/             # route-level views
│   ├── Explore.jsx        # home / landing
│   ├── Category.jsx       # listings by type (rent/sale)
│   ├── Offers.jsx         # discounted listings
│   ├── Listing.jsx        # single listing + map
│   ├── CreateListing.jsx  # create a listing (with geocoding + image upload)
│   ├── EditListing.jsx    # edit an existing listing
│   ├── Profile.jsx        # user profile + my listings
│   ├── Contact.jsx        # contact the owner
│   ├── SignIn.jsx / SignUp.jsx / ForgotPassword.jsx
├── firebase.config.js # Firebase initialization
├── App.js             # routes
└── index.js           # entry point
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- A [Firebase](https://console.firebase.google.com/) project
- A free [Geoapify](https://www.geoapify.com/) API key (for geocoding)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/SilvesterSpath/Caravan.git
cd Caravan

# 2. Install dependencies
npm install

# 3. Add your environment variables (see below)

# 4. Start the development server
npm start
```

The app runs at [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create a `.env` file in the project root:

```env
REACT_APP_GEOCODE_API_KEY=your_geoapify_api_key
```

> **Recommended:** move the Firebase config out of `src/firebase.config.js` and into environment variables as well, then read them via `process.env.REACT_APP_*`:
>
> ```env
> REACT_APP_FIREBASE_API_KEY=...
> REACT_APP_FIREBASE_AUTH_DOMAIN=...
> REACT_APP_FIREBASE_PROJECT_ID=...
> REACT_APP_FIREBASE_STORAGE_BUCKET=...
> REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
> REACT_APP_FIREBASE_APP_ID=...
> ```

### Firebase Setup

1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** → Email/Password and Google providers.
3. Create a **Cloud Firestore** database (a `listings` collection is created automatically on first listing).
4. Enable **Storage** for image uploads.
5. Copy your web app config into `src/firebase.config.js` (or your `.env`).

---

## 📜 Available Scripts

| Command | Description |
| --- | --- |
| `npm start` | Run the app in development mode |
| `npm test` | Launch the test runner |
| `npm run build` | Build for production into `build/` |

---

## 🗺 Roadmap

- [ ] Move Firebase config to environment variables
- [ ] Add search and filtering on the Explore page
- [ ] Add pagination / infinite scroll for listings
- [ ] Migrate to TypeScript
- [ ] Add unit/integration tests

---

## 👤 Author

**Silvester Spath**
- Portfolio: [silvesterspath.me](https://silvesterspath.me)
- GitHub: [@SilvesterSpath](https://github.com/SilvesterSpath)

---

## 📄 License

This project is licensed under the MIT License.
