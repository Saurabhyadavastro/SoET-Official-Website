const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const alumniSchema = new mongoose.Schema({
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
    rollNumber: {
        type: String,
        trim: true,
        uppercase: true
    },
    graduationYear: {
        type: Number,
        required: [true, 'Graduation year is required'],
        min: [2000, 'Graduation year must be after 2000'],
        max: [new Date().getFullYear(), 'Graduation year cannot be in the future']
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        enum: {
            values: ['cs', 'ece', 'me', 'ee', 'ce', 'other'],
            message: 'Invalid department'
        }
    },
    degree: {
        type: String,
        required: [true, 'Degree is required'],
        enum: {
            values: ['B.Tech', 'M.Tech', 'PhD', 'Diploma'],
            message: 'Invalid degree'
        }
    },
    currentPosition: {
        type: String,
        trim: true,
        maxlength: [100, 'Position cannot exceed 100 characters']
    },
    currentCompany: {
        type: String,
        trim: true,
        maxlength: [100, 'Company name cannot exceed 100 characters']
    },
    currentLocation: {
        city: String,
        state: String,
        country: {
            type: String,
            default: 'India'
        }
    },
    employmentStatus: {
        type: String,
        enum: {
            values: ['employed', 'entrepreneur', 'higher-studies', 'job-seeking', 'other'],
            message: 'Invalid employment status'
        },
        default: 'employed'
    },
    workExperience: {
        type: Number,
        min: [0, 'Work experience cannot be negative'],
        max: [50, 'Work experience cannot exceed 50 years']
    },
    salary: {
        type: Number,
        min: [0, 'Salary cannot be negative']
    },
    profileImage: {
        url: String,
        publicId: String
    },
    bio: {
        type: String,
        maxlength: [1000, 'Bio cannot exceed 1000 characters']
    },
    achievements: [{
        title: String,
        description: String,
        year: Number,
        category: {
            type: String,
            enum: ['award', 'recognition', 'publication', 'patent', 'other']
        }
    }],
    socialLinks: {
        linkedin: String,
        twitter: String,
        github: String,
        website: String
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
    isVerified: {
        type: Boolean,
        default: false
    },
    isPublicProfile: {
        type: Boolean,
        default: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for better performance
alumniSchema.index({ graduationYear: 1, department: 1 });
alumniSchema.index({ employmentStatus: 1 });
alumniSchema.index({ email: 1 });
alumniSchema.index({ name: 'text', currentCompany: 'text', currentPosition: 'text' });

// Virtual for batch display
alumniSchema.virtual('batchDisplay').get(function() {
    return `Batch of ${this.graduationYear}`;
});

// Virtual for experience calculation
alumniSchema.virtual('yearsOfExperience').get(function() {
    if (!this.workExperience) {
        const currentYear = new Date().getFullYear();
        return Math.max(0, currentYear - this.graduationYear);
    }
    return this.workExperience;
});

// Method to get alumni by year range
alumniSchema.statics.getByYearRange = function(startYear, endYear) {
    return this.find({
        graduationYear: { $gte: startYear, $lte: endYear },
        isPublicProfile: true
    }).sort({ graduationYear: -1, name: 1 });
};

// Method to get alumni by department
alumniSchema.statics.getByDepartment = function(department) {
    return this.find({ 
        department, 
        isPublicProfile: true 
    }).sort({ graduationYear: -1, name: 1 });
};

// Method to get alumni by employment status
alumniSchema.statics.getByEmploymentStatus = function(status) {
    return this.find({ 
        employmentStatus: status,
        isPublicProfile: true 
    }).sort({ graduationYear: -1, name: 1 });
};

// Method to search alumni
alumniSchema.statics.searchAlumni = function(query) {
    return this.find({
        $and: [
            { isPublicProfile: true },
            {
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { currentCompany: { $regex: query, $options: 'i' } },
                    { currentPosition: { $regex: query, $options: 'i' } },
                    { rollNumber: { $regex: query, $options: 'i' } }
                ]
            }
        ]
    }).sort({ graduationYear: -1, name: 1 });
};

// Method to get recent graduates
alumniSchema.statics.getRecentGraduates = function(years = 3) {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - years;
    
    return this.find({
        graduationYear: { $gte: startYear },
        isPublicProfile: true
    }).sort({ graduationYear: -1, name: 1 });
};

// Add pagination plugin
alumniSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Alumni', alumniSchema);
