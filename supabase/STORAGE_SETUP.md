# Supabase Storage Setup Instructions

## Image Storage Configuration

### 1. Create Storage Bucket
1. Go to Supabase Dashboard → Storage
2. Click "New Bucket"
3. Name: `warning-images`
4. Enable "Public bucket"
5. Click "Create bucket"

### 2. Set Bucket Policies

Navigate to: **Storage → warning-images → Policies**

Add these policies:

#### Policy 1: Allow Upload
- **Name:** Allow upload warning images
- **Allowed operation:** INSERT
- **Target roles:** authenticated
- **Policy definition:** `bucket_id = 'warning-images'`

#### Policy 2: Allow Delete
- **Name:** Allow delete warning images  
- **Allowed operation:** DELETE
- **Target roles:** authenticated
- **Policy definition:** `bucket_id = 'warning-images'`

#### Policy 3: Allow Select (Read)
- **Name:** Allow read warning images
- **Allowed operation:** SELECT
- **Target roles:** anon, authenticated
- **Policy definition:** `bucket_id = 'warning-images'`

### 3. Alternative: Using Supabase CLI (if you have access)

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Apply policies via config.toml or migrations
```

### 4. Manual Image Cleanup

If images weren't deleted properly, you can clean them up:

1. Go to **Storage → warning-images**
2. Select all files
3. Click "Delete" 

Or use the SQL editor with proper permissions:
```sql
-- Only works with service_role or owner permissions
DELETE FROM storage.objects 
WHERE bucket_id = 'warning-images';
```

## Current Code Implementation

The code in `data-supabase.ts` now extracts the filename from the URL and attempts to delete it. The storage bucket must have proper DELETE permissions for this to work.
