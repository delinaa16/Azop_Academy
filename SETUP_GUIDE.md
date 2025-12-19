# 🚀 Setup Guide - Azop Kindergarten

## **Prerequisites**

Before starting, make sure you have:

1. **Node.js** installed (version 14 or higher)
   - Download from: https://nodejs.org/
   - Check version: `node --version`

2. **MongoDB** installed and running
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas
   - Check if running: MongoDB should be running on `localhost:27017`

---

## **Step-by-Step Setup**

### **Step 1: Install Dependencies**

Open terminal/command prompt in the project folder and run:

```bash
cd backend-mongoose
npm install
```

This will install all required packages (Express, Mongoose, etc.)

---

### **Step 2: Configure Environment Variables**

1. **Create `.env` file** in `backend-mongoose/` folder
2. **Copy** the content from `env.example.txt` or create it with:

```env
PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017/azop_academy
JWT_SECRET=your_super_secret_jwt_key_change_this_to_something_random
```

**Important:** Change `JWT_SECRET` to a long random string for security!

---

### **Step 3: Start MongoDB**

#### **Option A: Local MongoDB**
Make sure MongoDB is running:
```bash
# Windows (if installed as service, it should auto-start)
# Or start manually:
mongod

# Mac/Linux
sudo systemctl start mongod
# or
mongod
```

#### **Option B: MongoDB Atlas (Cloud)**
If using MongoDB Atlas, update `MONGO_URL` in `.env`:
```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/azop_academy
```

---

### **Step 4: Create Admin Account (Easiest Method - No Postman Needed!)**

**Just run this script:**
```bash
node scripts/createAdmin.js
```

This will automatically create an admin account with:
- Username: `admin`
- Password: `admin123`

**To use custom credentials:**
```bash
node scripts/createAdmin.js your_username your_password
```

**Alternative Methods (if you prefer):**

#### **Method 1: Browser Console** (No Postman needed)
1. Start server: `npm start`
2. Open browser: `http://localhost:5000`
3. Press F12 to open console
4. Paste and run:
```javascript
fetch('/api/admin/register-first', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123' })
}).then(r => r.json()).then(console.log)
```

#### **Method 2: Using curl** (Command Line)
```bash
curl -X POST http://localhost:5000/api/admin/register-first \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

### **Step 5: Add Teachers**

Run the script to add all teachers:
```bash
node scripts/addTeachers.js
```

You should see:
```
✓ Connected to MongoDB
✓ Added: Miss Ayalnesh Dagne - KG1 - Main Teacher
✓ Added: Miss Tirfewerk Dechasa - KG1 - Main Teacher
...
✓ Successfully added 8 teachers!
```

---

### **Step 6: Add Programs**

Run the script to add all programs:
```bash
node scripts/addKindergartenPrograms.js
```

You should see:
```
✓ Connected to MongoDB
✓ Added: አማርኛ (Amharic)
✓ Added: ሂሳብ (Math)
...
✓ Successfully added programs!
```

---

### **Step 7: Upload Student Photos (Optional)**

1. **Copy all student photos** to: `backend-mongoose/uploads/images/`

2. **Run the registration script:**
```bash
node scripts/registerImages.js
```

This will register all images in the gallery.

---

### **Step 8: Start the Server**

```bash
# Production mode
npm start

# Development mode (auto-restart on changes)
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected Successfully
```

---

### **Step 9: Open Your Website**

Open your browser and go to:
```
http://localhost:5000
```

Your kindergarten website is now running! 🎉

---

## **Quick Command Reference**

```bash
# Install dependencies
cd backend-mongoose
npm install

# Start server
npm start          # Production
npm run dev        # Development (auto-restart)

# Add data (run these after server is set up)
node scripts/addTeachers.js
node scripts/addKindergartenPrograms.js
node scripts/registerImages.js  # After copying photos
```

---

## **Troubleshooting**

### **Error: MongoDB connection failed**
- Make sure MongoDB is running
- Check `MONGO_URL` in `.env` file
- Try: `mongod` to start MongoDB manually

### **Error: Port 5000 already in use**
- Change `PORT` in `.env` file to another number (e.g., 5001)
- Or stop the process using port 5000

### **Error: Cannot find module**
- Run `npm install` again
- Make sure you're in `backend-mongoose/` folder

### **Teachers/Programs not showing**
- Make sure you ran the scripts: `addTeachers.js` and `addKindergartenPrograms.js`
- Check MongoDB is connected
- Refresh the browser

### **Images not loading**
- Make sure images are in `backend-mongoose/uploads/images/`
- Check file permissions
- Make sure server is running

---

## **What's Next?**

1. ✅ Server running on `http://localhost:5000`
2. ✅ Admin account created
3. ✅ Teachers added
4. ✅ Programs added
5. ✅ Student photos uploaded (optional)

**Your Azop Kindergarten website is ready! 🎉**

---

## **Need Help?**

- Check `API_DOCUMENTATION.md` for API endpoints
- Check `STUDENT_PHOTOS_GUIDE.md` for photo upload help
- Make sure MongoDB is running
- Check server logs for errors

