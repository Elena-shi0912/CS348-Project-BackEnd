# CS348-Project-BackEnd
## How to create and load sample database
Please run the sql script _DatabaseStructure.sql_ to create tables and then import data from _carInfo.csv, DriverInfo.csv, PostInfo.csv, Review.csv_, and _UserInfo.csv_ files.

1. How to create and load sample database?
Step 1: Set up MySQL properly on your local machine

Step 2: Run DatabaseStructure.sql to create and populate tables for the database with sample data (the five csv files in sample data dir contain the sample data for each table)

2. How to run the working database-driven application?

Pre-requisite: You have NodeJS set up properly
Step 1: Create the directory (named as carpool here) for workspace
Step 2: Under carpool directory, clone the front-end code into client dir using command : git clone https://github.com/Elena-shi0912/CS348-Project-FrontEnd.git
                                 clone the back-end code into server dir using command : git clone https://github.com/Elena-shi0912/CS348-Project-BackEnd.git
Step 3: In clinet dir, run npm start [a web page should appear in either Firefox or Google browse and this is the user interface for this application]
Step 4: In client dir, run npm start [start the backend server]
Step 5: You are free to use the application web page now!


3. What feature it currently supports?
   a) Register User Name and User Password from web page
   b) The submitted Name and Password will be added to the corresponding UserInfo table in the backend
   c) Create five necessary tables for the database through backend

   SQL queries for following four features:
       1) Create User Account => insert into user table
       2) Filter based on Origin => Select from Carpool Posting table
       3) Sort carpool posts based on Price
       4) Update Seats Available in Carpool Post with existing data

    Note: The SQL queries and expected output for each feature is in SQLFeatures folder