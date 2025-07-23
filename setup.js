const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
require('dotenv').config();

const createDefaultAdmin = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/soet-university', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ role: 'super_admin' });
        
        if (existingAdmin) {
            console.log('Super admin already exists:', existingAdmin.email);
            process.exit(0);
        }

        // Create default super admin
        const defaultAdmin = new Admin({
            name: 'Super Administrator',
            email: process.env.ADMIN_EMAIL || 'admin@soetuniversity.com',
            password: process.env.ADMIN_PASSWORD || 'admin123',
            role: 'super_admin',
            permissions: [
                'manage_users',
                'manage_content',
                'view_analytics',
                'manage_settings',
                'manage_system'
            ],
            isActive: true
        });

        await defaultAdmin.save();
        
        console.log('✅ Default super admin created successfully!');
        console.log('📧 Email:', defaultAdmin.email);
        console.log('🔑 Password:', process.env.ADMIN_PASSWORD || 'admin123');
        console.log('⚠️  Please change the password after first login!');
        
        process.exit(0);

    } catch (error) {
        console.error('❌ Error creating default admin:', error.message);
        process.exit(1);
    }
};

createDefaultAdmin();
