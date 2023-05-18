//__________________Global Variables____________________
let budget = document.getElementById("budget"); //example
const today = document.getElementById("date"); //AG
const receiptSubmit = document.getElementById("submit"); //AG
const setBudget = document.querySelector(".set-budget");
const setSavings = document.querySelector(".set-saving");
const budgetInput = document.querySelector(".budget-button");
const manualInput = document.getElementById("expense-submit")
let savingsAmount = 0;
let moneySpent = 0;
let moneyLeft = 0;
let myChart = undefined;

let expenseItemArr = JSON.parse(localStorage.getItem("expenseItemArr")) || [];
let expenseAmountArr = JSON.parse(localStorage.getItem("expenseAmountArr")) || [];
//__________________Today"s Date________________________
today.textContent = "Today is " + dayjs().format("MMMM D, YYYY"); //AG
//Call for any local storage data if it exists on page load.
document.addEventListener("DOMContentLoaded", function () {
  getLocalStorage();
  renderExpense();
  renderGraph();
});

//__________________Event-Listeners_____________________
//AG
document.addEventListener("DOMContentLoaded", () => {
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add("is-active");
  }

  function closeModal($el) {
    $el.classList.remove("is-active");
  }

  function closeAllModals() {
    (document.querySelectorAll(".modal") || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll(".js-modal-trigger") || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener("click", () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll(".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button") || []).forEach(($close) => {
    const $target = $close.closest(".modal");

    $close.addEventListener("click", () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener("keydown", (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) { // Escape key
      closeAllModals();
    }
  });
});

receiptSubmit.addEventListener("click", fileOCR);

async function fileOCR(event) {
  event.preventDefault();
  const ocrKey = "K86624004988957";
  const fileName = document.getElementById("receipt").files[0];
  const ocrURL = "https://api.ocr.space/parse/image";

  const formData  = new FormData();

  formData.append('apikey', ocrKey);
  formData.append('file', fileName);

  fetch(ocrURL, {
    method: "POST",
    body: formData
  })

    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      const nums = data.ParsedResults[0].ParsedText
        .split('\r\n')
        .map(function(line) { return parseFloat(line) })
        .filter(function(line) { return !isNaN(line) });
      let biggestNum = 0;
      const itemName = 'Receipt';

      for (let x=0; x<nums.length; x++) {

        if (biggestNum < nums[x]) {
          biggestNum = nums[x];
        }
      }
      expenseItemArr.push(itemName);
      expenseAmountArr.push(biggestNum);

      localStorage.setItem('expenseItemArr', JSON.stringify(expenseItemArr));
      localStorage.setItem('expenseAmountArr', JSON.stringify(expenseAmountArr));

      renderExpense();
      renderGraph();
      const getModal = document.querySelector("#budget-modal");
      getModal.classList.remove('is-active');

    })
}
//End AG

//__________________Set-Budget-Button___________________
//Michael Tranquillo && EO
//set submit button for budget section that takes budget as total and savings as a percentage


function budgetInfo() {
  budget = parseFloat(setBudget.value);
  let savings = parseFloat(setSavings.value);
  // savingsAmount = will convert the budget number into the savings percentage from the whole number you chose.
  // toFixed(2) = will round the number to two decimal places.
  savingsAmount = (Math.floor(budget / 100) * savings).toFixed(2);
  // Set local storage for the budget and savings amount
  localStorage.setItem("budget", budget);
  localStorage.setItem("savingsAmount", savingsAmount);
  // Set local storage for the expense item and amount arrays
  localStorage.setItem("expenseItemArr", JSON.stringify(expenseItemArr));
  localStorage.setItem("expenseAmountArr", JSON.stringify(expenseAmountArr));
  renderGraph();
}

budgetInput.addEventListener("click", function (event) {
  event.preventDefault();
  budgetInfo();
});


setBudget.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    setSavings.focus();
  }
});


//__________________Set-expense-Button__________________
//Michael Tranquillo && EO

function expense() {
  const expenseItem = document.querySelector(".expense-item-input");
  const expenseAmount = document.querySelector(".expense-amount-input");
  moneySpent += parseFloat(expenseAmount.value);
  // Push the new expense item and amount into the arrays
  expenseItemArr.push(expenseItem.value);
  expenseAmountArr.push(parseFloat(expenseAmount.value));
  // Set local storage for the expense item and amount arrays
  localStorage.setItem("expenseItemArr", JSON.stringify(expenseItemArr));
  localStorage.setItem("expenseAmountArr", JSON.stringify(expenseAmountArr));
  // Set local storage for the money spent
  localStorage.setItem("moneySpent", moneySpent);
  //clear the input fields
  expenseItem.value = "";
  expenseAmount.value = "";
}

