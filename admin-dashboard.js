// Simple logout function that works immediately
function performLogout() {
    console.log('Logout button clicked!'); // Debug log
    
    if (confirm('Are you sure you want to logout?')) {
        console.log('User confirmed logout'); // Debug log
        
        // Clear all admin session data
        localStorage.removeItem('soetAdminSession');
        sessionStorage.removeItem('soetAdminSession');
        localStorage.removeItem('adminToken');
        sessionStorage.removeItem('adminToken');
        
        console.log('Session data cleared'); // Debug log
        
        // Show confirmation
        alert('Logged out successfully!');
        
        // Redirect to login page
        window.location.href = 'admin-login.html';
    } else {
        console.log('User cancelled logout'); // Debug log
    }
}

// Backup logout function - attach to window object for global access
window.performLogout = performLogout;
window.logout = performLogout; // Also create a window.logout function

// Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.initializeData();
        this.loadDashboard();
        this.updateStats();
    }

    initializeData() {
        // Initialize data structures if they don't exist
        if (!localStorage.getItem('staffMembers')) {
            localStorage.setItem('staffMembers', JSON.stringify([
                {
                    id: 1,
                    name: 'Dr. Rajesh Kumar',
                    designation: 'Professor & Head',
                    department: 'Computer Science',
                    email: 'rajesh.kumar@soet.ac.in',
                    phone: '+91 9876543210',
                    photo: '',
                    qualification: 'Ph.D. in Computer Science',
                    experience: '15 years',
                    specialization: 'Machine Learning, Data Science'
                },
                {
                    id: 2,
                    name: 'Dr. Priya Sharma',
                    designation: 'Associate Professor',
                    department: 'Electrical Engineering',
                    email: 'priya.sharma@soet.ac.in',
                    phone: '+91 9876543211',
                    photo: '',
                    qualification: 'Ph.D. in Electrical Engineering',
                    experience: '12 years',
                    specialization: 'Power Systems, Renewable Energy'
                }
            ]));
        }

        if (!localStorage.getItem('alumniMembers')) {
            localStorage.setItem('alumniMembers', JSON.stringify([
                {
                    id: 1,
                    name: 'Amit Patel',
                    batchYear: '2020',
                    department: 'Computer Science',
                    currentPosition: 'Software Engineer at TCS',
                    company: 'Tata Consultancy Services',
                    email: 'amit.patel@gmail.com',
                    phone: '+91 9876543212',
                    photo: '',
                    location: 'Bangalore'
                },
                {
                    id: 2,
                    name: 'Neha Singh',
                    batchYear: '2019',
                    department: 'Mechanical Engineering',
                    currentPosition: 'Design Engineer at Mahindra',
                    company: 'Mahindra & Mahindra',
                    email: 'neha.singh@gmail.com',
                    phone: '+91 9876543213',
                    photo: '',
                    location: 'Pune'
                }
            ]));
        }

        if (!localStorage.getItem('events')) {
            localStorage.setItem('events', JSON.stringify([
                {
                    id: 1,
                    title: 'Tech Fest 2024',
                    description: 'Annual technical festival showcasing innovation and creativity',
                    date: '2024-03-15',
                    time: '09:00',
                    venue: 'SOET Auditorium',
                    image: '',
                    category: 'Technical',
                    organizer: 'Computer Science Department'
                },
                {
                    id: 2,
                    title: 'Industry Expert Lecture',
                    description: 'Guest lecture on emerging technologies in engineering',
                    date: '2024-02-20',
                    time: '14:00',
                    venue: 'Conference Hall',
                    image: '',
                    category: 'Educational',
                    organizer: 'Academic Affairs'
                }
            ]));
        }

        if (!localStorage.getItem('announcements')) {
            localStorage.setItem('announcements', JSON.stringify([
                {
                    id: 1,
                    title: 'Admission Open for 2024-25',
                    content: 'Applications are now open for undergraduate and postgraduate programs',
                    priority: 'high',
                    category: 'Admission',
                    date: '2024-01-15',
                    document: '',
                    isActive: true
                },
                {
                    id: 2,
                    title: 'Workshop on AI and Machine Learning',
                    content: 'One week intensive workshop for students and faculty members',
                    priority: 'medium',
                    category: 'Workshop',
                    date: '2024-01-10',
                    document: '',
                    isActive: true
                }
            ]));
        }
    }

    loadDashboard() {
        const adminUsername = localStorage.getItem('adminUsername') || 'Admin';
        document.getElementById('adminUsername').textContent = adminUsername;
    }

    updateStats() {
        const staff = JSON.parse(localStorage.getItem('staffMembers') || '[]');
        const alumni = JSON.parse(localStorage.getItem('alumniMembers') || '[]');
        const events = JSON.parse(localStorage.getItem('events') || '[]');
        const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');

        document.getElementById('staffCount').textContent = staff.length;
        document.getElementById('alumniCount').textContent = alumni.length;
        document.getElementById('eventCount').textContent = events.length;
        document.getElementById('announcementCount').textContent = announcements.length;
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        const container = document.getElementById('notificationContainer');
        container.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('slideIn');
        }, 100);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    createModal(title, content, size = 'medium') {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal ${size}">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="close-btn" onclick="closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        
        document.getElementById('modalContainer').appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 100);
    }

    // Staff Management Functions
    showStaffManagement() {
        const staff = JSON.parse(localStorage.getItem('staffMembers') || '[]');
        
        let content = `
            <div class="management-header">
                <button class="btn btn-primary" onclick="showAddStaffForm()">
                    <i class="fas fa-plus"></i> Add New Staff
                </button>
            </div>
            <div class="staff-grid">
        `;

        staff.forEach(member => {
            content += `
                <div class="staff-card">
                    <div class="staff-photo">
                        ${member.photo ? 
                            `<img src="${member.photo}" alt="${member.name}">` : 
                            `<div class="photo-placeholder"><i class="fas fa-user"></i></div>`
                        }
                    </div>
                    <div class="staff-info">
                        <h4>${member.name}</h4>
                        <p class="designation">${member.designation}</p>
                        <p class="department">${member.department}</p>
                        <p class="email">${member.email}</p>
                        <p class="phone">${member.phone}</p>
                        <div class="staff-actions">
                            <button class="btn btn-edit" onclick="editStaff(${member.id})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-delete" onclick="deleteStaff(${member.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        content += '</div>';
        
        document.getElementById('contentArea').innerHTML = content;
    }

    showAddStaffForm() {
        const formContent = `
            <form id="staffForm" onsubmit="saveStaff(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label for="staffName">Full Name *</label>
                        <input type="text" id="staffName" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="staffDesignation">Designation *</label>
                        <input type="text" id="staffDesignation" name="designation" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="staffDepartment">Department *</label>
                        <select id="staffDepartment" name="department" required>
                            <option value="">Select Department</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Electrical Engineering">Electrical Engineering</option>
                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                            <option value="Civil Engineering">Civil Engineering</option>
                            <option value="Electronics & Communication">Electronics & Communication</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="staffEmail">Email *</label>
                        <input type="email" id="staffEmail" name="email" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="staffPhone">Phone *</label>
                        <input type="tel" id="staffPhone" name="phone" required>
                    </div>
                    <div class="form-group">
                        <label for="staffQualification">Qualification</label>
                        <input type="text" id="staffQualification" name="qualification">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="staffExperience">Experience</label>
                        <input type="text" id="staffExperience" name="experience">
                    </div>
                    <div class="form-group">
                        <label for="staffSpecialization">Specialization</label>
                        <input type="text" id="staffSpecialization" name="specialization">
                    </div>
                </div>
                <div class="form-group">
                    <label for="staffPhoto">Photo</label>
                    <input type="file" id="staffPhoto" name="photo" accept="image/*" onchange="previewImage(this, 'staffPhotoPreview')">
                    <div id="staffPhotoPreview" class="image-preview"></div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Staff</button>
                </div>
            </form>
        `;
        
        this.createModal('Add New Staff Member', formContent, 'large');
    }

    saveStaff(event, isEdit = false, staffId = null) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const staff = JSON.parse(localStorage.getItem('staffMembers') || '[]');
        
        const staffData = {
            id: isEdit ? staffId : Date.now(),
            name: formData.get('name'),
            designation: formData.get('designation'),
            department: formData.get('department'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            qualification: formData.get('qualification') || '',
            experience: formData.get('experience') || '',
            specialization: formData.get('specialization') || '',
            photo: this.currentImagePreview || ''
        };

        if (isEdit) {
            const index = staff.findIndex(s => s.id === staffId);
            if (index !== -1) {
                staff[index] = staffData;
            }
        } else {
            staff.push(staffData);
        }

        localStorage.setItem('staffMembers', JSON.stringify(staff));
        this.updateStats();
        closeModal();
        this.showStaffManagement();
        this.showNotification(isEdit ? 'Staff member updated successfully!' : 'New staff member added successfully!');
        this.currentImagePreview = null;
    }

    editStaff(id) {
        const staff = JSON.parse(localStorage.getItem('staffMembers') || '[]');
        const member = staff.find(s => s.id === id);
        
        if (!member) return;

        const formContent = `
            <form id="staffForm" onsubmit="adminDashboard.saveStaff(event, true, ${id})">
                <div class="form-row">
                    <div class="form-group">
                        <label for="staffName">Full Name *</label>
                        <input type="text" id="staffName" name="name" value="${member.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="staffDesignation">Designation *</label>
                        <input type="text" id="staffDesignation" name="designation" value="${member.designation}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="staffDepartment">Department *</label>
                        <select id="staffDepartment" name="department" required>
                            <option value="">Select Department</option>
                            <option value="Computer Science" ${member.department === 'Computer Science' ? 'selected' : ''}>Computer Science</option>
                            <option value="Electrical Engineering" ${member.department === 'Electrical Engineering' ? 'selected' : ''}>Electrical Engineering</option>
                            <option value="Mechanical Engineering" ${member.department === 'Mechanical Engineering' ? 'selected' : ''}>Mechanical Engineering</option>
                            <option value="Civil Engineering" ${member.department === 'Civil Engineering' ? 'selected' : ''}>Civil Engineering</option>
                            <option value="Electronics & Communication" ${member.department === 'Electronics & Communication' ? 'selected' : ''}>Electronics & Communication</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="staffEmail">Email *</label>
                        <input type="email" id="staffEmail" name="email" value="${member.email}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="staffPhone">Phone *</label>
                        <input type="tel" id="staffPhone" name="phone" value="${member.phone}" required>
                    </div>
                    <div class="form-group">
                        <label for="staffQualification">Qualification</label>
                        <input type="text" id="staffQualification" name="qualification" value="${member.qualification || ''}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="staffExperience">Experience</label>
                        <input type="text" id="staffExperience" name="experience" value="${member.experience || ''}">
                    </div>
                    <div class="form-group">
                        <label for="staffSpecialization">Specialization</label>
                        <input type="text" id="staffSpecialization" name="specialization" value="${member.specialization || ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label for="staffPhoto">Photo</label>
                    <input type="file" id="staffPhoto" name="photo" accept="image/*" onchange="previewImage(this, 'staffPhotoPreview')">
                    <div id="staffPhotoPreview" class="image-preview">
                        ${member.photo ? `<img src="${member.photo}" alt="Current photo">` : ''}
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Update Staff</button>
                </div>
            </form>
        `;
        
        this.createModal('Edit Staff Member', formContent, 'large');
        this.currentImagePreview = member.photo;
    }

    deleteStaff(id) {
        if (confirm('Are you sure you want to delete this staff member?')) {
            const staff = JSON.parse(localStorage.getItem('staffMembers') || '[]');
            const updatedStaff = staff.filter(s => s.id !== id);
            localStorage.setItem('staffMembers', JSON.stringify(updatedStaff));
            this.updateStats();
            this.showStaffManagement();
            this.showNotification('Staff member deleted successfully!');
        }
    }

    // Alumni Management Functions
    showAlumniManagement() {
        const alumni = JSON.parse(localStorage.getItem('alumniMembers') || '[]');
        
        let content = `
            <div class="management-header">
                <button class="btn btn-primary" onclick="showAddAlumniForm()">
                    <i class="fas fa-plus"></i> Add New Alumni
                </button>
            </div>
            <div class="alumni-grid">
        `;

        alumni.forEach(member => {
            content += `
                <div class="alumni-card">
                    <div class="alumni-photo">
                        ${member.photo ? 
                            `<img src="${member.photo}" alt="${member.name}">` : 
                            `<div class="photo-placeholder"><i class="fas fa-user-graduate"></i></div>`
                        }
                    </div>
                    <div class="alumni-info">
                        <h4>${member.name}</h4>
                        <p class="batch">Batch: ${member.batchYear}</p>
                        <p class="department">${member.department}</p>
                        <p class="position">${member.currentPosition}</p>
                        <p class="company">${member.company}</p>
                        <p class="location">${member.location}</p>
                        <div class="alumni-actions">
                            <button class="btn btn-edit" onclick="editAlumni(${member.id})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-delete" onclick="deleteAlumni(${member.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        content += '</div>';
        
        document.getElementById('contentArea').innerHTML = content;
    }

    showAddAlumniForm() {
        const formContent = `
            <form id="alumniForm" onsubmit="saveAlumni(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label for="alumniName">Full Name *</label>
                        <input type="text" id="alumniName" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="alumniBatchYear">Batch Year *</label>
                        <input type="number" id="alumniBatchYear" name="batchYear" min="2000" max="2025" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="alumniDepartment">Department *</label>
                        <select id="alumniDepartment" name="department" required>
                            <option value="">Select Department</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Electrical Engineering">Electrical Engineering</option>
                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                            <option value="Civil Engineering">Civil Engineering</option>
                            <option value="Electronics & Communication">Electronics & Communication</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="alumniPosition">Current Position *</label>
                        <input type="text" id="alumniPosition" name="currentPosition" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="alumniCompany">Company *</label>
                        <input type="text" id="alumniCompany" name="company" required>
                    </div>
                    <div class="form-group">
                        <label for="alumniLocation">Location</label>
                        <input type="text" id="alumniLocation" name="location">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="alumniEmail">Email</label>
                        <input type="email" id="alumniEmail" name="email">
                    </div>
                    <div class="form-group">
                        <label for="alumniPhone">Phone</label>
                        <input type="tel" id="alumniPhone" name="phone">
                    </div>
                </div>
                <div class="form-group">
                    <label for="alumniPhoto">Photo</label>
                    <input type="file" id="alumniPhoto" name="photo" accept="image/*" onchange="previewImage(this, 'alumniPhotoPreview')">
                    <div id="alumniPhotoPreview" class="image-preview"></div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Alumni</button>
                </div>
            </form>
        `;
        
        this.createModal('Add New Alumni', formContent, 'large');
    }

    saveAlumni(event, isEdit = false, alumniId = null) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const alumni = JSON.parse(localStorage.getItem('alumniMembers') || '[]');
        
        const alumniData = {
            id: isEdit ? alumniId : Date.now(),
            name: formData.get('name'),
            batchYear: formData.get('batchYear'),
            department: formData.get('department'),
            currentPosition: formData.get('currentPosition'),
            company: formData.get('company'),
            location: formData.get('location') || '',
            email: formData.get('email') || '',
            phone: formData.get('phone') || '',
            photo: this.currentImagePreview || ''
        };

        if (isEdit) {
            const index = alumni.findIndex(a => a.id === alumniId);
            if (index !== -1) {
                alumni[index] = alumniData;
            }
        } else {
            alumni.push(alumniData);
        }

        localStorage.setItem('alumniMembers', JSON.stringify(alumni));
        this.updateStats();
        closeModal();
        this.showAlumniManagement();
        this.showNotification(isEdit ? 'Alumni updated successfully!' : 'New alumni added successfully!');
        this.currentImagePreview = null;
    }

    editAlumni(id) {
        const alumni = JSON.parse(localStorage.getItem('alumniMembers') || '[]');
        const member = alumni.find(a => a.id === id);
        
        if (!member) return;

        const formContent = `
            <form id="alumniForm" onsubmit="adminDashboard.saveAlumni(event, true, ${id})">
                <div class="form-row">
                    <div class="form-group">
                        <label for="alumniName">Full Name *</label>
                        <input type="text" id="alumniName" name="name" value="${member.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="alumniBatchYear">Batch Year *</label>
                        <input type="number" id="alumniBatchYear" name="batchYear" value="${member.batchYear}" min="2000" max="2025" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="alumniDepartment">Department *</label>
                        <select id="alumniDepartment" name="department" required>
                            <option value="">Select Department</option>
                            <option value="Computer Science" ${member.department === 'Computer Science' ? 'selected' : ''}>Computer Science</option>
                            <option value="Electrical Engineering" ${member.department === 'Electrical Engineering' ? 'selected' : ''}>Electrical Engineering</option>
                            <option value="Mechanical Engineering" ${member.department === 'Mechanical Engineering' ? 'selected' : ''}>Mechanical Engineering</option>
                            <option value="Civil Engineering" ${member.department === 'Civil Engineering' ? 'selected' : ''}>Civil Engineering</option>
                            <option value="Electronics & Communication" ${member.department === 'Electronics & Communication' ? 'selected' : ''}>Electronics & Communication</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="alumniPosition">Current Position *</label>
                        <input type="text" id="alumniPosition" name="currentPosition" value="${member.currentPosition}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="alumniCompany">Company *</label>
                        <input type="text" id="alumniCompany" name="company" value="${member.company}" required>
                    </div>
                    <div class="form-group">
                        <label for="alumniLocation">Location</label>
                        <input type="text" id="alumniLocation" name="location" value="${member.location || ''}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="alumniEmail">Email</label>
                        <input type="email" id="alumniEmail" name="email" value="${member.email || ''}">
                    </div>
                    <div class="form-group">
                        <label for="alumniPhone">Phone</label>
                        <input type="tel" id="alumniPhone" name="phone" value="${member.phone || ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label for="alumniPhoto">Photo</label>
                    <input type="file" id="alumniPhoto" name="photo" accept="image/*" onchange="previewImage(this, 'alumniPhotoPreview')">
                    <div id="alumniPhotoPreview" class="image-preview">
                        ${member.photo ? `<img src="${member.photo}" alt="Current photo">` : ''}
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Update Alumni</button>
                </div>
            </form>
        `;
        
        this.createModal('Edit Alumni', formContent, 'large');
        this.currentImagePreview = member.photo;
    }

    deleteAlumni(id) {
        if (confirm('Are you sure you want to delete this alumni?')) {
            const alumni = JSON.parse(localStorage.getItem('alumniMembers') || '[]');
            const updatedAlumni = alumni.filter(a => a.id !== id);
            localStorage.setItem('alumniMembers', JSON.stringify(updatedAlumni));
            this.updateStats();
            this.showAlumniManagement();
            this.showNotification('Alumni deleted successfully!');
        }
    }

    // Event Management Functions
    showEventManagement() {
        const events = JSON.parse(localStorage.getItem('events') || '[]');
        
        let content = `
            <div class="management-header">
                <button class="btn btn-primary" onclick="showAddEventForm()">
                    <i class="fas fa-plus"></i> Add New Event
                </button>
            </div>
            <div class="events-grid">
        `;

        events.forEach(event => {
            const eventDate = new Date(event.date);
            const formattedDate = eventDate.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });

            content += `
                <div class="event-card">
                    <div class="event-image">
                        ${event.image ? 
                            `<img src="${event.image}" alt="${event.title}">` : 
                            `<div class="image-placeholder"><i class="fas fa-calendar"></i></div>`
                        }
                    </div>
                    <div class="event-info">
                        <h4>${event.title}</h4>
                        <p class="event-description">${event.description}</p>
                        <div class="event-details">
                            <p><i class="fas fa-calendar"></i> ${formattedDate}</p>
                            <p><i class="fas fa-clock"></i> ${event.time}</p>
                            <p><i class="fas fa-map-marker-alt"></i> ${event.venue}</p>
                            <p><i class="fas fa-tag"></i> ${event.category}</p>
                            <p><i class="fas fa-user"></i> ${event.organizer}</p>
                        </div>
                        <div class="event-actions">
                            <button class="btn btn-edit" onclick="editEvent(${event.id})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-delete" onclick="deleteEvent(${event.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        content += '</div>';
        
        document.getElementById('contentArea').innerHTML = content;
    }

    showAddEventForm() {
        const formContent = `
            <form id="eventForm" onsubmit="saveEvent(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label for="eventTitle">Event Title *</label>
                        <input type="text" id="eventTitle" name="title" required>
                    </div>
                    <div class="form-group">
                        <label for="eventCategory">Category *</label>
                        <select id="eventCategory" name="category" required>
                            <option value="">Select Category</option>
                            <option value="Technical">Technical</option>
                            <option value="Cultural">Cultural</option>
                            <option value="Educational">Educational</option>
                            <option value="Sports">Sports</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Seminar">Seminar</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="eventDescription">Description *</label>
                    <textarea id="eventDescription" name="description" rows="3" required></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="eventDate">Date *</label>
                        <input type="date" id="eventDate" name="date" required>
                    </div>
                    <div class="form-group">
                        <label for="eventTime">Time *</label>
                        <input type="time" id="eventTime" name="time" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="eventVenue">Venue *</label>
                        <input type="text" id="eventVenue" name="venue" required>
                    </div>
                    <div class="form-group">
                        <label for="eventOrganizer">Organizer *</label>
                        <input type="text" id="eventOrganizer" name="organizer" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="eventImage">Event Image</label>
                    <input type="file" id="eventImage" name="image" accept="image/*" onchange="previewImage(this, 'eventImagePreview')">
                    <div id="eventImagePreview" class="image-preview"></div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Event</button>
                </div>
            </form>
        `;
        
        this.createModal('Add New Event', formContent, 'large');
    }

    saveEvent(event, isEdit = false, eventId = null) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const events = JSON.parse(localStorage.getItem('events') || '[]');
        
        const eventData = {
            id: isEdit ? eventId : Date.now(),
            title: formData.get('title'),
            description: formData.get('description'),
            date: formData.get('date'),
            time: formData.get('time'),
            venue: formData.get('venue'),
            category: formData.get('category'),
            organizer: formData.get('organizer'),
            image: this.currentImagePreview || ''
        };

        if (isEdit) {
            const index = events.findIndex(e => e.id === eventId);
            if (index !== -1) {
                events[index] = eventData;
            }
        } else {
            events.push(eventData);
        }

        localStorage.setItem('events', JSON.stringify(events));
        this.updateStats();
        closeModal();
        this.showEventManagement();
        this.showNotification(isEdit ? 'Event updated successfully!' : 'New event added successfully!');
        this.currentImagePreview = null;
    }

    editEvent(id) {
        const events = JSON.parse(localStorage.getItem('events') || '[]');
        const event = events.find(e => e.id === id);
        
        if (!event) return;

        const formContent = `
            <form id="eventForm" onsubmit="adminDashboard.saveEvent(event, true, ${id})">
                <div class="form-row">
                    <div class="form-group">
                        <label for="eventTitle">Event Title *</label>
                        <input type="text" id="eventTitle" name="title" value="${event.title}" required>
                    </div>
                    <div class="form-group">
                        <label for="eventCategory">Category *</label>
                        <select id="eventCategory" name="category" required>
                            <option value="">Select Category</option>
                            <option value="Technical" ${event.category === 'Technical' ? 'selected' : ''}>Technical</option>
                            <option value="Cultural" ${event.category === 'Cultural' ? 'selected' : ''}>Cultural</option>
                            <option value="Educational" ${event.category === 'Educational' ? 'selected' : ''}>Educational</option>
                            <option value="Sports" ${event.category === 'Sports' ? 'selected' : ''}>Sports</option>
                            <option value="Workshop" ${event.category === 'Workshop' ? 'selected' : ''}>Workshop</option>
                            <option value="Seminar" ${event.category === 'Seminar' ? 'selected' : ''}>Seminar</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="eventDescription">Description *</label>
                    <textarea id="eventDescription" name="description" rows="3" required>${event.description}</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="eventDate">Date *</label>
                        <input type="date" id="eventDate" name="date" value="${event.date}" required>
                    </div>
                    <div class="form-group">
                        <label for="eventTime">Time *</label>
                        <input type="time" id="eventTime" name="time" value="${event.time}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="eventVenue">Venue *</label>
                        <input type="text" id="eventVenue" name="venue" value="${event.venue}" required>
                    </div>
                    <div class="form-group">
                        <label for="eventOrganizer">Organizer *</label>
                        <input type="text" id="eventOrganizer" name="organizer" value="${event.organizer}" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="eventImage">Event Image</label>
                    <input type="file" id="eventImage" name="image" accept="image/*" onchange="previewImage(this, 'eventImagePreview')">
                    <div id="eventImagePreview" class="image-preview">
                        ${event.image ? `<img src="${event.image}" alt="Current image">` : ''}
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Update Event</button>
                </div>
            </form>
        `;
        
        this.createModal('Edit Event', formContent, 'large');
        this.currentImagePreview = event.image;
    }

    deleteEvent(id) {
        if (confirm('Are you sure you want to delete this event?')) {
            const events = JSON.parse(localStorage.getItem('events') || '[]');
            const updatedEvents = events.filter(e => e.id !== id);
            localStorage.setItem('events', JSON.stringify(updatedEvents));
            this.updateStats();
            this.showEventManagement();
            this.showNotification('Event deleted successfully!');
        }
    }

    // Announcement Management Functions
    showAnnouncementManagement() {
        const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
        
        let content = `
            <div class="management-header">
                <button class="btn btn-primary" onclick="showAddAnnouncementForm()">
                    <i class="fas fa-plus"></i> Add New Announcement
                </button>
            </div>
            <div class="announcements-grid">
        `;

        announcements.forEach(announcement => {
            const announcementDate = new Date(announcement.date);
            const formattedDate = announcementDate.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });

            content += `
                <div class="announcement-card">
                    <div class="announcement-header">
                        <div class="priority-badge ${announcement.priority}">
                            ${announcement.priority.toUpperCase()}
                        </div>
                        <div class="announcement-status">
                            <span class="status ${announcement.isActive ? 'active' : 'inactive'}">
                                ${announcement.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                    <div class="announcement-content">
                        <h4>${announcement.title}</h4>
                        <p class="announcement-text">${announcement.content}</p>
                        <div class="announcement-meta">
                            <p><i class="fas fa-calendar"></i> ${formattedDate}</p>
                            <p><i class="fas fa-tag"></i> ${announcement.category}</p>
                            ${announcement.document ? 
                                `<p><i class="fas fa-paperclip"></i> Document attached</p>` : 
                                ''
                            }
                        </div>
                        <div class="announcement-actions">
                            <button class="btn btn-edit" onclick="editAnnouncement(${announcement.id})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-toggle" onclick="toggleAnnouncement(${announcement.id})">
                                <i class="fas fa-${announcement.isActive ? 'eye-slash' : 'eye'}"></i> 
                                ${announcement.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button class="btn btn-delete" onclick="deleteAnnouncement(${announcement.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        content += '</div>';
        
        document.getElementById('contentArea').innerHTML = content;
    }

    showAddAnnouncementForm() {
        const formContent = `
            <form id="announcementForm" onsubmit="saveAnnouncement(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label for="announcementTitle">Title *</label>
                        <input type="text" id="announcementTitle" name="title" required>
                    </div>
                    <div class="form-group">
                        <label for="announcementCategory">Category *</label>
                        <select id="announcementCategory" name="category" required>
                            <option value="">Select Category</option>
                            <option value="Admission">Admission</option>
                            <option value="Academic">Academic</option>
                            <option value="Examination">Examination</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Event">Event</option>
                            <option value="General">General</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="announcementContent">Content *</label>
                    <textarea id="announcementContent" name="content" rows="4" required></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="announcementPriority">Priority *</label>
                        <select id="announcementPriority" name="priority" required>
                            <option value="">Select Priority</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="announcementDate">Date *</label>
                        <input type="date" id="announcementDate" name="date" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="announcementDocument">Attachment (Optional)</label>
                    <input type="file" id="announcementDocument" name="document" accept=".pdf,.doc,.docx,.txt" onchange="previewDocument(this, 'documentPreview')">
                    <div id="documentPreview" class="document-preview"></div>
                </div>
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" name="isActive" checked> Active
                    </label>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Announcement</button>
                </div>
            </form>
        `;
        
        this.createModal('Add New Announcement', formContent, 'large');
    }

    saveAnnouncement(event, isEdit = false, announcementId = null) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
        
        const announcementData = {
            id: isEdit ? announcementId : Date.now(),
            title: formData.get('title'),
            content: formData.get('content'),
            category: formData.get('category'),
            priority: formData.get('priority'),
            date: formData.get('date'),
            document: this.currentDocumentPreview || '',
            isActive: formData.get('isActive') === 'on'
        };

        if (isEdit) {
            const index = announcements.findIndex(a => a.id === announcementId);
            if (index !== -1) {
                announcements[index] = announcementData;
            }
        } else {
            announcements.push(announcementData);
        }

        localStorage.setItem('announcements', JSON.stringify(announcements));
        this.updateStats();
        closeModal();
        this.showAnnouncementManagement();
        this.showNotification(isEdit ? 'Announcement updated successfully!' : 'New announcement added successfully!');
        this.currentDocumentPreview = null;
    }

    editAnnouncement(id) {
        const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
        const announcement = announcements.find(a => a.id === id);
        
        if (!announcement) return;

        const formContent = `
            <form id="announcementForm" onsubmit="adminDashboard.saveAnnouncement(event, true, ${id})">
                <div class="form-row">
                    <div class="form-group">
                        <label for="announcementTitle">Title *</label>
                        <input type="text" id="announcementTitle" name="title" value="${announcement.title}" required>
                    </div>
                    <div class="form-group">
                        <label for="announcementCategory">Category *</label>
                        <select id="announcementCategory" name="category" required>
                            <option value="">Select Category</option>
                            <option value="Admission" ${announcement.category === 'Admission' ? 'selected' : ''}>Admission</option>
                            <option value="Academic" ${announcement.category === 'Academic' ? 'selected' : ''}>Academic</option>
                            <option value="Examination" ${announcement.category === 'Examination' ? 'selected' : ''}>Examination</option>
                            <option value="Workshop" ${announcement.category === 'Workshop' ? 'selected' : ''}>Workshop</option>
                            <option value="Event" ${announcement.category === 'Event' ? 'selected' : ''}>Event</option>
                            <option value="General" ${announcement.category === 'General' ? 'selected' : ''}>General</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="announcementContent">Content *</label>
                    <textarea id="announcementContent" name="content" rows="4" required>${announcement.content}</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="announcementPriority">Priority *</label>
                        <select id="announcementPriority" name="priority" required>
                            <option value="">Select Priority</option>
                            <option value="high" ${announcement.priority === 'high' ? 'selected' : ''}>High</option>
                            <option value="medium" ${announcement.priority === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="low" ${announcement.priority === 'low' ? 'selected' : ''}>Low</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="announcementDate">Date *</label>
                        <input type="date" id="announcementDate" name="date" value="${announcement.date}" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="announcementDocument">Attachment (Optional)</label>
                    <input type="file" id="announcementDocument" name="document" accept=".pdf,.doc,.docx,.txt" onchange="previewDocument(this, 'documentPreview')">
                    <div id="documentPreview" class="document-preview">
                        ${announcement.document ? `<p><i class="fas fa-file"></i> Document attached</p>` : ''}
                    </div>
                </div>
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" name="isActive" ${announcement.isActive ? 'checked' : ''}> Active
                    </label>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Update Announcement</button>
                </div>
            </form>
        `;
        
        this.createModal('Edit Announcement', formContent, 'large');
        this.currentDocumentPreview = announcement.document;
    }

    toggleAnnouncement(id) {
        const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
        const index = announcements.findIndex(a => a.id === id);
        
        if (index !== -1) {
            announcements[index].isActive = !announcements[index].isActive;
            localStorage.setItem('announcements', JSON.stringify(announcements));
            this.showAnnouncementManagement();
            this.showNotification(`Announcement ${announcements[index].isActive ? 'activated' : 'deactivated'} successfully!`);
        }
    }

    deleteAnnouncement(id) {
        if (confirm('Are you sure you want to delete this announcement?')) {
            const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
            const updatedAnnouncements = announcements.filter(a => a.id !== id);
            localStorage.setItem('announcements', JSON.stringify(updatedAnnouncements));
            this.updateStats();
            this.showAnnouncementManagement();
            this.showNotification('Announcement deleted successfully!');
        }
    }
}

// Global functions for form handling
function previewImage(input, previewId) {
    const preview = document.getElementById(previewId);
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            adminDashboard.currentImagePreview = e.target.result;
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}

function previewDocument(input, previewId) {
    const preview = document.getElementById(previewId);
    
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            adminDashboard.currentDocumentPreview = e.target.result;
            preview.innerHTML = `
                <div class="document-info">
                    <i class="fas fa-file"></i>
                    <span>${file.name}</span>
                    <small>(${(file.size / 1024).toFixed(2)} KB)</small>
                </div>
            `;
        };
        
        reader.readAsDataURL(file);
    }
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// Global function declarations for onclick handlers
function showStaffManagement() {
    adminDashboard.showStaffManagement();
}

