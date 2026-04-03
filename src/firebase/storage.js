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
 * Delete a file from Firebase Storage.
 */
export async function deleteFile(path) {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (err) {
    console.error('deleteFile error:', err);
    throw err;
  }
}
