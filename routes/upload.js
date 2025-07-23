const express = require('express');
const upload = require('../middleware/upload');
const { deleteFromCloudinary, handleUploadError } = require('../utils/cloudinary');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/upload/single
// @desc    Upload single file
// @access  Private
router.post('/single', auth, upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        res.json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                url: req.file.path,
                publicId: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype
            }
        });

    } catch (error) {
        console.error('Upload single file error:', error);
        res.status(500).json({
            success: false,
            message: 'File upload failed'
        });
    }
});

// @route   POST /api/upload/multiple
// @desc    Upload multiple files
// @access  Private
router.post('/multiple', auth, upload.array('files', 5), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }

        const uploadedFiles = req.files.map(file => ({
            url: file.path,
            publicId: file.filename,
            originalName: file.originalname,
            size: file.size,
            mimetype: file.mimetype
        }));

        res.json({
            success: true,
            message: `${req.files.length} file(s) uploaded successfully`,
            data: uploadedFiles
        });

    } catch (error) {
        console.error('Upload multiple files error:', error);
        res.status(500).json({
            success: false,
            message: 'File upload failed'
        });
    }
});

// @route   DELETE /api/upload/:publicId
// @desc    Delete file from Cloudinary
// @access  Private
router.delete('/:publicId', auth, async (req, res) => {
    try {
        const { publicId } = req.params;

        if (!publicId) {
            return res.status(400).json({
                success: false,
                message: 'Public ID is required'
            });
        }

        const deleted = await deleteFromCloudinary(publicId);

        if (deleted) {
            res.json({
                success: true,
                message: 'File deleted successfully'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Failed to delete file'
            });
        }

    } catch (error) {
        console.error('Delete file error:', error);
        res.status(500).json({
            success: false,
            message: 'File deletion failed'
        });
    }
});

// Apply upload error handling middleware
router.use(handleUploadError);

module.exports = router;
