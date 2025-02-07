// Event listener for login form submission
document.querySelector('.login-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form submission

    // Get input values
    const loginId = document.getElementById('login-id').value.trim();
    const password = document.getElementById('password').value.trim();
    const captcha = document.getElementById('captcha').value.trim();
    const captchaText = document.getElementById('captcha-text').innerText.trim();

    // Validate Captcha
    if (captcha !== captchaText) {
        alert("Captcha is incorrect.");
        return;
    }

    // Prepare user login data
    const loginData = {
        userId: loginId, 
        password
    };

    try {
        // Send login request to the backend
        const response = await fetch("https://render-express-deployment-3.onrender.com/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginData)
        });

        const result = await response.json();

        if (response.ok) {
            alert("Login successful! Redirecting...");
            localStorage.setItem("token", result.token); // Store JWT token in localStorage
            window.location.href = "dashboard.html"; // Redirect to dashboard
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred. Please try again.");
    }
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
