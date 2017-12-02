# comp467project
Task: Create an online paint editor.

This is an Angular2/4 + Springboot stack. Both the frontend and backend are hosed on separate AWS EC2 instances.

front end host: http://ec2-54-67-71-116.us-west-1.compute.amazonaws.com/

The structure includes: -MVC -Client/Server -SPA -Rest -ORM + Relational DB -Dependency Injection -Unit tests -Token Authentication and Authorization

 1.	download and extract zip to destination folder
 2.	download and install visual studio code: https://code.visualstudio.com/
 3.	open visual studio code and file/open folder/open the root folder that you extracted 
Frontend: Angular2/4 application that uses Auth0 for authentication and authorization. Users can currently login to reach their home page which is a online painting application. Users can draw paintings as well as save/open them across multiple devices.  Both the get and post requests are sent to the hosted backend along with Authorization: Bearer "Access_Token" in the header. To run the frontend locally you must have nodejs 6.11.4 installed on your machine https://nodejs.org/en/. If you are unsure check in terminal by running: 'node -v' should return "v6.11.4" and 'npm -v' should return "3.10.10" Once installed navigate to the extracted project folder and from the project root run 'npm install' followed by 'npm start'. Open a browser => http://localhost:4200 Note: By default the targeted backend is set to the hosted AWS server. This means that without changing any front end code the project will work just fine without running the backend locally. If you want to test it against a locally running backend you must change one line in 'app_config.ts' located in src/app/app_config.ts first: comment out line 8: let mode: string = 'default'; Then: uncomment line 11: //let mode: string = 'opt1';


Backend: Springboot + Maven project that uses Hibernate ORM to access Mysql database. WebSecurityConfig.java configures auth0 with all endpoints secured by token authentication. To run the backend locally you must import the project into eclipse EE as 'Existing Maven Projects' (may take a while to import). Once imported right click project root => Run as => Maven build... => and set Goals to 'spring-boot:run' => click Run Note: The first time you run the project after importing it; it is common to get this error: "No compiler is provided in this environment. Perhaps you are running on a JRE rather than a JDK?" To fix this just re-run the project and it should not appear again.


Mysql: Database is also hosted separately on AWS using RDS. The database uses auth0's userID passed by the claim in the access_token for the primary and foreign keys. 








