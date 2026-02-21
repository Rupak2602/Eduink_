// ============================================
// EDUINK - EXPRESS BACKEND SERVER
// ============================================

// Import dependencies
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configure multer for file uploads
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

// ============================================
// ADMIN AUTHENTICATION MIDDLEWARE
// ============================================

/**
 * Middleware to check admin session
 * For protected admin routes
 */
const checkAdminSession = (req, res, next) => {
    // Admin routes don't need session check on backend
    // Session is managed client-side with localStorage
    // Backend just serves the pages - client handles auth
    next();
};

// ============================================
// FAVICON ROUTE
// ============================================

/**
 * GET /favicon.ico
 * Serve favicon or return 204 No Content
 */
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

// ============================================
// ADMIN ROUTES (Separate from student pages)
// ============================================

/**
 * GET /admin
 * Serve admin login page
 */
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'login.html'));
});

/**
 * GET /admin/dashboard
 * Serve admin dashboard page
 */
app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'dashboard.html'));
});

/**
 * GET /admin/upload
 * Serve admin upload page
 */
app.get('/admin/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'upload.html'));
});

// ============================================
// SAMPLE DATA (In production, use database)
// ============================================

// Initialize in-memory storage
let classesData = ['9th', '10th', '11th', '12th'];
let subjectsData = {
    '9th': ['Mathematics', 'Science', 'Social Studies', 'English', 'Hindi'],
    '10th': ['Mathematics', 'Science', 'Social Studies', 'English', 'Hindi'],
    '11th': ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English'],
    '12th': ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English']
};

let questionsData = [];
let videosData = [];
let notesData = [];

// ============================================
// API ROUTES
// ============================================

/**
 * GET /api/classes
 * Fetch all available classes
 */
app.get('/api/classes', (req, res) => {
    try {
        res.json(classesData);
    } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).json({ error: 'Error fetching classes' });
    }
});

/**
 * GET /api/subjects/:class
 * Fetch subjects for a specific class
 */
app.get('/api/subjects/:class', (req, res) => {
    try {
        const { class: classNum } = req.params;
        const subjects = subjectsData[classNum];

        if (!subjects) {
            return res.status(404).json({ error: 'Class not found' });
        }

        res.json(subjects);
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ error: 'Error fetching subjects' });
    }
});

/**
 * GET /api/questions/:subject
 * Fetch question papers for a specific subject
 */
app.get('/api/questions/:subject', (req, res) => {
    try {
        const { subject } = req.params;
        const { class: classNum } = req.query;

        // Filter questions by subject and class
        const filtered = questionsData.filter(q => 
            q.subject.toLowerCase() === subject.toLowerCase() &&
            q.class === classNum
        );

        res.json(filtered);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Error fetching questions' });
    }
});

/**
 * GET /api/videos/:subject
 * Fetch video links for a specific subject
 */
app.get('/api/videos/:subject', (req, res) => {
    try {
        const { subject } = req.params;
        const { class: classNum } = req.query;

        // Filter videos by subject and class
        const filtered = videosData.filter(v => 
            v.subject.toLowerCase() === subject.toLowerCase() &&
            v.class === classNum
        );

        res.json(filtered);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Error fetching videos' });
    }
});

/**
 * GET /api/all-subjects
 * Fetch all unique subjects from in-memory storage
 * Used to populate subject dropdown in admin panel
 */
app.get('/api/all-subjects', (req, res) => {
    try {
        // Collect all unique subjects from all classes
        const allSubjects = new Set();
        
        Object.values(subjectsData).forEach(subjects => {
            subjects.forEach(subject => {
                allSubjects.add(subject);
            });
        });

        res.json(Array.from(allSubjects).sort());
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ error: 'Error fetching subjects' });
    }
});

/**
 * GET /api/notes/:class/:subject
 * Fetch study notes for a specific class and subject from Supabase
 * Returns: array of note objects with title, caption, and file_url
 * Only notes matching BOTH class AND subject are returned
 */
