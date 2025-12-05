# SOET University Website

A modern, full-stack website and administrative backend for the School of Engineering and Technology (SOET), Vikram University, Ujjain, MP.

---

## 🚀 Features

### Frontend
- Responsive, mobile-first design
- Real-time announcements, events, and news
- Interactive elements: contact forms, event management

### Backend
- RESTful API
- Administrative dashboard
- JWT-based authentication and role management
- File upload with Cloudinary
- MongoDB database

### Security
- Helmet, CORS, rate limiting, input validation
- Email notifications via Nodemailer

---

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT
- **Others:** Cloudinary, Nodemailer, Font Awesome

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) v14+
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- [Git](https://git-scm.com/)

---

## 🔧 Installation & Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd soet-university
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy and configure your environment file:
   ```bash
   cp .env.example .env
   ```
   > ⚠️ **Important:**  
   > - Edit the `.env` file with secure, random values for secrets.
   > - Never commit the `.env` file.
   > - Change all default credentials before production use.

4. Start MongoDB, then initialize the admin user:
   ```bash
   node setup.js
   ```

5. Run in development:
   ```bash
   npm run dev
   ```
   Or production:
   ```bash
   npm start
   ```

Access the application at:
- Website: http://localhost:3000
- Admin: http://localhost:3000/admin-dashboard

---

## 🔐 Security Best Practices

- Never publish or use default credentials in production.
- Always generate strong secrets (e.g. JWT_SECRET).
- Store secrets in environment variables, not code or README.
- Enable 2FA for admin accounts when available.
- Regularly update dependencies for security.

---

## 📚 API Endpoints

> ❗**Security Notice:**  
> All API endpoints for administration, staff, alumni, event, announcement, and file management **require authentication**.  
> Only public endpoints (like contact form submission) are available unauthenticated.  
> Never expose admin endpoints or their documentation to untrusted parties.

**Authentication**
- `POST /api/auth/login` — Admin login *(requires credentials)*
- `POST /api/auth/register` — Create new admin *(Super admin only)*
- `GET /api/auth/me` — Get current admin profile
- `PUT /api/auth/profile` — Update admin profile
- `POST /api/auth/change-password` — Change password

**Staff Management**
- `GET /api/staff` *(Admin only)*
- `POST /api/staff` *(Admin only)*
- ...

**Contact**
- `POST /api/contact` — Public contact form

Full API documentation available in `docs/` or via `/api/health`.

---

## 🚀 Deployment

Supported platforms:
- Heroku
- Vercel
- AWS, DigitalOcean
> See platform documentation for environment variable setup.

---

## 📁 Project Structure

```
soet-university/
├── models/
├── routes/
├── middleware/
├── public/
├── views/
├── styles/
├── scripts/
├── server.js
├── setup.js
├── package.json
├── .env.example
└── README.md
```

---

## 📝 License

Released under the MIT License. See [LICENSE](LICENSE).

---

## 🤝 Contributing

1. Fork and clone the repo.
2. Create a feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit and push, then open a PR.

---

## 📞 Support

For technical issues or queries, please contact the SOET University administration via official channels.

---

**Made for SOET University, Vikram University, Ujjain, MP, India.**

