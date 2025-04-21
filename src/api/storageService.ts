// src/api/storageService.ts
import { supabase } from "./supabaseClient";

// Define your bucket names - consider using env vars for these
const BUCKET_NAME = "book_covers"; // Example bucket name

/**
 * Uploads a file to a specified Supabase Storage bucket.
 *
 * @param file The file object to upload.
 * @param path The desired path and filename within the bucket (e.g., 'public/avatar.png').
 *             Consider including user ID for user-specific folders: `userId + '/' + file.name`
 * @param bucket The name of the bucket (defaults to BUCKET_NAME).
 * @returns A promise resolving to the uploaded file data or throwing an error.
 */
export const uploadFile = async (
  file: File,
  path: string,
  bucket: string = BUCKET_NAME
) => {
  console.log(`Uploading file '${file.name}' to bucket '${bucket}' at path '${path}'`);
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600", // Optional: Cache control header
        upsert: false, // Optional: true to overwrite existing file, false to error
      });

    if (error) {
      console.error("Supabase storage upload error:", error.message);
      throw error;
    }

    console.log("File uploaded successfully:", data);
    return data; // Contains the path: { path: 'public/avatar.png' }
  } catch (error) {
    console.error(`Failed to upload file to ${bucket}/${path}:`, error);
    throw error; // Re-throw for handling in the component/hook
  }
};

/**
 * Gets the public URL for a file in a Supabase Storage bucket.
 * Assumes the file and bucket have public access enabled in Supabase policies.
 *
 * @param path The path to the file within the bucket.
 * @param bucket The name of the bucket (defaults to BUCKET_NAME).
 * @returns An object containing the public URL or an error.
 */
export const getPublicUrl = (
  path: string,
  bucket: string = BUCKET_NAME
) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  if (!data || !data.publicUrl) {
    console.warn(`Could not get public URL for ${bucket}/${path}. Check path and bucket permissions.`);
    // Depending on requirements, you might return null or a placeholder URL
    return { publicUrl: null };
  }

  return data; // Contains the publicUrl: { publicUrl: 'https://<project>.supabase.co/...' }
};

// Add functions for download, delete, list files etc. as needed
// export const deleteFile = async (path: string, bucket: string = BUCKET_NAME) => { ... }
