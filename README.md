# Crowdfunding Platform

A modern, role-based crowdfunding platform that allows **Supporters** to discover campaigns and contribute credits, **Creators** to launch and manage campaigns, and **Admins** to control platform operations, campaign approvals, withdrawals, users, and reports.

The platform is designed with inspiration from popular crowdfunding platforms such as Kickstarter, Indiegogo, and GoFundMe, while maintaining its own original design and user experience.

---

## 🌟 Live Website

**Live Site:** `https://crowdfunding-client-two.vercel.app/`

**Client Repository:** `https://github.com/sushantarsushil-hub/crowdfunding-client`

**Server Repository:** `https://github.com/sushantarsushil-hub/crowdfunding-server`

> Replace the placeholder URLs above with your actual deployed website and GitHub repository links.

---

## 📌 Project Overview

The Crowdfunding Platform provides a complete ecosystem for project fundraising using platform credits.

Users can register as either **Supporters** or **Creators**. Supporters receive **50 credits** after registration, while Creators receive **20 credits**. Supporters can purchase additional credits and use them to contribute to approved campaigns.

Creators can submit campaigns, review contributions, manage their campaigns, and request withdrawals. Admins supervise the entire platform by approving campaigns, managing users, processing withdrawals, and handling reports.

---

## 👥 User Roles

### 🙋 Supporter

Supporters can:

* Explore approved crowdfunding campaigns
* View campaign details
* Contribute credits to campaigns
* Track their contributions
* Purchase additional credits
* View payment history
* Receive notifications
* Report suspicious campaigns

### 🚀 Creator

Creators can:

* Create crowdfunding campaigns
* Manage their own campaigns
* Review pending contributions
* Approve or reject contributions
* Track campaign funding
* Post campaign updates
* Request withdrawals
* View withdrawal/payment history
* Receive platform notifications
* Report issues

### 🛡️ Admin

Admins can:

* View platform statistics
* Approve or reject campaigns
* Manage users
* Change user roles
* Delete users
* Manage campaigns
* Process withdrawal requests
* Review reported campaigns
* Suspend or delete suspicious campaigns
* Monitor platform activity

The three-role structure and corresponding responsibilities are defined in the project requirements.

---

# ✨ Key Features

## 🔐 Authentication

* Email/password registration
* Email/password login
* Google Sign-In
* Role selection during registration
* Profile picture support
* Email validation
* Password-strength validation
* Secure access-token storage
* Protected dashboard routes
* Role-based authorization

New Supporters receive **50 credits**, while new Creators receive **20 credits** after successful registration.

---

## 🏠 Homepage

The homepage includes:

* Animated hero section
* Three-slide campaign banner
* Top 6 funded campaigns
* Campaign cover images
* Funding statistics
* User testimonials
* How It Works section
* Category exploration
* Platform impact/statistics section
* Responsive design
* Animated UI elements

The project requirements specify a three-banner slider and a Top Funded Campaigns section showing the six campaigns with the highest raised amount.

---

# 💰 Credit & Contribution System

The platform uses **credits** instead of direct currency for campaign contributions.

### Initial Credits

| User Type | Initial Credits |
| --------- | --------------: |
| Supporter |              50 |
| Creator   |              20 |

### Credit Purchase Packages

| Package      | Price |
| ------------ | ----: |
| 100 Credits  |   $10 |
| 300 Credits  |   $25 |
| 800 Credits  |   $60 |
| 1500 Credits |  $110 |

Supporters can purchase credits through the payment system. After successful payment, the payment information is saved and the user's credit balance is increased.

---

# 💳 Payment System

The platform supports a Stripe-based payment system for purchasing credits.

### Supported Payment Options

* Stripe


If Stripe integration is unavailable during development, a dummy payment flow can be used as a fallback.

---

# 📊 Creator Dashboard

Creators have access to:

### Creator Home

Displays:

* Total campaigns
* Active campaigns
* Total amount raised

### Contribution Review

Creators can see pending contributions containing:

* Supporter name
* Campaign title
* Contribution amount
* Contribution details

Creators can **Approve** or **Reject** contributions.

When approved:

1. Contribution status becomes `approved`.
2. The contribution amount is added to the campaign's raised amount.

When rejected:

1. Contribution status becomes `rejected`.
2. Credits are refunded to the Supporter.

