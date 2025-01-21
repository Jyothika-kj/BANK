document.addEventListener('DOMContentLoaded', () => {
    // Get logged in user
    const loggedInUserId = localStorage.getItem('loggedInUser');
    if (!loggedInUserId) {
        window.location.href = 'login.html';
        return;
    }

    // Get user-specific data using unique keys
    const transactions = JSON.parse(localStorage.getItem(`transactions_${loggedInUserId}`)) || [];
    let balance = parseFloat(localStorage.getItem(`balance_${loggedInUserId}`)) || 0;
    
    // Load user data
    const storedUserData = localStorage.getItem(loggedInUserId);
    const userData = JSON.parse(storedUserData);

    const greetingElement = document.getElementById('greeting');
    if (userData?.fullName) {
        greetingElement.innerHTML = `Welcome ${userData.fullName}`;
    } else {
        greetingElement.innerHTML = 'Welcome!';
    }

    // Fill profile
    if (userData) {
        document.getElementById('accountNumber').textContent = userData.accountNumber || 'N/A';
        document.getElementById('branch').textContent = userData.branch || 'N/A';
        document.getElementById('phone').textContent = userData.phone || 'N/A';
        document.getElementById('email').textContent = userData.email || 'N/A';
    }

    // Update balance display
    const updateBalanceDisplay = () => {
        document.getElementById('balance').textContent = balance.toFixed(2);
    };
    updateBalanceDisplay();

    // Logout functionality
    document.getElementById('logout').addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            window.location.href = 'login.html';
        }
    });

    // Navigation
    const navLinks = document.querySelectorAll('#nav a');
    const contentSections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            contentSections.forEach(section => section.classList.add('hidden'));
            link.classList.add('active');
            document.getElementById(link.dataset.page).classList.remove('hidden');
        });
    });

    // Add transaction with user-specific storage
    const addTransaction = (description, amount) => {
        const transaction = { 
            date: new Date().toISOString().split('T')[0], 
            description, 
            amount 
        };
        transactions.push(transaction);
        balance += amount;

        // Save to localStorage with user-specific keys
        localStorage.setItem(`transactions_${loggedInUserId}`, JSON.stringify(transactions));
        localStorage.setItem(`balance_${loggedInUserId}`, balance.toFixed(2));

        updateBalanceDisplay();
    };

    // Transfer form
    document.getElementById('transferForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = parseFloat(document.getElementById('transferAmount').value);
        const beneficiary = document.getElementById('beneficiaryAccount').value;
        if (amount > 0 && amount <= balance) {
            addTransaction(`Transfer to ${beneficiary}`, -amount);
            alert(`Transferred ₹${amount} to ${beneficiary}`);
            document.getElementById('transferForm').reset();
        } else {
            alert('Insufficient balance or invalid amount.');
        }
    });

    // Deposit form
    document.getElementById('depositForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = parseFloat(document.getElementById('depositAmount').value);
        const type = document.getElementById('depositType').value;
        if (amount > 0) {
            addTransaction(`Deposit via ${type}`, amount);
            alert(`Deposited ₹${amount} via ${type}`);
            document.getElementById('depositForm').reset();
        }
    });

    // Withdraw form
    document.getElementById('withdrawForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = parseFloat(document.getElementById('withdrawAmount').value);
        if (amount > 0 && amount <= balance) {
            addTransaction('Withdrawal', -amount);
            alert(`Withdrew ₹${amount}`);
            document.getElementById('withdrawForm').reset();
        } else {
            alert('Insufficient balance or invalid amount.');
        }
    });

    // Fetch statements for specific user
    window.fetchStatements = () => {
        const fromDate = new Date(document.getElementById('fromDate').value);
        const toDate = new Date(document.getElementById('toDate').value);

        const filtered = transactions.filter(tx => {
            const txDate = new Date(tx.date);
            return (!fromDate || txDate >= fromDate) && (!toDate || txDate <= toDate);
        });

        const transactionList = document.getElementById('transactionList');
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
                    ${filtered.map((tx, index) => {
                        let runningBalance = filtered
                            .slice(0, index + 1)
                            .reduce((sum, t) => sum + t.amount, 0);
                        return `
                            <tr>
                                <td>${tx.date}</td>
                                <td>${tx.description}</td>
                                <td style="color:${tx.amount > 0 ? 'green' : 'red'}">₹${Math.abs(tx.amount).toFixed(2)}</td>
                                <td>₹${runningBalance.toFixed(2)}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>` : '<p>No transactions found for the selected period.</p>';
    };

    // Initial fetch statements
    fetchStatements();
});