# authentication-first

## Description

An app which uses authentication to grant the user permissions based on which account they have logged in to. The app mimics a repository for credentials for a company's divisions to use. This app uses the MERN stack.

## Table of Contents

1. [**Setting Up**](#setting-up)
2. [**Usage**](#usage)
3. [**Credits**](#credits)

# Setting Up

To run this app you will to have Node.js installed.

After downloading the repo, navigate to the directory using your command line and install dependencies by entering npm install. After this, open a second command line interface and navigate to the authentication-first-front-end folder and type npm install again. After doing this type npm start into each of the command lines. The front end will be hosted on http://localhost:3000 and the backend will be hosted on http://localhost:8000.

This message should appear in the command line for the back-end.
![image](https://github.com/user-attachments/assets/c0621816-f40a-4cae-b2eb-fdb931f9f391)

This message should appear in the command line for the front-end. The react app should open in your browser automatically.
![image](https://github.com/user-attachments/assets/eed093ad-bf2b-42a5-b8ad-b6495e63d77d)

# Usage

This app displays information from a MongoDB database. There are 4 Organisational Units, each with 3 divisions between them at the time of writing (If the database is altered outside the app, this can increase). Each of these divisions has a repository of credentials to access places needed for the divisions' functioning. 

## Login

The landing page is the login page.
![image](https://github.com/user-attachments/assets/f2b99075-e2a7-42ca-9f94-c3577de13dcd)

There is a user set-up as an admin with permissions to all divisions and app functions. Login to this user with username: "zippey" and password: "pwd". 

If you do not login, you will only be able to register users and login, the "Cred List" and "Users" sections are only available when logged in. 

If you want to logout and do not want to login to another user, click the logout button. 

![image](https://github.com/user-attachments/assets/ca86028e-6b5e-4100-8d4b-146a34102f50)

## User permissions

Newly registered users will always have normal permissions and no Org Units or Divisions assigned to them on creation. Org Units and Divisions can be assigned users with the admin permission. "zippey" has admin permissions. 

Normal users can only add new credentials to the database.

Management users can do the above and edit credentials

Admin users can do the above and assign Org Units and Divisions to users.

## Credentials

In the credentials page, you are may choose an organisational unit, a division and then an operation to perform. You can get a list of credentials, add credentials, and edit credentials.

## Users

This page can only be used by admins. From this page, an admin can change the Org Units, Divisions, or permissions associated with any user. 

# Credits

Currently, only I am working on this project.

