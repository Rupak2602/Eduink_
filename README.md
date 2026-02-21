# Eduink - Full-Stack Educational Platform

A clean, modern educational website built with vanilla HTML, CSS, JavaScript, Node.js, and Supabase. Perfect for students to access question papers and video lectures organized by class and subject.

## 🎯 Features

- ✨ **Glassmorphism UI Design** - Modern, clean interface with blur effects
- 📚 **Class-Based Organization** - Classes 9th to 12th
- 📖 **Subject Management** - Multiple subjects per class
- 📝 **Question Bank** - PDF and image question papers
- 🎥 **Video Classes** - Embedded YouTube videos
- 👨‍💼 **Admin Panel** - Easy content management
- 📱 **Responsive Design** - Works on all devices
- ✅ **No Frameworks** - Pure vanilla JavaScript
- 🔐 **Secure Storage** - Supabase integration

## 🛠️ Tech Stack

**Frontend:**
- HTML5
- CSS3 (Glassmorphism + Animations)
- Vanilla JavaScript

**Backend:**
- Node.js
- Express.js
- Multer (File uploads)

**Database & Storage:**
- Supabase (Database)
- Supabase Storage (File storage)

## 📁 Project Structure

```
eduink/
├── public/
│   ├── index.html          # Landing page
│   ├── class.html          # Class selection
│   ├── subjects.html       # Subject listing
│   ├── question.html       # Question bank
│   ├── video.html          # Video classes
│   ├── admin.html          # Admin panel
│   ├── developer.html      # Developer info
│   ├── style.css           # Main stylesheet
│   └── script.js           # Shared frontend logic
├── server.js               # Express server
├── package.json            # Dependencies
├── .env                    # Environment variables
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/eduink.git
   cd eduink
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Project Settings → API
   - Copy your Project URL and Anon Key

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   PORT=3000
   ```

5. **Create Supabase Storage Bucket**
   - In Supabase dashboard, go to Storage
   - Create new bucket named `question-papers`
   - Make it public

6. **Start the server**
   ```bash
   npm start
   ```

7. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📚 Usage

### Admin Panel
- Visit `http://localhost:3000/admin.html`
- Default password: `admin12345` ⚠️ Change this before production!
- Upload question papers, add subjects, and add video links

### User Flow
1. Click "Get Enter" on homepage
2. Select your class (9th, 10th, 11th, 12th)
3. Choose a subject
4. Access Question Bank or Video Classes
5. View/download materials

## 🔌 API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/classes` | Get all available classes |
| GET | `/api/subjects/:class` | Get subjects for a class |
| GET | `/api/questions/:subject` | Get questions for a subject |
| GET | `/api/videos/:subject` | Get videos for a subject |

### Admin Endpoints (POST)

| Endpoint | Purpose |
|----------|---------|
| `/api/upload-question` | Upload question paper |
| `/api/add-subject` | Add new subject |
| `/api/add-video` | Add video link |

**Example API Call:**
```javascript
// Get subjects for class 10th
fetch('/api/subjects/10th')
  .then(res => res.json())
  .then(data => console.log(data));
```

## 🎨 Customization

### Change Admin Password
Edit `public/admin.html` and update:
```javascript
const ADMIN_PASSWORD = 'your_new_password';
```

### Change Colors
Edit `public/style.css` and modify the gradient colors:
```css
.btn-glow {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Change Port
Update `.env`:
```
PORT=5000
```

## 📖 File Descriptions

### HTML Files
- **index.html** - Landing page with hero section and call-to-action button
- **class.html** - Class selection (9-12)
- **subjects.html** - Displays subjects for selected class (fetches from API)
- **question.html** - Shows question papers with download/preview options
- **video.html** - Embeds YouTube video lectures
- **admin.html** - Content management dashboard
- **developer.html** - Developer information and API documentation

### CSS & JS
- **style.css** - Complete styling with animations and responsive design
- **Server.js** - Express backend with API routes
- Frontend logic is inline in HTML files (kept simple)

## 🔒 Security Notes

⚠️ **Before Production:**
1. Change admin password in `admin.html`
2. Use environment variables for sensitive data
3. Never commit `.env` file to version control
4. Implement proper authentication (JWT tokens recommended)
5. Add rate limiting to API endpoints
6. Use HTTPS in production

## 🐛 Troubleshooting

### Port already in use
```bash
# Use a different port
PORT=3001 npm start
```

### Cannot connect to Supabase
- Check your `.env` file has correct credentials
- Verify Supabase project is active
- Check internet connection

### File upload not working
- Ensure `question-papers` bucket exists in Supabase
- Check bucket is set to public
- Verify file size is under 50MB

## 📦 Dependencies

```json
{
  "express": "^4.18.2",
  "dotenv": "^16.3.1",
  "@supabase/supabase-js": "^2.38.4",
  "multer": "^1.4.5-lts.1"
}
```

## 🤝 Contributing

Feel free to fork, modify, and improve this project!

## 📝 License

MIT License - feel free to use this project for personal and commercial purposes.

## 👨‍💻 Author

**Eduink Development Team**  
Created: February 2026

---

**Made with ❤️ for students everywhere**