app.get('/api/notes/:class/:subject', async (req, res) => {
    try {
        const { class: classParam, subject } = req.params;

        // Fetch from Supabase database
        // Filter by BOTH class and subject to ensure notes are in correct location
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('class', classParam)
            .eq('subject', subject)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase fetch error:', error);
            return res.status(500).json({ error: 'Error fetching notes' });
        }

        res.json(data || []);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Error fetching notes' });
    }
});

/**
 * GET /api/notes/:subject (legacy endpoint for backward compatibility)
 * Fetch all notes for a subject across all classes
 */
app.get('/api/notes/:subject', async (req, res) => {
    try {
        const { subject } = req.params;

        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('subject', subject)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase fetch error:', error);
            return res.status(500).json({ error: 'Error fetching notes' });
        }

        res.json(data || []);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Error fetching notes' });
    }
});

/**
 * POST /api/upload-question
 * Upload a question paper to Supabase storage
 * Required: class, subject, title, file
 */
app.post('/api/upload-question', upload.single('file'), async (req, res) => {
    try {
        const { class: classNum, subject, title } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        // Validate inputs
        if (!classNum || !subject || !title) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Get file extension
        const fileExt = path.extname(req.file.originalname);
        const fileName = `${Date.now()}_${subject}_${title}${fileExt}`;
        const filePath = `question-papers/${classNum}/${subject}/${fileName}`;

        // Upload to Supabase storage
        const { data, error: uploadError } = await supabase
            .storage
            .from('question-papers')
            .upload(filePath, req.file.buffer, {
                contentType: req.file.mimetype
            });

        if (uploadError) {
            console.error('Supabase upload error:', uploadError);
            return res.status(500).json({ 
                message: `Failed to upload file: ${uploadError.message || 'Check if bucket exists and is public'}` 
            });
        }

        // Get public URL
        const { data: publicUrlData } = supabase
            .storage
            .from('question-papers')
            .getPublicUrl(filePath);
        
        const publicUrl = publicUrlData?.publicUrl || '';

        // Store question metadata
        const questionData = {
            id: Date.now(),
            class: classNum,
            subject,
            title,
            fileUrl: publicUrl,
            fileType: fileExt === '.pdf' ? 'pdf' : 'image',
            uploadedAt: new Date().toISOString()
        };

        questionsData.push(questionData);

        res.json({ 
            success: true, 
            message: 'Question uploaded successfully',
            data: questionData 
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
            message: error.message || 'Error uploading file' 
        });
    }
});

/**
 * POST /api/add-subject
 * Add a new subject to a class
 * Required: class, name
 */
app.post('/api/add-subject', (req, res) => {
    try {
        const { class: classNum, name } = req.body;

        if (!classNum || !name) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if (!subjectsData[classNum]) {
            subjectsData[classNum] = [];
        }

        // Avoid duplicates
        if (!subjectsData[classNum].includes(name)) {
            subjectsData[classNum].push(name);
        }

        res.json({ 
            success: true, 
            message: 'Subject added successfully',
            data: { class: classNum, subject: name }
        });

    } catch (error) {
        console.error('Error adding subject:', error);
        res.status(500).json({ message: error.message || 'Error adding subject' });
    }
});

/**
 * POST /api/add-video
 * Add a video link to the database
 * Required: class, subject, title, videoUrl
 */
app.post('/api/add-video', (req, res) => {
    try {
        const { class: classNum, subject, title, videoUrl } = req.body;

        if (!classNum || !subject || !title || !videoUrl) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const videoData = {
            id: Date.now(),
            class: classNum,
            subject,
            title,
            videoUrl,
            addedAt: new Date().toISOString()
        };

        videosData.push(videoData);

        res.json({ 
            success: true, 
            message: 'Video added successfully',
            data: videoData
        });

    } catch (error) {
        console.error('Error adding video:', error);
        res.status(500).json({ message: error.message || 'Error adding video' });
    }
});

/**
 * POST /api/upload-notes
 * Upload study notes PDF to Supabase storage
 * Store metadata in notes database table with class and subject
 * 
 * Required: class, subject, title, file
 * Optional: caption
 * 
 * Process:
 * 1. Validate file is PDF
 * 2. Upload file to Supabase storage bucket
 * 3. Get public URL
 * 4. Insert metadata into notes table with class and subject
 * 5. Return success response
 */
