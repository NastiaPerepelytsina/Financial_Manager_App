const financeForm = document.querySelector("#financeForm");
const titleInput = document.querySelector("#titleInput");
const amountInput = document.querySelector("#amountInput");
const typeInput = document.querySelector('#typeInput');
const message = document.querySelector("#message");
const transactionList = document.querySelector("#transactionList");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearBtn = document.querySelector("#clearBtn");
const balance = document.querySelector("#balance");
const income = document.querySelector("#income");
const expense = document.querySelector("#expense");


let transaction = [];
try {
    const savedTransaction = localStorage.getItem("transaction");
    const parsedTransaction = savedTransaction ? JSON.parse(savedTransaction) : [];
    transaction = Array.isArray(parsedTransaction) ? parsedTransaction : [];
} catch (error) {
    try {
        localStorage.removeItem("transaction");
    } catch (storageError) {

    }
}

function saveTransaction(){
    const json = JSON.stringify(transaction);
    try {
        localStorage.setItem("transaction", json);
    } catch (error) {
    }
}
financeForm.addEventListener("submit", function(e){
    e.preventDefault();
    const title = titleInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;
    if (title === "" || !Number.isFinite(amount) || amount <= 0){
        message.textContent = "Fill in the fields!";
        message.style.color = "red";
        return
    }
    const newTransaction = {
        id: Date.now(),
        title: title,
        amount: amount,
        type: type
    }
    transaction.push(newTransaction)
    saveTransaction();
    renderTransaction();
    updateStatistic();
    message.textContent = "Operation successful added!";
    message.style.color = "green";
    financeForm.reset()
})

function renderTransaction(list = transaction){
    transactionList.innerHTML = "";
    if (list.length == 0){
        transactionList.innerHTML = `
        <p>While transaction is empty</p>
        `
        return
    }
    list.forEach(function(item){
        const isIncome = item.type == "income";
        const cardClass = isIncome ? "income" : "expense";
        const textClass = isIncome ? "income-text" : "expense-text";
        const sign = isIncome ? "+" : "-";
        const typeText = isIncome ? "income" : "Cost";

        transactionList.insertAdjacentHTML("beforeend", `
            <div class="transaction ${cardClass}">
                <div class="transaction-info">
                    <h5>${item.title}</h5>
                    <p>${typeText}</p>
                </div>
                <div>
                    <span class="${textClass}">${sign}${item.amount}grn</span>
                    <button class="btn btn-danger delete-btn" data-id="${item.id}">Delete</button>
                </div>
            </div>
            `)
    })
}
function updateStatistic(){
    const incomes = transaction.filter(function(item){
        return item.type == "income";
    });

    const totalIncome = incomes.reduce(function(sum, item){
        return sum + item.amount
    }, 0);


    const expenses = transaction.filter(function(item){
        return item.type == "expense";
    });

    const totalExpense = expenses.reduce(function(sum, item){
        return sum + item.amount
    }, 0)

    const totalBalance = totalIncome - totalExpense;
    income.textContent = totalIncome.toFixed(2);
    expense.textContent = totalExpense.toFixed(2);
    balance.textContent = totalBalance.toFixed(2);
}

transactionList.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-btn")) {
        const id = Number(e.target.dataset.id);
        transaction = transaction.filter(function (item) {
            return item.id !== id;
        });
        saveTransaction();
        renderTransaction();
        updateStatistic();
    }
});

renderTransaction();
updateStatistic();

function filterTransaction(type){
    if (type === "all"){
        renderTransaction(transaction);
        return;
    }
    const filtered = transaction.filter(function(item){
        return item.type === type;
    });
    renderTransaction(filtered);
}

filterButtons.forEach(function(button){
    button.addEventListener("click", function(){
        const filterType = this.dataset.filter;
        filterTransaction(filterType);
    });
});

if (clearBtn) {
    clearBtn.addEventListener("click", function(){
        transaction = [];
        saveTransaction();
        renderTransaction();
        updateStatistic();
    });
}
