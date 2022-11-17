# CS348-Project-BackEnd

## How to create database
With mySQL installed and running, open mysql workbench, copy the content inside createTables.sql into a query file
running the create to generate all tables
[NOTE: you need to comment the last 2 triggers in the sql file first]

## How to load sample database
Step1: Download all CSV files under folder Sample_Data_M2 and also populate_sample_data.sql

Step2: Change the file location of each CSV file in populate_sample_data.sql to the location in your computer

Step3: With mySQL running, enter the command 'source location-of-populate_sample_data.sql' to populate the sample data into tables

Step4: Run the comment out 2 triggers now

## How to get and load production data
Step1: Download the production_data_v2.py under folder Production_Data

Step2: Run the python script to automatically generate CSV file for each table

Step3: Down populate_database.sql under Production_Data folder and follow the same step as sample data to populate production data

Step4: Rerun the 2 triggers (if you did not run them after populating sample data)

## How to run the working database-driven application?

Pre-requisite: You have NodeJS set up properly
Step 1: Create the directory (named as carpool here) for workspace
Step 2: Under carpool directory, clone the front-end code into client dir using command : git clone https://github.com/Elena-shi0912/CS348-Project-FrontEnd.git
                                 clone the back-end code into server dir using command : git clone https://github.com/Elena-shi0912/CS348-Project-BackEnd.git
Step 3: In clinet dir, run npm start [a web page should appear in either Firefox or Google browse and this is the user interface for this application]
Step 4: In client dir, run npm start [start the backend server]
Step 5: You are free to use the application web page now!


# What feature is currently supported?
   a) Create User Account in Sign Up page and insert into User and User/DriverProfile tables
   b) Log in using registered Email and Password (performing check on email and possword)
   c) User can view all the postings 
   d) Driver can only view his/her own posting
   e) Driver can update the number of available seats in his/her own posting
   f) User can view his/her own profile
   g) User can make an reservation on the posting and the available seats of the corresponding posting will be decreased

All the features is implemented in index.js file in Backend repo
