const express = require('express');
const Announcement = require('../models/Announcement');
const auth = require('../middleware/auth');
const { canManageContent } = require('../middleware/permissions');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/announcements
// @desc    Get all announcements (public and private based on auth)
// @access  Public for active announcements, Private for all announcements
router.get('/', async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            category, 
            priority,
            targetAudience,
            department,
            search,
            active_only = 'true'
        } = req.query;

        let query = {};

        // If not authenticated, only show active announcements
        const isAuthenticated = req.header('Authorization');
        if (!isAuthenticated || active_only === 'true') {
            query.isActive = true;
            query.publishDate = { $lte: new Date() };
            query.$or = [
                { expiryDate: { $gte: new Date() } },
                { expiryDate: null }
            ];
        }

        // Filter by category
        if (category && category !== 'all') {
            query.category = category;
        }

        // Filter by priority
        if (priority && priority !== 'all') {
            query.priority = priority;
        }

        // Filter by target audience
        if (targetAudience && targetAudience !== 'all') {
            query.targetAudience = { $in: ['all', targetAudience] };
        }

        // Filter by department
        if (department && department !== 'all') {
            query.department = { $in: ['all', department] };
        }

        // Search functionality
        if (search) {
            query.$text = { $search: search };
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { isPinned: -1, priority: -1, publishDate: -1 },
            populate: {
                path: 'createdBy',
                select: 'name email'
            }
        };

        const announcements = await Announcement.paginate(query, options);

        res.json({
            success: true,
            data: announcements.docs,
            pagination: {
                currentPage: announcements.page,
                totalPages: announcements.totalPages,
                totalDocs: announcements.totalDocs,
                limit: announcements.limit,
                hasNextPage: announcements.hasNextPage,
                hasPrevPage: announcements.hasPrevPage
            }
        });

    } catch (error) {
        console.error('Get announcements error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/announcements/homepage
// @desc    Get homepage announcements
// @access  Public
router.get('/homepage', async (req, res) => {
    try {
        const announcements = await Announcement.getHomepage();

        res.json({
            success: true,
            data: announcements
        });

    } catch (error) {
        console.error('Get homepage announcements error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/announcements/pinned
// @desc    Get pinned announcements
// @access  Public
router.get('/pinned', async (req, res) => {
    try {
        const announcements = await Announcement.getPinned();

        res.json({
            success: true,
            data: announcements
        });

    } catch (error) {
        console.error('Get pinned announcements error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/announcements/category/:category
// @desc    Get announcements by category
// @access  Public
router.get('/category/:category', async (req, res) => {
    try {
        const announcements = await Announcement.getByCategory(req.params.category);

        res.json({
            success: true,
            data: announcements
        });

    } catch (error) {
        console.error('Get announcements by category error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/announcements/:id
// @desc    Get announcement by ID
// @access  Public for active announcements
router.get('/:id', async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        // Check if announcement is active (for non-authenticated users)
        const isAuthenticated = req.header('Authorization');
        if (!isAuthenticated && (!announcement.isActive || announcement.isExpired)) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        // Increment views
        await announcement.incrementViews();

        res.json({
            success: true,
            data: announcement
        });

    } catch (error) {
        console.error('Get announcement by ID error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/announcements
// @desc    Create new announcement
// @access  Private (Manage Content Permission)
router.post('/', auth, canManageContent, upload.array('images', 3), async (req, res) => {
    try {
        const announcementData = { ...req.body };

        // Parse arrays from form data
        if (typeof announcementData.targetAudience === 'string') {
            announcementData.targetAudience = announcementData.targetAudience.split(',');
        }
        if (typeof announcementData.department === 'string') {
            announcementData.department = announcementData.department.split(',');
        }
        if (typeof announcementData.tags === 'string') {
            announcementData.tags = announcementData.tags.split(',');
        }

        // Add images if uploaded
        if (req.files && req.files.length > 0) {
            announcementData.images = req.files.map(file => ({
                url: file.path,
                publicId: file.filename,
                caption: file.originalname
            }));
        }

        // Add created by
        announcementData.createdBy = req.admin.id;

        const announcement = new Announcement(announcementData);
        await announcement.save();

        res.status(201).json({
            success: true,
            message: 'Announcement created successfully',
            data: announcement
        });

    } catch (error) {
        console.error('Create announcement error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/announcements/:id
// @desc    Update announcement
// @access  Private (Manage Content Permission)
router.put('/:id', auth, canManageContent, upload.array('images', 3), async (req, res) => {
    try {
        let announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        const updateData = { ...req.body };

        // Parse arrays from form data
        if (typeof updateData.targetAudience === 'string') {
            updateData.targetAudience = updateData.targetAudience.split(',');
        }
        if (typeof updateData.department === 'string') {
            updateData.department = updateData.department.split(',');
        }
        if (typeof updateData.tags === 'string') {
            updateData.tags = updateData.tags.split(',');
        }

        // Add images if uploaded
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => ({
                url: file.path,
                publicId: file.filename,
                caption: file.originalname
            }));

            // Append to existing images or replace
            updateData.images = updateData.replaceImages === 'true' 
                ? newImages 
                : [...(announcement.images || []), ...newImages];
        }

        // Add modified by
        updateData.modifiedBy = req.admin.id;
        updateData.updatedAt = new Date();

        announcement = await Announcement.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Announcement updated successfully',
            data: announcement
        });

    } catch (error) {
        console.error('Update announcement error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   DELETE /api/announcements/:id
// @desc    Delete announcement
// @access  Private (Manage Content Permission)
router.delete('/:id', auth, canManageContent, async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        await Announcement.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Announcement deleted successfully'
        });

    } catch (error) {
        console.error('Delete announcement error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PATCH /api/announcements/:id/pin
// @desc    Toggle pin status of announcement
// @access  Private (Manage Content Permission)
router.patch('/:id/pin', auth, canManageContent, async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        announcement.isPinned = !announcement.isPinned;
        announcement.modifiedBy = req.admin.id;
        announcement.updatedAt = new Date();
        
        await announcement.save();

        res.json({
            success: true,
            message: `Announcement ${announcement.isPinned ? 'pinned' : 'unpinned'} successfully`,
            data: announcement
        });

    } catch (error) {
        console.error('Toggle pin announcement error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/announcements/:id/like
// @desc    Like/unlike announcement
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        const userId = req.admin.id;
        const isLiked = announcement.likes.includes(userId);

        if (isLiked) {
            await announcement.removeLike(userId);
        } else {
            await announcement.addLike(userId);
        }

        res.json({
            success: true,
            message: isLiked ? 'Like removed' : 'Announcement liked',
            data: {
                isLiked: !isLiked,
                likeCount: announcement.likeCount
            }
        });

    } catch (error) {
        console.error('Like announcement error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/announcements/search/:query
// @desc    Search announcements
// @access  Public
router.get('/search/:query', async (req, res) => {
    try {
        const announcements = await Announcement.searchAnnouncements(req.params.query);

        res.json({
            success: true,
            data: announcements
        });

    } catch (error) {
        console.error('Search announcements error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