function showAlumniManagement() {
    adminDashboard.showAlumniManagement();
}

function showEventManagement() {
    adminDashboard.showEventManagement();
}

function showAnnouncementManagement() {
    adminDashboard.showAnnouncementManagement();
}

function showAddStaffForm() {
    adminDashboard.showAddStaffForm();
}

function showAddAlumniForm() {
    adminDashboard.showAddAlumniForm();
}

function showAddEventForm() {
    adminDashboard.showAddEventForm();
}

function showAddAnnouncementForm() {
    adminDashboard.showAddAnnouncementForm();
}

function saveStaff(event) {
    adminDashboard.saveStaff(event);
}

function saveAlumni(event) {
    adminDashboard.saveAlumni(event);
}

function saveEvent(event) {
    adminDashboard.saveEvent(event);
}

function saveAnnouncement(event) {
    adminDashboard.saveAnnouncement(event);
}

function editStaff(id) {
    adminDashboard.editStaff(id);
}

function editAlumni(id) {
    adminDashboard.editAlumni(id);
}

function editEvent(id) {
    adminDashboard.editEvent(id);
}

function editAnnouncement(id) {
    adminDashboard.editAnnouncement(id);
}

function deleteStaff(id) {
    adminDashboard.deleteStaff(id);
}

function deleteAlumni(id) {
    adminDashboard.deleteAlumni(id);
}

