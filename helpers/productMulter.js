const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { isCloudinaryConfigured, uploadBufferToCloudinary } = require('../config/cloudinary');

const memoryStorage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (!file || !file.originalname || file.size === 0) {
        cb(null, false);
    } else if (file.mimetype && file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

const uploadProduct = (req, res, next) => {
    const upload = multer({
        storage: memoryStorage,
        limits: {
            fileSize: 10 * 1024 * 1024,
            files: 4
        },
        fileFilter: fileFilter
    }).array('images', 4);

    upload(req, res, async (err) => {
        if (err) {
            console.error('[UPLOADER ERROR]:', err);
            return res.status(400).json({
                success: false,
                message: err.message || 'Image upload failed'
            });
        }

        if (!req.files || req.files.length === 0) {
            return next();
        }

        const useCloudinary = isCloudinaryConfigured();
        const uploadDir = path.join(__dirname, '../public/uploads/product-images');

        for (const file of req.files) {
            if (useCloudinary) {
                try {
                    console.log('[UPLOADER] Uploading image buffer to Cloudinary...');
                    const result = await uploadBufferToCloudinary(file.buffer);
                    file.path = result.secure_url;
                    file.filename = result.public_id;
                    console.log('[UPLOADER] Cloudinary upload successful:', file.path);
                    continue;
                } catch (cloudErr) {
                    console.error('[UPLOADER] Cloudinary buffer upload timed out/failed. Saving locally:', cloudErr.message || cloudErr);
                }
            }

            // Local storage fallback (or default if Cloudinary is not configured)
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const ext = path.extname(file.originalname) || '.jpg';
            const uniqueFilename = 'product-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
            const fullPath = path.join(uploadDir, uniqueFilename);
            fs.writeFileSync(fullPath, file.buffer);
            file.filename = uniqueFilename;
            file.path = uniqueFilename;
            console.log('[UPLOADER] Saved image to local storage:', uniqueFilename);
        }

        next();
    });
};

module.exports = {
    uploadProduct
};