---

## ➕ Campaign Creation

Creators can create campaigns using:

* Campaign title
* Campaign story
* Category
* Funding goal
* Minimum contribution
* Deadline
* Reward information
* Campaign image

New campaigns initially receive a `pending` status and become visible to Supporters only after Admin approval.

---

## 📁 Campaign Management

Creators can:

* View their campaigns
* Update campaigns
* Delete campaigns

Creators can update:

* Campaign title
* Campaign story
* Reward information

When a campaign is deleted, approved Supporters receive their contribution credits back.

---

# 💵 Creator Withdrawals

The platform uses the following business model:

> **20 raised credits = $1 creator withdrawal value**

Creators can request a withdrawal after reaching at least **200 raised credits**, equivalent to **$10**.

For example:

```text
500 Raised Credits
        ↓
500 ÷ 20
        ↓
$25 Withdrawal Amount
```

Creators can specify:

* Credits to withdraw
* Automatically calculated withdrawal amount
* Payment system
* Account number

Withdrawal requests are saved with a `pending` status and processed by Admins.

---

# 🙌 Supporter Dashboard

Supporters can access:

### Supporter Home

Displays:

* Total contributions
* Pending contributions
* Total approved contribution amount

### Explore Campaigns

Campaign cards display:

* Campaign title
* Creator name
* Deadline
* Funding goal
* Amount raised
* View Details button

Only campaigns that are:

```text
Status = approved
AND
Deadline has not passed
```

are displayed to Supporters.

---

# 🎯 Campaign Details

The campaign details page displays complete campaign information and provides a contribution form.

The Supporter enters:

```text
Contribution Amount
```

A contribution record contains information such as:

* Campaign ID
* Campaign title
* Contribution amount
* Supporter email
* Supporter name
* Creator name
* Creator email
* Current date
* Contribution status

New contributions initially have a `pending` status.

---

# 🧾 My Contributions

Supporters can view all contributions associated with their account.

Features include:

* Contribution history
* Campaign information
* Contribution amount
* Creator information
* Contribution status
* Status highlighting
* Pagination

---

# 💳 Payment History

Supporters can view their previous credit purchases in a tabular payment-history interface.

Creators can similarly view their previous withdrawal requests and payment history.

---

# 🛡️ Admin Dashboard

The Admin dashboard provides complete platform management.

## Admin Statistics

Admins can monitor:

* Total Supporters
* Total Creators
* Total available credits
* Total payments processed

---

## ✅ Campaign Approval

Admins can review campaigns with:

```text
status = pending
```

Available actions:

* Approve
* Reject

Approved campaigns become available to Supporters, while rejected campaigns are not published.

---

## 💰 Withdrawal Management

Admins can review pending withdrawal requests.

After successful payment:

```text
Withdrawal Status
        ↓
approved
        ↓
Creator raised credits decreased
```

---

# 👤 User Management

Admins can view:

* Display name
* Email
* Profile picture
* Role
* Credits

Available actions:

* Remove user
* Update role

Supported roles:

```text
Admin
Creator
Supporter
```

---

# 🚨 Report Management

Supporters can report suspicious or potentially fraudulent campaigns.

Admins can view:

* Reporter name
* Campaign title
* Report reason
* Report date

Admins can then:

* Suspend a campaign
* Delete a campaign

---

# 🔔 Notification System

The platform includes an in-app notification system.

Notifications are generated for events such as:

* Contribution approval
* Contribution rejection
* New contribution
* Campaign approval
* Campaign rejection
* Withdrawal approval

Each notification contains information such as:

```text
message
toEmail
actionRoute
time
```

Notifications are filtered according to the currently authenticated user's email and displayed in a floating notification popup.

---

# 🔒 Security & Authorization

The platform implements **Role-Based Authorization**.

Separate authorization middleware is used for:

```text
Supporter
Creator
Admin
```

Users can only access functionality permitted for their assigned role.

---

# 🖼️ Image Upload

The platform supports image uploading for:

* User profile pictures
* Campaign images

**imgBB** can be used for image hosting/uploading.

---

# 🔎 Advanced Search & Filtering

The platform can support advanced campaign search and filtering based on:

* Category
* Deadline
* Funding goal
* Campaign status

MongoDB aggregation can be used for efficient filtering and querying.

---

