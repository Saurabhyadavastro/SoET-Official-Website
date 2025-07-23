const express = require('express');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const { canManageContent } = require('../middleware/permissions');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/events
// @desc    Get all events (public and private based on auth)
// @access  Public for public events, Private for all events
router.get('/', async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            category, 
            status = 'upcoming',
            search,
            startDate,
            endDate,
            public_only = 'true'
        } = req.query;

        let query = {};

        // If not authenticated, only show public events
        const isAuthenticated = req.header('Authorization');
        if (!isAuthenticated || public_only === 'true') {
            query.isPublic = true;
        }

        // Filter by status
        if (status !== 'all') {
            query.status = status;
        }

        // Filter by category
        if (category && category !== 'all') {
            query.category = category;
        }

        // Date range filter
        if (startDate && endDate) {
            query.startDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // Search functionality
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { venue: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { startDate: 1 },
            populate: {
                path: 'createdBy',
                select: 'name email'
            }
        };

        const events = await Event.paginate(query, options);

        res.json({
            success: true,
            data: events.docs,
            pagination: {
                currentPage: events.page,
                totalPages: events.totalPages,
                totalDocs: events.totalDocs,
                limit: events.limit,
                hasNextPage: events.hasNextPage,
                hasPrevPage: events.hasPrevPage
            }
        });

    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/events/upcoming
// @desc    Get upcoming events
// @access  Public
router.get('/upcoming', async (req, res) => {
    try {
        const { limit = 5 } = req.query;
        const events = await Event.getUpcoming(parseInt(limit));

        res.json({
            success: true,
            data: events
        });

    } catch (error) {
        console.error('Get upcoming events error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/events/category/:category
// @desc    Get events by category
// @access  Public
router.get('/category/:category', async (req, res) => {
    try {
        const events = await Event.getByCategory(req.params.category);

        res.json({
            success: true,
            data: events
        });

    } catch (error) {
        console.error('Get events by category error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/events/:id
// @desc    Get event by ID
// @access  Public for public events
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if event is public or user is authenticated
        const isAuthenticated = req.header('Authorization');
        if (!event.isPublic && !isAuthenticated) {
            return res.status(403).json({
                success: false,
                message: 'Access denied to private event'
            });
        }

        res.json({
            success: true,
            data: event
        });

    } catch (error) {
        console.error('Get event by ID error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/events
// @desc    Create new event
// @access  Private (Manage Content Permission)
router.post('/', auth, canManageContent, upload.array('images', 5), async (req, res) => {
    try {
        const eventData = { ...req.body };

        // Add images if uploaded
        if (req.files && req.files.length > 0) {
            eventData.images = req.files.map(file => ({
                url: file.path,
                publicId: file.filename,
                caption: file.originalname
            }));

            // Set first image as banner if no banner specified
            if (!eventData.bannerImage) {
                eventData.bannerImage = {
                    url: req.files[0].path,
                    publicId: req.files[0].filename
                };
            }
        }

        // Add created by
        eventData.createdBy = req.admin.id;

        const event = new Event(eventData);
        await event.save();

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event
        });

    } catch (error) {
        console.error('Create event error:', error);
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

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private (Manage Content Permission)
router.put('/:id', auth, canManageContent, upload.array('images', 5), async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        const updateData = { ...req.body };

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
                : [...(event.images || []), ...newImages];
        }

        updateData.updatedAt = new Date();

        event = await Event.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Event updated successfully',
            data: event
        });

    } catch (error) {
        console.error('Update event error:', error);
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

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private (Manage Content Permission)
router.delete('/:id', auth, canManageContent, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        await Event.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Event deleted successfully'
        });

    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/events/search/:query
// @desc    Search events
// @access  Public
router.get('/search/:query', async (req, res) => {
    try {
        const events = await Event.searchEvents(req.params.query);

        res.json({
            success: true,
            data: events
        });

    } catch (error) {
        console.error('Search events error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PATCH /api/events/:id/status
// @desc    Update event status
// @access  Private (Manage Content Permission)
router.patch('/:id/status', auth, canManageContent, async (req, res) => {
    try {
        const { status } = req.body;

        if (!['upcoming', 'ongoing', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const event = await Event.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: new Date() },
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            message: 'Event status updated successfully',
            data: event
        });

    } catch (error) {
        console.error('Update event status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
