🟦 E-PLACER — Community Service & Internship Placement System

E-Placer is a full-stack platform designed to help university students easily discover, apply for, and track Community Service placements and Internships, while providing administrators with a secure dashboard to manage applications and opportunities.

Built with React (Vite), Tailwind CSS, Node.js + Express, and MongoDB.

🚀 Features
🧑‍🎓 Student Features

Secure JWT login

Browse categorized Community Service placements

Browse categorized Internships (Tech, Finance, Media, HR, etc.)

Scrollable, modern Airbnb-style card layout

Side-panel with maps and contact info for CS placements

Full internship application form (PDF CV upload)

View all submitted applications in My Applications

Cancel applications (slot auto-restore)

Application statuses: Pending → Accepted / Rejected

🛠️ Admin Features

Secure Admin login

View all applications system-wide

Approve / Reject applications

View uploaded CVs

Manage placements & internships (Create, Update, Delete)

⚙️ Backend Core Features

REST API built with Express

MongoDB storage with Mongoose models:

Users

Placements

Internships

Applications

Password hashing (bcryptjs)

JWT authentication middleware

Multer file upload system for CVs

Role-based access control (Student / Admin)

Automatic slot decrement + restore on cancel

🧰 Tech Stack
Frontend

React 18 + Vite

Tailwind CSS

Axios

React Router

Backend

Node.js + Express

MongoDB + Mongoose

Multer (CV uploads)

JWT Auth

bcryptjs

CORS + Morgan

📁 Project Structure
eplacer/
│
├── eplacer-frontend/
│   ├── src/
│   ├── public/
│   └── vite.config.js
│
├── eplacer-backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   ├── seed.js
│   └── server.js
│
└── README.md

▶️ Running the Project
Frontend
cd eplacer-frontend
npm install
npm run dev


Runs at: http://localhost:5173

Backend
cd eplacer-backend
npm install
npm run dev


Runs at: http://localhost:5000

🔐 Environment Setup

Create /eplacer-backend/.env:

MONGO_URI=mongodb+srv://<your-connection-string>
JWT_SECRET=supersecret123
PORT=5000

🌱 Database Seeding

Run once to create initial data:

node seed.js


This seeds:

Admin account

Community service placements

Internships

🔑 Default Login Credentials
Admin
Email: admin@eplacer.test
Password: admin123

Student (if seeded)
Email: student@eplacer.test
Password: student123

📌 API Endpoints (Short Version)
Authentication

POST /api/auth/login

POST /api/auth/register (optional)

Placements

GET /api/placements

GET /api/placements/:id

(Admin): POST /api/placements

(Admin): PUT /api/placements/:id

(Admin): DELETE /api/placements/:id

Internships

GET /api/internships

GET /api/internships/:id

(Admin) CRUD operations

Applications

POST /api/applications (student)

GET /api/applications/me/list (student)

GET /api/applications (admin)

PUT /api/applications/:id/status (admin)

DELETE /api/applications/:id (admin)

📌 Known Working Features

Student & admin login

Full application workflow (submit → view → cancel)

Admin review dashboard

File upload (PDF CV)

Dynamic internship categories

Slot decrement + restore

🎯 Future Enhancements

Email notifications

Analytics dashboard for admins

Cloud image hosting (Cloudinary)

University SSO login integration