function deleteEvent(id) {
    adminDashboard.deleteEvent(id);
}

function deleteAnnouncement(id) {
    adminDashboard.deleteAnnouncement(id);
}

function toggleAnnouncement(id) {
    adminDashboard.toggleAnnouncement(id);
}

// Initialize the admin dashboard
let adminDashboard;

function initializeSampleData() {
    const sampleStudents = [
        { id: 1, name: "Rahul Sharma", department: "CSE", year: "2nd", email: "rahul.sharma@student.soet.ac.in", phone: "+91-9876543210", enrollmentDate: "2023-08-15" },
        { id: 2, name: "Priya Patel", department: "ECE", year: "3rd", email: "priya.patel@student.soet.ac.in", phone: "+91-9876543211", enrollmentDate: "2022-08-15" },
        { id: 3, name: "Amit Kumar", department: "ME", year: "1st", email: "amit.kumar@student.soet.ac.in", phone: "+91-9876543212", enrollmentDate: "2024-08-15" },
        { id: 4, name: "Sneha Singh", department: "CE", year: "4th", email: "sneha.singh@student.soet.ac.in", phone: "+91-9876543213", enrollmentDate: "2021-08-15" },
        { id: 5, name: "Vikash Yadav", department: "EE", year: "2nd", email: "vikash.yadav@student.soet.ac.in", phone: "+91-9876543214", enrollmentDate: "2023-08-15" }
    ];
    
    const sampleFaculty = [
        { id: 1, name: "Dr. Rajesh Kumar", department: "CSE", designation: "Professor", email: "rajesh.kumar@soet.ac.in", phone: "+91-9876543215", specialization: "Machine Learning" },
        { id: 2, name: "Dr. Sunita Sharma", department: "ECE", designation: "Associate Professor", email: "sunita.sharma@soet.ac.in", phone: "+91-9876543216", specialization: "Digital Signal Processing" },
        { id: 3, name: "Dr. Manoj Gupta", department: "ME", designation: "Assistant Professor", email: "manoj.gupta@soet.ac.in", phone: "+91-9876543217", specialization: "Thermodynamics" },
        { id: 4, name: "Dr. Kavita Jain", department: "CE", designation: "Professor", email: "kavita.jain@soet.ac.in", phone: "+91-9876543218", specialization: "Structural Engineering" },
        { id: 5, name: "Dr. Ankit Verma", department: "EE", designation: "Associate Professor", email: "ankit.verma@soet.ac.in", phone: "+91-9876543219", specialization: "Power Systems" }
    ];
    
    const sampleEvents = [
        { id: 1, title: "Tech Fest 2025", date: "2025-03-15", description: "Annual technical festival", status: "Upcoming", organizer: "Student Council" },
        { id: 2, title: "Code_d_Code Workshop", date: "2025-02-10", description: "Advanced programming workshop", status: "Upcoming", organizer: "Code_d_Code Society" },
        { id: 3, title: "Industry Expert Lecture", date: "2025-01-25", description: "Guest lecture on AI trends", status: "Upcoming", organizer: "CSE Department" },
        { id: 4, title: "Sports Meet", date: "2025-02-20", description: "Inter-department sports competition", status: "Upcoming", organizer: "Sports Committee" }
    ];
    
    const sampleNotifications = [
        { id: 1, title: "Exam Schedule Released", message: "Mid-semester examination schedule is now available", date: "2025-01-15", priority: "high", status: "active" },
        { id: 2, title: "Library Hours Extended", message: "Library will remain open till 10 PM during exam period", date: "2025-01-10", priority: "medium", status: "active" },
        { id: 3, title: "New Course Registration", message: "Registration for elective courses starts next week", date: "2025-01-05", priority: "medium", status: "active" }
    ];
    
    // Store sample data
    localStorage.setItem('soetStudentData', JSON.stringify(sampleStudents));
    localStorage.setItem('soetFacultyData', JSON.stringify(sampleFaculty));
    localStorage.setItem('soetEventData', JSON.stringify(sampleEvents));
    localStorage.setItem('soetNotificationData', JSON.stringify(sampleNotifications));
    
    // Initialize activity log
    const activityLog = [
        { id: 1, action: "Student Registration", details: "Rahul Sharma registered for B.Tech CSE", timestamp: new Date(Date.now() - 2*60*60*1000).toISOString(), user: "admin" },
        { id: 2, action: "Content Updated", details: "Academic calendar for 2025 updated", timestamp: new Date(Date.now() - 5*60*60*1000).toISOString(), user: "admin" },
        { id: 3, action: "Achievement Added", details: "Code_d_Code won national coding competition", timestamp: new Date(Date.now() - 24*60*60*1000).toISOString(), user: "admin" },
        { id: 4, action: "Event Scheduled", details: "Tech Fest 2025 scheduled for March", timestamp: new Date(Date.now() - 2*24*60*60*1000).toISOString(), user: "admin" }
    ];
    localStorage.setItem('soetActivityLog', JSON.stringify(activityLog));
}

