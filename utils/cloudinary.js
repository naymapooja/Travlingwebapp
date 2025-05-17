import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';

cloudinary.config({
  cloud_name:process.env. CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePeth) => {
  try {

    if (!localFilePeth) return null;
    const uploadResult = await cloudinary.uploader.upload(localFilePeth, {
      folder: "tour_images"
    });

    fs.unlinkSync(localFilePeth);
    return uploadResult;
  } catch (error) {

    console.error("error occurred while uploading file on cloudinary", error);
    return null;
  }
};

export const deletFromCloudinary = async (url) => {
  try {
    const publicId = url.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId, { resource_type: "" })
  } catch (error) {

  }
}
