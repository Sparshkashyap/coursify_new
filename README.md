# 🎓 Coursify – Learn Without Limits

<p align="center">
  <img src="./screenshoot/img.png" width="900"/>
</p>

## 🌐 Live Demo

Frontend: https://your-frontend-url.vercel.app
Backend API: https://your-backend-url.onrender.com

---

## 📌 About The Project

Coursify is a full-stack learning management platform where students can enroll in courses, instructors can create and manage courses, and admins can manage the entire platform. The platform includes authentication, payments, certificates, AI features, wishlist, and profile management.

This project is built as a production-level full-stack application with role-based dashboards, secure authentication, payment integration, and cloud media storage.

---

## 🚀 Features

### 👨‍🎓 Student

* Browse and search courses
* Add courses to wishlist
* Enroll in courses
* Download certificates
* AI course recommendations
* Profile management
* Google login
* Course progress tracking

### 👨‍🏫 Instructor

* Create courses
* Edit and delete courses
* Upload course content
* View earnings
* AI course generator
* Affiliate tracking

### 🛠 Admin

* Manage users
* Manage courses
* Manage payments
* Platform settings
* Block users
* Promote instructors

### 🔐 Authentication

* Email & Password login
* Google OAuth login
* Forgot password / Reset password
* JWT authentication
* Protected routes
* Role-based access control

### 💳 Payments

* Razorpay integration
* Secure checkout
* Course enrollment after payment
* Payment history

### 🧠 AI Features

* AI course recommendations
* AI content generator for instructors
* Course assistant chatbot

### 🖼 Profile

* Upload profile picture (Cloudinary)
* Update profile
* Remove profile picture
* User dashboard profile menu

---

## 🧱 Tech Stack

### Frontend

* React
* TypeScript
* Tailwind CSS
* ShadCN UI
* React Router
* React Query
* Axios
* Context API

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Cloudinary (Image Upload)
* Razorpay (Payments)
* Google OAuth
* REST API

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas
* Images: Cloudinary

---

## 📂 Project Structure

```
coursify
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   └── server.js
│
├── frontend
│   ├── components
│   ├── pages
│   ├── layouts
│   ├── contexts
│   ├── api
│   ├── routes
│   └── App.tsx
│
├── screenshoot
│   └── img.png
│
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file inside backend folder and add:

```
MONGO_URI=
JWT_SECRET=
CLIENT_URL=

CLOUDINARY_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

EMAIL_USER=
EMAIL_PASS=
```

---

## 🧪 Run Locally

### Backend

```
cd backend
npm install
npm run dev
```

### Frontend

```
cd frontend
npm install
npm run dev
```

---

## 🌍 Deployment

| Service  | Platform      |
| -------- | ------------- |
| Frontend | Vercel        |
| Backend  | Render        |
| Database | MongoDB Atlas |
| Images   | Cloudinary    |

---

## 📸 Screenshots

<p align="center">
  <img src="./screenshoot/img.png" width="900"/>
</p>

---

## 📈 Future Improvements

* Course video streaming
* Instructor analytics dashboard
* Course reviews and comments
* Notifications system
* Mobile app
* Subscription system
* Dark mode improvements
* Course progress tracking UI

---

## 👨‍💻 Author

**Your Name**

GitHub: https://github.com/yourusername
LinkedIn: https://linkedin.com/in/yourprofile

---

## ⭐ Support

If you like this project, please give it a ⭐ on GitHub.

---

## 📄 License

This project is licensed under the MIT License.
