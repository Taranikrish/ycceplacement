# 🎓 PlaceNow — College Placement Portal

> A full-stack job placement platform built for college students — inspired by Naukri.com. Students can discover opportunities, apply to jobs, and track applications, while companies can post listings and manage candidates, all within one unified portal.

🌐 **Live Demo:** [https://ycce-placement-portal.vercel.app](https://ycce-placement-portal.vercel.app)  
🔧 **Backend API:** [https://portal-project-black.vercel.app](https://portal-project-black.vercel.app)

---

## 📸 Preview

| Student Dashboard | Company Portal | Admin Panel |
|---|---|---|
| Browse & apply for jobs | Post & manage listings | Oversee all users & activity |

---

## ✨ Features

### 👩‍🎓 Students
- Register & build a complete profile
- Browse and search job listings
- Apply to jobs and track application status
- Google OAuth login support

### 🏢 Companies
- Register and manage company profile
- Post, edit, and delete job listings
- View and manage applicants
- Google OAuth login support

### 🛡️ Admin
- Dashboard to oversee all students and companies
- Manage platform-wide activity and listings

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React (Vite) | UI framework |
| Redux Toolkit | State management (slices/store) |
| Tailwind CSS | Styling |
| React Router | Client-side routing |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | Server & REST API |
| MongoDB + Mongoose | Database & ODM |
| JWT | Authentication |
| Google OAuth 2.0 | Social login |
| Vercel | Deployment |

---

## 📁 Folder Structure

```
NAUKRI_1/
├── backend/
│   ├── config/                  # DB and environment config
│   ├── controllers/
│   │   ├── admincontroller/     # Admin logic
│   │   ├── companycontroller/   # Company logic
│   │   └── studentcontroller/
│   │       ├── jobapplication.js
│   │       └── studentprofile.js
│   ├── googleAdmin.js           # Google OAuth - Admin
│   ├── googleCompany.js         # Google OAuth - Company
│   ├── googleStudent.js         # Google OAuth - Student
│   ├── logoutcontroller.js
│   ├── middleware/              # Auth & error middleware
│   ├── models/                  # Mongoose schemas
│   ├── routes/                  # Express route definitions
│   ├── index.js                 # Entry point
│   └── .env                     # Environment variables
│
└── frontend/
    ├── public/
    └── src/
        ├── components/          # Reusable UI components
        ├── pages/               # Route-level page components
        ├── slices/              # Redux slices
        ├── store/               # Redux store setup
        ├── App.jsx
        └── main.jsx
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Google OAuth credentials


Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🔌 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/student/register` | Student registration |
| POST | `/api/company/register` | Company registration |
| GET | `/api/jobs` | Fetch all job listings |
| POST | `/api/jobs/apply/:id` | Apply to a job |
| GET | `/api/admin/students` | Get all students (Admin) |
| GET | `/auth/google/student` | Google OAuth - Student |
| GET | `/auth/google/company` | Google OAuth - Company |

---

## 🌍 Deployment

Both frontend and backend are deployed on **Vercel**.

- Frontend: [ycce-placement-portal.vercel.app](https://ycce-placement-portal.vercel.app)
- Backend: [portal-project-black.vercel.app](https://portal-project-black.vercel.app)

Ensure the following are set in your Vercel environment variables for production deployment.

---
---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Made with ❤️ for students.  
