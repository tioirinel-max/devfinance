const transactionBody = document.querySelector('#transaction-body');
const form = document.querySelector('#form');
const incomeDisplay = document.querySelector('#incomeDisplay');
const expenseDisplay = document.querySelector('#expenseDisplay');
const totalDisplay = document.querySelector('#totalDisplay');

// 1. Obter dados do LocalStorage
let transactions = JSON.parse(localStorage.getItem('dev.finances:transactions')) || [];

// 2. Gráfico Chart.js
let ctx = document.getElementById('myChart').getContext('2d');
let myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Entradas', 'Saídas'],
        datasets: [{
            data: [0, 0],
            backgroundColor: ['#49aa26', '#e92929']
        }]
    },
    options: { responsive: true, maintainAspectRatio: false }
});

// 3. Funções de Cálculo e Atualização
function updateValues() {
    const amounts = transactions.map(t => t.type === 'expense' ? -t.amount : t.amount);
    const income = amounts.filter(v => v > 0).reduce((acc, v) => acc + v, 0);
    const expense = Math.abs(amounts.filter(v => v < 0).reduce((acc, v) => acc + v, 0));
    const total = income - expense;

    incomeDisplay.innerText = `R$ ${income.toFixed(2)}`;
    expenseDisplay.innerText = `R$ ${expense.toFixed(2)}`;
    totalDisplay.innerText = `R$ ${total.toFixed(2)}`;

    // Atualizar Gráfico
    myChart.data.datasets[0].data = [income, expense];
    myChart.update();
}

function addTransactionDOM(t, index) {
    const cssClass = t.type === 'income' ? 'income' : 'expense';
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${t.description}</td>
        <td class="${cssClass}">R$ ${t.amount.toFixed(2)}</td>
        <td class="remove" onclick="removeTransaction(${index})">✕</td>
    `;
    transactionBody.appendChild(row);
}

function init() {
    transactionBody.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
    localStorage.setItem('dev.finances:transactions', JSON.stringify(transactions));
}

// 4. Eventos
form.addEventListener('submit', e => {
    e.preventDefault();
    const transaction = {
        description: document.querySelector('#description').value,
        amount: Number(document.querySelector('#amount').value),
        type: document.querySelector('#type').value
    };
    transactions.push(transaction);
    init();
    form.reset();
});

function removeTransaction(index) {
    transactions.splice(index, 1);
    init();
}

init();
