#  Kyle Maxwell
## CS 1660 Final Project - Frontend

### Code Walkthrough: [View Video](https://youtu.be/2WbvXQOz7XE)
### Demo: [View Demo](https://youtu.be/nXn5yQK6wnY)

To authenticate: <br />
	Take credentials file that was given when assignment was turned in and place it in the "creds" folder.  
	Next, if running locally, run ``` export GOOGLE_APPLICATION_CREDENTIALS='creds/lyrical-bolt-328905-ca498657da4d.json' ```  (Note: if the file is named differently, change the name in the export statement in docker/backend/Dockerfile and Dockercompose.yml)
Steps to build and run (assuming in the main folder)	:
```
npm install -f
npm start
```
Then, you can navigate to http://localhost:4200/
To build and run Docker containers (assuming in the main folder):
```
docker-compose build
docker-compose up
```
Then, in a browser, navigate to http://localhost:80/