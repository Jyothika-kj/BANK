// Event listener for the login form submission
document.querySelector('.login-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    // Get input values
    const loginId = document.getElementById('login-id').value.trim();
    const password = document.getElementById('password').value.trim();
    const captcha = document.getElementById('captcha').value.trim();
    const captchaText = document.getElementById('captcha-text').innerText.trim();

    // Check if the loginId exists in localStorage
    const storedUserData = localStorage.getItem(loginId);

    if (!storedUserData) {
        alert("User ID not found. Please check your Login ID or register as a new user.");
        return;
    }

    // Parse stored user data
    const userData = JSON.parse(storedUserData);

    // Validate password
    if (userData.password !== password) {
        alert("Incorrect password. Please try again.");
        return;
    }

    if (captcha !== captchaText) {
        alert("Captcha is incorrect.");
        return;
    }

    // Login successful
    alert("Login successful! Welcome, " + userData.fullName);
    window.location.href = "dashboard.html"; // Redirect to the dashboard or home page
    localStorage.setItem('loggedInUser', loginId);
});
// Generate a random captcha when the page loads
function generateCaptcha() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let captcha = '';
    for (let i = 0; i < 5; i++) {
        captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    document.getElementById('captcha-text').innerText = captcha;
}


// Initialize the captcha
generateCaptcha();