# 🧑‍💻 Technology Stack

The exact implementation stack can be customized according to the project setup.

### Frontend

* React
* React Router
* Tailwind CSS
* DaisyUI
* Axios
* TanStack Query
* React Hook Form
* React Hot Toast
* Next.js
* Framer Motion

### Backend

* Node.js
* Express.js
* MongoDB
* REST API
* JWT-based authentication/authorization

### Services

* Stripe
* Google Authentication
* imgBB
* Vercel
* Render

> Update this section if your final implementation uses a different technology stack.

---

# 📂 Suggested Project Structure

```text
crowdfunding-platform/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── hooks/
│   │   ├── contexts/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── public/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── config/
│   ├── utils/
│   └── server.js
│
└── README.md
```

---

# 🗄️ Main Data Collections

The backend can organize data into collections such as:

```text
users
campaigns
contributions
payments
withdrawals
notifications
reports
```

---

# 🔄 Basic Platform Workflow

```text
User Registration
       ↓
Select Role
       ↓
Supporter / Creator
       ↓
Dashboard
       ↓
────────────────────────────
│                          │
Supporter                Creator
│                          │
Explore Campaigns       Create Campaign
│                          │
Contribute Credits      Admin Approval
│                          │
Track Contribution      Receive Contributions
│                          │
Purchase Credits        Request Withdrawal
────────────────────────────
              ↓
            Admin
              ↓
Campaign Approval
User Management
Withdrawal Processing
Report Management
```

---

# 🚀 Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/crowdfunding-client.git
cd crowdfunding-client
```

For the backend:

```bash
git clone https://github.com/your-username/crowdfunding-server.git
cd crowdfunding-server
```

---

## 2. Install Dependencies

Frontend:

```bash
npm install
```

Backend:

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file in the server project.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

STRIPE_SECRET_KEY=your_stripe_secret_key

IMG_BB_API_KEY=your_imgbb_api_key

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

CLIENT_URL=http://localhost:5173
```

Never commit your actual secret keys or `.env` files to GitHub.

---

## 4. Run the Backend

```bash
npm run dev
```

---

## 5. Run the Frontend

```bash
npm run dev
```

The application should then be available through your local development URL.

---

# 🌐 Deployment

The project is designed to support deployment of both client and server applications.

Recommended deployment:

```text
Frontend → Vercel
Backend  → Vercel
Database → MongoDB Atlas
```

The project requirements specifically recommend deploying the site and server and hosting the frontend on Vercel.

---

# 📱 Responsive Design

The platform is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile

All major pages, dashboards, tables, forms, campaign cards, navigation elements, and modals should provide a responsive experience.

---

# 🎨 Design Goals

The UI focuses on:

* Modern crowdfunding experience
* Clean dashboard design
* Easy campaign discovery
* Clear financial information
* Responsive layouts
* Smooth animations
* Accessible navigation
* Role-specific interfaces
* Attractive campaign cards
* Consistent visual hierarchy

The design may take inspiration from existing crowdfunding platforms but should not directly copy them.

---

# 🔮 Future Improvements

Possible future improvements include:

* Automated email notifications
* Advanced campaign search
* Advanced filtering
* MongoDB aggregation-based analytics
* Fraud detection
* Campaign recommendation system
* Campaign updates/news feed
* More payment gateways
* Improved admin analytics
* Real-time notifications
* Campaign sharing
* Social login providers
* Email verification
* Password reset
* Two-factor authentication

Automated email notifications, advanced campaign filtering, and an expanded reporting system are specifically identified as optional enhancements in the requirements.

---


Example:

```text
screenshots/
├── home.png
├── login.png
├── register.png
├── campaign-details.png
├── supporter-dashboard.png
├── creator-dashboard.png
├── admin-dashboard.png
└── payment.png
```

Then add them to the README:

```markdown
![Homepage](./screenshots/home.png)
```

---

# 🤝 Contributing

Contributions are welcome.

To contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Test the application.
5. Commit your changes.
6. Push the branch.
7. Create a Pull Request.

---

# 📄 License

This project is developed for educational and project purposes.

You may modify this section according to the license selected for your repository.

---

# 👨‍💻 Developer

**Sushanta Ranjan Sushil**

Frontend Developer



---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

**Built with ❤️ for a better crowdfunding experience.**
