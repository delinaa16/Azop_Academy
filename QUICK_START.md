# ⚡ Quick Start Guide

## **5-Minute Setup**

### **1. Install Dependencies**
```bash
cd backend-mongoose
npm install
```

### **2. Create `.env` File**
Create `backend-mongoose/.env`:
```env
PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017/azop_academy
JWT_SECRET=change_me_to_a_long_random_secret
```

### **3. Start MongoDB**
Make sure MongoDB is running on your computer.

### **4. Start Server**
```bash
npm start
```

### **5. Create Admin** (Easiest - Just run script!)
```bash
node scripts/createAdmin.js
```

**Or use browser console** (no Postman needed):
1. Start server: `npm start`
2. Open `http://localhost:5000`
3. Press F12, paste in console:
```javascript
fetch('/api/admin/register-first', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123' })
}).then(r => r.json()).then(console.log)
```

### **6. Add Data**
```bash
# In a new terminal (keep server running)
cd backend-mongoose
node scripts/addTeachers.js
node scripts/addKindergartenPrograms.js
```

### **7. Open Website**
Go to: `http://localhost:5000`

**Done! 🎉**

---

## **For Student Photos**

1. Copy photos to: `backend-mongoose/uploads/images/`
2. Run: `node scripts/registerImages.js`

---

## **Common Issues**

- **MongoDB not running?** Start it: `mongod`
- **Port in use?** Change `PORT` in `.env`
- **Module not found?** Run `npm install`

See `SETUP_GUIDE.md` for detailed help!

