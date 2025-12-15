const API_URL = 'http://localhost:3000/api';
let currentUser = null;
let token = localStorage.getItem('token');

// Check authentication on load
window.onload = function() {
    console.log('Page loaded, checking auth...');
    console.log('Token from localStorage:', token ? 'Present' : 'Missing');
    
    if (token) {
        loadUserInfo();
        showMainSection();
        loadSweets();
    } else {
        showAuthSection();
    }
    
    // Test backend connection
    testBackendConnection();
};

async function testBackendConnection() {
    try {
        console.log('Testing backend connection to:', API_URL + '/health');
        const response = await fetch(API_URL + '/health');
        console.log('Backend response status:', response.status);
        if (response.ok) {
            console.log('✅ Backend is reachable');
        } else {
            console.error('❌ Backend returned error:', response.status);
        }
    } catch (error) {
        console.error('❌ Cannot reach backend:', error.message);
        alert('Cannot connect to backend. Make sure it\'s running on http://localhost:3000');
    }
}

function showTab(tabName) {
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    
    if (tabName === 'login') {
        document.querySelector('button[onclick="showTab(\'login\')"]').classList.add('active');
        document.getElementById('login-tab').classList.add('active');
    } else {
        document.querySelector('button[onclick="showTab(\'register\')"]').classList.add('active');
        document.getElementById('register-tab').classList.add('active');
    }
}

function showAuthSection() {
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('main-section').style.display = 'none';
    document.getElementById('auth-buttons').innerHTML = '';
}

function showMainSection() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('main-section').style.display = 'block';
    if (currentUser) {
        document.getElementById('auth-buttons').innerHTML = `
            <span class="navbar-text me-3">Welcome, ${currentUser.name}</span>
            <button class="btn btn-outline-light" onclick="logout()">Logout</button>
        `;
    }
}

async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');
    errorDiv.textContent = '';

    console.log('Attempting login for:', email);

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        console.log('Login response status:', response.status);

        if (!response.ok) {
            let errorMessage = 'Login failed';
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage;
            } catch (e) {
                errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('Login successful, user:', data.user);
        
        token = data.token;
        currentUser = data.user;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(currentUser));
        
        showMainSection();
        loadSweets();
    } catch (error) {
        console.error('Login error:', error);
        errorDiv.textContent = `Login failed: ${error.message}`;
    }
}

async function register() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const errorDiv = document.getElementById('register-error');
    errorDiv.textContent = '';

    if (!name || !email || !password) {
        errorDiv.textContent = 'All fields are required';
        return;
    }

    console.log('Attempting registration for:', email);

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email, password, name })
        });

        console.log('Register response status:', response.status);

        if (!response.ok) {
            let errorMessage = 'Registration failed';
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage;
            } catch (e) {
                errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('Registration successful, user:', data);
        
        token = data.token;
        currentUser = data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(currentUser));
        
        showMainSection();
        loadSweets();
    } catch (error) {
        console.error('Registration error:', error);
        errorDiv.textContent = `Registration failed: ${error.message}`;
        
        // If it's a network error, provide more guidance
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorDiv.textContent += '. Make sure backend is running at http://localhost:3000';
        }
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    token = null;
    currentUser = null;
    showAuthSection();
}

async function loadUserInfo() {
    try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            currentUser = JSON.parse(userStr);
        }
    } catch (error) {
        console.error('Failed to load user info:', error);
    }
}

async function loadSweets() {
    try {
        const response = await fetch(`${API_URL}/sweets`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const sweets = await response.json();
        displaySweets(sweets);
    } catch (error) {
        console.error('Failed to load sweets:', error);
        document.getElementById('sweets-container').innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    Failed to load sweets: ${error.message}<br>
                    <small>Backend URL: ${API_URL}</small>
                </div>
            </div>`;
    }
}

async function searchSweets() {
    const query = document.getElementById('search-input').value;
    if (!query.trim()) {
        loadSweets();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/sweets/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Search failed');
        
        const data = await response.json();
        displaySweets(data.data || []);
    } catch (error) {
        console.error('Search failed:', error);
    }
}

function displaySweets(sweets) {
    const container = document.getElementById('sweets-container');
    
    if (!sweets || sweets.length === 0) {
        container.innerHTML = '<div class="col-12"><div class="alert alert-info">No sweets found. The database might be empty.</div></div>';
        return;
    }

    container.innerHTML = sweets.map(sweet => `
        <div class="col-md-4">
            <div class="card sweet-card ${sweet.stock === 0 ? 'out-of-stock' : ''}">
                <div class="card-body">
                    <h5 class="card-title">${sweet.name}</h5>
                    <p class="card-text">${sweet.description || 'No description'}</p>
                    <p class="card-text">
                        <strong>Price:</strong> $${sweet.price.toFixed(2)}<br>
                        <strong>Stock:</strong> ${sweet.stock}
                    </p>
                    <button class="btn btn-primary" onclick="purchaseSweet(${sweet.id})" 
                            ${sweet.stock === 0 ? 'disabled' : ''}
                            ${!token ? 'disabled title="Login to purchase"' : ''}>
                        Purchase
                    </button>
                    ${sweet.stock === 0 ? '<span class="badge bg-warning ms-2">Out of stock</span>' : ''}
                </div>
            </div>
        </div>
    `).join('');
}

async function purchaseSweet(sweetId) {
    if (!token) {
        alert('Please login to purchase');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/inventory/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ sweetId, quantity: 1 })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Purchase failed');
        }

        alert('Purchase successful!');
        loadSweets();
    } catch (error) {
        alert(error.message);
    }
}
