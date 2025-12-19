# Azop Academy Backend API Documentation

## Overview
This backend API provides comprehensive functionality for managing Azop Academy's teachers, programs, gallery, contacts, waitlist, analytics, and more.

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most admin endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-token>
```

---

## 📚 Table of Contents
1. [Teachers API](#teachers-api)
2. [Programs API](#programs-api)
3. [Gallery API](#gallery-api)
4. [Contact API](#contact-api)
5. [Waitlist API](#waitlist-api)
6. [Analytics API](#analytics-api)
7. [Export API](#export-api)
8. [Settings API](#settings-api)
9. [Admin API](#admin-api)

---

## Teachers API

### Get All Teachers
```
GET /api/teachers
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `search` (string): Search in name, subject, bio
- `name` (string): Filter by name (regex)
- `subject` (string): Filter by subject (regex)
- `isActive` (boolean): Filter by active status
- `sort` (string): Sort field and order (e.g., `name:asc`, `createdAt:desc`)
- `raw` (boolean): Return array instead of paginated object

**Response:**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Get Teacher by ID
```
GET /api/teachers/:id
```

### Create Teacher
```
POST /api/teachers
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- name (string, required)
- subject (string, required)
- experience (string, required)
- bio (string, optional)
- photo (file, optional)
- isActive (boolean, optional)
- order (number, optional)
```

### Update Teacher
```
PUT /api/teachers/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body: (all fields optional)
- name, subject, experience, bio, isActive, order
- photo (file)
```

### Bulk Update Teachers
```
PATCH /api/teachers/bulk/update
Authorization: Bearer <token>

Body:
{
  "ids": ["id1", "id2"],
  "updateData": {
    "isActive": false
  }
}
```

### Reorder Teachers
```
PATCH /api/teachers/reorder
Authorization: Bearer <token>

Body:
{
  "orderMap": {
    "teacherId1": 1,
    "teacherId2": 2
  }
}
```

### Get Teacher Statistics
```
GET /api/teachers/stats
Authorization: Bearer <token>
```

### Delete Teacher
```
DELETE /api/teachers/:id
Authorization: Bearer <token>
```

### Delete All Teachers
```
DELETE /api/teachers
Authorization: Bearer <token>
```

---

## Programs API

### Get All Programs
```
GET /api/programs?page=1&limit=10&title=search&sort=createdAt:desc
```

### Get Program by ID
```
GET /api/programs/:id
```

### Create Program
```
POST /api/programs
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- title (string, required)
- description (string, optional)
- duration (string, optional)
- image (file, optional)
- isActive (boolean, optional)
- order (number, optional)
```

### Update Program
```
PUT /api/programs/:id
Authorization: Bearer <token>
```

### Bulk Update Programs
```
PATCH /api/programs/bulk/update
Authorization: Bearer <token>

Body:
{
  "ids": ["id1", "id2"],
  "updateData": { "isActive": true }
}
```

### Delete Program
```
DELETE /api/programs/:id
Authorization: Bearer <token>
```

---

## Waitlist API

### Create Waitlist Entry (Public)
```
POST /api/waitlist

Body:
{
  "studentName": "John Doe",
  "parentEmail": "parent@example.com",
  "phone": "1234567890",
  "programInterest": "Math Program",
  "message": "Interested in enrollment"
}
```

### Get All Waitlist Entries (Admin)
```
GET /api/waitlist?page=1&limit=10&status=pending&search=john&sort=priority:desc
Authorization: Bearer <token>

Query Parameters:
- page, limit, search, sort
- status: pending|contacted|enrolled|declined
- priority: number
- programInterest: string
- startDate, endDate: ISO date strings
```

### Get Waitlist Statistics
```
GET /api/waitlist/stats
Authorization: Bearer <token>
```

### Get Pending Waitlist (Priority Sorted)
```
GET /api/waitlist/pending?page=1&limit=10
Authorization: Bearer <token>
```

### Update Waitlist Entry
```
PUT /api/waitlist/:id
Authorization: Bearer <token>

Body:
{
  "status": "contacted",
  "priority": 5,
  "notes": "Called parent on 2025-01-15"
}
```