manualInput.addEventListener("click", function (event) {
  event.preventDefault();
  expense();

  getLocalStorage();
  renderExpense();
  renderGraph();
});

const expenseItem = document.querySelector(".expense-item-input");
setSavings.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    budgetInfo();
    expenseItem.focus({
      preventScroll: true
    });
  }
})

const expenseAmount = document.querySelector(".expense-amount-input");
expenseItem.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    expenseAmount.focus();
  }
})

expenseAmount.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    expense();
    getLocalStorage();
    renderExpense();
    renderGraph();
    expenseItem.focus();
  }
})

// render expense info
//Michael Tranquillo
function removeExpense(index) {
  expenseItemArr.splice(index, 1);
  expenseAmountArr.splice(index, 1);
  localStorage.setItem("expenseItemArr", JSON.stringify(expenseItemArr));
  localStorage.setItem("expenseAmountArr", JSON.stringify(expenseAmountArr));
}

function renderExpense() {
  const expenseList = document.querySelector(".expense-list");
  expenseList.innerHTML = "";
  let updatedMoneySpent = 0;

  // Retrieve expenseItemArr and expenseAmountArr from local storage
  const storedExpenseItemArr = JSON.parse(localStorage.getItem("expenseItemArr")) || [];
  const storedExpenseAmountArr = JSON.parse(localStorage.getItem("expenseAmountArr")) || [];

  // Convert retrieved values to arrays if they are not already
  const expenseItemArr = Array.isArray(storedExpenseItemArr) ? storedExpenseItemArr : [storedExpenseItemArr];
  const expenseAmountArr = Array.isArray(storedExpenseAmountArr) ? storedExpenseAmountArr : [storedExpenseAmountArr];

  for (let i = 0; i < expenseItemArr.length; i++) {
    const expense = expenseItemArr[i];
    const amount = expenseAmountArr[i];
    updatedMoneySpent += parseFloat(amount);

    const li = document.createElement("li");
    li.textContent = expense + ": $" + amount;
    li.setAttribute("data-index", i);
    expenseList.appendChild(li);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "X";
    removeBtn.setAttribute("class", "removeBtn");
    li.appendChild(removeBtn);

    removeBtn.addEventListener("click", function (e) {
      removeExpense(e.target.parentElement.getAttribute("data-index"));
      renderExpense();
      renderGraph();
    });

  }

  moneySpent = updatedMoneySpent;

  // Store the updated expenseItemArr and expenseAmountArr in local storage
  localStorage.setItem("expenseItemArr", JSON.stringify(expenseItemArr));
  localStorage.setItem("expenseAmountArr", JSON.stringify(expenseAmountArr));
}





//__________________Graph functions_____________________
// Calls the graph to render when the page loads
//Michael Tranquillo
document.addEventListener("DOMContentLoaded", function () {
  renderGraph();
});
// Function for re-rendering the graph whenever needed.
//Michael Tranquillo
function renderGraph() {
  if (myChart) {
    myChart.destroy();
  };
  getLocalStorage();
  moneyLeft = budget - moneySpent - savingsAmount; //This will pull the data from each section and calculate the money left.
  document.getElementById("pie-chart").textContent = "";
  const ctx = document.getElementById("pie-chart").getContext("2d");
  myChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Money Left", "Savings", "Money Spent"],
      datasets: [{
        data: [moneyLeft, savingsAmount, moneySpent],
        backgroundColor: [ // change colors here to match theme
          "rgba(14, 14, 204, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)"
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(36, 197, 237, 1)",
          "rgba(204, 12, 12, 1)"
        ],
        borderWidth: 1.5
      }]
    },
    options: {
      plugins: {
        datalabels: {
          color: "#fff",
          formatter: function (value, context) {
            return context.chart.data.labels[context.dataIndex];
          },
          anchor: "center",
          align: "center",
          position: "relative",
        }
      }
    },
    responsive: true,
    maintainAspectRatio: true,
    legend: {
      display: false
    }
  });
  percentageLeft();
}

//_____________ Add/Render Goal using local storage______________

const storedGoals = JSON.parse(localStorage.getItem("goals")) || []; /*EO*/

const goalList = document.getElementById("goal-list");
renderGoals();

const addGoalButton = document.getElementById("addGoalBtn");
const inputField = document.getElementById("goal-input");

addGoalButton.addEventListener("click", addGoal);
inputField.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addGoal();
  }
});

function addGoal() {
  const goalText = inputField.value;

  if (goalText) {
    storedGoals.push(goalText);
    localStorage.setItem("goals", JSON.stringify(storedGoals));
    inputField.value = "";
    renderGoals(goalText);
  }
}

