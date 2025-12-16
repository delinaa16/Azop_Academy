const API_BASE = 'http://localhost:5000/api';

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => section.classList.add('d-none'));
    document.getElementById(sectionId).classList.remove('d-none');

    if (sectionId === 'teachers') loadTeachers();
    if (sectionId === 'programs') loadPrograms();
    if (sectionId === 'gallery') loadGallery();
}

// Load Teachers
async function loadTeachers() {
    try {
        const response = await fetch(`${API_BASE}/teachers`);
        const teachers = await response.json();
        const container = document.getElementById('teachers-list');
        container.innerHTML = '';
        teachers.forEach(teacher => {
            const col = document.createElement('div');
            col.className = 'col-md-4';
            col.innerHTML = `
                <div class="card">
                    ${teacher.photo ? `<img src="${API_BASE.replace('/api', '')}/uploads/images/${teacher.photo}" class="card-img-top" alt="${teacher.name}">` : ''}
                    <div class="card-body">
                        <h5 class="card-title">${teacher.name}</h5>
                        <p class="card-text">Subject: ${teacher.subject}</p>
                        <p class="card-text">Experience: ${teacher.experience}</p>
                    </div>
                </div>
            `;
            container.appendChild(col);
        });
    } catch (error) {
        console.error('Error loading teachers:', error);
    }
}

// Load Programs
async function loadPrograms() {
    try {
        const response = await fetch(`${API_BASE}/programs`);
        const programs = await response.json();
        const container = document.getElementById('programs-list');
        container.innerHTML = '';
        programs.forEach(program => {
            const col = document.createElement('div');
            col.className = 'col-md-4';
            col.innerHTML = `
                <div class="card">
                    ${program.image ? `<img src="${API_BASE.replace('/api', '')}/uploads/images/${program.image}" class="card-img-top" alt="${program.title}">` : ''}
                    <div class="card-body">
                        <h5 class="card-title">${program.title}</h5>
                        <p class="card-text">${program.description}</p>
                        <p class="card-text"><small class="text-muted">Duration: ${program.duration}</small></p>
                    </div>
                </div>
            `;
            container.appendChild(col);
        });
    } catch (error) {
        console.error('Error loading programs:', error);
    }
}

// Load Gallery
async function loadGallery() {
    try {
        const response = await fetch(`${API_BASE}/gallery`);
        const galleries = await response.json();
        const container = document.getElementById('gallery-images');
        container.innerHTML = '';
        galleries.forEach(gallery => {
            gallery.images.forEach(image => {
                const col = document.createElement('div');
                col.className = 'col-md-3';
                col.innerHTML = `<img src="${API_BASE.replace('/api', '')}/uploads/images/${image}" class="img-fluid" alt="Gallery Image">`;
                container.appendChild(col);
            });
        });
    } catch (error) {
        console.error('Error loading gallery:', error);
    }
}

// Handle Contact Form
document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch(`${API_BASE}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            alert('Message sent successfully!');
            e.target.reset();
        } else {
            alert('Error sending message.');
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    showSection('home');
});