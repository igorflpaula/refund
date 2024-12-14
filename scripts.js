// Elementos
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

// Elementos da lista
const expenseList = document.querySelector("ul");
const expenseTotal = document.querySelector("aside header h2");
const expenseQuantity = document.querySelector("aside header p span");

amount.oninput = () => {
  let value = amount.value.replace(/\D/g, "");

  value = Number(value) / 100;

  amount.value = formatCurrencyBRL(value);
};

function formatCurrencyBRL(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

form.onsubmit = (event) => {
  event.preventDefault();

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  };

  expenseAdd(newExpense);
};

// Cria a estrutura de <li>
function expenseAdd(newExpense) {
  try {
    // <li>
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    // <img>
    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    // <div class="expense-info">
    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    // <strong>
    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    // <span>
    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    // Adiciona name e categoria na div das despesas (expenseInfo)
    expenseInfo.append(expenseName, expenseCategory);

    // <span><small>
    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`;

    // <img> de delete
    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.setAttribute("src", "img/remove.svg");

    // Adiciona Icone, Info no Item da Lista
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);
    expenseList.append(expenseItem);

    // Limpa o form
    formClear();

    // Atualiza o total de items
    updateTotals();
  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas.");
    console.log(error);
  }
}

function updateTotals() {
  try {
    // Recupera todos os items <li> de <ul>
    const items = expenseList.children;

    // Atualiza <span>
    expenseQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`;

    // Increment Total

    let total = 0;

    for(let item = 0; item < items.length; item++){
      const itemAmount = items[item].querySelector(".expense-amount");

      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".");
      value = parseFloat(value);

      if(isNaN(value)){
        return alert("Valor não é um número.");
      }

      total += Number(value);
    }

    // Criar <span> do valor total
    const symbolBRL = document.createElement("small");
    symbolBRL.textContent = "R$";
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "");

    expenseTotal.innerHTML = "";
    expenseTotal.append(symbolBRL, total);
  } catch (error) {
    console.log(error);
    alert("Não foi possível att o total");
  }
}

expenseList.addEventListener("click", function(event) {
  if(event.target.classList.contains("remove-icon")){
    const item = event.target.closest(".expense");
    item.remove();
  }

  updateTotals();
})

function formClear(){
  expense.value = "";
  category.value = "";
  amount.value = "";

  expense.focus();
}