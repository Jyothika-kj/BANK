document.addEventListener("DOMContentLoaded", function () {
    const loggedInUserId = localStorage.getItem('token');
    if (!loggedInUserId) {
        window.location.href = 'login.html';
        return;
    }

    fetch(`https://render-express-deployment-3.onrender.com/users/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${loggedInUserId}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(userData => {
        if (!userData) {
            window.location.href = 'login.html';
            return;
        }
        
        document.getElementById('greeting').innerHTML = `Welcome ${userData.fullName}`;
        document.getElementById('accountNumber').textContent = userData.accountNumber || 'N/A';
        document.getElementById('branch').textContent = userData.branch || 'N/A';
        document.getElementById('phone').textContent = userData.phone || 'N/A';
        document.getElementById('email').textContent = userData.email || 'N/A';
        document.getElementById('balance').textContent = userData.balance||'N/A';
    })
    .catch(error => console.error("Error loading user data:", error));

    document.getElementById('logout').addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            window.location.href = 'login.html';
        }
    });

    const navLinks = document.querySelectorAll(".nav-links a");
    const sections = document.querySelectorAll(".content-section");

    function showSection(sectionId) {
        sections.forEach(section => section.classList.add("hidden"));
        document.getElementById(sectionId).classList.remove("hidden");
    }

    showSection("profile");

    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            showSection(this.getAttribute("data-page"));
        });
    });

    

    document.getElementById('depositForm').addEventListener('submit', async (e) => {
        console.log("deposit")
        e.preventDefault();
        const amount = parseFloat(document.getElementById('depositAmount').value);
        const type = document.getElementById('depositType').value;
        if (amount > 0) {
            const response = await fetch('https://render-express-deployment-3.onrender.com/deposit', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${loggedInUserId}`,
            'Content-Type': 'application/json'},
                body: JSON.stringify({ amount })
            });

            const result = await response.json();
            if (response.ok) {
                alert(`Deposited ₹${amount} via ${type}`);
                document.getElementById('balance').textContent = result.balance.toFixed(2);
            } else {
                alert(result.message);
            }
        }
    });


     // Withdraw form
     document.getElementById('withdrawForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const amount = parseFloat(document.getElementById('withdrawAmount').value);
        if (amount > 0) {
            const response = await fetch('https://render-express-deployment-3.onrender.com/withdraw', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${loggedInUserId}`,
                'Content-Type': 'application/json'},
                body: JSON.stringify({ amount })
            });

            const result = await response.json();
            if (response.ok) {
                alert(`Withdrew ₹${amount}`);
                document.getElementById('balance').textContent = result.balance.toFixed(2);
            } else {
                alert(result.message);
            }
        }
    });


     // Transfer form
     document.getElementById('transferForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const amount = parseFloat(document.getElementById('transferAmount').value);
        const beneficiary = document.getElementById('beneficiaryAccount').value;
        const beneficiary1 = document.getElementById('beneficiaryAccount1').value;
        console.log("beneficiary1",beneficiary1);
        if (amount > 0) {
            const response = await fetch('https://render-express-deployment-3.onrender.com/transfer', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${loggedInUserId}`,
                'Content-Type': 'application/json'},
                body: JSON.stringify({ recipientUserId: beneficiary,beneficiary1, amount }),
                
            });

            const result = await response.json();
            if (response.ok) {
                alert(`Transferred ₹${amount} to ${beneficiary}`);
                document.getElementById('balance').textContent = result.senderBalance.toFixed(2);
            } else {
                alert(result.message);
            }
        }
    });

      // Fetch transaction history
      window.fetchStatements = async () => {
        const fromDate = new Date(document.getElementById('fromDate').value);
        const toDate   = new Date(document.getElementById('toDate').value);
    
        const response = await fetch(`http://127.0.0.1:7000/transactions?from=${fromDate.toISOString()}&to=${toDate.toISOString()}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${loggedInUserId}`,
                'Content-Type': 'application/json'
            }
        });
    
        const result = await response.json();
        const transactionList = document.getElementById('transactionList');
    
        if (response.ok) {
            // Filter transactions based on the selected date range.
            let filtered = result.transactions.filter(tx => {
                const txDate = new Date(tx.date);
                return (!fromDate || txDate >= fromDate) && (!toDate || txDate <= toDate);
            });
    
            // Sort transactions by date (ascending order)
            filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    
            let runningBalance = 0;
    
            transactionList.innerHTML = filtered.length ? `
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filtered.map(tx => {
                            // Directly use the amount from the backend.
                            // Convert to a number if necessary.
                            const amount = Number(tx.amount);
    
                            // Update running balance
                            runningBalance += amount;
    
                            // Choose text color: red for negatives, green for positives.
                            const color = amount < 0 ? 'red' : 'green';
    
                            // Format the amount: show the negative sign if the value is negative.
                            const formattedAmount = `${amount < 0 ? '-' : ''}₹${Math.abs(amount).toFixed(2)}`;
    
                            return `
                                <tr>
                                    <td>${new Date(tx.date).toLocaleDateString()}</td>
                                    <td>${tx.description}</td>
                                    <td style="color:${color}">${formattedAmount}</td>
                                    <td>₹${runningBalance.toFixed(2)}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            ` : '<p>No transactions found for the selected period.</p>';
        } else {
            alert(result.message);
        }
    };
    
    
    //.............................................................

     
});
