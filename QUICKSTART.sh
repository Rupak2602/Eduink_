#!/bin/bash

# ============================================
# EDUINK - QUICK START SCRIPT
# Run this after installing Node.js
# ============================================

echo "╔════════════════════════════════════════╗"
echo "║  EDUINK - QUICK START SETUP            ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed!"
echo ""

# Step 2: Instructions
echo "🔧 Setup Instructions:"
echo ""
echo "1. Create a Supabase account at https://supabase.com"
echo "2. Create a new project and wait for it to initialize"
echo "3. Go to Project Settings → API"
echo "4. Copy your Project URL and Anon Key"
echo ""
echo "5. Edit .env file with your Supabase credentials:"
echo "   SUPABASE_URL=your_project_url"
echo "   SUPABASE_ANON_KEY=your_anon_key"
echo ""
echo "6. In Supabase Dashboard:"
echo "   - Go to Storage"
echo "   - Create new bucket: 'question-papers'"
echo "   - Make it public"
echo ""
echo "7. Start the server:"
echo "   npm start"
echo ""
echo "8. Open http://localhost:3000 in your browser"
echo ""
echo "📝 Admin Panel: http://localhost:3000/admin.html"
echo "🔑 Default Password: admin12345 (Change this!)"
echo ""
echo "✨ You're all set! Happy teaching & learning!"
