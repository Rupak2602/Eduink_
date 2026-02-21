# Quick Reference - Notes Feature

## For Students 👨‍🎓

### How to Access Notes:
1. Go to `http://localhost:3000` → Class → Subject
2. Click the **"Notes"** button (middle button)
3. View all available study materials
4. Click **"📄 Open PDF"** to download

### What You'll Find:
- Study notes for each subject
- PDF files ready to download
- Clean, organized layout
- Easy back button to return

---

## For Admins 👨‍💼

### How to Upload Notes:

#### Step 1: Login
```
URL: http://localhost:3000/admin
Password: admin12345
```

#### Step 2: Go to Upload Page
Click "Back to Dashboard" → Click "Upload" in navigation

#### Step 3: Upload Notes
Scroll down to **"📚 Upload Study Notes"** section

#### Step 4: Fill Form
| Field | Example | Format |
|-------|---------|--------|
| Subject | Physics, Chemistry, Math | Text |
| Notes Title | Chapter 1: Mechanics | Text |
| PDF File | Select file | PDF only |

#### Step 5: Click "Upload Notes"
✅ Success message = File uploaded

#### Step 6: Verify
- Go to `http://localhost:3000`
- Select Class → Subject
- Click "Notes" button
- Your uploaded note appears!

---

## API Reference 🔌

### Get Notes
```bash
GET /api/notes/Physics
```

**Response:**
```json
[
  {
    "id": 1708345200000,
    "subject": "Physics",
    "title": "Chapter 1: Mechanics",
    "fileUrl": "https://...",
    "uploadedAt": "2025-02-20T..."
  }
]
```

### Upload Notes
```bash
POST /api/upload-notes
Content-Type: multipart/form-data

Body:
- subject: "Physics"
- title: "Chapter 1"
- file: (PDF file)
```

**Response:**
```json
{
  "success": true,
  "message": "Notes uploaded successfully",
  "data": { ...note info... }
}
```

---

## Files & Locations 📁

### Student Pages
- 📖 View Notes: `/public/notes.html`
- 📋 Choose Subjects: `/public/subjects.html` (modified)

### Admin Pages
- 📤 Upload Notes: `/public/admin/upload.html` (modified)

### Backend
- 🔧 API Routes: `/server.js` (modified)
- 🗂️ Notes Data: In-memory array `notesData`

---

## Styling 🎨

### Notes Button
- **Color:** Purple gradient (reversed)
- **Hover:** Glows with strong shadow
- **Position:** Centered between other buttons

### Notes Page
- **Theme:** White cards with glass effect
- **Layout:** Responsive grid (1-3 columns)
- **Animation:** Smooth fade-in (0.6s)

---

## Important Notes ⚠️

✏️ **Default Admin Password:** `admin12345`
- Change before going to production!
- Located in: `/public/admin/login.html` (line 1)

📱 **Mobile Friendly:**
- Notes page is fully responsive
- Works on phones, tablets, desktops

🔒 **File Security:**
- Only PDF files allowed for notes
- Max file size: 50MB
- Files stored in Supabase (public bucket)

---

## Troubleshooting 🔧

| Problem | Solution |
|---------|----------|
| Notes page blank | Admin hasn't uploaded notes yet |
| Upload fails | Select PDF file (not image) |
| Button not visible | Refresh page with Ctrl+F5 |
| Can't login | Check password (case-sensitive) |
| Server won't start | Kill node.exe, run npm start |

---

## Testing Workflow 🧪

### Test as Student:
1. Start server: `npm start`
2. Go to: `http://localhost:3000`
3. Select Class → Subject
4. Click "Notes" button
5. ✅ See empty state (no notes uploaded)

### Test as Admin:
1. Go to: `http://localhost:3000/admin`
2. Login with password: `admin12345`
3. Click "Upload" in navigation
4. Scroll to "📚 Upload Study Notes"
5. Upload a test PDF
6. ✅ Success message appears

### Test as Student (Verify):
1. Refresh Notes page
2. ✅ New note appears in grid
3. Click "📄 Open PDF"
4. ✅ PDF opens in new tab

---

## Database Schema 📊

**Planned for Supabase:**
```sql
CREATE TABLE notes (
  id uuid PRIMARY KEY,
  subject text,
  title text,
  file_url text,
  file_name text,
  created_at timestamp
);
```

**Currently:** In-memory array
- Persists while server running
- Resets on server restart

---

## URLs Cheat Sheet 🔗

| Page | URL | User |
|------|-----|------|
| Home | `/` | Student |
| Classes | `/class.html` | Student |
| Subjects | `/subjects.html?class=10th` | Student |
| **Notes** | `/notes.html?subject=Physics` | Student |
| Questions | `/question.html?class=10th&subject=Physics` | Student |
| Videos | `/video.html?class=10th&subject=Physics` | Student |
| Admin Login | `/admin` | Admin |
| Admin Upload | `/admin/upload` | Admin |
| API: Get Notes | `/api/notes/:subject` | Both |
| API: Upload Notes | `/api/upload-notes` | Admin |

---

## Quick Commands 💻

### Start Server
```bash
cd "c:\Users\rupak\Desktop\project 70\eduink"
npm start
```

### Kill Node Process (if stuck)
```bash
taskkill /F /IM node.exe
```

### Check if Working
```bash
curl http://localhost:3000
```

---

## Next Enhancements 🚀

- [ ] Add notes search feature
- [ ] Add note preview thumbnails
- [ ] Add student bookmarks
- [ ] Add note ratings/reviews
- [ ] Move to Supabase database
- [ ] Add note edit/delete admin features
- [ ] Add download counter
- [ ] Add upload date display

---

**Last Updated:** February 20, 2026
**Version:** Eduink Notes v1.0
**Status:** ✅ Ready to Use
