document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("entry-form");
    const entriesList = document.getElementById("entries-list");
    const totalIncomeElement = document.getElementById("total-income");
    const totalExpenseElement = document.getElementById("total-expense");
    const netBalanceElement = document.getElementById("net-balance");
  
    let entries = JSON.parse(localStorage.getItem("entries")) || [];
  
    const renderEntries = (filter = "All") => {
      entriesList.innerHTML = "";
      const filteredEntries =
        filter === "All"
          ? entries
          : entries.filter((entry) => entry.type === filter);
      filteredEntries.forEach((entry, index) => {
        const row = document.createElement("tr");
        row.classList.add("border-t");
        row.innerHTML = `
                  <td class="px-4 py-2">${
                    entry.description
                  }</td>
                  <td class="px- py-2 ${
                    entry.type === "Income" ? "text-green-500" : "text-red-500"
                  }">
                      $${parseFloat(entry.amount).toFixed(2)}
                  </td>
                  <td class="px-4 py-2">${entry.type}</td>
                  <td class="px-4 py-2 ">
                      <button class="text-blue-500 mr-4 " onclick="editEntry(${index})">Edit</button>
                      <button class="text-red-500" onclick="deleteEntry(${index})">Delete</button>
                  </td>
              `;
        entriesList.appendChild(row);
      });
      updateTotals();
    };
  
    const updateTotals = () => {
      const totalIncome = entries.reduce(
        (sum, entry) =>
          entry.type === "Income" ? sum + parseFloat(entry.amount) : sum,
        0
      );
      const totalExpense = entries.reduce(
        (sum, entry) =>
          entry.type === "Expense" ? sum + parseFloat(entry.amount) : sum,
        0
      );
      totalIncomeElement.textContent = `$${totalIncome.toFixed(2)}`;
      totalExpenseElement.textContent = `$${totalExpense.toFixed(2)}`;
      netBalanceElement.textContent = `$${(totalIncome - totalExpense).toFixed(
        2
      )}`;
    };
  
    const saveEntries = () => {
      localStorage.setItem("entries", JSON.stringify(entries));
    };
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const description = document.getElementById("description").value;
      const amount = document.getElementById("amount").value;
      const type = document.querySelector('input[name="type"]:checked').value;
      entries.push({ description, amount, type });
      form.reset();
      saveEntries();
      renderEntries();
    });
  
    window.editEntry = (index) => {
      const entry = entries[index];
      document.getElementById("description").value = entry.description;
      document.getElementById("amount").value = entry.amount;
      document.querySelector(
        `input[name="type"][value="${entry.type}"]`
      ).checked = true;
      entries.splice(index, 1);
      saveEntries();
      renderEntries();
    };
  
    window.deleteEntry = (index) => {
      entries.splice(index, 1);
      saveEntries();
      renderEntries();
    };
  
    document.querySelectorAll('input[name="filter"]').forEach((filterButton) => {
      filterButton.addEventListener("change", () => {
        renderEntries(filterButton.value);
      });
    });
  
    renderEntries();
  });