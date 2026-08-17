# Crowdfunding Platform — Frontend Architecture & Specification

## Executive Overview
This document outlines the technical architecture, component design, route mapping, state management, and design system for the **Crowdfunding Platform Client**. The application is built as a separate Next.js project communicating with an independent Express.js REST API.

---

## 1. Frontend Architecture
- **Framework & Paradigm**: Next.js App Router with React Client Components for interactive UI and Server Components for static/metadata generation.
- **Backend Communication**: Pure REST API architecture via **Axios** HTTP client. Zero backend logic or database access inside the Next.js frontend.
- **Routing Engine**: Next.js App Router (`app/` directory). Legacy React Router DOM is completely replaced by App Router file-system routing.
- **Security Boundary**: The backend remains the sole source of truth for authentication, permissions, and business rules. Client-side role checks only handle UI rendering visibility.
- **State Partitioning**:
  - **Server State**: TanStack Query (React Query v5) for data fetching, caching, background polling, and optimistic updates.
  - **Form State**: React Hook Form for form validation, controlled inputs, and error messaging.
  - **Auth State**: Better Auth client session provider sync with HTTP Bearer token management.
  - **UI / Local State**: React `useState`/`useContext` for drawer toggles, theme switches, and modal visibility.

---

## 2. Folder Structure
```
crowdfunding-client/
├── app/                        # Next.js App Router Structure
│   ├── (public)/              # Public route group (shared public header/footer)
│   │   ├── page.jsx           # Home Page (/)
│   │   ├── campaigns/
│   │   │   ├── page.jsx       # Campaign Discovery (/campaigns)
│   │   │   └── [id]/
│   │   │       └── page.jsx   # Campaign Details (/campaigns/[id])
│   │   ├── login/
│   │   │   └── page.jsx       # Login Page (/login)
│   │   └── register/
│   │       └── page.jsx       # Register Page (/register)
│   ├── dashboard/             # Protected Dashboard area
│   │   ├── layout.jsx         # Unified Dashboard Layout (Sidebar + Topbar)
│   │   ├── page.jsx           # Dashboard Home (Role-aware overview)
│   │   ├── (supporter)/       # Supporter Specific Routes
│   │   │   ├── my-contributions/
│   │   │   │   └── page.jsx   # Supporter: My Contributions
│   │   │   └── purchase-credits/
│   │   │       └── page.jsx   # Supporter: Purchase Credit
│   │   ├── (creator)/         # Creator Specific Routes
│   │   │   ├── add-campaign/
│   │   │   │   └── page.jsx   # Creator: Add New Campaign
│   │   │   ├── my-campaigns/
│   │   │   │   └── page.jsx   # Creator: Manage My Campaigns
│   │   │   └── withdrawals/
│   │   │       └── page.jsx   # Creator: Request & View Withdrawals
│   │   ├── (admin)/           # Admin Specific Routes
│   │   │   ├── users/
│   │   │   │   └── page.jsx   # Admin: Manage Users & Roles
│   │   │   ├── manage-campaigns/
│   │   │   │   └── page.jsx   # Admin: Approve/Reject Campaigns
│   │   │   ├── withdrawal-requests/
│   │   │   │   └── page.jsx   # Admin: Manage Withdrawal Requests
│   │   │   └── reports/
│   │   │       └── page.jsx   # Admin: Manage Campaign Reports
│   │   └── payment-history/
│   │       └── page.jsx       # Shared: Payment & Credit Transaction History
│   ├── layout.jsx             # Root Layout (Providers, Fonts, Toaster)
│   ├── not-found.jsx          # Custom 404 Page
│   └── globals.css            # Tailwind + Custom DaisyUI Overrides
├── src/                        # Application Code & Business Logic
│   ├── api/                   # Axios API instances & interceptors
│   │   └── axiosClient.js
│   ├── components/            # Reusable Components
│   │   ├── common/            # Navbar, Footer, Modal, Loading, EmptyState
│   │   ├── ui/                # StatCard, Badge, Button, Input, Progress
│   │   ├── campaigns/         # CampaignCard, CampaignGrid, CampaignFilters, ReportModal
│   │   ├── dashboard/         # DashboardSidebar, DashboardHeader, NavItems
│   │   ├── auth/              # LoginForm, RegisterForm, RoleSelector
│   │   └── admin/             # UserTable, CampaignApprovalCard, ReportQueueTable
│   ├── context/               # AuthContext, NotificationContext
│   ├── hooks/                 # Custom Query/Mutation Hooks
│   │   ├── useAuth.js
│   │   ├── useCampaigns.js
│   │   ├── useContributions.js
│   │   ├── useCredits.js
│   │   ├── useWithdrawals.js
│   │   └── useAdmin.js
│   ├── services/              # API Client Service Calls
│   │   ├── auth.service.js
│   │   ├── campaign.service.js
│   │   ├── contribution.service.js
│   │   ├── credit.service.js
│   │   ├── withdrawal.service.js
│   │   └── admin.service.js
│   ├── utils/                 # Formatters, Credit Math, Constants
│   │   ├── creditRules.js     # Package pricing & conversion formulas
│   │   └── formatters.js      # Date & currency helpers
│   └── constants/             # Roles, API Endpoints, Menu Configurations
│       └── config.js
└── public/                    # Static Assets (Logos, Placeholders)
```

