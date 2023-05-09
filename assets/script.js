//__________________Global Variables____________________
const budget = document.getElementById("budget"); //example
const today = document.getElementById("date");


//__________________Today's Date________________________
today.textContent = "Today is " + dayjs().format('MMMM D, YYYY');

//__________________Event-Listeners_____________________
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