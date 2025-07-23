const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Event description is required'],
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    category: {
        type: String,
        required: [true, 'Event category is required'],
        enum: {
            values: ['academic', 'cultural', 'technical', 'sports', 'workshop', 'seminar', 'conference', 'other'],
            message: 'Invalid event category'
        }
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    startTime: {
        type: String,
        required: [true, 'Start time is required']
    },
    endTime: {
        type: String,
        required: [true, 'End time is required']
    },
    venue: {
        type: String,
        required: [true, 'Venue is required'],
        trim: true,
        maxlength: [200, 'Venue cannot exceed 200 characters']
    },
    organizer: {
        name: {
            type: String,
            required: [true, 'Organizer name is required'],
            trim: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
        },
        phone: {
            type: String,
            trim: true
        },
        department: {
            type: String,
            trim: true
        }
    },
    maxParticipants: {
        type: Number,
        min: [1, 'Max participants must be at least 1']
    },
    registrationDeadline: {
        type: Date
    },
    registrationFee: {
        type: Number,
        min: [0, 'Registration fee cannot be negative'],
        default: 0
    },
    status: {
        type: String,
        enum: {
            values: ['upcoming', 'ongoing', 'completed', 'cancelled'],
            message: 'Invalid event status'
        },
        default: 'upcoming'
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    requiresRegistration: {
        type: Boolean,
        default: false
    },
    images: [{
        url: String,
        publicId: String,
        caption: String
    }],
    bannerImage: {
        url: String,
        publicId: String
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    resources: [{
        name: String,
        url: String,
        type: {
            type: String,
            enum: ['document', 'video', 'link', 'other']
        }
    }],
    registrations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EventRegistration'
    }],
    feedback: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EventFeedback'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
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
eventSchema.index({ startDate: 1, status: 1 });
eventSchema.index({ category: 1, status: 1 });
eventSchema.index({ isPublic: 1, status: 1 });
eventSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual for duration
eventSchema.virtual('duration').get(function() {
    if (!this.startDate || !this.endDate) return null;
    const diffTime = Math.abs(this.endDate - this.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
});

// Virtual for registration count
eventSchema.virtual('registrationCount', {
    ref: 'EventRegistration',
    localField: '_id',
    foreignField: 'event',
    count: true
});

// Pre-save middleware to update status based on dates
eventSchema.pre('save', function(next) {
    const now = new Date();
    const startDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);
    
    // Auto-update status based on dates
    if (this.status !== 'cancelled') {
        if (now < startDate) {
            this.status = 'upcoming';
        } else if (now >= startDate && now <= endDate) {
            this.status = 'ongoing';
        } else if (now > endDate) {
            this.status = 'completed';
        }
    }
    
    next();
});

// Static method to get upcoming events
eventSchema.statics.getUpcoming = function(limit = 10) {
    return this.find({
        status: 'upcoming',
        isPublic: true,
        startDate: { $gte: new Date() }
    })
    .sort({ startDate: 1 })
    .limit(limit);
};

// Static method to get events by category
eventSchema.statics.getByCategory = function(category) {
    return this.find({
        category,
        isPublic: true
    }).sort({ startDate: -1 });
};

// Static method to get events by date range
eventSchema.statics.getByDateRange = function(startDate, endDate) {
    return this.find({
        isPublic: true,
        $or: [
            {
                startDate: { $gte: startDate, $lte: endDate }
            },
            {
                endDate: { $gte: startDate, $lte: endDate }
            },
            {
                startDate: { $lte: startDate },
                endDate: { $gte: endDate }
            }
        ]
    }).sort({ startDate: 1 });
};

// Static method to search events
eventSchema.statics.searchEvents = function(query) {
    return this.find({
        $and: [
            { isPublic: true },
            {
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } },
                    { tags: { $regex: query, $options: 'i' } },
                    { venue: { $regex: query, $options: 'i' } }
                ]
            }
        ]
    }).sort({ startDate: -1 });
};

// Add pagination plugin
eventSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Event', eventSchema);
