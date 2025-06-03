# Recipe Haven

A full-stack web application for discovering, saving, and organizing your favorite recipes. Built with React, Redux, Vite, Material UI on the frontend, and Node.js, Express, MongoDB, and Passport (with Google OAuth) on the backend.

---

## Features

- 🍲 **Browse 100+ Random Recipes** (powered by Spoonacular API)
- 🔍 **Search Recipes** by keyword
- 🥗 **Filter & Sort** by diet, time, and rating
- 📖 **Detailed Recipe View** with nutrition, ingredients, and directions
- 💾 **Save & Organize Recipes** (drag-and-drop reorder, delete)
- 📝 **User Authentication** (Email/Password & Google OAuth)
- 👤 **Profile Management**
- 📱 **Responsive Design** for all devices

---

## Tech Stack

- **Frontend:** React, Redux Toolkit, Vite, Material UI, React Router, React Toastify
- **Backend:** Node.js, Express, MongoDB, Mongoose, Passport, JWT, Spoonacular API
- **Authentication:** JWT, Google OAuth 2.0
- **Deployment:** Netlify (frontend), Render (backend)

---

## Folder Structure

```
backend/
  server.js
  config/
  controllers/
  middleware/
  models/
  routes/
frontend/
  recipe-frontend/
    src/
      components/
      features/
      pages/
      store/
      utils/
    public/
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Spoonacular API key(s)
- Google OAuth credentials

---

### 1. Clone the Repository

```sh
git clone https://github.com/Ashish-Kumar16/Recipe-website
cd Recipe-website-main
```

---

### 2. Backend Setup

```sh
cd backend
npm install
```

#### Create a `.env` file in `backend/` with:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SPOONACULAR_API_KEY_1=your_spoonacular_api_key
# (Optional) Add more keys as SPOONACULAR_API_KEY_2, etc.
```

#### Start the backend server

```sh
npm start
```

The backend runs on `http://localhost:5000` by default.

---

### 3. Frontend Setup

```sh
cd ../frontend/recipe-frontend
npm install
```

#### Start the frontend dev server

```sh
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

---

## Deployment

- **Frontend:** Deploy the `frontend/recipe-frontend` folder to [Netlify](https://www.netlify.com/) or [Vercel](https://vercel.com/).
- **Backend:** Deploy the `backend` folder to [Render](https://render.com/) or [Heroku](https://heroku.com/).

### Netlify Redirects

The project includes a [`netlify.toml`](frontend/recipe-frontend/netlify.toml) for SPA routing.

---

## Environment Variables

See [backend/.env.example](backend/.env.example) for required backend variables.

---

## API Endpoints

### Auth

- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login user
- `GET /api/auth/google` — Google OAuth login
- `GET /api/auth/profile` — Get user profile

### Recipes

- `GET /api/recipes` — Get random recipes
- `GET /api/recipes/:id` — Get recipe details
- `GET /api/recipes/search?query=...` — Search recipes
- `POST /api/recipes/save` — Save recipe (auth required)
- `GET /api/recipes/saved` — Get saved recipes (auth required)
- `PUT /api/recipes/saved/order` — Update saved recipes order (auth required)
- `DELETE /api/recipes/saved/:recipeId` — Delete saved recipe (auth required)
