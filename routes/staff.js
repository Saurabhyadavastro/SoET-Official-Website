const express = require('express');
const Staff = require('../models/Staff');
const auth = require('../middleware/auth');
const { canManageUsers } = require('../middleware/permissions');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/staff
// @desc    Get all staff members
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            department, 
            position, 
            status = 'active',
            search 
        } = req.query;

        let query = {};

        // Filter by status
        if (status !== 'all') {
            query.status = status;
        }

        // Filter by department
        if (department && department !== 'all') {
            query.department = department;
        }

        // Filter by position
        if (position && position !== 'all') {
            query.position = position;
        }

        // Search functionality
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { employeeId: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 }
        };

        const staff = await Staff.paginate(query, options);

        res.json({
            success: true,
            data: staff.docs,
            pagination: {
                currentPage: staff.page,
                totalPages: staff.totalPages,
                totalDocs: staff.totalDocs,
                limit: staff.limit,
                hasNextPage: staff.hasNextPage,
                hasPrevPage: staff.hasPrevPage
            }
        });

    } catch (error) {
        console.error('Get staff error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/staff/:id
// @desc    Get staff member by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: 'Staff member not found'
            });
        }

        res.json({
            success: true,
            data: staff
        });

    } catch (error) {
        console.error('Get staff by ID error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Staff member not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/staff
// @desc    Create new staff member
// @access  Private (Manage Users Permission)
router.post('/', auth, canManageUsers, upload.single('profilePhoto'), async (req, res) => {
    try {
        const staffData = { ...req.body };

        // Add profile photo if uploaded
        if (req.file) {
            staffData.profilePhoto = {
                url: req.file.path,
                publicId: req.file.filename
            };
        }

        // Add created by
        staffData.createdBy = req.admin.id;

        const staff = new Staff(staffData);
        await staff.save();

        res.status(201).json({
            success: true,
            message: 'Staff member created successfully',
            data: staff
        });

    } catch (error) {
        console.error('Create staff error:', error);
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

// @route   PUT /api/staff/:id
// @desc    Update staff member
// @access  Private (Manage Users Permission)
router.put('/:id', auth, canManageUsers, upload.single('profilePhoto'), async (req, res) => {
    try {
        let staff = await Staff.findById(req.params.id);

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: 'Staff member not found'
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

        staff = await Staff.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Staff member updated successfully',
            data: staff
        });

    } catch (error) {
        console.error('Update staff error:', error);
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

// @route   DELETE /api/staff/:id
// @desc    Delete staff member
// @access  Private (Manage Users Permission)
router.delete('/:id', auth, canManageUsers, async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: 'Staff member not found'
            });
        }

        await Staff.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Staff member deleted successfully'
        });

    } catch (error) {
        console.error('Delete staff error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/staff/department/:department
// @desc    Get staff by department
// @access  Private
router.get('/department/:department', auth, async (req, res) => {
    try {
        const staff = await Staff.getByDepartment(req.params.department);

        res.json({
            success: true,
            data: staff
        });

    } catch (error) {
        console.error('Get staff by department error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/staff/stats
// @desc    Get staff statistics
// @access  Private
router.get('/stats/overview', auth, async (req, res) => {
    try {
        const stats = await Staff.getStats();

        res.json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('Get staff stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PATCH /api/staff/:id/status
// @desc    Update staff status
// @access  Private (Manage Users Permission)
router.patch('/:id/status', auth, canManageUsers, async (req, res) => {
    try {
        const { status } = req.body;

        if (!['active', 'inactive', 'on_leave'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const staff = await Staff.findByIdAndUpdate(
            req.params.id,
            { 
                status,
                updatedBy: req.admin.id,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        );

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: 'Staff member not found'
            });
        }

        res.json({
            success: true,
            message: 'Staff status updated successfully',
            data: staff
        });

    } catch (error) {
        console.error('Update staff status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