// Update dashboard statistics
function updateDashboardStats() {
    const students = JSON.parse(localStorage.getItem('soetStudentData') || '[]');
    const faculty = JSON.parse(localStorage.getItem('soetFacultyData') || '[]');
    const events = JSON.parse(localStorage.getItem('soetEventData') || '[]');
    
    // Update student count
    const studentStat = document.querySelector('.stat-info h3[data-count="2200"]');
    if (studentStat) {
        studentStat.textContent = `${2200 + students.length}+`;
    }
    
    // Update faculty count
    const facultyStat = document.querySelector('.stat-info h3[data-count="30"]');
    if (facultyStat) {
        facultyStat.textContent = faculty.length + 30;
    }
}

// Check if user is authenticated
function checkAuthentication() {
    const localSession = localStorage.getItem('soetAdminSession');
    const sessionSession = sessionStorage.getItem('soetAdminSession');
    
    if (!localSession && !sessionSession) {
        // No valid session, redirect to login
        window.location.href = 'admin-login.html';
        return;
    }
    
    // Check session expiry for localStorage
    if (localSession) {
        const sessionData = JSON.parse(localSession);
        if (sessionData.expiry && new Date(sessionData.expiry) <= new Date()) {
            localStorage.removeItem('soetAdminSession');
            window.location.href = 'admin-login.html';
            return;
        }
    }
}

