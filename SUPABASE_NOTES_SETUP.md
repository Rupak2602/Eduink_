# Supabase Notes Table Setup Guide

## Step 1: Create the Notes Table

Go to your Supabase dashboard and run this SQL in the SQL Editor:

```sql
-- Create notes table
CREATE TABLE notes (
  id uuid primary key default uuid_generate_v4(),
  subject text not null,
  title text not null,
  caption text,
  file_url text not null,
  created_at timestamp default now()
);

-- Create index for faster queries by subject
CREATE INDEX notes_subject_idx ON notes(subject);

-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Allow public SELECT (anyone can read notes)
CREATE POLICY "Allow public SELECT" 
ON notes FOR SELECT 
TO public 
USING (true);

-- Allow public INSERT (temporary for testing)
CREATE POLICY "Allow public INSERT" 
ON notes FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow public UPDATE
CREATE POLICY "Allow public UPDATE"
ON notes FOR UPDATE
TO public
USING (true);
```

## Step 2: Create Storage Bucket

1. Go to **Storage** in Supabase
2. Create a bucket named: `question-papers` (if not already created)
3. Set it as **Public**
4. Add this policy:
   - Allow: `SELECT`, `INSERT`, `UPDATE`, `DELETE`
   - For: `public`

## Step 3: Verify Setup

After running the SQL, you should see:
- ✅ Table `notes` created
- ✅ Columns: id, subject, title, caption, file_url, created_at
- ✅ RLS policies enabled
- ✅ Index on subject column

## Step 4: That's It!

The backend will now automatically:
- Upload PDFs to Supabase storage
- Store note metadata in the notes table
- Allow students to fetch notes by subject
