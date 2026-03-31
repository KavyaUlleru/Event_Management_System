const API_URL = 'http://localhost:5000/api';

// Get token from localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Get user from localStorage
function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Set auth data
function setAuthData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}

// Clear auth data
function clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

// Check if user is authenticated
function isAuthenticated() {
    return !!getToken();
}

// API request helper
async function apiRequest(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
}

// Auth functions
async function register(name, email, password, role) {
    const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role })
    });

    setAuthData(data.token, data.user);
    return data;
}

async function login(email, password) {
    const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });

    setAuthData(data.token, data.user);
    return data;
}

function logout() {
    clearAuthData();
    window.location.href = 'index.html';
}

// Event functions
async function getEvents(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/events?${queryString}`);
}

async function getEvent(id) {
    return await apiRequest(`/events/${id}`);
}

async function createEvent(eventData) {
    return await apiRequest('/events', {
        method: 'POST',
        body: JSON.stringify(eventData)
    });
}

async function updateEvent(id, eventData) {
    return await apiRequest(`/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(eventData)
    });
}

async function deleteEvent(id) {
    return await apiRequest(`/events/${id}`, {
        method: 'DELETE'
    });
}

// Registration functions
async function registerForEvent(registrationData) {
    return await apiRequest('/registrations', {
        method: 'POST',
        body: JSON.stringify(registrationData)
    });
}

async function getMyTickets() {
    return await apiRequest('/registrations/my-tickets');
}

async function getEventRegistrations(eventId) {
    return await apiRequest(`/registrations/event/${eventId}`);
}

async function validateQRCode(qrData) {
    return await apiRequest('/registrations/validate-qr', {
        method: 'POST',
        body: JSON.stringify({ qrData })
    });
}

// Report functions
async function getEventReport(eventId) {
    return await apiRequest(`/reports/event/${eventId}`);
}

async function getSystemOverview() {
    return await apiRequest('/reports/overview');
}

// UI Helper functions
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="loading"><div class="spinner"></div>Loading...</div>';
    }
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div class="alert alert-danger">${message}</div>`;
    }
}

function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div class="alert alert-success">${message}</div>`;
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format date and time
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Update navigation based on auth status
function updateNav() {
    const authLinks = document.getElementById('authLinks');
    const userLinks = document.getElementById('userLinks');
    const eventsNavLink = document.getElementById('eventsNavLink');
    const myTicketsNavLink = document.getElementById('myTicketsNavLink');

    if (isAuthenticated()) {
        if (authLinks) authLinks.classList.add('hidden');
        if (userLinks) userLinks.classList.remove('hidden');
        
        // Hide Events and My Tickets for organizers
        if (hasRole('organizer', 'admin')) {
            if (eventsNavLink) eventsNavLink.classList.add('hidden');
            if (myTicketsNavLink) myTicketsNavLink.classList.add('hidden');
        } else {
            if (eventsNavLink) eventsNavLink.classList.remove('hidden');
            if (myTicketsNavLink) myTicketsNavLink.classList.remove('hidden');
        }
    } else {
        if (authLinks) authLinks.classList.remove('hidden');
        if (userLinks) userLinks.classList.add('hidden');
        if (eventsNavLink) eventsNavLink.classList.remove('hidden');
        if (myTicketsNavLink) myTicketsNavLink?.classList.remove('hidden');
    }
}

// Protect page (redirect if not authenticated)
function protectPage() {
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
    }
}

// Check role
function hasRole(...roles) {
    const user = getUser();
    return user && roles.includes(user.role);
}
// Modal functions
function showLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.classList.remove('hidden');
        loginModal.style.display = 'flex';
    }
}

function hideLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.classList.add('hidden');
        loginModal.style.display = 'none';
    }
}

function showRegisterModal() {
    const registerModal = document.getElementById('registerModal');
    if (registerModal) {
        registerModal.classList.remove('hidden');
        registerModal.style.display = 'flex';
    }
}

function hideRegisterModal() {
    const registerModal = document.getElementById('registerModal');
    if (registerModal) {
        registerModal.classList.add('hidden');
        registerModal.style.display = 'none';
    }
}