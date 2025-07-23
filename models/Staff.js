const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const staffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        trim: true,
        match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    position: {
        type: String,
        required: [true, 'Position is required'],
        trim: true,
        maxlength: [100, 'Position cannot exceed 100 characters']
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        enum: {
            values: ['director', 'ece', 'cs', 'me', 'ee', 'ce', 'admin', 'other'],
            message: 'Invalid department'
        }
    },
    qualification: {
        type: String,
        trim: true,
        maxlength: [200, 'Qualification cannot exceed 200 characters']
    },
    experience: {
        type: Number,
        min: [0, 'Experience cannot be negative'],
        max: [50, 'Experience cannot exceed 50 years']
    },
    joiningDate: {
        type: Date,
        default: Date.now
    },
    salary: {
        type: Number,
        min: [0, 'Salary cannot be negative']
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: {
            type: String,
            default: 'India'
        }
    },
    profileImage: {
        url: String,
        publicId: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    bio: {
        type: String,
        maxlength: [1000, 'Bio cannot exceed 1000 characters']
    },
    specializations: [{
        type: String,
        trim: true
    }],
    publications: [{
        title: String,
        journal: String,
        year: Number,
        url: String
    }],
    socialLinks: {
        linkedin: String,
        researchGate: String,
        googleScholar: String,
        orcid: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for better performance
staffSchema.index({ department: 1, isActive: 1 });
staffSchema.index({ email: 1 });
staffSchema.index({ name: 'text', qualification: 'text', specializations: 'text' });

// Virtual for full name formatting
staffSchema.virtual('displayName').get(function() {
    return this.name;
});

// Method to get years of experience
staffSchema.methods.getYearsOfExperience = function() {
    if (!this.joiningDate) return 0;
    const diffTime = Math.abs(new Date() - this.joiningDate);
    const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
    return diffYears;
};

// Static method to get staff by department
staffSchema.statics.getByDepartment = function(department) {
    return this.find({ department, isActive: true }).sort({ name: 1 });
};

// Static method to search staff
staffSchema.statics.searchStaff = function(query) {
    return this.find({
        $and: [
            { isActive: true },
            {
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { qualification: { $regex: query, $options: 'i' } },
                    { specializations: { $regex: query, $options: 'i' } },
                    { position: { $regex: query, $options: 'i' } }
                ]
            }
        ]
    }).sort({ name: 1 });
};

// Add pagination plugin
staffSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Staff', staffSchema);