app.post('/api/upload-notes', upload.single('file'), async (req, res) => {
    try {
        const { class: classParam, subject, title, caption } = req.body;

        // Validate file exists
        if (!req.file) {
            return res.status(400).json({ message: 'No file provided' });
        }

        // Validate required fields
        if (!classParam || !subject || !title) {
            return res.status(400).json({ message: 'Missing required fields (class, subject, title)' });
        }

        // Validate file is PDF
        if (req.file.mimetype !== 'application/pdf') {
            return res.status(400).json({ message: 'Only PDF files are allowed for notes' });
        }

        // Create unique file name with class and subject
        const fileExt = path.extname(req.file.originalname);
        const fileName = `${Date.now()}_${classParam}_${subject}_${title}${fileExt}`;
        const filePath = `question-papers/notes/${classParam}/${subject}/${fileName}`;

        // Upload file to Supabase storage
        const { data, error: uploadError } = await supabase
            .storage
            .from('question-papers')
            .upload(filePath, req.file.buffer, {
                contentType: req.file.mimetype
            });

        if (uploadError) {
            console.error('Supabase upload error:', uploadError);
            return res.status(500).json({ 
                message: `Failed to upload file: ${uploadError.message || 'Check if bucket exists and is public'}` 
            });
        }

        // Get public URL for the uploaded file
        const { data: publicUrlData } = supabase
            .storage
            .from('question-papers')
            .getPublicUrl(filePath);
        
        const fileUrl = publicUrlData?.publicUrl || '';

        // Insert note metadata into Supabase database with both class and subject
        const { data: noteData, error: dbError } = await supabase
            .from('notes')
            .insert({
                class: classParam,
                subject,
                title,
                caption: caption || null,
                file_url: fileUrl
            })
            .select();

        if (dbError) {
            console.error('Database insert error:', dbError);
            return res.status(500).json({ 
                message: `Failed to save note metadata: ${dbError.message}` 
            });
        }

        // Return success response
        res.json({
            success: true,
            message: 'Notes uploaded successfully',
            data: noteData?.[0] || {
                subject,
                title,
                caption,
                file_url: fileUrl
            }
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            message: error.message || 'Error uploading notes'
        });
    }
});

// ============================================
// FETCH ALL CONTENT (FOR MANAGE/DELETE)
// ============================================

/**
 * GET /api/all-notes
 * Fetch all notes from database
 * Used for the manage content tab
 */
app.get('/api/all-notes', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Database fetch error:', error);
            return res.status(500).json({ error: error.message || 'Failed to fetch notes' });
        }

        res.json(data || []);
    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).json({ error: error.message || 'Error fetching notes' });
    }
});

/**
 * GET /api/all-questions
 * Fetch all questions from database
 * Used for the manage content tab
 */
app.get('/api/all-questions', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('question_banks')
            .select('*')
            .order('created_at', { ascending: false });

        // If table doesn't exist, return empty array instead of error
        if (error && error.message && error.message.includes('relation')) {
            console.log('Question banks table does not exist yet');
            return res.json([]);
        }

        if (error) {
            console.error('Database fetch error:', error);
            return res.status(500).json({ error: error.message || 'Failed to fetch questions' });
        }

        res.json(data || []);
    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).json({ error: error.message || 'Error fetching questions' });
    }
});

/**
 * GET /api/all-videos
 * Fetch all videos from database
 * Used for the manage content tab
 */
app.get('/api/all-videos', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('videos')
            .select('*')
            .order('created_at', { ascending: false });

        // If table doesn't exist, return empty array instead of error
        if (error && error.message && error.message.includes('relation')) {
            console.log('Videos table does not exist yet');
            return res.json([]);
        }

        if (error) {
            console.error('Database fetch error:', error);
            return res.status(500).json({ error: error.message || 'Failed to fetch videos' });
        }

        res.json(data || []);
    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).json({ error: error.message || 'Error fetching videos' });
    }
});

// ============================================
// DELETE CONTENT ROUTES
// ============================================

/**
 * DELETE /api/delete-note/:noteId
 * Delete a note by ID
 * Removes from database and storage
 */
