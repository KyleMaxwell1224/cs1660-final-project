const dataproc = require('@google-cloud/dataproc');
const {Storage} = require('@google-cloud/storage');
var bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
const express = require('express')
const cors = require('cors');
const app = express()
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb"  }))
app.use(fileUpload());


app.listen(8000, () => {
  submitWordCountJob();
    console.log('Server started!');
})



const bucketName = 'gs://dataproc-staging-us-east1-207355824678-1tbxa1xf/ ';
const filePath = 'preprocessed-files';

projectId = 'lyrical-bolt-328905'
region = 'us-east1'
clusterName = 'hadoop-cluster'  

// Create a client with the endpoint set to the desired cluster region
const jobClient = new dataproc.v1.JobControllerClient({
    apiEndpoint: `${region}-dataproc.googleapis.com`,
    projectId: projectId,
  });
  
const storage = new Storage();
async function submitWordCountJob() {
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
          args: ['gs://dataproc-staging-us-east1-207355824678-1tbxa1xf/'+filePath, 'gs://dataproc-staging-us-east1-207355824678-1tbxa1xf/wordSolution'],
        },
      },
    };
  
    const [jobOperation] = await jobClient.submitJobAsOperation(job);
    const [jobResponse] = await jobOperation.promise();
  
    const matches = jobResponse.driverOutputResourceUri.match('gs://(.*?)/(.*)');
  
  
    const output = await storage
      .bucket(matches[1])
      .file(`${matches[2]}.000000000`)
      .download();
  
    // Output a success message.
    console.log(`Job finished successfully: ${output}`);    
}

async function topN(n) {
  const job = {
    projectId: projectId,
    region: region,
    job: {
      placement: {
        clusterName: clusterName,
      },
      hadoopJob: {
        mainClass: 'TopN',
        jarFileUris: [
          'gs://dataproc-staging-us-east1-207355824678-1tbxa1xf/TopN.jar',
        ],
        args: ['gs://dataproc-staging-us-east1-207355824678-1tbxa1xf/wordSolution', 'gs://dataproc-staging-us-east1-207355824678-1tbxa1xf/output', n],
      },
    },
  };

  const [jobOperation] = await jobClient.submitJobAsOperation(job);
  const [jobResponse] = await jobOperation.promise();

  const matches = jobResponse.driverOutputResourceUri.match('gs://(.*?)/(.*)');


  const output = await storage
    .bucket(matches[1])
    .file(`${matches[2]}.000000000`)
    .download();

  // Output a success message.
  console.log(`Job finished successfully`);  
}
async function uploadFile(files) {
  
  await storage.bucket(bucketName).upload(files, {
    destination: "dest",
  });
  console.log(`${filePath} uploaded to ${bucketName}`);
}


app.post('/processfiles', async (req, res) => {
  console.log("PROCESSING FILES: " + req.body.files); 
  await uploadFile(req.body.files).catch(console.error);
  console.log('FILES should be in the right space, running wordcount hadoop job...')
  //await submitWordCountJob().catch(console.error);
  res.json('Completed')
});

app.post('/topn', async (req, res) => {
  console.log("requesting top-n job! N is " + req.body.n);
 // await topN(req.body.n).catch(console.error);
  res.json('Completed top n job')
});