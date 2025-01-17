document.addEventListener('DOMContentLoaded', () => {
  // Initialize progress bars
  initProgressBars();
  
  // Mobile menu functionality
  initMobileMenu();
  
  // Smooth scrolling for navigation links
  initSmoothScroll();
  
  // Form submission handling
  initContactForm();
  
  // Admin functionality
  // Load initial data
  loadData();

  const addProjectForm = document.getElementById('addProjectForm');
  if (addProjectForm) {
    addProjectForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      try {
        const formData = new FormData(e.target);
        const imageFile = formData.get('image');
        const imageUrl = await readFileAsDataURL(imageFile);
        
        const project = {
          id: Date.now(),
          title: formData.get('title'),
          description: formData.get('description'),
          technologies: formData.get('technologies'),
          link: formData.get('link'),
          image: imageUrl
        };
        
        projects.push(project);
        localStorage.setItem('projects', JSON.stringify(projects));
        
        updateCounts();
        renderProjects();
        
        e.target.reset();
        alert('Project added successfully!');
      } catch (error) {
        console.error('Error adding project:', error);
        alert('Error adding project. Please try again.');
      }
    });
  }
});

function initProgressBars() {
  const progressBars = document.querySelectorAll('.progress-bar');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const percent = progressBar.getAttribute('data-percent');
        progressBar.style.setProperty('--progress', `${percent}%`);
      }
    });
  }, { threshold: 0.5 });

  progressBars.forEach(bar => observer.observe(bar));
}

function initMobileMenu() {
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.nav-links');
  let menuOpen = false;

  menuBtn?.addEventListener('click', () => {
    if (!menuOpen) {
      menuBtn.classList.add('open');
      navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = 'var(--bg-color)';
      navLinks.style.padding = '1rem';
      menuOpen = true;
    } else {
      menuBtn.classList.remove('open');
      navLinks.style.display = 'none';
      menuOpen = false;
    }
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
      name: form.querySelector('input[name="name"]').value,
      email: form.querySelector('input[name="email"]').value,
      message: form.querySelector('textarea[name="message"]').value
    };

    try {
      // Using EmailJS to send emails
      await emailjs.send(
        'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
        'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
        {
          to_email: 'dinushaesoft88@gmail.com',
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message
        },
        'YOUR_USER_ID' // Replace with your EmailJS user ID
      );
      
      alert('Thank you for your message! I will get back to you soon.');
      form.reset();
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Sorry, there was an error sending your message. Please try again later.');
    }
  });
}

// Add scroll animation for elements
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, {
  threshold: 0.1
});

document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});

let projects = [];
let clients = [];

function checkPassword() {
  const password = document.getElementById('adminPassword').value;
  if (password === '4067') {
    document.getElementById('adminModal').style.display = 'none';
    document.getElementById('adminPanel').classList.remove('hidden');
    loadData();
  } else {
    alert('Incorrect password');
  }
}

function loadData() {
  try {
    projects = JSON.parse(localStorage.getItem('projects')) || [];
    clients = JSON.parse(localStorage.getItem('clients')) || [];
    updateCounts();
    renderProjects();
    renderClients();
  } catch (error) {
    console.error('Error loading data:', error);
    projects = [];
    clients = [];
  }
}

function updateCounts() {
  const projectCount = document.getElementById('projectCount');
  const clientCount = document.getElementById('clientCount');
  
  if (projectCount) projectCount.textContent = projects.length;
  if (clientCount) clientCount.textContent = clients.length;
}

function renderProjects() {
  const projectsGrid = document.querySelector('.projects-grid');
  if (!projectsGrid) return;
  
  projectsGrid.innerHTML = '';  // Clear existing projects first
  
  if (projects.length === 0) {
    projectsGrid.innerHTML = '<p>No projects added yet.</p>';
    return;
  }
  
  projects.forEach(project => {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    projectCard.innerHTML = `
      <img src="${project.image}" alt="${project.title}" class="project-image">
      <div class="project-info">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <div class="project-tech">
          ${project.technologies.split(',').map(tech => `
            <span class="tech-tag">${tech.trim()}</span>
          `).join('')}
        </div>
        <div class="cta-buttons">
          ${project.link ? `<a href="${project.link}" class="btn primary" target="_blank">View Project</a>` : ''}
          ${document.getElementById('adminPanel').classList.contains('hidden') ? '' : 
            `<button onclick="deleteProject(${project.id})" class="btn secondary delete-btn">Delete</button>`}
        </div>
      </div>
    `;
    projectsGrid.appendChild(projectCard);
  });
}

function renderClients() {
  const clientsList = document.getElementById('clientsList');
  if (!clientsList) return;
  
  clientsList.innerHTML = '';
  
  if (clients.length === 0) {
    clientsList.innerHTML = '<p>No clients added yet.</p>';
    return;
  }
  
  clients.forEach(client => {
    const clientItem = document.createElement('div');
    clientItem.className = 'client-item';
    clientItem.innerHTML = `
      <div class="client-details">
        <h4>${client.name}</h4>
        <p>${client.company}</p>
        <p>${client.testimonial}</p>
      </div>
      <button onclick="deleteClient(${client.id})" class="btn secondary delete-btn">Delete</button>
    `;
    clientsList.appendChild(clientItem);
  });
}

function deleteProject(id) {
  if (confirm('Are you sure you want to delete this project?')) {
    projects = projects.filter(project => project.id !== id);
    localStorage.setItem('projects', JSON.stringify(projects));
    updateCounts();
    renderProjects();
  }
}

function deleteClient(id) {
  if (confirm('Are you sure you want to delete this client?')) {
    clients = clients.filter(client => client.id !== id);
    localStorage.setItem('clients', JSON.stringify(clients));
    updateCounts();
    renderClients();
  }
}

function logout() {
  document.getElementById('adminPanel').classList.add('hidden');
  document.getElementById('adminModal').style.display = 'none';
  // Clear any sensitive data if needed
  alert('Successfully logged out');
}

document.getElementById('addClientForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  const client = {
    id: Date.now(),
    name: formData.get('name'),
    company: formData.get('company'),
    testimonial: formData.get('testimonial')
  };
  
  clients.push(client);
  localStorage.setItem('clients', JSON.stringify(clients));
  updateCounts();
  renderClients(); 
  e.target.reset();
  alert('Client added successfully!');
});

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Add admin button to nav
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.nav-links')?.insertAdjacentHTML('beforeend', `
    <li><a href="#" onclick="document.getElementById('adminModal').style.display='block'">Admin</a></li>
  `);
});