---

## 3. Route Structure & Access Control
| Route | Layout Group | Guard Level | Allowed Roles | Core Functionality |
|---|---|---|---|---|
| `/` | Public | None | All | Hero, Featured Campaigns, Value Prop, Impact Stats |
| `/campaigns` | Public | None | All | Filterable & Searchable Campaign Directory |
| `/campaigns/[id]` | Public | None | All | Campaign Detail, Backer Progress, Contribution Modal, Report Modal |
| `/login` | Public | Guest Only | Guests | Email/Password & Better Auth Login |
| `/register` | Public | Guest Only | Guests | Registration with Role Choice (Supporter / Creator) |
| `/dashboard` | Dashboard | Authenticated | Supporter, Creator, Admin | Role-tailored Overview Cards, Quick Actions, Recent Activity |
| `/dashboard/my-contributions` | Dashboard | Authenticated | Supporter | List of backed projects, status, credits spent |
| `/dashboard/purchase-credits` | Dashboard | Authenticated | Supporter | Credit Package Cards (100, 300, 800, 1500 credits), Checkout |
| `/dashboard/add-campaign` | Dashboard | Authenticated | Creator | Multi-step Campaign Creation Form |
| `/dashboard/my-campaigns` | Dashboard | Authenticated | Creator | Campaign status management, review contributions |
| `/dashboard/withdrawals` | Dashboard | Authenticated | Creator | Request Withdrawal ($1 per 20 credits, min 200 credits), View Status |
| `/dashboard/payment-history` | Dashboard | Authenticated | Supporter, Creator | Credit purchases & withdrawal transaction log |
| `/dashboard/users` | Dashboard | Authenticated | Admin | User Table, Role updates (Supporter/Creator/Admin), Account Status |
| `/dashboard/manage-campaigns` | Dashboard | Authenticated | Admin | Pending campaign queue, Approve/Reject modal |
| `/dashboard/withdrawal-requests` | Dashboard | Authenticated | Admin | Review creator withdrawal payout requests |
| `/dashboard/reports` | Dashboard | Authenticated | Admin | Review reported campaigns & take actions |

---

## 4. Component Architecture & Custom Design System
- **Styling Architecture**: DaisyUI paired with custom CSS utility extensions.
- **Visual Palette**: Deep Slate/Navy background, Vibrant Emerald green primary accents for funding/growth, Amber/Gold for credits, Coral for urgency/alerts.
- **Core Component Hierarchy**:
  - `CampaignCard`: Visual thumbnail, title, creator badge, category pill, dynamic animated progress bar, credits goal vs raised, days left, and quick contribute button.
  - `CreditBadge`: Dynamic topbar pill showing active credit balance with glowing accent on purchase.
  - `ContributionModal`: Step-by-step credit allocation slider with real-time credit balance check.
  - `WithdrawalForm`: Live converter showing raised credits to USD ($1 per 20 credits) with minimum threshold validation (200 credits / $10).
  - `DataTable`: Responsive table with sorting, status badges (Pending, Approved, Rejected, Fulfilled), and action menus.
  - `NotificationDropdown`: Real-time notification drawer/popover.

---

## 5. API Service Architecture (Axios + TanStack Query)
- **Axios Instance Configuration**:
  - `baseURL`: `process.env.NEXT_PUBLIC_API_URL`
  - Interceptors: Inject Bearer JWT from Better Auth session into `Authorization` header.
  - Error Interceptor: Intercept 401 (trigger sign out/redirect), 403 (show permission toast), 422/400 (display validation toasts via React Hot Toast).
