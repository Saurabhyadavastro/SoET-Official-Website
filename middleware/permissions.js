const Admin = require('../models/Admin');

// Check if admin has specific permission
const hasPermission = (permission) => {
    return async (req, res, next) => {
        try {
            const admin = await Admin.findById(req.admin.id);
            
            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: 'Admin not found'
                });
            }

            // Super admin has all permissions
            if (admin.role === 'super_admin') {
                return next();
            }

            // Check if admin has the required permission
            if (!admin.permissions.includes(permission)) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied. Required permission: ${permission}`
                });
            }

            next();
        } catch (error) {
            console.error('Permission check error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error in permission check'
            });
        }
    };
};

// Check if admin has specific role
const hasRole = (roles) => {
    return async (req, res, next) => {
        try {
            const admin = await Admin.findById(req.admin.id);
            
            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: 'Admin not found'
                });
            }

            // Convert single role to array
            const allowedRoles = Array.isArray(roles) ? roles : [roles];

            if (!allowedRoles.includes(admin.role)) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
                });
            }

            next();
        } catch (error) {
            console.error('Role check error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error in role check'
            });
        }
    };
};

// Check if admin is super admin
const isSuperAdmin = hasRole('super_admin');

// Check if admin can manage users
const canManageUsers = hasPermission('manage_users');

// Check if admin can manage content
const canManageContent = hasPermission('manage_content');

// Check if admin can view analytics
const canViewAnalytics = hasPermission('view_analytics');

// Check if admin can manage settings
const canManageSettings = hasPermission('manage_settings');

module.exports = {
    hasPermission,
    hasRole,
    isSuperAdmin,
    canManageUsers,
    canManageContent,
    canViewAnalytics,
    canManageSettings
};
