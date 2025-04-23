const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload a file to Cloudinary
 * @param {string} filePath - Path to the file to upload
 * @param {Object} options - Additional options for the upload
 * @returns {Promise<Object>} - Cloudinary upload result
 */
const uploadToCloudinary = async (filePath, options = {}) => {
  try {
    // If Cloudinary credentials are not set, return the local file path
    if (!process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET) {

      // Extract the relative path from the full path
      const relativePath = filePath.replace(/\\/g, '/').split('/uploads/')[1];

      // Return a mock Cloudinary response with the proper URL path
      return {
        secure_url: `/uploads/${relativePath}`,
        public_id: `uploads/${relativePath}`,
        format: filePath.split('.').pop()
      };
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'real-estate',
      ...options
    });

    // Delete the local file after successful upload
    fs.unlinkSync(filePath);

    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);

    // If Cloudinary upload fails, return the local file path
    const relativePath = filePath.replace(/\\/g, '/').split('/uploads/')[1];
    return {
      secure_url: `/uploads/${relativePath}`,
      public_id: `uploads/${relativePath}`,
      format: filePath.split('.').pop()
    };
  }
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - Public ID of the file to delete
 * @returns {Promise<Object>} - Cloudinary deletion result
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    // If Cloudinary credentials are not set, just return success
    if (!process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET) {
      return { result: 'ok' };
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary
};
