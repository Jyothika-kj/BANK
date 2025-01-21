// Generate a random captcha when the page loads
function generateCaptcha() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let captcha = '';
    for (let i = 0; i < 5; i++) {
        captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    document.getElementById('captcha-text').innerText = captcha;
}

// Validate the form and store data in localStorage
document.querySelector('.registration-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    // Get input values
    const fullName = document.getElementById('full-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const accountNumber = document.getElementById('account-number').value.trim();
    const branch=document.getElementById('branch').value.trim();
    const userId = document.getElementById('user-id').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
    const captcha = document.getElementById('captcha').value.trim();
    const captchaText = document.getElementById('captcha-text').innerText.trim();
    const declaration = document.getElementById('declaration').checked;

    // Validation
    if (!fullName || !email || !phone || !accountNumber || !branch || !userId || !password || !confirmPassword) {
        alert("Please fill in all required fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    if (captcha !== captchaText) {
        alert("Captcha is incorrect.");
        return;
    }

    if (!declaration) {
        alert("You must agree to the declaration.");
        return;
    }

    // Create a user object
    const userData = {
        fullName,
        email,
        phone,
        accountNumber,
        branch,
        userId,
        password,
    };

    // Save the user data in localStorage
    localStorage.setItem(userId, JSON.stringify(userData));

    alert("Registration successful! You can now log in.");
    window.location.href = "login.html"; // Redirect to login page
});

// Initialize the captcha
generateCaptcha();
