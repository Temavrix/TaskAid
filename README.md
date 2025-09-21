# TaskAid

###### An App Made To Boost Your Productivity And Motivate you

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/Temavrix/TaskAid) [![Documentation Status](https://readthedocs.org/projects/ansicolortags/badge/?version=latest)](https://github.com/Temavrix/TaskAid) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/Temavrix/TaskAid/issues)

## Our Project is now live: [TaskAid](https://taskaid-tvix.onrender.com/)

<img width="150" src="https://github.com/user-attachments/assets/a0f0031a-a982-4d68-be09-033b4641e8e8"/> <img width="150" src="https://github.com/user-attachments/assets/ae999415-43a1-4c8b-9542-2b2872197202"/>
<img width="150" src="https://github.com/user-attachments/assets/bfe1580e-23ce-4223-8468-05028bd98bb1"/>

## Table Of Contents
- [What's New?](#whats-new)
- [Introduction to TaskAid](#introducing-taskaid)
- [Running TaskAid On Your Computer](#running-taskaid-on-your-local-computer)
- [How MongoDB Handles Your Data?](#how-your-data-is-handled-with-mongodb)
   * [Private MongoDB Database For Devs](#for-devs-who-want-to-have-a-private-mongodb-database)
- [Issues](#issues)
- [License](#license)



## What's New?
Here at Temavrix we are committed in keeping TaskAid up-to-date and up-to-speed with the growing tech solutions, services and algorithms. Hence this new commit includes:


```
TaskAid Changelogs:-
QOL upgrades:
1. Asthetics and Color Choices Improvements

Code Checks Manifest:-
All Checks Status: ✅
-----------------------------------------
UX (User Experience) Checks: ✅
BackEnd Code-FrontEnd UI Integration Checks: ✅
(All evaluations are done by the R&D Department)

Last Updated: 21-September-2025 15:25 HRS (Singapore Standard Time)
Publisher: Temavrix
```
Keep up-to-date with what's happening on this repository by clicking the 'Star' and 'Watch' button on the top right corner of this webpage.



## Introducing TaskAid
TaskAid is a web-based application designed for users to store and track commitments, store notes and track users overall efficiency using a calander to make their week more productive.  
This product is built primarily using React JS as the frontend framework and MongoDB as the database to store and retrieve user's information.


## Running TaskAid On Your Local Computer
TaskAid can be exectued on you localhost by installing node.js and after initializing npm, Head to pages sub-folder 

### Running Frontend 
Type this in the terminal
```
>>> cd Taskaid
```
Then run the following command in you command line to start your localhost frontend.
```
>>> npm run dev
```
Once the command is executed you will get the following output. You will need to go to the localhost link (Ex: http://localhost:5173/) or you can press ctrl + click on the link.
```
npm run dev

> package.json@0.0.0 dev
> vite

  VITE v6.2.6  ready in 195 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```
Now you can enjoy using the web-app.

### Running Backend
Currently in the frontend code all API requests targeted at MongoDB are passing through our organization's server in Render.com.  
Hence in order to create use the server provided in this repository, you will need to replace all links in the frontend code:
```
https://taskaid-backend-8v50.onrender.com/api/tasks
``` 
and point it to your localhost server:
```
{localhost-server}/api/tasks
```
Open a new terminal and type this:
```
>>> cd Server
```
Then run the following command in you command line to start your localhost server.
```
>>> node server.js
```


## How Your Data Is Handled With MongoDB?
In TaskAid only your login details, commitments and notes are saved in the database for easy retrieval. All these information are saved under the E-Mail address which is used for registering in the login page at the start.


   #### For Devs Who Want To Have A Private MongoDB Database
   For Devs who want to have a private database without storing your info on our databases you can go to [MongoDB](https://MongoDB.com/) and create a database cluster.


## Issues
As this project is still in constant development, if you run into any issues while operating or have any suggestions or features, please feel free to drop by our [issues](https://github.com/Temavrix/TaskAid/issues) section and open a issue and we'll respond within 2-4 working days, Thank you for your understanding.


## License

IMPORTANT NOTE: Any User who are willing to Share or Re-Distribute TaskAid are kindly advised to:

1. A reference to us by keeping a "(C) Temavrix" text in the 'Modified program'.

2. A link to this repository from the user's 'Modified program' README file. 

This will be helpful for us as users will know it's original source and about our startup.
Please also refer to LICENSE file for clarifications.  
Thank you for your kind co-operation :-)

TaskAid Copyright (C) Temavrix 2025  
All Rights Reserved

Version 1.6

