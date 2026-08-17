import axios from 'axios';

export const uploadToImgBB = async (file, onProgress) => {
  if (!file) return '';

  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type?.toLowerCase())) {
    throw new Error('Invalid file format. Please select a PNG, JPG, WEBP, or GIF image.');
  }

  const maxSizeInBytes = 5 * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    throw new Error('File size exceeds 5MB limit.');
  }

  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  const formData = new FormData();
  formData.append('image', file);

  if (apiKey && apiKey !== 'your_imgbb_api_key') {
    try {
      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          }
        },
      });

      if (response.data?.data?.url) {
        return response.data.data.url;
      }
    } catch (err) {
      console.warn('ImgBB upload failed, falling back to FileReader preview:', err.message);
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file locally.'));
    reader.readAsDataURL(file);
  });
};

export default uploadToImgBB;