function renderGoals() {
  goalList.innerHTML = "";

  for (let i = 0; i < storedGoals.length; i++) {
    const goal = storedGoals[i];
    const li = document.createElement("li");
    li.textContent = goal + " ";
    goalList.appendChild(li);

    const removeGoal = document.createElement("button");
    removeGoal.setAttribute("class", "removeBtn");
    removeGoal.textContent = "Goal Met";
    li.appendChild(removeGoal);

    removeGoal.addEventListener("click", function () {
      li.remove();
      storedGoals.splice(i, 1);
      localStorage.setItem("goals", JSON.stringify(storedGoals));
    })
  }
} /*EO*/



//_______________Find An Advisor_________________

function mapquestRadiusSearch(apiKey, location) { /*EO*/

  const geocodeUrl = "https://www.mapquestapi.com/geocoding/v1/address?key=" + apiKey + "&location=" + location;
  fetch(geocodeUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (geocodeData) {
      const latitude = geocodeData.results[0].locations[0].latLng.lat;
      const longitude = geocodeData.results[0].locations[0].latLng.lng;


      const searchUrl = "https://www.mapquestapi.com/search/v2/radius?key=" + apiKey + "&origin=" + latitude + "," + longitude + "&radius=100";

      fetch(searchUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (searchData) {
          retrieveAdvisors(searchData)
          console.log(searchData)
          return searchData;
        });



      function retrieveAdvisors(searchData) {
        const advisorModal = document.getElementById("advisorModal");
        const modalAdvisorName = document.getElementById("modalAdvisorName");
        const modalAdvisorAddress = document.getElementById("modalAdvisorAddress");
        const modalAdvisorPhone = document.getElementById("modalAdvisorPhone");
        const modalCloseBtn = document.getElementById("closeAdvisor");

        for (let i = 0; i < searchData.searchResults.length; i++) {
          const result = searchData.searchResults[i].name;
          const address = searchData.searchResults[i].fields.address;
          const city = searchData.searchResults[i].fields.city;
          const state = searchData.searchResults[i].fields.state;
          const number = searchData.searchResults[i].fields.phone;
          let cleanNumber = number.replace(/\D/g, ""); //The internet is wonderful.
          let phone = cleanNumber.slice(1, 4) + "-" + cleanNumber.slice(4, 7) + "-" + cleanNumber.slice(7);

          if (result.includes("Financial" || "Advisor" || "Services")) {

            const businessName = result;
            const businessAddress = address + " " + city + ", " + state;
            const businessPhone = phone;

            modalAdvisorName.textContent = businessName;
            modalAdvisorAddress.textContent = businessAddress;
            modalAdvisorPhone.textContent = businessPhone;

            advisorModal.style.display = "block";
          };
        }

        modalCloseBtn.addEventListener("click", function (event) {
          if (event.target === modalCloseBtn) {
            advisorModal.style.display = "none";
          }
        });

      }
    });
}

//______________Show percentage of budget spent_______________
//show percentage of remaining budget and add it as text to the html element percentage-left and change text and text color if over budget
function percentageLeft() {
  const percentageLeft = document.querySelector(".percentage-left");
  const percentage = Math.round((moneyLeft / budget) * 100);
  percentageLeft.textContent = percentage + "% of your budget remains!";
  if (percentage < 0) {
    percentageLeft.textContent = "Over Budget! If you are having a hard time staying on budget, we recommend contacting a financial advisor!";
    percentageLeft.style.color = "red";
  } else if (percentage > 0) {
    percentageLeft.style.color = "black";
  } else {
    percentageLeft.textContent = "Don't forget to add your budget, and your savings!";
  }
};

const searchBtn = document.getElementById("advisorSearch")
const locationInput = document.getElementById("location");

searchBtn.addEventListener("click", function () {
  const apiKey = "RNllwWWXiyhm721laLx5JSKyaoFO4G2b";
  const location = locationInput.value;
  mapquestRadiusSearch(apiKey, location);
});

locationInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const apiKey = "RNllwWWXiyhm721laLx5JSKyaoFO4G2b";
    const location = locationInput.value;
    mapquestRadiusSearch(apiKey, location);
  }
});

/*EO*/



//__________________Local Storage Display_______________
function getLocalStorage() {
  //get local storage for the budget
  budget = JSON.parse(localStorage.getItem("budget"));
  //get local storage for the money spent
  moneySpent = JSON.parse(localStorage.getItem("moneySpent"));
  //get local storage for the savings amount
  savingsAmount = JSON.parse(localStorage.getItem("savingsAmount"));

  renderExpense();
};