### Bulk Update Waitlist
```
PATCH /api/waitlist/bulk/update
Authorization: Bearer <token>

Body:
{
  "ids": ["id1", "id2"],
  "updateData": { "status": "contacted" }
}
```

### Delete Waitlist Entry
```
DELETE /api/waitlist/:id
Authorization: Bearer <token>
```

---

## Analytics API

### Get Dashboard Statistics
```
GET /api/analytics/dashboard
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "overview": {
      "teachers": { "total": 10, "active": 8 },
      "programs": { "total": 5, "active": 4 },
      "gallery": { "entries": 20, "totalImages": 150 },
      "contacts": 50,
      "waitlist": 30
    },
    "recentActivity": {
      "last30Days": {...},
      "last7Days": {...}
    },
    "breakdowns": {
      "contactStatus": [...],
      "waitlistStatus": [...],
      "teachersBySubject": [...]
    }
  }
}
```

### Get Activity Trends
```
GET /api/analytics/trends?days=30
Authorization: Bearer <token>
```

### Get Program Analytics
```
GET /api/analytics/programs
Authorization: Bearer <token>
```

---

## Export API

### Export Teachers to CSV
```
GET /api/export/teachers/csv
Authorization: Bearer <token>
```

### Export Programs to CSV
```
GET /api/export/programs/csv
Authorization: Bearer <token>
```

### Export Contacts to CSV
```
GET /api/export/contacts/csv
Authorization: Bearer <token>
```

### Export Waitlist to CSV
```
GET /api/export/waitlist/csv
Authorization: Bearer <token>
```

### Export Data as JSON
```
GET /api/export/:type/json
Authorization: Bearer <token>

Types: teachers, programs, contacts, waitlist, gallery
```

---

## Settings API

### Get All Settings
```
GET /api/settings?category=general&format=object
Authorization: Bearer <token>

Query Parameters:
- category: Filter by category
- format: "object" returns key-value pairs
```

### Get Setting by Key
```
GET /api/settings/:key
Authorization: Bearer <token>
```

### Create/Update Setting
```
POST /api/settings
Authorization: Bearer <token>

Body:
{
  "key": "academy_name",
  "value": "Azop Academy",
  "description": "Name of the academy",
  "category": "general"
}
```

### Bulk Update Settings
```
PUT /api/settings/bulk
Authorization: Bearer <token>

Body:
{
  "settings": [
    { "key": "setting1", "value": "value1" },
    { "key": "setting2", "value": "value2" }
  ]
}
```

### Delete Setting
```
DELETE /api/settings/:key
Authorization: Bearer <token>
```

---

## Advanced Query Features

### Pagination
All list endpoints support pagination:
```
?page=1&limit=20
```

### Sorting
Sort by any field with direction:
```
?sort=name:asc
?sort=createdAt:desc
?sort=name:asc,createdAt:desc  (multiple sorts)
```

### Advanced Filtering
Use MongoDB-style operators:
```
?isActive=true
?order[gte]=5
?order[lte]=10
?status[in]=pending,contacted
?status[nin]=declined
```

### Text Search
Search across multiple fields:
```
?search=john
```

### Date Range
Filter by date range:
```
?startDate=2025-01-01&endDate=2025-01-31
```

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error message",
  "errors": [...] // Optional, for validation errors
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error
- `503` - Service Unavailable (Database not connected)

---

## Examples

### Example: Get paginated teachers with search
```bash
curl "http://localhost:5000/api/teachers?page=1&limit=10&search=math&sort=name:asc"
```

### Example: Create waitlist entry
```bash
curl -X POST http://localhost:5000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "Jane Doe",
    "parentEmail": "parent@example.com",
    "phone": "1234567890",
    "programInterest": "Science Program"
  }'
```

### Example: Bulk update teachers
```bash
curl -X PATCH http://localhost:5000/api/teachers/bulk/update \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "ids": ["id1", "id2"],
    "updateData": { "isActive": true }
  }'
```

---

## Notes

- All timestamps are in ISO 8601 format
- File uploads use `multipart/form-data`
- Pagination defaults: page=1, limit=10
- Maximum limit: 100 items per page
- All admin endpoints require authentication
- Waitlist creation is public (no auth required)

