const dataproc = require('@google-cloud/dataproc');
const {Storage} = require('@google-cloud/storage');

const express = require('express')
const app = express()

app.listen(8000, () => {
    console.log('Server started! boutta submit job');
    submitJob();
})

projectId = 'lyrical-bolt-328905'
region = 'us-east1'
clusterName = 'hadoop-cluster'  

// Create a client with the endpoint set to the desired cluster region
const jobClient = new dataproc.v1.JobControllerClient({
    apiEndpoint: `${region}-dataproc.googleapis.com`,
    projectId: projectId,
  });
  

async function submitJob() {
    const job = {
      projectId: projectId,
      region: region,
      job: {
        placement: {
          clusterName: clusterName,
        },
        hadoopJob: {
          mainClass: 'WordCount',
          jarFileUris: [
            'gs://dataproc-staging-us-east1-207355824678-1tbxa1xf/WordCount.jar',
          ],
          args: ['gs://dataproc-staging-us-east1-207355824678-1tbxa1xf/Data', 'wordSolution'],
        },
      },
    };
  
    const [jobOperation] = await jobClient.submitJobAsOperation(job);
    const [jobResponse] = await jobOperation.promise();
  
    const matches = jobResponse.driverOutputResourceUri.match('gs://(.*?)/(.*)');
  
    const storage = new Storage();
  
    const output = await storage
      .bucket(matches[1])
      .file(`${matches[2]}.000000000`)
      .download();
  
    // Output a success message.
    console.log(`Job finished successfully: ${output}`);    
}