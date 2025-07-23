const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        trim: true,
        match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number']
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true,
        maxlength: [200, 'Subject cannot exceed 200 characters']
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
        minlength: [10, 'Message must be at least 10 characters'],
        maxlength: [2000, 'Message cannot exceed 2000 characters']
    },
    category: {
        type: String,
        enum: {
            values: ['general', 'admission', 'academic', 'technical', 'complaint', 'suggestion', 'media', 'other'],
            message: 'Invalid category'
        },
        default: 'general'
    },
    priority: {
        type: String,
        enum: {
            values: ['low', 'medium', 'high', 'urgent'],
            message: 'Invalid priority'
        },
        default: 'medium'
    },
    status: {
        type: String,
        enum: {
            values: ['new', 'in-progress', 'resolved', 'closed'],
            message: 'Invalid status'
        },
        default: 'new'
    },
    userType: {
        type: String,
        enum: {
            values: ['student', 'parent', 'faculty', 'staff', 'alumni', 'visitor', 'media', 'other'],
            message: 'Invalid user type'
        },
        default: 'visitor'
    },
    department: {
        type: String,
        enum: {
            values: ['', 'cse', 'ece', 'me', 'ce', 'ee', 'it', 'mca', 'mba', 'admin'],
            message: 'Invalid department'
        }
    },
    attachments: [{
        name: String,
        url: String,
        publicId: String,
        type: String,
        size: Number
    }],
    ipAddress: String,
    userAgent: String,
    referrer: String,
    isRead: {
        type: Boolean,
        default: false
    },
    readBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    readAt: Date,
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    assignedAt: Date,
    response: {
        message: String,
        respondedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin'
        },
        respondedAt: Date,
        method: {
            type: String,
            enum: ['email', 'phone', 'in-person', 'other']
        }
    },
    followUp: [{
        message: String,
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin'
        },
        addedAt: {
            type: Date,
            default: Date.now
        },
        type: {
            type: String,
            enum: ['note', 'call', 'email', 'meeting']
        }
    }],
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    isSpam: {
        type: Boolean,
        default: false
    },
    spamReason: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    feedback: String,
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
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ category: 1, createdAt: -1 });
contactSchema.index({ priority: 1, status: 1 });
contactSchema.index({ assignedTo: 1, status: 1 });
contactSchema.index({ email: 1 });
contactSchema.index({ name: 'text', subject: 'text', message: 'text' });

// Virtual for response time
contactSchema.virtual('responseTime').get(function() {
    if (!this.response || !this.response.respondedAt) return null;
    const diffTime = this.response.respondedAt - this.createdAt;
    const diffHours = Math.round(diffTime / (1000 * 60 * 60));
    return diffHours;
});

// Virtual for time since creation
contactSchema.virtual('timeSinceCreation').get(function() {
    const diffTime = new Date() - this.createdAt;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
        const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    }
});

// Pre-save middleware to mark as read when response is added
contactSchema.pre('save', function(next) {
    if (this.isModified('response') && this.response && this.response.message) {
        this.isRead = true;
        this.status = 'resolved';
    }
    next();
});

// Static method to get unread contacts
contactSchema.statics.getUnread = function() {
    return this.find({ isRead: false })
        .sort({ priority: -1, createdAt: -1 });
};

// Static method to get contacts by status
contactSchema.statics.getByStatus = function(status) {
    return this.find({ status })
        .sort({ priority: -1, createdAt: -1 });
};

// Static method to get contacts by category
contactSchema.statics.getByCategory = function(category) {
    return this.find({ category })
        .sort({ priority: -1, createdAt: -1 });
};

// Static method to get high priority contacts
contactSchema.statics.getHighPriority = function() {
    return this.find({ 
        priority: { $in: ['high', 'urgent'] },
        status: { $in: ['new', 'in-progress'] }
    })
    .sort({ priority: -1, createdAt: -1 });
};

// Static method to get contacts assigned to admin
contactSchema.statics.getAssignedTo = function(adminId) {
    return this.find({ assignedTo: adminId })
        .sort({ priority: -1, createdAt: -1 });
};

// Static method to search contacts
contactSchema.statics.searchContacts = function(query) {
    return this.find({
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
            { subject: { $regex: query, $options: 'i' } },
            { message: { $regex: query, $options: 'i' } }
        ]
    })
    .sort({ createdAt: -1 });
};

// Static method to get contact statistics
contactSchema.statics.getStats = function() {
    return this.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
                inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
                resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
                closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
                unread: { $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] } },
                highPriority: { $sum: { $cond: [{ $in: ['$priority', ['high', 'urgent']] }, 1, 0] } }
            }
        }
    ]);
};

// Instance method to mark as read
contactSchema.methods.markAsRead = function(adminId) {
    this.isRead = true;
    this.readBy = adminId;
    this.readAt = new Date();
    return this.save();
};

// Instance method to assign to admin
contactSchema.methods.assignTo = function(adminId) {
    this.assignedTo = adminId;
    this.assignedAt = new Date();
    this.status = 'in-progress';
    return this.save();
};

// Instance method to add response
contactSchema.methods.addResponse = function(responseData) {
    this.response = {
        ...responseData,
        respondedAt: new Date()
    };
    this.status = 'resolved';
    this.isRead = true;
    return this.save();
};

// Instance method to add follow-up
contactSchema.methods.addFollowUp = function(followUpData) {
    this.followUp.push(followUpData);
    return this.save();
};

// Add pagination plugin
contactSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Contact', contactSchema);