// Load user session data
function loadUserSession() {
    const localSession = localStorage.getItem('soetAdminSession');
    const sessionSession = sessionStorage.getItem('soetAdminSession');
    
    const sessionData = JSON.parse(localSession || sessionSession);
    
    if (sessionData && sessionData.username) {
        const usernameElement = document.getElementById('adminUsername');
        if (usernameElement) {
            // Capitalize first letter
            const displayName = sessionData.username.charAt(0).toUpperCase() + sessionData.username.slice(1);
            usernameElement.textContent = displayName;
        }
    }
}

// Initialize event listeners
function initializeEventListeners() {
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const actionText = this.textContent;
            handleQuickAction(actionText);
        });
    });
    
    // Navigation active state
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                // Add active class to clicked link
                this.classList.add('active');
            }
        });
    });
}

// Handle logout
function handleLogout(e) {
    e.preventDefault();
    
    // Confirm logout
    if (confirm('Are you sure you want to logout?')) {
        // Clear sessions
        localStorage.removeItem('soetAdminSession');
        sessionStorage.removeItem('soetAdminSession');
        
        // Show logout message
        showNotification('Logged out successfully', 'success');
        
        // Redirect to login page after a brief delay
        setTimeout(() => {
            window.location.href = 'admin-login.html';
        }, 1500);
    }
}

