# Deployment Guide for "Reservice"

This guide helps you deploy your "Production Ready" application.

## 1. Backend Deployment (Render)
We use Render because it keeps the server running 24/7, which is required for your Real-time Admin Notifications.

1.  Push your code to GitHub.
2.  Go to [Render Dashboard](https://dashboard.render.com/).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  **Settings**:
    *   **Root Directory**: `backend` (Important!)
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
6.  **Environment Variables**:
    *   `NODE_ENV`: `production`
    *   `MONGO_URI`: (Your MongoDB Connection String)
    *   `JWT_SECRET`: (A long random string)
    *   `COOKIE_SECRET`: (Another long random string)
    *   `ALLOWED_ORIGINS`: `https://your-frontend-url.vercel.app` (You can add this *after* you deploy the frontend)

## 2. Frontend Deployment (Vercel)
Vercel is best for React/Vite apps.

1.  Go to [Vercel Dashboard](https://vercel.com).
2.  **Add New Project** -> Select your Repository.
3.  **Framework Preset**: Vite
4.  **Root Directory**: `frontend` (Important!)
5.  **Environment Variables**:
    *   `VITE_API_URL`: `https://your-backend-url.onrender.com/api/v1` (Copy this from your Render Dashboard).
6.  Click **Deploy**.

## 3. Post-Deployment
After deploying the Frontend, go back to Render and update the `ALLOWED_ORIGINS` variable with your new Vercel URL (e.g., `https://reservice.vercel.app`).
