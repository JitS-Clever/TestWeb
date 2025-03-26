// Global variables
let currentUser = null;
const API_ENDPOINT = "https://v5ffl5exja.execute-api.ap-south-1.amazonaws.com/prod";

// Check if the user is already logged in
function checkAuthStatus() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateUIForLoggedInUser();
        
        // Hide login overlay for logged-in users
        document.getElementById('loginOverlay').style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
        
        return true;
    }
    
    // Show login overlay if not logged in
    document.getElementById('loginOverlay').style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    return false;
}

// Check if user has access
async function checkAccess() {
    const email = document.getElementById('emailInput').value.trim();
    
    if (!email || !validateEmail(email)) {
        showMessage('Please enter a valid email address.');
        return;
    }
    
    showLoading(true);
    
    try {
        // Build URL with query parameters instead of using a request body
        const url = `${API_ENDPOINT}?authOperation=check-access&email=${encodeURIComponent(email)}`;
        console.log("Sending request to:", url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log("Response status:", response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Server error:", errorText);
            showMessage(`Server error: ${response.status}`);
            return;
        }
        
        try {
            const data = await response.json();
            console.log("Response data:", data);
            
            // Handle nested response format - extract the actual data from the body
            let authData = data;
            
            // Check if response is in API Gateway format with nested body
            if (data.statusCode && data.body) {
                console.log("Processing nested API Gateway response");
                
                // If body is a string, parse it
                if (typeof data.body === 'string') {
                    authData = JSON.parse(data.body);
                } else {
                    authData = data.body;
                }
                console.log("Extracted auth data:", authData);
            }
            
            if (authData.hasAccess) {
                // User has access
                loginUser(authData.user);
            } else if (authData.userExists) {
                // User exists but doesn't have access
                showMessage('Your access request is pending approval. Please check back later.');
            } else {
                // User doesn't exist
                showRequestForm(email);
            }
        } catch (parseError) {
            console.error("Error parsing JSON response:", parseError);
            showMessage("Invalid response format from server");
        }
    } catch (networkError) {
        console.error('Network error:', networkError);
        showMessage('Network error. Please check your connection and try again.');
    } finally {
        showLoading(false);
    }
}

// Show request access form
function showRequestForm(email = '') {
    document.getElementById('loginFormHeader').style.display = 'none';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('requestAccessForm').style.display = 'block';
    
    if (email) {
        document.getElementById('requestEmailInput').value = email;
    }
}

// Show login form
function showLoginForm() {
    document.getElementById('loginFormHeader').style.display = 'block';
    document.getElementById('requestAccessForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

// Submit access request
async function requestAccess() {
    // Get all the required inputs
    const nameInput = document.getElementById('nameInput');
    const companyInput = document.getElementById('companyInput');
    const jobTitleInput = document.getElementById('jobTitleInput');
    const pocInput = document.getElementById('pocInput');
    const emailInput = document.getElementById('requestEmailInput');
    
    // Reset previous validations
    nameInput.classList.remove('is-invalid');
    companyInput.classList.remove('is-invalid');
    jobTitleInput.classList.remove('is-invalid');
    pocInput.classList.remove('is-invalid');
    
    // Check validations
    let isValid = true;
    
    const namePattern = /^[A-Za-z\s\.\-]+$/;
    if (!nameInput.value.trim() || !namePattern.test(nameInput.value.trim())) {
        nameInput.classList.add('is-invalid');
        isValid = false;
    }
    
    if (!companyInput.value.trim()) {
        companyInput.classList.add('is-invalid');
        isValid = false;
    }
    
    if (!jobTitleInput.value.trim()) {
        jobTitleInput.classList.add('is-invalid');
        isValid = false;
    }
    
    // Email validation for Point of Contact
    if (!pocInput.value.trim() || !validateEmail(pocInput.value.trim())) {
        pocInput.classList.add('is-invalid');
        isValid = false;
    }
    
    // If validation fails, stop processing
    if (!isValid) {
        console.log("Form validation failed");
        return;
    }
    
    // If validation passes, continue with form submission
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const company = companyInput.value.trim();
    const poc = pocInput.value.trim();
    const jobTitle = jobTitleInput.value.trim();
    
    showLoading(true);
        
    try {
        // Same URL building logic
        const url = `${API_ENDPOINT}?authOperation=request-access&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&company=${encodeURIComponent(company)}&pointOfContact=${encodeURIComponent(poc)}&jobTitle=${encodeURIComponent(jobTitle || 'Not Specified')}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        console.log("Request access response:", data);
        
        // Handle nested response format
        let responseData = data;
        if (data.statusCode && data.body) {
            if (typeof data.body === 'string') {
                responseData = JSON.parse(data.body);
            } else {
                responseData = data.body;
            }
        }
        
        if (responseData.success) {
            showMessage('Your access request has been submitted. Please check back later for approval status.', 'success');
            showLoginForm();
        } else {
            showMessage(responseData.message || 'Failed to submit request. Please try again.');
        }
    } catch (error) {
        console.error('Error requesting access:', error);
        showMessage('Failed to submit request. Please try again later.');
    } finally {
        showLoading(false);
    }
}

// Log in user
function loginUser(userData) {
    currentUser = userData;
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    // Update UI before hiding the overlay to ensure proper rendering
    updateUIForLoggedInUser();
    
    // Add a small delay to ensure DOM updates are rendered
    setTimeout(() => {
        // Hide login overlay
        document.getElementById('loginOverlay').style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
        
        // Force a repaint of the userInfo section
        const userInfo = document.getElementById('userInfo');
        if (userInfo) {
            userInfo.style.display = 'none';
            // Trigger a reflow
            userInfo.offsetHeight;
            userInfo.style.display = 'flex';
        }
    }, 50);
}

// Log out user
function logout() {
    // Clear user data
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    // Remove user-logged-in class from body
    document.body.classList.remove('user-logged-in');
    
    // Hide user info immediately
    const userInfo = document.getElementById('userInfo');
    if (userInfo) userInfo.style.display = 'none';
    
    // Show login overlay immediately
    document.getElementById('loginOverlay').style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    // Reset login form
    document.getElementById('emailInput').value = '';
    showLoginForm();
    
    // Add a temporary logout success message to the login form
    const loginContainer = document.querySelector('.login-container');
    const logoutMsg = document.createElement('div');
    logoutMsg.className = 'auth-message success';
    logoutMsg.textContent = 'You have been logged out successfully.';
    logoutMsg.style.display = 'block';
    
    // Insert the message at the top of the login container
    loginContainer.insertBefore(logoutMsg, loginContainer.firstChild);
    
    // Remove the message after 3 seconds
    setTimeout(() => {
        if (logoutMsg && logoutMsg.parentNode) {
            logoutMsg.parentNode.removeChild(logoutMsg);
        }
    }, 3000);
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    const userInfo = document.getElementById('userInfo');
    
    if (userInfo && currentUser) {
        // Clear any existing content
        userInfo.innerHTML = '';
        
        // Create avatar with user's initial
        const avatar = document.createElement('div');
        avatar.className = 'user-avatar';
        const initial = currentUser.email.charAt(0).toUpperCase();
        avatar.textContent = initial;
        
        // Create email element - only show part before the @ symbol
        const emailEl = document.createElement('span');
        emailEl.className = 'user-email';
        
        // Get username part (before @)
        const username = currentUser.email.split('@')[0];
        emailEl.textContent = username;
        
        // Create a custom tooltip container
        const tooltip = document.createElement('span');
        tooltip.className = 'email-tooltip';
        tooltip.textContent = currentUser.email;
        emailEl.appendChild(tooltip);
        
        // Add hover listeners for immediate tooltip display
        emailEl.addEventListener('mouseenter', () => {
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';
        });
        
        emailEl.addEventListener('mouseleave', () => {
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0';
        });
        
        // Create logout button with improved styling
        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'logoutBtn';
        logoutBtn.textContent = 'Logout';
        logoutBtn.onclick = logout;
        
        // Add all elements to userInfo
        userInfo.appendChild(avatar);
        userInfo.appendChild(emailEl);
        userInfo.appendChild(logoutBtn);
        
        // Show the user info section - explicitly set display style
        userInfo.style.display = 'flex';
        
        // Add class to body for CSS targeting
        document.body.classList.add('user-logged-in');
    }
}

// Validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Show message to user
function showMessage(message, type = 'error') {
    // Create message element if it doesn't exist
    let messageEl = document.getElementById('authMessage');
    if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.id = 'authMessage';
        messageEl.className = 'auth-message';
        document.querySelector('.login-container').prepend(messageEl);
    }
    
    messageEl.textContent = message;
    messageEl.className = `auth-message ${type}`;
    messageEl.style.display = 'block';
    
    // Hide after 5 seconds
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 5000);
}

// Show/hide loading indicator
function showLoading(show) {
    // Create loading element if it doesn't exist
    let loadingEl = document.getElementById('authLoading');
    if (!loadingEl) {
        loadingEl = document.createElement('div');
        loadingEl.id = 'authLoading';
        loadingEl.className = 'auth-loading';
        loadingEl.innerHTML = '<div class="spinner"></div>';
        document.querySelector('.login-container').appendChild(loadingEl);
    }
    
    loadingEl.style.display = show ? 'flex' : 'none';
}

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', checkAuthStatus);