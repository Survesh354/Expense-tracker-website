let transactions = [];

        // Function to load transactions from local storage (new feature for persistence)
        function loadTransactions() {
            const storedTransactions = localStorage.getItem('transactions');
            if (storedTransactions) {
                transactions = JSON.parse(storedTransactions);
            }
        }

        // Function to save transactions to local storage
        function saveTransactions() {
            localStorage.setItem('transactions', JSON.stringify(transactions));
        }


        const balanceEl = document.getElementById('balance');
        const incomeEl = document.getElementById('income');
        const expenseEl = document.getElementById('expense');
        const transactionListEl = document.getElementById('transaction-list');
        const form = document.getElementById('transaction-form');

        function formatCurrency(amount) {
            return 'Rs.' + Math.abs(amount).toFixed(2);
        }

        function updateBalance() {
            const amounts = transactions.map(t => t.type === 'income' ? t.amount : -t.amount);
            const total = amounts.reduce((acc, val) => acc + val, 0);
            const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
            const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

            balanceEl.textContent = formatCurrency(total);
            incomeEl.textContent = formatCurrency(income);
            expenseEl.textContent = formatCurrency(expense);
        }

        function renderTransactions() {
            transactionListEl.innerHTML = '';

            if (transactions.length === 0) {
                transactionListEl.innerHTML = '<div class="empty-state">No transactions yet. Add your first transaction above!</div>';
                return;
            }

            transactions.forEach((transaction, index) => {
                const li = document.createElement('li');
                li.className = `transaction-item ${transaction.type}`;

                li.innerHTML = `
                    <div class="transaction-info">
                        <div class="transaction-desc">${transaction.desc}</div>
                        <div class="transaction-category">${transaction.category}</div>
                    </div>
                    <span class="transaction-amount ${transaction.type}">
                        ${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}
                    </span>
                    <button class="delete-btn" onclick="deleteTransaction(${index})">×</button>
                `;

                transactionListEl.appendChild(li);
            });
        }

        function addTransaction(e) {
            e.preventDefault();

            const desc = document.getElementById('desc').value;
            const amount = parseFloat(document.getElementById('amount').value);
            const type = document.getElementById('type').value;
            const category = document.getElementById('category').value;

            // Simple validation to ensure amount is positive
            if (amount <= 0) {
                alert("Please enter a positive amount.");
                return;
            }

            const transaction = {
                desc,
                amount,
                type,
                category
            };

            transactions.unshift(transaction);
            saveTransactions(); // Save to local storage
            updateBalance();
            renderTransactions();
            form.reset();
        }

        function deleteTransaction(index) {
            transactions.splice(index, 1);
            saveTransactions(); // Save to local storage
            updateBalance();
            renderTransactions();
        }

        form.addEventListener('submit', addTransaction);

        // Initialize: Load transactions and then update display
        loadTransactions();
        updateBalance();
        renderTransactions();