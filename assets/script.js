//__________________Global Variables____________________
let budget = document.getElementById("budget"); //example
const today = document.getElementById("date"); //AG
const receiptSubmit = document.getElementById('submit'); //AG
const setBudget = document.querySelector(".set-budget");
const setSavings = document.querySelector(".set-saving");
const budgetInput = document.querySelector(".budget-button");
const manualInput = document.getElementById("expense-submit")
let savingsAmount = 0;
let moneySpent = 0;
let moneyLeft = 0;
let myChart = undefined;
//__________________Today's Date________________________
today.textContent = "Today is " + dayjs().format('MMMM D, YYYY'); //AG

//__________________Event-Listeners_____________________
//AG
document.addEventListener('DOMContentLoaded', () => {
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add('is-active');
  }

  function closeModal($el) {
    $el.classList.remove('is-active');
  }

  function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) { // Escape key
      closeAllModals();
    }
  });
});

receiptSubmit.addEventListener('click', fileOCR);

function fileOCR(event) {
  event.preventDefault();
  const ocrKey = 'K86624004988957'; //AG
  //const file = document.getElementById('receipt').files[0].name;
  const ocrURL = 'https://api.ocr.space/pare/image?apikey=' + ocrKey + '&file=' + file;

  fetch(ocrURL)
    .then(function (response) {
      return response.json();
    })
    .then(function () {
      console.log(response);
    })
}
//End AG

//__________________Set-Budget-Button___________________
//Michael Tranquillo
budgetInput.addEventListener("click", function (event) {
  event.preventDefault();
  budget = setBudget.value;
  let savings = setSavings.value;
  // savingsAmount = will convert the budget number into the savings percentage from the whole number you chose.
  // toFixed(2) = will round the number to two decimal places.
  savingsAmount = (Math.floor(budget / 100) * savings).toFixed(2);
  //clear local storage if it exists before setting new values
  localStorage.clear();
  //store the budget and savings amount in local storage
  localStorage.setItem('budget', budget);
  localStorage.setItem('savingsAmount', savingsAmount);
  getLocalStorage();
  renderGraph();
});

//__________________Add-Expense-Button__________________
//Add event listener to the add expense button
//Michael Tranquillo
manualInput.addEventListener("click", function (event) {
  event.preventDefault();
  const expenseItem = document.querySelector(".expense-item-input");
  const expenseAmount = document.querySelector(".expense-amount-input");
  moneySpent += parseFloat(expenseAmount.value);
  //set local storage for the expense item and amount json
  localStorage.setItem('expenseItem', JSON.stringify(expenseItem.value));
  localStorage.setItem('expenseAmount', JSON.stringify(expenseAmount.value));
  //set local storage for the money spent
  localStorage.setItem('moneySpent', moneySpent);
  callLocalStorage();
  renderGraph();
});





//__________________Graph functions_____________________
// Calls the graph to render when the page loads
//Michael Tranquillo
document.addEventListener('DOMContentLoaded', function () {
  renderGraph();
});
// Function for re-rendering the graph whenever needed.
//Michael Tranquillo
function renderGraph() {
  if (myChart) {
    myChart.destroy();
  };
  callLocalStorage();
  moneyLeft = budget - moneySpent - savingsAmount; //This will pull the data from each section and calculate the money left.
  document.getElementById('pie-chart').textContent = '';
  const ctx = document.getElementById('pie-chart').getContext('2d');
  myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Money Left', 'Savings', 'Money Spent'],
      datasets: [{
        data: [moneyLeft, savingsAmount, moneySpent],
        backgroundColor: [ // change colors here to match theme
          'rgba(54, 162, 235, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 99, 132, 0.7)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1.5
      }]
    },
    options: {
      plugins: {
        datalabels: {
          color: '#fff',
          formatter: function (value, context) {
            return context.chart.data.labels[context.dataIndex];
          }
        }
      }
    },
    reponsive: true,
    maintainAspectRatio: true,
    legend: {
      display: false
    }
  });
}

//_____________ Add/Render Goal using local storage______________

const storedGoals = JSON.parse(localStorage.getItem('goals')) || []; /*EO*/

const goalList = document.getElementById('goal-list');
renderGoals();

const addGoalButton = document.getElementById('addGoalBtn');
addGoalButton.addEventListener('click', addGoal);

function addGoal() {
  const inputField = document.getElementById('goal-input');
  const goalText = inputField.value;

  if (goalText) {
    storedGoals.push(goalText);
    localStorage.setItem('goals', JSON.stringify(storedGoals));
    inputField.value = '';
    renderGoals(goalText);
  }
}

function renderGoals() {
  goalList.innerHTML = '';

  for (let i = 0; i < storedGoals.length; i++) {
    const goal = storedGoals[i];
    const li = document.createElement('li');
    li.textContent = goal;
    goalList.appendChild(li);
  }
} /*EO*/



//_______________Find An Advisor_________________

function mapquestRadiusSearch(apiKey, location) { /*EO*/

  const geocodeUrl = "http://www.mapquestapi.com/geocoding/v1/address?key=" + apiKey + "&location=" + location;
  fetch(geocodeUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (geocodeData) {
      const latitude = geocodeData.results[0].locations[0].latLng.lat;
      const longitude = geocodeData.results[0].locations[0].latLng.lng;


      const searchUrl = "http://www.mapquestapi.com/search/v2/radius?key=" + apiKey + "&origin=" + latitude + "," + longitude + "&radius=100";

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
        const advisorModal = document.getElementById('advisorModal');
        const modalAdvisorName = document.getElementById('modalAdvisorName');
        const modalAdvisorAddress = document.getElementById('modalAdvisorAddress');
        const modalAdvisorPhone = document.getElementById('modalAdvisorPhone');
        const modalCloseBtn = document.getElementById('closeAdvisor');

        for (let i = 0; i < searchData.searchResults.length; i++) {
          const result = searchData.searchResults[i].name;
          const address = searchData.searchResults[i].fields.address;
          const city = searchData.searchResults[i].fields.city;
          const state = searchData.searchResults[i].fields.state;
          const number = searchData.searchResults[i].fields.phone;
          let cleanNumber = number.replace(/\D/g, ''); //The internet is wonderful.
          let phone = cleanNumber.slice(1, 4) + '-' + cleanNumber.slice(4, 7) + '-' + cleanNumber.slice(7);

          if (result.includes("Financial" || "Advisor" || "Services")) {

            const businessName = result;
            const businessAddress = address + ' ' + city + ', ' + state;
            const businessPhone = phone;

            modalAdvisorName.textContent = businessName;
            modalAdvisorAddress.textContent = businessAddress;
            modalAdvisorPhone.textContent = businessPhone;

            advisorModal.style.display = "block";
          };
        }

        modalCloseBtn.addEventListener('click', function (event) {
          if (event.target === modalCloseBtn) {
            advisorModal.style.display = "none";
          }
        });

      }
    });
}

const searchBtn = document.getElementById('advisorSearch')

searchBtn.addEventListener('click', function () {
  const apiKey = "RNllwWWXiyhm721laLx5JSKyaoFO4G2b";
  const locationInput = document.getElementById("location");
  const location = locationInput.value;

  mapquestRadiusSearch(apiKey, location);
}); /*EO*/



//__________________Local Storage Display_______________
function getLocalStorage() {

}