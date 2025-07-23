const express = require('express');
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');
const { canManageContent } = require('../middleware/permissions');
const upload = require('../middleware/upload');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiting for contact form submissions
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 contact form submissions per hour
    message: {
        success: false,
        error: 'Too many contact form submissions, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', contactLimiter, upload.array('attachments', 3), async (req, res) => {
    try {
        const contactData = { ...req.body };

        // Add attachments if uploaded
        if (req.files && req.files.length > 0) {
            contactData.attachments = req.files.map(file => ({
                name: file.originalname,
                url: file.path,
                publicId: file.filename,
                type: file.mimetype,
                size: file.size
            }));
        }

        // Add request metadata
        contactData.ipAddress = req.ip || req.connection.remoteAddress;
        contactData.userAgent = req.get('User-Agent');
        contactData.referrer = req.get('Referrer');

        const contact = new Contact(contactData);
        await contact.save();

        res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully. We will get back to you soon.',
            data: {
                id: contact._id,
                subject: contact.subject,
                createdAt: contact.createdAt
            }
        });

    } catch (error) {
        console.error('Contact form submission error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// @route   GET /api/contact
// @desc    Get all contact messages (Admin only)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            status = 'all',
            category = 'all',
            priority = 'all',
            search,
            unread_only = 'false'
        } = req.query;

        let query = {};

        // Filter by status
        if (status !== 'all') {
            query.status = status;
        }

        // Filter by category
        if (category !== 'all') {
            query.category = category;
        }

        // Filter by priority
        if (priority !== 'all') {
            query.priority = priority;
        }

        // Filter unread only
        if (unread_only === 'true') {
            query.isRead = false;
        }

        // Filter out spam
        query.isSpam = { $ne: true };

        // Search functionality
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } },
                { message: { $regex: search, $options: 'i' } }
            ];
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 },
            populate: [
                { path: 'assignedTo', select: 'name email' },
                { path: 'readBy', select: 'name email' }
            ]
        };

        const contacts = await Contact.paginate(query, options);

        res.json({
            success: true,
            data: contacts.docs,
            pagination: {
                currentPage: contacts.page,
                totalPages: contacts.totalPages,
                totalDocs: contacts.totalDocs,
                limit: contacts.limit,
                hasNextPage: contacts.hasNextPage,
                hasPrevPage: contacts.hasPrevPage
            }
        });

    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/contact/:id
// @desc    Get contact message by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id)
            .populate('assignedTo', 'name email')
            .populate('readBy', 'name email')
            .populate('response.respondedBy', 'name email');

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        // Mark as read if not already read
        if (!contact.isRead) {
            await contact.markAsRead(req.admin.id);
        }

        res.json({
            success: true,
            data: contact
        });

    } catch (error) {
        console.error('Get contact by ID error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PATCH /api/contact/:id/assign
// @desc    Assign contact to admin
// @access  Private
router.patch('/:id/assign', auth, async (req, res) => {
    try {
        const { adminId } = req.body;

        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        await contact.assignTo(adminId || req.admin.id);

        res.json({
            success: true,
            message: 'Contact assigned successfully',
            data: contact
        });

    } catch (error) {
        console.error('Assign contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/contact/:id/response
// @desc    Add response to contact
// @access  Private (Manage Content Permission)
router.post('/:id/response', auth, canManageContent, async (req, res) => {
    try {
        const { message, method = 'email' } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Response message is required'
            });
        }

        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        await contact.addResponse({
            message,
            method,
            respondedBy: req.admin.id
        });

        res.json({
            success: true,
            message: 'Response added successfully',
            data: contact
        });

    } catch (error) {
        console.error('Add response error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/contact/:id/follow-up
// @desc    Add follow-up note to contact
// @access  Private
router.post('/:id/follow-up', auth, async (req, res) => {
    try {
        const { message, type = 'note' } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Follow-up message is required'
            });
        }

        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        await contact.addFollowUp({
            message,
            type,
            addedBy: req.admin.id
        });

        res.json({
            success: true,
            message: 'Follow-up added successfully',
            data: contact
        });

    } catch (error) {
        console.error('Add follow-up error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PATCH /api/contact/:id/status
// @desc    Update contact status
// @access  Private
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;

        if (!['new', 'in-progress', 'resolved', 'closed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: new Date() },
            { new: true, runValidators: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        res.json({
            success: true,
            message: 'Contact status updated successfully',
            data: contact
        });

    } catch (error) {
        console.error('Update contact status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/contact/stats/overview
// @desc    Get contact statistics
// @access  Private
router.get('/stats/overview', auth, async (req, res) => {
    try {
        const stats = await Contact.getStats();

        res.json({
            success: true,
            data: stats[0] || {
                total: 0,
                new: 0,
                inProgress: 0,
                resolved: 0,
                closed: 0,
                unread: 0,
                highPriority: 0
            }
        });

    } catch (error) {
        console.error('Get contact stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   DELETE /api/contact/:id
// @desc    Delete contact message
// @access  Private (Manage Content Permission)
router.delete('/:id', auth, canManageContent, async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        await Contact.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Contact message deleted successfully'
        });

    } catch (error) {
        console.error('Delete contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
