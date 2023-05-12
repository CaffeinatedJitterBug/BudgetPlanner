//__________________Global Variables____________________
const budget = document.getElementById("budget"); //example
const today = document.getElementById("date"); //AG
const budgetSubmit = document.getElementById('submit'); //AG

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

budgetSubmit.addEventListener('click', fileOCR);
  
function fileOCR(event) {
  event.preventDefault();
  const ocrKey = 'K86624004988957'; //AG
  const file = document.getElementById('receipt').files[0].name;
  const ocrURL = 'https://api.ocr.space/pare/image?apikey=' + ocrKey + '&file=' + file;

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
//Add event listener to the set budget button
//This should set the budget and display it on the page
//Append it to the graph so that it can be displayed appropriately
// Set savings to 4% of the budget
//This should add the budget to the local storage
//__________________Add-Expense-Button__________________
//Add event listener to the add expense button
//This should update the graph accordingly
//This should add the expense to the local storage



//__________________Graph functions_____________________
//Function related to the graph display API
//Should display the graph on the page with all the data from the three sources (budget, expenses, savings)
//Graph should update in appearance based on those three data points
//Display the graph on the page using chart.js
/* document.addEventListener('DOMContentLoaded', function() {
    var ctx = document.getElementById('pie-chart').getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Money Left', 'Savings', 'Money Spent'],
        datasets: [{
          data: [1000, 500, 700], // data should be replaced with the data from the three sources
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
            formatter: function(value, context) {
              return context.chart.data.labels[context.dataIndex];
            }
          }
        },
        reponsive: true,
        maintainAspectRatio: true,
        legend: {
          display: false
        }
      }
    });
  });
 */


//_______________Find An Advisor_________________

function mapquestRadiusSearch(apiKey, location) {

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

                        const advisorName = document.getElementById('advisorName');
                        const advisorAdress = document.getElementById('advisorAddress');
                        const advisorPhone = document.getElementById('advisorPhone');

                        advisorName.textContent = businessName;
                        advisorAdress.textContent = businessAddress;
                        advisorPhone.textContent = businessPhone;
                    };
                }
            }


        });
}

const searchBtn = document.getElementById('advisorSearch')

searchBtn.addEventListener('click', function () {
    const apiKey = "RNllwWWXiyhm721laLx5JSKyaoFO4G2b";
    const locationInput = document.getElementById("location");
    const location = locationInput.value;

    mapquestRadiusSearch(apiKey, location);
});



//__________________Local Storage Display_______________
//This should display local storage data on the page