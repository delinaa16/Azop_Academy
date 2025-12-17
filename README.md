AZOP Academy – Backend API
Node.js • Express.js • MongoDB

This repository contains the backend API for AZOP Academy, designed to manage teachers, academic programs, gallery assets, and contact inquiries. The system provides secure data handling, structured routing, file uploads, and a modular architecture suitable for production environments.
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
Create a .env file in the project root:

PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017/kindergarten
APP_NAME=AZOP Academy
DEBUG_MODE=true


3. Run the Development Server
npm start


API Base URL

http://localhost:5000/api
"Features updated and stabilized." 
