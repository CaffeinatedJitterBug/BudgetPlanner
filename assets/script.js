//__________________Global Variables____________________
const budget = document.getElementById("budget"); //example
const today = document.getElementById("date");
const ocrKey = 'K86624004988957';

//__________________Today's Date________________________
today.textContent = "Today is " + dayjs().format('MMMM D, YYYY');

//__________________Event-Listeners_____________________
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




//__________________Local Storage Display_______________
//This should display local storage data on the page