// Handle quick actions with full functionality
function handleQuickAction(actionText) {
    switch(actionText) {
        case 'Edit Content':
            showContentEditor();
            break;
        case 'View Reports':
            showReports();
            break;
        case 'Manage Events':
            showEventManager();
            break;
        case 'Settings':
            showSystemSettings();
            break;
        default:
            showNotification('Feature coming soon!', 'info');
    }
}

// Show Content Editor
function showContentEditor() {
    const modal = createModal('Content Management', `
        <div class="content-editor">
            <div class="editor-tabs">
                <button class="tab-btn active" onclick="showEditorTab('announcements')">Announcements</button>
                <button class="tab-btn" onclick="showEditorTab('news')">News & Updates</button>
                <button class="tab-btn" onclick="showEditorTab('events')">Events</button>
            </div>
            <div class="editor-content">
                <div id="announcements-tab" class="editor-tab active">
                    <h4>Create New Announcement</h4>
                    <form id="announcementForm">
                        <div class="form-group">
                            <label for="announcementTitle">Title *</label>
                            <input type="text" id="announcementTitle" required>
                        </div>
                        <div class="form-group">
                            <label for="announcementContent">Content *</label>
                            <textarea id="announcementContent" rows="5" required></textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="announcementPriority">Priority</label>
                                <select id="announcementPriority">
                                    <option value="low">Low</option>
                                    <option value="medium" selected>Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="announcementExpiry">Expiry Date</label>
                                <input type="date" id="announcementExpiry">
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `, [
        { text: 'Cancel', class: 'btn-secondary', action: 'close' },
        { text: 'Publish', class: 'btn-primary', action: () => publishAnnouncement() }
    ]);
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
}

