AZOP Academy – Full Stack (Frontend + Backend)
Node.js • Express.js • MongoDB • Vanilla JS + Bootstrap

This repository contains both the **backend API** and a **modern single-page frontend** for AZOP Academy. The backend manages teachers, programs, gallery assets, and contact inquiries, and also serves the frontend UI so everything runs from a single URL.
Features

Teachers Module

Create teacher profiles with photo upload
Retrieve all teacher records
Programs Module
Create programs with image upload
Retrieve all program records

Gallery Module
Upload multiple images
Retrieve all gallery items

Contact Module
Submit contact messages
Retrieve contact submissions for administrative purposes
Mark messages as read / archive / delete (admin-protected)

Admin Auth
Create the first admin (one-time)
Login to get a JWT token for protected routes

File Upload System
Image uploads using Multer
Server-side validation for MIME types
Static hosting of uploaded files

Error Handling
Centralized Express error-handling middleware
Consistent structured JSON error responses

Technology Stack
Node.js
Express.js
MongoDB & Mongoose
Multer (file uploads)
CORS
Dotenv

Nodemon (development only)
Project Structure

AZOP_Academy/

├── config/
│   └── db.js

├── controllers/
│   ├── teacherController.js
│   ├── programController.js
│   ├── galleryController.js
│   └── contactController.js

├── middleware/
│   ├── upload.js
│   └── errorHandler.js

├── models/
│   ├── Teacher.js
│   ├── Program.js
│   ├── Gallery.js
│   └── Contact.js

├── routes/
│   ├── teacherRoutes.js
│   ├── programRoutes.js
│   ├── galleryRoutes.js
│   └── contactRoutes.js

├── uploads/        (auto-generated; stores uploaded images)

├── server.js

└── README.md


Installation & Setup

1. Install Dependencies
npm install

2. Environment Variables
Create a `.env` file inside `backend-mongoose/` (see `backend-mongoose/env.example.txt`):

PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017/kindergarten
APP_NAME=AZOP Academy
DEBUG_MODE=true


3. Install backend deps (first time)

Run in `backend-mongoose/`:

npm install

4. Run the server

From the repo root:

npm start

Or from `backend-mongoose/`:

npm run dev


API Base URL

http://localhost:5000/api
"Features updated and stabilized."

Frontend URL

Open the app at:

http://localhost:5000/

Admin Setup (first run)

Create the first admin account (only works if no admin exists yet):

POST /api/admin/register-first
{ "username": "admin", "password": "admin123" }
"Features updated and stabilized." 
