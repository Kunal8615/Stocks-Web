import { v2 as cloud } from "cloudinary";
import fs from "fs";
import path from "path";

cloud.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;

  try {
    // Ensure file exists
    if (!fs.existsSync(localFilePath)) {
      throw new Error(`File not found: ${localFilePath}`);
    }

    // Upload to Cloudinary
    const response = await cloud.uploader.upload(localFilePath, {
      resource_type: "auto"
    });

    // Delete local file safely
    try {
      await fs.promises.unlink(localFilePath);
    } catch (err) {
      console.warn("Failed to delete file:", localFilePath, err.message);
    }

    return response;

  } catch (error) {
    console.error("Cloudinary upload error:", error.message);

    // Attempt to delete file even if upload fails
    try {
      if (fs.existsSync(localFilePath)) {
        await fs.promises.unlink(localFilePath);
      }
    } catch (err) {
      console.warn("Failed to delete file after error:", err.message);
    }

    throw error;
  }
};

export { uploadOnCloudinary };
