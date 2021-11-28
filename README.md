#  Kyle Maxwell
## CS 1660 Final Project - Frontend

To authenticate: <br />
	Take credentials file that was given when assignment was turned in and place it in the "creds" folder. 
	Next, if running locally, run ``` export GOOGLE_APPLICATION_CREDENTIALS='creds/lyrical-bolt-328905-ca498657da4d.json' ```
Steps to build and run (assuming in the main folder)	:
```
npm install -f
npm start
```
Then, you can navigate to http://localhost:4200/
To build and run Docker container (assuming in the main folder):
```
docker build -t <tag> .
docker run -p 80:80 <tag>
```
Then, in a browser, navigate to http://localhost:80/