- **Service Modules**:
  - `campaign.service.js`: `getCampaigns()`, `getCampaignById(id)`, `createCampaign(payload)`, `updateCampaignStatus(id, status)`.
  - `credit.service.js`: `getBalance()`, `purchasePackage(packageId)`, `getPaymentHistory()`.
  - `contribution.service.js`: `contribute(campaignId, credits)`, `getMyContributions()`, `reviewContribution(id, status)`.
  - `withdrawal.service.js`: `requestWithdrawal(credits)`, `getWithdrawals()`, `processWithdrawal(id, status)`.
  - `admin.service.js`: `getUsers()`, `updateUserRole(userId, role)`, `getReports()`, `resolveReport(id, action)`.
- **Query Hook Strategy**:
  - `useQuery({ queryKey: ['campaigns', filters], queryFn: () => campaignService.getCampaigns(filters) })`
  - Optimistic updates on credit contributions and campaign approvals using `queryClient.setQueryData`.

---

## 6. Authentication Architecture & Better Auth Integration
- **Client Session Integration**: Better Auth client sdk wrapped inside `AuthProvider` context.
- **Initial Credit Rules**:
  - **New Supporter Registration**: Automatically granted **50 signup credits**.
  - **New Creator Registration**: Automatically granted **20 signup credits**.
- **Role Enforcement**:
  - `ClientAuthGuard` checks `user.role` from session state.
  - Non-authorized route navigation redirects to `/dashboard` with an informative error toast.
  - Backend API verifies all JWT tokens and permission claims on every endpoint.

---

## 7. Dashboard Architecture & Credit Logic
- **Role-Aware Dashboard Shell**:
  - Common top bar displaying logo, search bar, active user profile dropdown, and active Credit Balance pill.
  - Sidebar navigation automatically renders relevant links based on active role (`supporter`, `creator`, `admin`).
- **Credit Purchase Packages Matrix**:
  - **Package 1**: 100 Credits = $10 ($0.10 / credit)
  - **Package 2**: 300 Credits = $25 ($0.083 / credit - *Popular*)
  - **Package 3**: 800 Credits = $60 ($0.075 / credit - *Best Value*)
  - **Package 4**: 1500 Credits = $110 ($0.073 / credit - *Ultimate*)
- **Creator Withdrawal Rules**:
  - **Conversion Rate**: 20 raised credits = $1.00 USD.
  - **Minimum Cashout**: 200 raised credits ($10.00 USD minimum).
  - Validation is enforced both in client form UI and strictly on backend.

---

## 8. State-Management Strategy
1. **Server State (TanStack Query v5)**:
   - Manages API caching, revalidation on window focus, and background sync.
   - Cache invalidation keys: `['user']`, `['campaigns']`, `['contributions']`, `['credits']`, `['withdrawals']`, `['admin']`.
2. **Form State (React Hook Form)**:
   - Validates form inputs before API calls.
   - Used in Campaign Creation, Registration, Login, Credit Purchase, and Withdrawal forms.
3. **Auth & Session State (Better Auth Client + Context)**:
   - Maintains active user profile, token, credits balance, and role.
4. **UI State (React Hooks)**:
   - Search query strings, pagination state, modal visibility toggles.

---

## 9. Responsive & Design Strategy
- **Breakpoints**: Standard Tailwind breakpoints (`sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`).
- **Mobile Adaptations**:
  - Dashboard sidebar converts to a collapsible off-canvas drawer.
  - Tables collapse into card-based list items on small screens.
  - Navigation header collapses into a mobile hamburger menu.
- **DaisyUI Customization**: Custom color schemes configured in `tailwind.config.js` to ensure the platform has a unique, high-end identity separate from standard templates.

---

## 10. Animation Strategy (Framer Motion)
- **Page Transitions**: Smooth fade-in and subtle vertical shift on route changes.
- **Card Animations**: Hover elevation, subtle scale effect, and staggered reveal for campaign grid items.
- **Interactive Modals**: Scale and opacity entrance for contribution, report, and approval dialogs.
- **Credit Counter**: Animated numerical count-up when credits are purchased or contributed.
- **Progress Bar**: Smooth width interpolation for campaign funding percentage indicators.

---

## Verification & Next Steps
- `FRONTEND_SPEC.md` serves as the blueprint for frontend architecture.
- Implementation will proceed step-by-step upon confirmation.
