# 🎒 Quick Upload Checklist - Azop Kindergarten

## 📍 **WHERE TO PUT IMAGES**
```
backend-mongoose/uploads/images/
```

---

## ✅ **WHAT TO UPLOAD**

### 1️⃣ **TEACHER PHOTOS** (5-10 images)
- ✅ Friendly, professional photos
- ✅ Teachers smiling, with children, or in classroom
- ✅ Size: 800x800px to 1200x1200px
- ✅ Format: JPG or PNG

**Example subjects:**
- Teacher reading to kids
- Teacher helping with activities
- Warm, approachable headshots

---

### 2️⃣ **PROGRAM IMAGES** (8-12 images)
One image per program/activity:

1. **Play-Based Learning** - Kids playing with toys/blocks
2. **Arts & Crafts** - Children painting/drawing
3. **Story Time** - Reading activities
4. **Music & Movement** - Dancing, singing
5. **Outdoor Play** - Playground activities
6. **Math & Numbers** - Counting games
7. **Science Exploration** - Simple experiments
8. **Social Skills** - Kids playing together

**Size:** 1200x800px (landscape) or 800x1200px (portrait)

---

### 3️⃣ **STUDENT GALLERY** (50-100+ images)
Photos of children in various activities:

**Categories:**
- Daily activities (circle time, snack, play)
- Artwork & creations
- Special events (birthdays, holidays)
- Learning moments
- Play & fun
- Friendship moments

**⚠️ IMPORTANT:** Get parent permission before uploading!

**Size:** 1200x1200px or 1200x800px

---

### 4️⃣ **FACILITY PHOTOS** (5-10 images)
- Classroom spaces
- Playground
- Reading corners
- Learning centers
- Outdoor areas

**Size:** 1200x800px

---

## 📝 **CONTENT TO PREPARE**

### **Teachers Info:**
- Name
- Subject/Area (e.g., "Early Childhood Education")
- Experience (e.g., "5 years teaching kindergarten")
- Bio (optional)

### **Programs Info:**
- Title (e.g., "Play-Based Learning")
- Description (what kids will do)
- Duration (e.g., "Full Day", "3 hours")
- Age Group (e.g., "Ages 3-4")

---

## 🚀 **HOW TO UPLOAD**

### **Quick Method (Bulk Upload):**
1. Copy all images to `backend-mongoose/uploads/images/`
2. Run: `node backend-mongoose/scripts/registerImages.js`
3. Images will be registered automatically!

### **Individual Upload (via API):**
- Use Postman or similar tool
- Login first: `POST /api/admin/login`
- Upload via endpoints (see API_DOCUMENTATION.md)

---

## 📊 **RECOMMENDED AMOUNTS**

| Type | Minimum | Good Amount |
|------|---------|-------------|
| Teachers | 3 | 5-10 |
| Programs | 4 | 8-12 |
| Gallery | 20 | 50-100 |
| Facilities | 3 | 5-10 |

---

## ⚠️ **IMPORTANT REMINDERS**

1. ✅ **Get parent consent** for student photos
2. ✅ **Optimize images** (under 3MB each)
3. ✅ **Name files clearly** (e.g., `teacher-mary.jpg`)
4. ✅ **Focus on activities**, not just faces
5. ✅ **Show diversity** in activities and children

---

## 🎯 **READY TO START?**

1. **Gather all your images**
2. **Get parent permissions** (for student photos)
3. **Organize by type** (teachers, programs, gallery)
4. **Copy to** `backend-mongoose/uploads/images/`
5. **Run the script** or use API to register

**That's it! Your kindergarten website will be ready! 🎉**