app.delete('/api/delete-note/:noteId', async (req, res) => {
    try {
        const { noteId } = req.params;

        // Get note details to find the file path
        const { data: note, error: fetchError } = await supabase
            .from('notes')
            .select('*')
            .eq('id', noteId)
            .single();

        if (fetchError || !note) {
            console.error('Note fetch error:', fetchError);
            return res.status(404).json({ error: 'Note not found' });
        }

        // Delete from database first
        const { error: deleteError } = await supabase
            .from('notes')
            .delete()
            .eq('id', noteId);

        if (deleteError) {
            console.error('Database delete error:', deleteError);
            return res.status(500).json({ error: deleteError.message || 'Failed to delete note' });
        }

        // Try to delete file from storage if URL exists
        if (note.file_url) {
            try {
                // Extract file path from URL or construct it
                const filePath = `notes/${note.class}/${note.subject}/${noteId}`;
                await supabase
                    .storage
                    .from('question-papers')
                    .remove([filePath]);
            } catch (storageError) {
                // Log but don't fail the request - DB delete was successful
                console.log('Storage delete warning:', storageError.message);
            }
        }

        res.json({ success: true, message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: error.message || 'Error deleting note' });
    }
});

/**
 * DELETE /api/delete-question/:questionId
 * Delete a question by ID
 * Removes from database and storage
 */
app.delete('/api/delete-question/:questionId', async (req, res) => {
    try {
        const { questionId } = req.params;

        // Get question details
        const { data: question, error: fetchError } = await supabase
            .from('question_banks')
            .select('*')
            .eq('id', questionId)
            .single();

        // If table doesn't exist, return success anyway
        if (fetchError && fetchError.message && fetchError.message.includes('relation')) {
            console.log('Question banks table does not exist');
            return res.json({ success: true, message: 'Question deleted successfully' });
        }

        if (fetchError || !question) {
            console.error('Question fetch error:', fetchError);
            return res.status(404).json({ error: 'Question not found' });
        }

        // Delete from database
        const { error: deleteError } = await supabase
            .from('question_banks')
            .delete()
            .eq('id', questionId);

        if (deleteError) {
            console.error('Database delete error:', deleteError);
            return res.status(500).json({ error: deleteError.message || 'Failed to delete question' });
        }

        // Try to delete file from storage if URL exists
        if (question.file_url) {
            try {
                const filePath = `questions/${question.class}/${question.subject}/${questionId}`;
                await supabase
                    .storage
                    .from('question-papers')
                    .remove([filePath]);
            } catch (storageError) {
                // Log but don't fail - DB delete was successful
                console.log('Storage delete warning:', storageError.message);
            }
        }

        res.json({ success: true, message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: error.message || 'Error deleting question' });
    }
});

/**
 * DELETE /api/delete-video/:videoId
 * Delete a video by ID
 * Removes from database (videos are links, not stored)
 */
app.delete('/api/delete-video/:videoId', async (req, res) => {
    try {
        const { videoId } = req.params;

        // Get video details
        const { data: video, error: fetchError } = await supabase
            .from('videos')
            .select('*')
            .eq('id', videoId)
            .single();

        // If table doesn't exist, return success anyway
        if (fetchError && fetchError.message && fetchError.message.includes('relation')) {
            console.log('Videos table does not exist');
            return res.json({ success: true, message: 'Video deleted successfully' });
        }

        if (fetchError || !video) {
            console.error('Video fetch error:', fetchError);
            return res.status(404).json({ error: 'Video not found' });
        }

        // Delete from database
        const { error: deleteError } = await supabase
            .from('videos')
            .delete()
            .eq('id', videoId);

        if (deleteError) {
            console.error('Database delete error:', deleteError);
            return res.status(500).json({ error: deleteError.message || 'Failed to delete video' });
        }

        res.json({ success: true, message: 'Video deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: error.message || 'Error deleting video' });
    }
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 Not Found handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// General error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║        EDUINK SERVER STARTED           ║
╠════════════════════════════════════════╣
║  Server running on: http://localhost:${PORT}   ║
║  Environment: ${process.env.NODE_ENV || 'development'}             ║
║  Supabase connected: ${supabaseUrl ? 'Yes' : 'No'}        ║
╚════════════════════════════════════════╝
    `);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});
