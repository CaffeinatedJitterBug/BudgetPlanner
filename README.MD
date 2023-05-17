# Budget Planner

## Our Project
Our web application is a budget planner that helps you track your spending, set savings goals, and find a financial advisor. You can create a budget, set a savings amount, and track your progress over time. You can also set goals for yourself, such as saving for a down payment on a house or retirement. The application will help you track your progress towards your goals and adjust as needed. You can also insert receipt pictures and have the application pull the data you need. This is a great way to keep track of your spending and make sure you are on track to reach your financial goals.

## What our Project Solves
Our web application budget planner solves the problem of tracking and managing your finances. It can help you set budgets and track your spending. This can help you save money, pay off debt, and reach your financial goals.

Here are some of the benefits of using a web application budget planner:

* It's easy to use. You can create a budget in minutes, and then track your spending with just a few clicks.
* It's accurate. The budget planner will track all your income and expenses, so you can be sure that you're on track with your financial goals.
* It's flexible. You can easily adjust your budget as your income and expenses change.


## Key Highlights of our Project / Usage
Within our project, the main feature is a graph found within the overview section. This graph updates accordingly whenever you set a budget, savings and when you set your expenses. With out goals section, you can set some list goals that can serve as a guidance of what you are aiming for. If you have trouble with your own set goals, we have an API to help find a financial advisor near you. With our receipts API, you can upload a picture of a receipt, and it will automatically insert that data needed in the expense section.

## Problems Faced and Solutions
* At times, the chart will not render correctly when inputting an expense and/or goal. To fix this, clear local storage of last item or completely.
_____________________________________________________________________________________________________________________
* **Erik**: Local storage would not properly be removed, and when entering another expense, would pull the previously removed expenses as well. The solution was to make the remove button into a function in itself, and call it from the expense function, so that it can properly remove and update the necessary information. 
_____________________________________________________________________________________________________________________
* **Amy**: The OCR API was difficult to navigate, and the documentation wasn't completely clear on how to use certain parts of it. To resolve this, multiple attempts were made to work around the errors, such as declaring the file type and giving the file a temporary URL. In the end, instructor support was needed to resolve the issue.
_____________________________________________________________________________________________________________________
* **Michael**: The main issue was within the graph itself. Its difficulties lay within pulling data from three sources and referencing them to each other to update the graph after every necessary interaction. Most of the solutions came from mathematical arithmetic(s), such as calculating the whole number savings, and setting it to interact with the whole budget number. This also applied with the percentageLeft function, and then also to compare each of the sections towards each other for the completed graph.

## Future Implementations
* User login: To keep track of multiple accounts if needed, and access from multiple devices.
* Personalized features that would take the information from accounts, and implement them into different text areas, and more.
* Family organizations: Could take multiple single budget profiles or set them and create a graph representing them as a full.
* Monthly statements that iterates over past budget plans, to better keep tract of goals and past expenses.
* Expense categories: So that you can see the percentage % of each type of expense, and better plan that way.
* Color customization for graphs.
* Set goals into its own page with extra customizations, and js(JavaScript) implementations, such as full savings percentage, et cetera.
* With the MapQuest API, we would like to pull a GPS location as an option other than a manual city input to find a local Advisor(s).


## Wireframe
![WIREFRAME](https://github.com/CaffeinatedJitterBug/BudgetPlanner/assets/117021869/cdb80972-70f1-4535-8c64-89fbe0d8068d)

## Link to Deployed Website
https://caffeinatedjitterbug.github.io/BudgetPlanner/

## Screenshot of our Deployed Application
![DEPLOYEDAPP](https://github.com/CaffeinatedJitterBug/BudgetPlanner/assets/117021869/dd07f916-8423-4139-9ee9-ed4227523b99)

## Credits
* **Amy Green**
* **Erik Olson**
* **Michael Tranquillo**

### Resources

* Free OCR API: https://ocr.space/ocrapi : for pulling information out of photos. 

* MapQuest API: https://developer.mapquest.com/documentation/geocoding-api/ : used for getting the closest financial advisor for the city you enter.

* Ladislav Jarabek: Full Stack Bootcamp Instructor.

mit

Copyright (c) _2023_ _Amy/Erik/Michael
