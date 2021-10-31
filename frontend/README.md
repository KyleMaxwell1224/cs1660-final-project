#  Kyle Maxwell
## CS 1660 Final Project

Steps I will use to connect to GCP:
		1. Currently, I have a cluster set up on DataProc in GCP that I will use for the Hadoop distributed file system.
		2.  In the frontend, there's a section for the user to upload files of their choosing.
		3. After uploading files, the file info will be displayed, and the user can press a button to send files to GCP storage.
		4. Currently, functionality isn't implemented to send and process files.
		5.  After files are sent to GCP, then the Java application that implements MapReduce will process the files.
		
Steps to build and run (assuming in the main folder)	:
```
cd frontend/
npm install 
ng serve --o
```
To build and run Docker container (assuming in the main folder):
```
cd frontend/
docker build -t <tag> .
docker run -p 80:80 <tag>
```
Then, in a browser, navigate to http://localhost:80