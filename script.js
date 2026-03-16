document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const nameInput = document.getElementById("expense-name");
    const amountInput = document.getElementById("expense-amount");
    const filterCategorySelect = document.getElementById("filterCategory");
    const filterBtn = document.getElementById("filterBtn");

    const expenseList = document.getElementById("expense-list");
    const totalDisplay = document.getElementById("total-amount");



    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];




    renderExpenses();

//--------------------------------------------

    // Add Expense
    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();
        addExpense();
    });

    // Delete Expense (Event Delegation)
    expenseList.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") {
            const id = parseInt(e.target.dataset.id);
            deleteExpense(id);
        }
    });

    // Filter Button Click
    filterBtn.addEventListener("click", () => {
        applyFilter();
    });


    //-----------------------------------------------

    function addExpense() {
        const name = nameInput.value.trim();
        const amount = parseFloat(amountInput.value);
        const category = filterCategorySelect.value;

        if (!name || isNaN(amount) || amount <= 0) return;

        const newExpense = {
            id: Date.now(),
            name,
            amount,
            category
        };

        expenses.push(newExpense);
        saveToLocalStorage();
        renderExpenses();

        // Clear inputs
        nameInput.value = "";
        amountInput.value = "";
    }


    function deleteExpense(id) {
        expenses = expenses.filter(exp => exp.id !== id);
        saveToLocalStorage();
        renderExpenses();
    }


    function applyFilter() {
        const selectedCategory = filterCategorySelect.value;

        const filteredExpenses = selectedCategory === "All"
            ? expenses
            : expenses.filter(exp => exp.category === selectedCategory);

        renderExpenses(filteredExpenses);
    }


    function renderExpenses(data = expenses) {
        expenseList.innerHTML = "";

        data.forEach(exp => {
            const li = document.createElement("li");

            li.innerHTML = `
                ${exp.name} - $${exp.amount.toFixed(2)} - ${exp.category}
                <button data-id="${exp.id}">Delete</button>
            `;

            expenseList.appendChild(li);
        });

        updateTotal(data);
    }


    function updateTotal(data) {
        const total = data.reduce((sum, exp) => sum + exp.amount, 0);
        totalDisplay.textContent = total.toFixed(2);
    }


    function saveToLocalStorage() {
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }

});