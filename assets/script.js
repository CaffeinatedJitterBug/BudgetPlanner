//__________________Global Variables____________________
const budget = document.getElementById("budget"); //example
const today = document.getElementById("date"); //AG
const receiptSubmit = document.getElementById('submit'); //AG
//HTML elements.
const setBudget = document.querySelector(".set-budget");
const setSavings = document.querySelector(".set-saving");
const budgetInput = document.querySelector(".budget-button");
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
  const file = document.getElementById('receipt').files[0].name;
  const ocrURL = 'https://api.ocr.space/parse/image?apikey=' + ocrKey + '&file=' + file;

  fetch(ocrURL)
  .then(function(response) {
    return response.json();
  })
  .then(function() {
    console.log(response);
  })
}
//End AG

//__________________Set-Budget-Button___________________
//Michael Tranquillo
budgetInput.addEventListener("click", function (event) {
  event.preventDefault();
  const budget = setBudget.value;
  const savings = setSavings.value;
  // savingsAmount = will convert the budget number into the savings percentage from the whole number you chose.
  // toFixed(2) = will round the number to two decimal places.
  savingsAmount = (Math.floor(budget / 100) * savings).toFixed(2);
  // console.log(budget);
  // console.log(savingsAmount);
  renderGraph();
});

//__________________Add-Expense-Button__________________
//Add event listener to the add expense button
//This should update the graph accordingly
//This should add the expense to the local storage



//__________________Graph functions_____________________
// Calls the graph to renter when the page loads
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
  document.getElementById('pie-chart').textContent = '';
  const ctx = document.getElementById('pie-chart').getContext('2d');
  myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Money Left', 'Savings', 'Money Spent'],
      datasets: [{
        data: [1000, savingsAmount, 700], // data should be replaced with the data from the three sources
        // data: [budgetLeft, savings, expenses]
        // budgetLeft = budget - expenses - savings
        // savings = budget * saving% transformed from whole number to decimal 0.00 (4% = 0.04)
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
//This should display local storage data on the page