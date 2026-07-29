const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');
dotenv.config();

cloudinary.config({
    cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || '').trim(),
    api_key: (process.env.CLOUDINARY_API_KEY || '').trim(),
    api_secret: (process.env.CLOUDINARY_API_SECRET || '').trim(),
    timeout: 60000
});

const isCloudinaryConfigured = () => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
    const apiKey = process.env.CLOUDINARY_API_KEY || '';
    const apiSecret = process.env.CLOUDINARY_API_SECRET || '';

    const isPlaceholder = (val) => {
        if (!val || val.trim() === '') return true;
        const lower = val.toLowerCase().trim();
        return lower === 'your_cloud_name' || lower === 'your_api_key' || lower === 'your_api_secret' || lower.includes('placeholder_');
    };

    const valid = !isPlaceholder(cloudName) && !isPlaceholder(apiKey) && !isPlaceholder(apiSecret);
    if (valid) {
        cloudinary.config({
            cloud_name: cloudName.trim(),
            api_key: apiKey.trim(),
            api_secret: apiSecret.trim(),
            timeout: 60000
        });
    }
    return valid;
};

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'brossoc-clothing/products',
        resource_type: 'auto',
        transformation: [{ width: 1000, height: 1000, crop: 'limit', quality: 'auto' }]
    }
});

const uploadBufferToCloudinary = (fileBuffer, options = {}) => {
    return new Promise((resolve, reject) => {
        const defaultOptions = {
            folder: 'brossoc-clothing/products',
            resource_type: 'auto',
            timeout: 15000
        };
        const stream = cloudinary.uploader.upload_stream(
            { ...defaultOptions, ...options },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        stream.end(fileBuffer);
    });
};

module.exports = {
    cloudinary,
    storage,
    isCloudinaryConfigured,
    uploadBufferToCloudinary
};
