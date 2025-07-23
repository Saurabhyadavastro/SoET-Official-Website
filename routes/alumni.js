const express = require('express');
const Alumni = require('../models/Alumni');
const auth = require('../middleware/auth');
const { canManageUsers } = require('../middleware/permissions');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/alumni
// @desc    Get all alumni
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            department, 
            graduationYear,
            currentStatus,
            search,
            public_only = 'false'
        } = req.query;

        let query = {};

        // Filter by public profiles only if requested
        if (public_only === 'true') {
            query.isPublic = true;
        }

        // Filter by department
        if (department && department !== 'all') {
            query.department = department;
        }

        // Filter by graduation year
        if (graduationYear && graduationYear !== 'all') {
            query.graduationYear = parseInt(graduationYear);
        }

        // Filter by current status
        if (currentStatus && currentStatus !== 'all') {
            query.currentStatus = currentStatus;
        }

        // Search functionality
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { rollNumber: { $regex: search, $options: 'i' } },
                { 'currentJob.company': { $regex: search, $options: 'i' } },
                { 'currentJob.position': { $regex: search, $options: 'i' } }
            ];
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { graduationYear: -1, name: 1 }
        };

        const alumni = await Alumni.paginate(query, options);

        res.json({
            success: true,
            data: alumni.docs,
            pagination: {
                currentPage: alumni.page,
                totalPages: alumni.totalPages,
                totalDocs: alumni.totalDocs,
                limit: alumni.limit,
                hasNextPage: alumni.hasNextPage,
                hasPrevPage: alumni.hasPrevPage
            }
        });

    } catch (error) {
        console.error('Get alumni error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/alumni/:id
// @desc    Get alumni by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const alumni = await Alumni.findById(req.params.id);

        if (!alumni) {
            return res.status(404).json({
                success: false,
                message: 'Alumni not found'
            });
        }

        res.json({
            success: true,
            data: alumni
        });

    } catch (error) {
        console.error('Get alumni by ID error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Alumni not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/alumni
// @desc    Create new alumni record
// @access  Private (Manage Users Permission)
router.post('/', auth, canManageUsers, upload.single('profilePhoto'), async (req, res) => {
    try {
        const alumniData = { ...req.body };

        // Add profile photo if uploaded
        if (req.file) {
            alumniData.profilePhoto = {
                url: req.file.path,
                publicId: req.file.filename
            };
        }

        // Add created by
        alumniData.createdBy = req.admin.id;

        const alumni = new Alumni(alumniData);
        await alumni.save();

        res.status(201).json({
            success: true,
            message: 'Alumni record created successfully',
            data: alumni
        });

    } catch (error) {
        console.error('Create alumni error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                success: false,
                message: `${field} already exists`
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/alumni/:id
// @desc    Update alumni record
// @access  Private (Manage Users Permission)
router.put('/:id', auth, canManageUsers, upload.single('profilePhoto'), async (req, res) => {
    try {
        let alumni = await Alumni.findById(req.params.id);

        if (!alumni) {
            return res.status(404).json({
                success: false,
                message: 'Alumni not found'
            });
        }

        const updateData = { ...req.body };

        // Add profile photo if uploaded
        if (req.file) {
            updateData.profilePhoto = {
                url: req.file.path,
                publicId: req.file.filename
            };
        }

        // Add updated by
        updateData.updatedBy = req.admin.id;
        updateData.updatedAt = new Date();

        alumni = await Alumni.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Alumni record updated successfully',
            data: alumni
        });

    } catch (error) {
        console.error('Update alumni error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                success: false,
                message: `${field} already exists`
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   DELETE /api/alumni/:id
// @desc    Delete alumni record
// @access  Private (Manage Users Permission)
router.delete('/:id', auth, canManageUsers, async (req, res) => {
    try {
        const alumni = await Alumni.findById(req.params.id);

        if (!alumni) {
            return res.status(404).json({
                success: false,
                message: 'Alumni not found'
            });
        }

        await Alumni.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Alumni record deleted successfully'
        });

    } catch (error) {
        console.error('Delete alumni error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/alumni/department/:department
// @desc    Get alumni by department
// @access  Private
router.get('/department/:department', auth, async (req, res) => {
    try {
        const alumni = await Alumni.getByDepartment(req.params.department);

        res.json({
            success: true,
            data: alumni
        });

    } catch (error) {
        console.error('Get alumni by department error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/alumni/year/:year
// @desc    Get alumni by graduation year
// @access  Private
router.get('/year/:year', auth, async (req, res) => {
    try {
        const alumni = await Alumni.getByGraduationYear(parseInt(req.params.year));

        res.json({
            success: true,
            data: alumni
        });

    } catch (error) {
        console.error('Get alumni by year error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/alumni/stats/overview
// @desc    Get alumni statistics
// @access  Private
router.get('/stats/overview', auth, async (req, res) => {
    try {
        const stats = await Alumni.getStats();

        res.json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('Get alumni stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/alumni/search/:query
// @desc    Search alumni
// @access  Private
router.get('/search/:query', auth, async (req, res) => {
    try {
        const alumni = await Alumni.searchAlumni(req.params.query);

        res.json({
            success: true,
            data: alumni
        });

    } catch (error) {
        console.error('Search alumni error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PATCH /api/alumni/:id/verify
// @desc    Verify alumni record
// @access  Private (Manage Users Permission)
router.patch('/:id/verify', auth, canManageUsers, async (req, res) => {
    try {
        const alumni = await Alumni.findByIdAndUpdate(
            req.params.id,
            { 
                isVerified: true,
                verifiedBy: req.admin.id,
                verifiedAt: new Date(),
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        );

        if (!alumni) {
            return res.status(404).json({
                success: false,
                message: 'Alumni not found'
            });
        }

        res.json({
            success: true,
            message: 'Alumni record verified successfully',
            data: alumni
        });

    } catch (error) {
        console.error('Verify alumni error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