// Show action modal
function showActionModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'action-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-cog"></i> ${title}</h3>
                    <button class="modal-close" onclick="this.closest('.action-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p>${content}</p>
                    <div class="demo-notice">
                        <i class="fas fa-info-circle"></i>
                        <strong>Demo Mode:</strong> This is a demonstration of the admin interface. 
                        In a production environment, this would connect to the actual system backend.
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.action-modal').remove()">
                        Close
                    </button>
                    <button class="btn-primary" onclick="showNotification('Feature would be implemented here', 'info'); this.closest('.action-modal').remove();">
                        Continue
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles if not already present
    if (!document.querySelector('#modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .action-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 9999;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .action-modal.show {
                opacity: 1;
                visibility: visible;
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .modal-content {
                background: white;
                border-radius: 15px;
                max-width: 500px;
                width: 100%;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            
            .action-modal.show .modal-content {
                transform: scale(1);
            }
            
            .modal-header {
                padding: 20px 25px 10px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-header h3 {
                color: var(--primary-blue);
                margin: 0;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 1.2rem;
                color: #666;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .modal-close:hover {
                background: #f0f0f0;
                color: #333;
            }
            
            .modal-body {
                padding: 20px 25px;
            }
            
            .demo-notice {
                background: #e3f2fd;
                border: 1px solid #bbdefb;
                border-radius: 8px;
                padding: 15px;
                margin-top: 20px;
                display: flex;
                align-items: flex-start;
                gap: 10px;
                font-size: 0.9rem;
            }
            
            .demo-notice i {
                color: #1976d2;
                margin-top: 2px;
            }
            
            .modal-footer {
                padding: 10px 25px 20px;
                text-align: right;
                display: flex;
                gap: 10px;
                justify-content: flex-end;
            }
            
            .btn-primary, .btn-secondary {
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 500;
            }
            
            .btn-primary {
                background: linear-gradient(135deg, var(--primary-blue), var(--primary-red));
                color: white;
            }
            
            .btn-primary:hover {
                transform: translateY(-1px);
                box-shadow: 0 5px 15px rgba(33, 29, 112, 0.3);
            }
            
            .btn-secondary {
                background: #6c757d;
                color: white;
            }
            
            .btn-secondary:hover {
                background: #5a6268;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="fas ${iconMap[type] || iconMap.info}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add notification styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 80px;
                right: 20px;
                background: white;
                border-radius: 8px;
                padding: 15px 20px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 10px;
                max-width: 300px;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                border-left: 4px solid;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-success {
                border-left-color: #4caf50;
                color: #2e7d32;
            }
            
            .notification-error {
                border-left-color: #f44336;
                color: #c62828;
            }
            
            .notification-warning {
                border-left-color: #ff9800;
                color: #ef6c00;
            }
            
            .notification-info {
                border-left-color: #2196f3;
                color: #1565c0;
            }
            
            .notification-close {
                background: none;
                border: none;
                cursor: pointer;
                opacity: 0.6;
                transition: opacity 0.3s ease;
                margin-left: auto;
            }
            
            .notification-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Initialize dashboard with animated counters
function initializeDashboard() {
    // Animate statistics counters
    animateCounters();
    
    // Add welcome message
    setTimeout(() => {
        showNotification('Welcome to SOET Admin Dashboard!', 'success');
    }, 500);
}

// Animate counter numbers
function animateCounters() {
    const counters = document.querySelectorAll('.stat-info h3');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format the number
            let displayValue = Math.floor(current);
            if (counter.textContent.includes('+')) {
                displayValue += '+';
            }
            if (counter.textContent.includes('%')) {
                displayValue += '%';
            }
            
            counter.textContent = displayValue;
        }, 16);
    });
}

// Log admin activity
function logActivity(action, details) {
    const timestamp = new Date().toISOString();
    const activity = {
        timestamp,
        action,
        details,
        user: document.getElementById('adminUsername').textContent
    };
    
    // In a real application, this would be sent to a server
    console.log('Admin Activity:', activity);
}

// Helper function to create modals
function createModal(title, content, buttons = []) {
    const modal = document.createElement('div');
    modal.className = 'admin-modal';
    
    const buttonsHtml = buttons.map(btn => {
        if (btn.action === 'close') {
            return `<button class="btn ${btn.class}" onclick="this.closest('.admin-modal').remove()">${btn.text}</button>`;
        } else if (typeof btn.action === 'function') {
            const actionName = `modalAction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            window[actionName] = btn.action;
            return `<button class="btn ${btn.class}" onclick="${actionName}()">${btn.text}</button>`;
        } else {
            return `<button class="btn ${btn.class}">${btn.text}</button>`;
        }
    }).join('');
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="close-btn" onclick="this.closest('.admin-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="modal-footer">
                ${buttonsHtml}
            </div>
        </div>
    `;
    
    return modal;
}

// Helper function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add notification styles if not exists
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1001;
                min-width: 300px;
                border-radius: 4px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                animation: slideIn 0.3s ease-out;
            }
            
            .notification-success {
                background: #d4edda;
                border: 1px solid #c3e6cb;
                color: #155724;
            }
            
            .notification-error {
                background: #f8d7da;
                border: 1px solid #f5c6cb;
                color: #721c24;
            }
            
            .notification-info {
                background: #d1ecf1;
                border: 1px solid #bee5eb;
                color: #0c5460;
            }
            
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
            }
            
            .notification-close {
                background: none;
                border: none;
                cursor: pointer;
                opacity: 0.7;
                font-size: 14px;
            }
            
            .notification-close:hover {
                opacity: 1;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Tab switching functions
function showEditorTab(tabName) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.editor-tab').forEach(tab => tab.classList.remove('active'));
    
    // Add active class to selected tab
    event.target.classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

function showReportTab(tabName) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.report-tab').forEach(tab => tab.classList.remove('active'));
    
    // Add active class to selected tab
    event.target.classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Additional helper functions
function publishAnnouncement() {
    const title = document.getElementById('announcementTitle').value.trim();
    const content = document.getElementById('announcementContent').value.trim();
    const priority = document.getElementById('announcementPriority').value;
    const expiry = document.getElementById('announcementExpiry').value;
    
    if (!title || !content) {
        showNotification('Please fill in title and content', 'error');
        return;
    }
    
    // Get existing announcements
    const announcements = JSON.parse(localStorage.getItem('soetAnnouncements') || '[]');
    
    // Create new announcement
    const newAnnouncement = {
        id: announcements.length + 1,
        title: title,
        content: content,
        priority: priority,
        expiry: expiry,
        timestamp: new Date().toISOString(),
        status: 'published'
    };
    
    // Add to announcements array
    announcements.push(newAnnouncement);
    localStorage.setItem('soetAnnouncements', JSON.stringify(announcements));
    
    // Log activity
    logActivity('Announcement Published', `${title} (${priority} priority)`);
    
    // Close modal and show success
    document.querySelector('.admin-modal').remove();
    showNotification('Announcement published successfully!', 'success');
}

function exportReportData() {
    const students = JSON.parse(localStorage.getItem('soetStudentData') || '[]');
    const events = JSON.parse(localStorage.getItem('soetEvents') || '[]');
    const notifications = JSON.parse(localStorage.getItem('soetNotifications') || '[]');
    
    const reportData = {
        summary: {
            totalStudents: students.length,
            totalEvents: events.length,
            totalNotifications: notifications.length,
            generatedOn: new Date().toISOString()
        },
        students: students,
        events: events,
        notifications: notifications
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soet-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Report exported successfully!', 'success');
}

function saveSettings() {
    const siteName = document.getElementById('siteName').value;
    const adminEmail = document.getElementById('adminEmail').value;
    
    const settings = {
        siteName: siteName,
        adminEmail: adminEmail,
        notifications: {
            email: document.querySelector('input[type="checkbox"]:nth-of-type(1)').checked,
            sms: document.querySelector('input[type="checkbox"]:nth-of-type(2)').checked,
            push: document.querySelector('input[type="checkbox"]:nth-of-type(3)').checked
        },
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('soetSettings', JSON.stringify(settings));
    
    // Log activity
    logActivity('Settings Updated', 'System settings have been modified');
    
    // Close modal and show success
    document.querySelector('.admin-modal').remove();
    showNotification('Settings saved successfully!', 'success');
}

// Initialize some sample data if none exists
function initializeSampleData() {
    // Sample students
    if (!localStorage.getItem('soetStudentData')) {
        const sampleStudents = [
            {
                id: 1,
                name: 'Rahul Sharma',
                department: 'CSE',
                year: '3rd',
                email: 'rahul.sharma@student.soet.ac.in',
                phone: '+91 9876543210',
                enrollmentDate: '2022-08-15'
            },
            {
                id: 2,
                name: 'Priya Patel',
                department: 'ECE',
                year: '2nd',
                email: 'priya.patel@student.soet.ac.in',
                phone: '+91 9876543211',
                enrollmentDate: '2023-08-20'
            }
        ];
        localStorage.setItem('soetStudentData', JSON.stringify(sampleStudents));
    }
    
    // Sample events
    if (!localStorage.getItem('soetEvents')) {
        const sampleEvents = [
            {
                id: 1,
                title: 'Tech Symposium 2024',
                date: '2024-03-15',
                time: '10:00',
                venue: 'Main Auditorium',
                description: 'Annual technical symposium featuring industry experts',
                category: 'technical',
                capacity: 500,
                registrations: 234,
                status: 'upcoming'
            }
        ];
        localStorage.setItem('soetEvents', JSON.stringify(sampleEvents));
    }
    
    // Sample activities
    if (!localStorage.getItem('soetActivities')) {
        const sampleActivities = [
            {
                id: 1,
                action: 'System Initialized',
                description: 'Admin dashboard setup completed',
                timestamp: new Date().toISOString(),
                admin: 'System'
            }
        ];
        localStorage.setItem('soetActivities', JSON.stringify(sampleActivities));
    }
}

console.log('Admin Dashboard Initialized');
console.log('Session Management: Active');
console.log('Quick Actions: Ready');

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication first
    checkAuthentication();
    loadUserSession();
    
    // Initialize dashboard
    adminDashboard = new AdminDashboard();
    
    initializeSampleData();
    updateDashboardStats();
    updateRecentActivities();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize new dashboard overview functionality
    initializeDashboardOverview();
});

// ========================================
// DASHBOARD OVERVIEW FUNCTIONALITY
// ========================================

// Initialize dashboard overview functionality
function initializeDashboardOverview() {
    loadRecentActivities();
    updateSystemStatus();
    loadUpcomingEvents();
    updateAnalytics();
    startAutoRefresh();
}

// Load recent activities for the overview widget
function loadRecentActivities() {
    // This would typically fetch from a backend API
    // For now, we'll use the static data already in HTML
    console.log('Recent activities loaded');
}

// Update system status indicators
function updateSystemStatus() {
    // Simulate system status checks
    const statusItems = document.querySelectorAll('.status-indicator');
    statusItems.forEach((indicator, index) => {
        // Randomly update status for demo purposes
        const statuses = ['status-good', 'status-warning', 'status-error'];
        const currentStatus = Math.random() > 0.8 ? 'status-warning' : 'status-good';
        
        // Remove all status classes and add current one
        indicator.classList.remove(...statuses);
        indicator.classList.add(currentStatus);
    });
}

// Load upcoming events for calendar widget
function loadUpcomingEvents() {
    // This would typically fetch from a backend API
    console.log('Upcoming events loaded');
}

// Update analytics data
function updateAnalytics() {
    // This would typically fetch real analytics data
    // For demo, we can update the numbers dynamically
    const analyticsItems = document.querySelectorAll('.analytics-data h4');
    analyticsItems.forEach(item => {
        const currentValue = parseInt(item.textContent.replace(/,/g, ''));
        if (!isNaN(currentValue)) {
            // Simulate small random changes
            const change = Math.floor(Math.random() * 20) - 10;
            const newValue = Math.max(0, currentValue + change);
            item.textContent = newValue.toLocaleString();
        }
    });
    
    console.log('Analytics data updated');
}

// Start auto-refresh for dynamic content
function startAutoRefresh() {
    // Refresh system status every 30 seconds
    setInterval(updateSystemStatus, 30000);
    
    // Refresh analytics every 5 minutes
    setInterval(updateAnalytics, 300000);
}

// Show all activities function
function showAllActivities() {
    showNotification('Opening full activity log...', 'info');
    // Here you would typically open a modal or navigate to a full activities page
    setTimeout(() => {
        showNotification('Full activity log feature coming soon!', 'info');
    }, 1000);
}

// Quick action function for adding staff
function showAddStaffModal() {
    const modal = document.getElementById('addStaffModal');
    if (modal) {
        modal.style.display = 'block';
    } else {
        showNotification('Add Staff modal not found. Using existing functionality...', 'info');
        // Fallback to existing add staff functionality
        if (typeof showAddStaff === 'function') {
            showAddStaff();
        }
    }
}

// Enhanced show section function for dashboard navigation
function showSection(sectionName) {
    // Hide dashboard overview first
    const dashboardOverview = document.querySelector('.dashboard-overview');
    if (dashboardOverview) {
        dashboardOverview.style.display = 'none';
    }
    
    // Hide all other sections
    const sections = document.querySelectorAll('.admin-section:not(.dashboard-overview)');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Try to find and show the requested section
    let targetSection = null;
    
    // Look for section by various selectors
    const selectors = [
        `[data-section="${sectionName}"]`,
        `.${sectionName}-section`,
        `#${sectionName}`,
        `#${sectionName}Section`,
        `#${sectionName}Management`
    ];
    
    for (const selector of selectors) {
        targetSection = document.querySelector(selector);
        if (targetSection) break;
    }
    
    if (targetSection) {
        targetSection.style.display = 'block';
        
        // Scroll to section smoothly
        targetSection.scrollIntoView({ behavior: 'smooth' });
        
        // Show success notification
        showNotification(`Switched to ${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} section`, 'success');
        
        // Update any section-specific data if needed
        switch(sectionName) {
            case 'staff':
                if (typeof updateStaffList === 'function') {
                    updateStaffList();
                }
                break;
            case 'alumni':
                if (typeof updateAlumniList === 'function') {
                    updateAlumniList();
                }
                break;
            case 'events':
                if (typeof updateEventsList === 'function') {
                    updateEventsList();
                }
                break;
        }
    } else {
        // Section not found, show coming soon message
        showNotification(`${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} section coming soon!`, 'info');
        
        // Show dashboard overview again if section not found
        if (dashboardOverview) {
            dashboardOverview.style.display = 'block';
        }
    }
}

// Enhanced notification function
function showNotification(message, type = 'info', duration = 3000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after specified duration
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, duration);
}

// Function to go back to dashboard overview
function showDashboardOverview() {
    // Hide all sections
    const sections = document.querySelectorAll('.admin-section:not(.dashboard-overview)');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show dashboard overview
    const dashboardOverview = document.querySelector('.dashboard-overview');
    if (dashboardOverview) {
        dashboardOverview.style.display = 'block';
        dashboardOverview.scrollIntoView({ behavior: 'smooth' });
    }
    
    showNotification('Returned to Dashboard Overview', 'success');
}

// ========================================
// MANAGEMENT SECTIONS FUNCTIONALITY
// ========================================

// Filter Functions
function filterAlumni() {
    const statusFilter = document.getElementById('alumniStatusFilter')?.value || 'all';
    const batchFilter = document.getElementById('alumniBatchFilter')?.value || 'all';
    const searchFilter = document.getElementById('alumniSearch')?.value.toLowerCase() || '';
    
    const alumni = document.querySelectorAll('.alumni-card');
    
    alumni.forEach(card => {
        let showCard = true;
        
        // Status filter
        if (statusFilter && statusFilter !== 'all') {
            const statusElement = card.querySelector('.alumni-status');
            if (!statusElement || !statusElement.classList.contains(statusFilter)) {
                showCard = false;
            }
        }
        
        // Batch filter
        if (batchFilter && batchFilter !== 'all') {
            const batchElement = card.querySelector('.alumni-batch');
            if (!batchElement || !batchElement.textContent.includes(batchFilter)) {
                showCard = false;
            }
        }
        
        // Search filter
        if (searchFilter) {
            const name = card.querySelector('.alumni-basic-info h4')?.textContent.toLowerCase() || '';
            const company = card.querySelector('.alumni-current p')?.textContent.toLowerCase() || '';
            if (!name.includes(searchFilter) && !company.includes(searchFilter)) {
                showCard = false;
            }
        }
        
        card.style.display = showCard ? 'block' : 'none';
    });
    
    updateAlumniStats();
}

function filterEvents() {
    const statusFilter = document.getElementById('eventStatusFilter')?.value || 'all';
    const categoryFilter = document.getElementById('eventCategoryFilter')?.value || 'all';
    const dateFromFilter = document.getElementById('eventDateFrom')?.value || '';
    const dateToFilter = document.getElementById('eventDateTo')?.value || '';
    const searchFilter = document.getElementById('eventSearch')?.value.toLowerCase() || '';
    
    const events = document.querySelectorAll('.event-card');
    
    events.forEach(card => {
        let showCard = true;
        
        // Status filter
        if (statusFilter && statusFilter !== 'all') {
            if (!card.classList.contains(statusFilter)) {
                showCard = false;
            }
        }
        
        // Category filter (based on event title or meta)
        if (categoryFilter && categoryFilter !== 'all') {
            const eventMeta = card.querySelector('.event-meta')?.textContent.toLowerCase() || '';
            if (!eventMeta.includes(categoryFilter.toLowerCase())) {
                showCard = false;
            }
        }
        
        // Search filter
        if (searchFilter) {
            const title = card.querySelector('.event-basic-info h4')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.event-description p')?.textContent.toLowerCase() || '';
            if (!title.includes(searchFilter) && !description.includes(searchFilter)) {
                showCard = false;
            }
        }
        
        card.style.display = showCard ? 'block' : 'none';
    });
    
    updateEventStats();
}

// Statistics Update Functions
function updateAlumniStats() {
    const visibleAlumni = document.querySelectorAll('.alumni-card[style*="block"], .alumni-card:not([style*="none"])');
    const totalStat = document.querySelector('[data-stat="total-alumni"] h3');
    if (totalStat) {
        totalStat.textContent = visibleAlumni.length;
    }
}

function updateEventStats() {
    const visibleEvents = document.querySelectorAll('.event-card[style*="block"], .event-card:not([style*="none"])');
    const totalStat = document.querySelector('[data-stat="total-events"] h3');
    if (totalStat) {
        totalStat.textContent = visibleEvents.length;
    }
}

// Bulk Action Functions
function selectAllAlumni() {
    const checkboxes = document.querySelectorAll('.alumni-card .selection-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
    updateBulkActionButtons();
}

function deselectAllAlumni() {
    const checkboxes = document.querySelectorAll('.alumni-card .selection-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    updateBulkActionButtons();
}

function updateBulkActionButtons() {
    const selectedCount = document.querySelectorAll('.alumni-card .selection-checkbox:checked').length;
    const bulkButtons = document.querySelectorAll('.bulk-action-buttons button');
    
    bulkButtons.forEach(button => {
        button.disabled = selectedCount === 0;
        if (selectedCount > 0) {
            button.style.opacity = '1';
        } else {
            button.style.opacity = '0.5';
        }
    });
}

// Export Functions
function exportAlumniData() {
    const selectedAlumni = document.querySelectorAll('.alumni-card .selection-checkbox:checked');
    
    if (selectedAlumni.length === 0) {
        showNotification('Please select alumni to export', 'warning');
        return;
    }
    
    // Simulate CSV export
    let csvContent = "Name,Batch,Status,Current Position,Company,Email,Phone\n";
    
    selectedAlumni.forEach(checkbox => {
        const card = checkbox.closest('.alumni-card');
        const name = card.querySelector('.alumni-basic-info h4')?.textContent || '';
        const batch = card.querySelector('.alumni-batch')?.textContent || '';
        const status = card.querySelector('.alumni-status')?.textContent || '';
        const position = card.querySelector('.alumni-current p')?.textContent || '';
        const email = card.querySelector('[href^="mailto:"]')?.textContent || '';
        const phone = card.querySelector('[href^="tel:"]')?.textContent || '';
        
        csvContent += `"${name}","${batch}","${status}","${position}","","${email}","${phone}"\n`;
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alumni_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    showNotification(`Exported data for ${selectedAlumni.length} alumni`, 'success');
}

function exportEventData() {
    const visibleEvents = document.querySelectorAll('.event-card[style*="block"], .event-card:not([style*="none"])');
    
    if (visibleEvents.length === 0) {
        showNotification('No events to export', 'warning');
        return;
    }
    
    // Simulate CSV export
    let csvContent = "Event Name,Date,Status,Venue,Participants,Category\n";
    
    visibleEvents.forEach(card => {
        const name = card.querySelector('.event-basic-info h4')?.textContent || '';
        const date = card.querySelector('.event-date-badge')?.textContent.replace(/\s+/g, ' ').trim() || '';
        const status = card.querySelector('.event-status')?.textContent || '';
        const venue = card.querySelector('.event-info-item:nth-child(1)')?.textContent.replace('📍', '').trim() || '';
        const participants = card.querySelector('.event-info-item:nth-child(2)')?.textContent.replace('👥', '').trim() || '';
        const category = card.querySelector('.event-meta')?.textContent || '';
        
        csvContent += `"${name}","${date}","${status}","${venue}","${participants}","${category}"\n`;
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `events_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    showNotification(`Exported data for ${visibleEvents.length} events`, 'success');
}

// Communication Functions
function sendBulkInvitations() {
    const selectedAlumni = document.querySelectorAll('.alumni-card .selection-checkbox:checked');
    
    if (selectedAlumni.length === 0) {
        showNotification('Please select alumni to send invitations', 'warning');
        return;
    }
    
    // Simulate sending invitations
    setTimeout(() => {
        showNotification(`Invitations sent to ${selectedAlumni.length} alumni`, 'success');
    }, 1000);
}

function sendNewsletter() {
    const selectedAlumni = document.querySelectorAll('.alumni-card .selection-checkbox:checked');
    
    if (selectedAlumni.length === 0) {
        showNotification('Please select alumni to send newsletter', 'warning');
        return;
    }
    
    // Simulate sending newsletter
    setTimeout(() => {
        showNotification(`Newsletter sent to ${selectedAlumni.length} alumni`, 'success');
    }, 1000);
}

// Event Management Functions
function manageRegistrations(eventId) {
    showNotification('Opening registration management...', 'info');
    // This would typically open a detailed modal for managing event registrations
}

function startLiveEvent(eventId) {
    if (confirm('Start live event tools for this event?')) {
        showNotification('Live event tools activated', 'success');
        // This would activate live event management features
    }
}

function viewEventReport(eventId) {
    showNotification('Generating event report...', 'info');
    // This would generate and display a comprehensive event report
}

// Initialize management functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for filters
    const alumniFilters = ['alumniStatusFilter', 'alumniBatchFilter', 'alumniSearch'];
    alumniFilters.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', filterAlumni);
            element.addEventListener('input', filterAlumni);
        }
    });
    
    const eventFilters = ['eventStatusFilter', 'eventCategoryFilter', 'eventDateFrom', 'eventDateTo', 'eventSearch'];
    eventFilters.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', filterEvents);
            element.addEventListener('input', filterEvents);
        }
    });
    
    // Add event listeners for checkboxes
    const checkboxes = document.querySelectorAll('.selection-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateBulkActionButtons);
    });
    
    // Initialize stats
    updateAlumniStats();
    updateEventStats();
});
