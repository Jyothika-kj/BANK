document.addEventListener('DOMContentLoaded', function () {
    const menus = document.querySelectorAll('.menu');

    menus.forEach(menu => {
        menu.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                // Toggle dropdown visibility
                this.classList.toggle('open');

                // Close other menus
                menus.forEach(m => {
                    if (m !== menu) {
                        m.classList.remove('open');
                    }
                });
            }
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
        menus.forEach(menu => {
            if (!menu.contains(e.target)) {
                menu.classList.remove('open');
            }
        });
    });
});

// List of bank holidays
const bankHolidays = ["January 1", "July 4", "December 25"]; // Add your specific holidays here

// Get today's date
const today = new Date();
const options = { month: "long", day: "numeric" }; // Format as "Month Day"
const formattedDate = today.toLocaleDateString("en-US", options);

// Display today's date
document.getElementById("date").textContent = ` ${formattedDate} `;

// Check if today is a bank holiday
if (bankHolidays.includes(formattedDate)) {
  document.getElementById("status").textContent = " | Today is a Bank Holiday!";
  document.getElementById("status").classList.add("holiday");
} else {
  document.getElementById("status").textContent = " | Today is a Working Day.";
  document.getElementById("status").classList.add("working-day");
}