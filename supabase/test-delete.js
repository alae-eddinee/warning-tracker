// Test script to verify image deletion
// Run this in your browser console (F12) when viewing a store with an image

// 1. First, add a test warning with an image
// 2. Then delete it and check console logs

// Alternative: Test deletion manually
async function testDeleteImage(imageUrl) {
  console.log('Testing deletion for:', imageUrl);
  
  const url = new URL(imageUrl);
  const pathParts = url.pathname.split('/');
  console.log('Path parts:', pathParts);
  
  const bucketIndex = pathParts.indexOf('warning-images');
  console.log('Bucket index:', bucketIndex);
  
  let filePath;
  if (bucketIndex >= 0 && bucketIndex < pathParts.length - 1) {
    filePath = pathParts.slice(bucketIndex + 1).join('/');
  } else {
    filePath = pathParts.pop() || '';
  }
  
  console.log('File path to delete:', filePath);
  
  // Get Supabase client (you need to import it or access it from window)
  const { data, error } = await supabase.storage
    .from('warning-images')
    .remove([filePath]);
    
  console.log('Delete result:', { data, error });
}

// To use:
// 1. Find an image URL in your database or storage
// 2. Run: testDeleteImage('https://your-project.supabase.co/storage/v1/object/public/warning-images/warning-images/filename.jpg')
