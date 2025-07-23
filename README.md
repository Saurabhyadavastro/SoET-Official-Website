# SOET University Website

A modern, full-stack university website with administrative backend for the School of Engineering and Technology (SOET), Vikram University.

## 🚀 Features

### Frontend Features
- **Responsive Design**: Mobile-first, fully responsive interface
- **Modern UI/UX**: Clean, professional design with university branding
- **Dynamic Content**: Real-time announcements, events, and news
- **Interactive Elements**: Contact forms, announcement system, event management
- **University Branding**: Consistent color scheme and logo integration

### Backend Features
- **RESTful API**: Complete REST API for all operations
- **Admin Panel**: Comprehensive administrative dashboard
- **Authentication & Authorization**: JWT-based secure authentication with role-based permissions
- **File Upload**: Cloudinary integration for image and document management
- **Database Management**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS, rate limiting, input validation
- **Email Integration**: Nodemailer for contact form and notifications

### Admin Dashboard Features
- **Staff Management**: Add, edit, delete, and manage staff profiles
- **Alumni Management**: Track and manage alumni database
- **Event Management**: Create and manage university events
- **Announcement System**: Publish and manage announcements
- **Contact Management**: Handle contact form submissions
- **Analytics**: View statistics and insights
- **User Management**: Manage admin accounts and permissions

## 🛠️ Technology Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Font Awesome Icons
- Poppins Font Family
- Responsive Grid Layout

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary (File Storage)
- Nodemailer (Email)

### Security & Performance
- Helmet.js (Security Headers)
- CORS Configuration
- Rate Limiting
- Data Validation
- Password Hashing (bcrypt)
- Input Sanitization

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- [Git](https://git-scm.com/)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd soet-university
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

Copy the example environment file and configure it:
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
CLIENT_URL=http://localhost:3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/soet-university

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@soetuniversity.com
FROM_NAME=SOET University

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Admin Configuration
ADMIN_EMAIL=admin@soetuniversity.com
ADMIN_PASSWORD=admin123
```

### 4. Database Setup

Start MongoDB service and create default admin user:
```bash
# Create default admin user
node setup.js
```

### 5. Start the Application

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

The application will be available at:
- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin-dashboard
- **API Documentation**: http://localhost:3000/api/health

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Create new admin (Super Admin only)
- `GET /api/auth/me` - Get current admin profile
- `PUT /api/auth/profile` - Update admin profile
- `POST /api/auth/logout` - Logout
- `POST /api/auth/change-password` - Change password

### Staff Management
- `GET /api/staff` - Get all staff members
- `GET /api/staff/:id` - Get staff member by ID
- `POST /api/staff` - Create new staff member
- `PUT /api/staff/:id` - Update staff member
- `DELETE /api/staff/:id` - Delete staff member
- `GET /api/staff/department/:dept` - Get staff by department

### Alumni Management
- `GET /api/alumni` - Get all alumni
- `GET /api/alumni/:id` - Get alumni by ID
- `POST /api/alumni` - Create new alumni record
- `PUT /api/alumni/:id` - Update alumni record
- `DELETE /api/alumni/:id` - Delete alumni record

### Event Management
- `GET /api/events` - Get all events
- `GET /api/events/upcoming` - Get upcoming events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Announcement Management
- `GET /api/announcements` - Get all announcements
- `GET /api/announcements/homepage` - Get homepage announcements
- `GET /api/announcements/:id` - Get announcement by ID
- `POST /api/announcements` - Create new announcement
- `PUT /api/announcements/:id` - Update announcement
- `DELETE /api/announcements/:id` - Delete announcement

### Contact Management
- `POST /api/contact` - Submit contact form (Public)
- `GET /api/contact` - Get all contact messages (Admin)
- `GET /api/contact/:id` - Get contact message by ID
- `POST /api/contact/:id/response` - Add response to contact
- `PATCH /api/contact/:id/status` - Update contact status

### File Upload
- `POST /api/upload/single` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files
- `DELETE /api/upload/:publicId` - Delete file

## 🔐 Admin Panel Access

### Default Admin Credentials
- **Email**: admin@soetuniversity.com
- **Password**: admin123

⚠️ **Important**: Change the default password after first login!

### Admin Roles & Permissions
- **Super Admin**: Full system access
- **Admin**: Content and user management
- **Editor**: Content management only

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=80
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/soet-university
JWT_SECRET=your-production-jwt-secret
# ... other production variables
```

### Deployment Platforms
- **Heroku**: Add Procfile with `web: node server.js`
- **Vercel**: Configure vercel.json for Node.js
- **AWS/DigitalOcean**: Standard Node.js deployment

## 📁 Project Structure

```
soet-university/
├── models/                 # Database models
│   ├── Admin.js
│   ├── Staff.js
│   ├── Alumni.js
│   ├── Event.js
│   ├── Announcement.js
│   └── Contact.js
├── routes/                 # API routes
│   ├── auth.js
│   ├── staff.js
│   ├── alumni.js
│   ├── events.js
│   ├── announcements.js
│   ├── contact.js
│   └── upload.js
├── middleware/             # Custom middleware
│   ├── auth.js
│   ├── permissions.js
│   └── upload.js
├── public/                 # Static files
├── views/                  # HTML templates
│   ├── index.html
│   ├── about.html
│   ├── academics.html
│   ├── facilities.html
│   ├── activities.html
│   ├── contact.html
│   ├── announcements.html
│   ├── admin-login.html
│   └── admin-dashboard.html
├── styles/                 # CSS files
├── scripts/                # JavaScript files
├── server.js              # Main server file
├── setup.js               # Database setup script
├── package.json
├── .env.example
└── README.md
```

## 🧪 Testing

Run the health check endpoint to verify the API:
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development",
  "version": "1.0.0"
}
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env file
   - Verify network connectivity

