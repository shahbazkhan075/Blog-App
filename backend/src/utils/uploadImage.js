const cloudinary = require("../config/cloudinary");
const fs = require("fs");

/**
 * Upload image to Cloudinary. Always uses Cloudinary — credentials must be set in .env.
 * Returns the secure_url string.
 */
const uploadImage = async (file, folder = "blog") => {
  if (!file) return "";

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: "image",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });
    // Remove temp file after successful upload
    fs.unlink(file.path, () => {});
    return result.secure_url;
  } catch (err) {
    // Clean up temp file even on failure
    fs.unlink(file.path, () => {});
    throw Object.assign(
      new Error(`Image upload failed: ${err.message}`),
      { status: 500 }
    );
  }
};

module.exports = uploadImage;
