# 📸 Upload Guide for Azop Kindergarten

## Overview
This guide will help you prepare and upload all the images and content needed for your kindergarten website.

---

## 📁 Folder Structure

All images should be placed in:
```
backend-mongoose/uploads/images/
```

---

## 🎨 **1. TEACHER PHOTOS**

### What to Upload:
- **Professional photos** of each teacher
- **Friendly, warm expressions** (smiling, approachable)
- **Clear, well-lit photos** (good lighting, not blurry)
- **Consistent style** (similar backgrounds or settings)

### Specifications:
- **Format**: JPG, PNG, or WebP
- **Size**: Recommended 800x800px to 1200x1200px (square or portrait)
- **File Size**: Under 2MB per image
- **Naming**: Name files descriptively (e.g., `teacher-mary-smith.jpg`)

### Examples:
- Teacher standing in classroom
- Teacher reading to children
- Teacher with a warm smile
- Headshot or half-body shot

### How Many:
- **1 photo per teacher** (you can add more teachers later)

---

## 🎯 **2. PROGRAM/ACTIVITY IMAGES**

### What to Upload:
Images representing different kindergarten programs and activities:

#### **Core Programs:**
1. **Play-Based Learning**
   - Children playing with blocks, puzzles, toys
   - Kids engaged in imaginative play
   - Learning through play activities

2. **Arts & Crafts**
   - Children painting, drawing, creating
   - Artwork displays
   - Craft activities

3. **Story Time & Reading**
   - Teacher reading to children
   - Kids with books
   - Reading corner/library area

4. **Music & Movement**
   - Children dancing, singing
   - Music activities
   - Movement exercises

5. **Outdoor Play**
   - Playground activities
   - Outdoor games
   - Nature exploration

6. **Math & Numbers**
   - Counting activities
   - Number games
   - Math manipulatives

7. **Science Exploration**
   - Simple science experiments
   - Nature observations
   - Discovery activities

8. **Social Skills**
   - Children playing together
   - Group activities
   - Sharing and cooperation

### Specifications:
- **Format**: JPG, PNG, or WebP
- **Size**: Recommended 1200x800px (landscape) or 800x1200px (portrait)
- **File Size**: Under 3MB per image
- **Naming**: Descriptive (e.g., `program-arts-crafts.jpg`)

### How Many:
- **1-2 images per program** (8-16 images total)

---

## 📸 **3. STUDENT GALLERY PHOTOS**

### What to Upload:
Candid, joyful photos of children engaged in various activities:

#### **Categories:**

1. **Daily Activities**
   - Children during circle time
   - Snack time
   - Free play moments
   - Learning activities

2. **Special Events**
   - Birthday celebrations
   - Holiday activities
   - Field trips
   - Performances

3. **Artwork & Creations**
   - Children's drawings
   - Craft projects
   - Art displays
   - Creative work

4. **Play & Fun**
   - Playground fun
   - Games and activities
   - Laughing and playing
   - Happy moments

5. **Learning Moments**
   - Focused learning
   - Teacher-student interaction
   - Group learning
   - Discovery moments

6. **Friendship & Social**
   - Children playing together
   - Helping each other
   - Group activities
   - Friendship moments

### Important Notes:
- **Get parent permission** before uploading children's photos
- **No identifying information** visible (names, addresses)
- **Focus on activities**, not individual children's faces (or get consent)
- **Diverse representation** of activities and children

### Specifications:
- **Format**: JPG, PNG, or WebP
- **Size**: Recommended 1200x1200px (square) or 1200x800px (landscape)
- **File Size**: Under 3MB per image
- **Naming**: Descriptive (e.g., `gallery-artwork-2025.jpg`)

### How Many:
- **20-50+ images** for a good gallery
- More is better! You can organize them into sets

---

## 🏫 **4. CLASSROOM & FACILITY PHOTOS**

### What to Upload:

1. **Classroom Spaces**
   - Main classroom areas
   - Reading corners
   - Play areas
   - Learning centers

2. **Facilities**
   - Playground
   - Outdoor areas
   - Restrooms (if showcasing)
   - Common areas

3. **Safety Features**
   - Child-safe furniture
   - Safety equipment
   - Clean, organized spaces

### Specifications:
- **Format**: JPG, PNG
- **Size**: 1200x800px (landscape)
- **File Size**: Under 3MB per image

### How Many:
- **5-10 facility images**

---

## 📝 **5. CONTENT TO PREPARE**

### Teachers Information:
For each teacher, prepare:
- **Name**: Full name
- **Subject/Area**: e.g., "Early Childhood Education", "Arts & Crafts", "Music"
- **Experience**: e.g., "5 years teaching kindergarten", "Certified Early Childhood Educator"
- **Bio** (optional): Short description of their teaching style or background

### Programs Information:
For each program, prepare:
- **Title**: e.g., "Play-Based Learning", "Arts & Crafts", "Story Time"
- **Description**: What children will learn/do (2-3 sentences)
- **Duration**: e.g., "Full Day", "Half Day", "3 hours"
- **Age Group**: e.g., "Ages 3-4", "Ages 4-5", "Ages 5-6"

---

## 🚀 **HOW TO UPLOAD**

### Option 1: Using the Script (Recommended for Many Images)

1. **Place all images** in `backend-mongoose/uploads/images/`
2. **Run the registration script**:
   ```bash
   cd backend-mongoose
   node scripts/registerImages.js
   ```

### Option 2: Using the API (For Individual Uploads)

1. **Login as admin**:
   ```bash
   POST /api/admin/login
   Body: { "username": "your-username", "password": "your-password" }
   ```

2. **Upload images**:
   - Teachers: `POST /api/teachers` (with photo file)
   - Programs: `POST /api/programs` (with image file)
   - Gallery: `POST /api/gallery` (with images array)

### Option 3: Manual Database Entry

After placing images in the folder, use the API to create entries referencing the filenames.

---

## ✅ **CHECKLIST**

Before uploading, make sure:

- [ ] All images are properly named
- [ ] Images are optimized (not too large)
- [ ] You have parent permission for student photos
- [ ] Teacher information is prepared
- [ ] Program descriptions are ready
- [ ] Images are in the correct folder (`backend-mongoose/uploads/images/`)

---

## 📊 **RECOMMENDED QUANTITIES**

| Content Type | Minimum | Recommended | Maximum |
|-------------|---------|-------------|---------|
| Teacher Photos | 3 | 5-10 | 20+ |
| Program Images | 4 | 8-12 | 20+ |
| Gallery Photos | 20 | 50-100 | 200+ |
| Facility Photos | 3 | 5-10 | 15+ |

---

## 🎨 **IMAGE QUALITY TIPS**

1. **Lighting**: Use natural light when possible
2. **Composition**: Focus on children's activities, not just faces
3. **Variety**: Mix close-ups and wide shots
4. **Emotions**: Capture joy, curiosity, engagement
5. **Safety**: Ensure no unsafe situations are visible
6. **Privacy**: Blur or avoid showing other children's faces if needed

---

## 🔒 **PRIVACY & CONSENT**

- **Always get written consent** from parents before uploading children's photos
- **Consider privacy settings** - you may want to password-protect the gallery
- **Don't include**:
  - Full names visible in photos
  - Addresses or location markers
  - Personal information
  - Photos of children without consent

---

## 📞 **NEED HELP?**

If you need assistance with:
- Bulk uploading images
- Organizing gallery sets
- Creating program entries
- Setting up teacher profiles

Refer to the `API_DOCUMENTATION.md` file for detailed API endpoints.

---

**Happy uploading! Your kindergarten website will look amazing! 🎉**

