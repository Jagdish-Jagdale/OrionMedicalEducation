import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

/**
 * Upload a file to Firebase Storage and return its download URL.
 * @param {File} file - The file to upload.
 * @param {string} path - Storage path e.g. 'universities/my-image.jpg'
 * @param {function} onProgress - Optional progress callback (0–100)
 */
export async function uploadFile(file, path, onProgress) {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(Math.round(progress));
      },
      (error) => {
        console.error('Upload error:', error);
        reject(error);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
}

/**
 * Get a download URL for an existing storage path.
 */
export async function getFileUrl(path) {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (err) {
    console.error('getFileUrl error:', err);
    throw err;
  }
}

/**
 * Delete a file from Firebase Storage using its download URL.
 */
export async function deleteFileByUrl(url) {
  if (!url || typeof url !== 'string') return;
  
  // Skip blob URLs (local previews) and non-Firebase URLs
  if (url.startsWith('blob:') || !url.includes('firebasestorage.googleapis.com')) {
    return;
  }

  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
    console.log('Successfully deleted old file from Storage:', url);
  } catch (err) {
    // If it's already deleted, 404 is fine.
    // If it's a permission error, we log it but don't stop the save.
    console.warn('deleteFileByUrl warning:', err.message);
  }
}

/**
 * Extract a human-readable filename from a Firebase Storage URL or a Blob URL.
 */
export function getFileNameFromUrl(url) {
  if (!url || typeof url !== 'string') return '';
  
  // Handle local blob URLs
  if (url.startsWith('blob:')) return 'Local File Selected';

  try {
    // Handle Firebase Storage URLs
    if (url.includes('firebasestorage.googleapis.com')) {
      const baseUrl = url.split('?')[0];
      const parts = baseUrl.split('/o/');
      if (parts.length > 1) {
        return decodeURIComponent(parts[1]).split('/').pop();
      }
    }
    
    // Handle standard URLs
    const filename = url.split('/').pop().split('#')[0].split('?')[0];
    return filename || url;
  } catch (e) {
    return url;
  }
}
