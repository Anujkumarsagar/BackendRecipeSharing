const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    try {

        if (!file || !file.tempFilePath) {
            throw new Error("Invalid file");
        }

        const options = { folder };
        if (height) {
            options.height = height;
        }
        if (quality) {
            options.quality = quality;
        }

        options.resource_type = 'auto';

        const uploadResponse = await cloudinary.uploader.upload(file.tempFilePath, options);

        return uploadResponse;
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error.message);
        throw new Error('Failed to upload image to Cloudinary');

    }
}