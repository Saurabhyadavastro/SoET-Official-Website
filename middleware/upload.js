const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let folder = 'soet-university';
        
        // Determine folder based on file type and route
        if (req.route.path.includes('staff')) {
            folder = 'soet-university/staff';
        } else if (req.route.path.includes('alumni')) {
            folder = 'soet-university/alumni';
        } else if (req.route.path.includes('events')) {
            folder = 'soet-university/events';
        } else if (req.route.path.includes('announcements')) {
            folder = 'soet-university/announcements';
        } else if (req.route.path.includes('contact')) {
            folder = 'soet-university/contacts';
        }

        const fileExtension = path.extname(file.originalname).toLowerCase();
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx'];
        
        if (!allowedExtensions.includes(fileExtension)) {
            throw new Error(`File type ${fileExtension} is not allowed`);
        }

        return {
            folder: folder,
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
            public_id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
            resource_type: 'auto'
        };
    }
});

// File filter function
const fileFilter = (req, file, cb) => {
    // Allowed file types
    const allowedMimes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images, PDF, and Word documents are allowed.'), false);
    }
};

// Create multer upload middleware
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 5 // Maximum 5 files
    }
});

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size too large. Maximum size is 10MB.'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files. Maximum 5 files allowed.'
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Unexpected field name for file upload.'
            });
        }
    }
    
    if (error.message.includes('File type')) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    // Pass other errors to global error handler
    next(error);
};

// Helper function to delete file from Cloudinary
const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
        return true;
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        return false;
    }
};

module.exports = upload;