2. **File Upload Not Working**
   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure proper CORS configuration

3. **Email Not Sending**
   - Verify SMTP credentials
   - Check email provider settings
   - Enable "Less secure app access" for Gmail

4. **Admin Panel Not Loading**
   - Check browser console for errors
   - Verify all static files are served correctly
   - Check admin authentication

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions, please contact:
- **Email**: admin@soetuniversity.com
- **Phone**: +91-XXXX-XXXX
- **Address**: SOET, Vikram University, Ujjain, MP, India

---

**Made with ❤️ for SOET University**

A modern, responsive website for the School of Engineering and Technology at Vikram University Ujjain.

## Color Scheme Used

- **Primary Red**: #841C2C (Main headings and accents)
- **Primary Blue**: #211D70 (Fonts and text)
- **Background Cream**: #FFE8BF (Site background)
- **Black**: #000000 (Normal text)
- **White**: #FFFFFF (Cards and contrasts)

## Features

### 🎨 Design Features
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional design with smooth animations
- **Custom Color Scheme**: Uses the specified colors throughout the site
- **Typography**: Beautiful Poppins font family for excellent readability

### 📱 Responsive Elements
- Mobile-friendly navigation with hamburger menu
- Flexible grid layouts that adapt to screen size
- Optimized images and content for all devices
- Touch-friendly buttons and interactions

### 🏗️ Website Sections

1. **Header & Navigation**
   - University logo and SOET branding
   - Clean navigation menu
   - Mobile-responsive hamburger menu

2. **Hero Section**
   - Inspiring quote and call-to-action buttons
   - Animated statistics (Year established, courses, students, faculty)
   - Engaging background with university colors

3. **About Section**
   - Mission and vision statements
   - Key highlights with icons
   - Campus image showcase

4. **Academic Programs**
   - 6 major engineering disciplines
   - Computer Science, Electronics, Mechanical, Electrical, Civil, Chemical
   - Icon-based program cards

5. **Facilities**
   - Modern laboratories
   - Auditorium
   - Central library
   - Campus infrastructure

6. **Student Activities**
   - Tabbed interface for different activity types
   - Academic activities (workshops, coding society)
   - Cultural events (Engineers Day, competitions)
   - Social initiatives (plantation, cleanliness drives)

7. **Quick Links**
   - Online fee payment
   - University website
   - Examination results
   - Academic calendar

8. **Contact Section**
   - Complete contact information
   - Interactive contact form
   - Address and phone details

9. **Footer**
   - Comprehensive links and information
   - Social media integration
   - Visitor counter

### ⚡ Interactive Features
- Smooth scrolling navigation
- Animated counters in hero section
- Tabbed content for activities
- Form validation
- Hover effects on cards
- Back-to-top button
- Typing animation for hero title
- Scroll-based animations

## Technical Implementation

### Technologies Used
- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with flexbox and grid
- **JavaScript**: Interactive functionality and animations
- **Font Awesome**: Icons throughout the site
- **Google Fonts**: Poppins font family

### Performance Features
- Optimized images and assets
- Smooth animations and transitions
- Lazy loading for better performance
- Local storage for visitor counter

## File Structure
```
/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
├── README.md           # Documentation
└── IMG/                # Image assets
    ├── Logo.png
    ├── Vikram-university_Logo.jpg
    ├── Academics Activities/
    ├── College Pics/
    ├── Cultural Activities/
    └── Social Activities/
```

## Usage Instructions

1. **Opening the Website**
   - Open `index.html` in any modern web browser
   - The site will load with all functionality active

2. **Navigation**
   - Click on navigation links for smooth scrolling
   - Use the mobile menu on smaller screens

3. **Activities Section**
   - Click on Academic, Cultural, or Social tabs
   - View different types of student activities

4. **Contact Form**
   - Fill out the form to send inquiries
   - Form includes validation for required fields

## Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Image Assets
The website uses images from the provided IMG folder:
- University logo for branding
- Campus photos for visual appeal
- Activity photos for student life showcase
- Facility images for infrastructure display

## Customization
The website can be easily customized by:
- Updating colors in CSS variables
- Replacing images in the IMG folder
- Modifying content in HTML
- Adding new sections or features

## Credits
- Designed for School of Engineering and Technology
- Vikram University Ujjain
- Built with modern web technologies
- Responsive design principles applied

---

**Note**: This website is designed to be clean, professional, and focused on essential sections for an engineering school. It emphasizes the university's heritage while showcasing modern facilities and programs.
