const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Announcement title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Announcement content is required'],
        trim: true,
        maxlength: [5000, 'Content cannot exceed 5000 characters']
    },
    category: {
        type: String,
        required: [true, 'Announcement category is required'],
        enum: {
            values: ['urgent', 'academic', 'administrative', 'event', 'examination', 'admission', 'general', 'holiday'],
            message: 'Invalid announcement category'
        }
    },
    priority: {
        type: String,
        enum: {
            values: ['low', 'medium', 'high', 'urgent'],
            message: 'Invalid priority level'
        },
        default: 'medium'
    },
    targetAudience: [{
        type: String,
        enum: {
            values: ['all', 'students', 'faculty', 'staff', 'parents', 'alumni', 'first-year', 'second-year', 'third-year', 'final-year'],
            message: 'Invalid target audience'
        }
    }],
    department: [{
        type: String,
        enum: {
            values: ['all', 'cse', 'ece', 'me', 'ce', 'ee', 'it', 'mca', 'mba'],
            message: 'Invalid department'
        }
    }],
    publishDate: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    showOnHomepage: {
        type: Boolean,
        default: false
    },
    allowComments: {
        type: Boolean,
        default: false
    },
    attachments: [{
        name: String,
        url: String,
        publicId: String,
        type: String,
        size: Number
    }],
    images: [{
        url: String,
        publicId: String,
        caption: String
    }],
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: String,
        email: String,
        content: String,
        createdAt: {
            type: Date,
            default: Date.now
        },
        isApproved: {
            type: Boolean,
            default: false
        }
    }],
    notificationSent: {
        type: Boolean,
        default: false
    },
    emailSent: {
        type: Boolean,
        default: false
    },
    smsSent: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
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
announcementSchema.index({ publishDate: -1, isActive: 1 });
announcementSchema.index({ category: 1, isActive: 1 });
announcementSchema.index({ priority: 1, isPinned: 1 });
announcementSchema.index({ expiryDate: 1 });
announcementSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Virtual for like count
announcementSchema.virtual('likeCount').get(function() {
    return this.likes ? this.likes.length : 0;
});

// Virtual for comment count
announcementSchema.virtual('commentCount').get(function() {
    return this.comments ? this.comments.filter(c => c.isApproved).length : 0;
});

// Virtual to check if announcement is expired
announcementSchema.virtual('isExpired').get(function() {
    if (!this.expiryDate) return false;
    return new Date() > this.expiryDate;
});

// Virtual to get days until expiry
announcementSchema.virtual('daysUntilExpiry').get(function() {
    if (!this.expiryDate) return null;
    const diffTime = this.expiryDate - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
});

// Pre-save middleware to auto-deactivate expired announcements
announcementSchema.pre('save', function(next) {
    if (this.expiryDate && new Date() > this.expiryDate) {
        this.isActive = false;
    }
    next();
});

// Static method to get active announcements
announcementSchema.statics.getActive = function(limit = 10) {
    return this.find({
        isActive: true,
        publishDate: { $lte: new Date() },
        $or: [
            { expiryDate: { $gte: new Date() } },
            { expiryDate: null }
        ]
    })
    .sort({ isPinned: -1, priority: -1, publishDate: -1 })
    .limit(limit);
};

// Static method to get pinned announcements
announcementSchema.statics.getPinned = function() {
    return this.find({
        isPinned: true,
        isActive: true,
        publishDate: { $lte: new Date() },
        $or: [
            { expiryDate: { $gte: new Date() } },
            { expiryDate: null }
        ]
    })
    .sort({ priority: -1, publishDate: -1 });
};

// Static method to get announcements by category
announcementSchema.statics.getByCategory = function(category) {
    return this.find({
        category,
        isActive: true,
        publishDate: { $lte: new Date() },
        $or: [
            { expiryDate: { $gte: new Date() } },
            { expiryDate: null }
        ]
    })
    .sort({ isPinned: -1, priority: -1, publishDate: -1 });
};

// Static method to get announcements for target audience
announcementSchema.statics.getForAudience = function(audience) {
    return this.find({
        targetAudience: { $in: ['all', audience] },
        isActive: true,
        publishDate: { $lte: new Date() },
        $or: [
            { expiryDate: { $gte: new Date() } },
            { expiryDate: null }
        ]
    })
    .sort({ isPinned: -1, priority: -1, publishDate: -1 });
};

// Static method to get homepage announcements
announcementSchema.statics.getHomepage = function() {
    return this.find({
        showOnHomepage: true,
        isActive: true,
        publishDate: { $lte: new Date() },
        $or: [
            { expiryDate: { $gte: new Date() } },
            { expiryDate: null }
        ]
    })
    .sort({ isPinned: -1, priority: -1, publishDate: -1 })
    .limit(5);
};

// Static method to search announcements
announcementSchema.statics.searchAnnouncements = function(query) {
    return this.find({
        $and: [
            { isActive: true },
            { publishDate: { $lte: new Date() } },
            {
                $or: [
                    { expiryDate: { $gte: new Date() } },
                    { expiryDate: null }
                ]
            },
            {
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { content: { $regex: query, $options: 'i' } },
                    { tags: { $regex: query, $options: 'i' } }
                ]
            }
        ]
    })
    .sort({ isPinned: -1, priority: -1, publishDate: -1 });
};

// Instance method to increment views
announcementSchema.methods.incrementViews = function() {
    this.views += 1;
    return this.save();
};

// Instance method to add like
announcementSchema.methods.addLike = function(userId) {
    if (!this.likes.includes(userId)) {
        this.likes.push(userId);
    }
    return this.save();
};

// Instance method to remove like
announcementSchema.methods.removeLike = function(userId) {
    this.likes = this.likes.filter(id => id.toString() !== userId.toString());
    return this.save();
};

// Instance method to add comment
announcementSchema.methods.addComment = function(comment) {
    this.comments.push(comment);
    return this.save();
};

// Add pagination plugin
announcementSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Announcement', announcementSchema);
