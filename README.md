# FundFlow — Crowdfunding Platform (Frontend Client)

FundFlow is a modern, high-impact web application built for transparent campaign creation, community backing, and social relief fundraising.

## 🚀 Tech Stack

- **Framework**: Next.js App Router (`src/app/`)
- **UI Library**: React 19
- **Styling**: Tailwind CSS & DaisyUI (Custom Theme)
- **Data Fetching & State**: TanStack Query (v5) & Axios
- **Form State**: React Hook Form
- **Auth Client**: Better Auth & JWT Session Sync
- **Animations**: Framer Motion
- **Carousel**: Swiper
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory based on `.env.example`:

```env
# Centralized REST API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1

# ImgBB API Key for Image Uploads
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

# Better Auth Client URL
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:5000
```

> **Note**: `NEXT_PUBLIC_API_BASE_URL` is centralized in `src/api/axiosInstance.js`. No backend secrets are exposed in client-side environment variables.

---

## 📦 Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Run Production Build**:
   ```bash
   npm run build
   ```

---

## 📁 App Router Project Structure

```
crowdfunding-client/
├── src/
│   ├── app/                    # Next.js App Router directory
│   │   ├── (public)/          # Public routes (Home, Campaigns, Detail, Auth)
│   │   ├── dashboard/         # Protected Dashboard shell & role sub-routes
│   │   ├── layout.jsx         # Root layout with QueryClient & Auth Providers
│   │   └── not-found.jsx      # Custom 404 page
│   ├── api/
│   │   └── axiosInstance.js   # Centralized Axios client with Bearer token interceptor
│   ├── components/
│   │   ├── common/            # Loading, ErrorState, EmptyState, Notifications
│   │   ├── home/              # HeroSwiper, TopFundedGrid, Categories, Impact
│   │   ├── layout/            # Navbar, Footer
│   │   └── ui/                # Button, Input, Modal
│   ├── context/
│   │   └── AuthContext.jsx    # Session & JWT state provider
│   ├── hooks/                 # TanStack Query custom hooks
│   └── utils/
│       └── creditRules.js     # Credit package prices & conversion logic
├── FRONTEND_SPEC.md            # Technical Architecture Blueprint
├── .env.example
├── next.config.mjs
├── tailwind.config.js
└── package.json
```
