const dataproc = require('@google-cloud/dataproc');
const {Storage} = require('@google-cloud/storage');
const fileUpload = require('express-fileupload');
const express = require('express')
const cors = require('cors');
const app = express()
app.use(cors());
app.use(express.json());
app.use(fileUpload());


app.listen(8000, () => {
    console.log('Server started!');
})



const bucketName = 'dataproc-staging-us-east1-207355824678-1tbxa1xf';
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
  const dest_folder = 'topNres';

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
        args: ['gs://dataproc-staging-us-east1-207355824678-1tbxa1xf/wordSolution', 'gs://dataproc-staging-us-east1-207355824678-1tbxa1xf/'+dest_folder, n],
      },
    },
  };

  const [jobOperation] = await jobClient.submitJobAsOperation(job);
  const [jobResponse] = await jobOperation.promise();

  const matches = jobResponse.driverOutputResourceUri.match('gs://(.*?)/(.*)');
  console.log(matches);

  const output = await storage
    .bucket(matches[1])
    .file(dest_folder+'/part-r-00000')
    .download();

  storage.bucket(bucketName).deleteFiles({ prefix: dest_folder+'/' }, function(err) {})

  // Output a success message.
  console.log(`Job finished successfully`);  
  return output.toString();
}

async function search(word) {
  const dest_folder = 'searchres'
  const job = {
    projectId: projectId,
    region: region,
    job: {
      placement: {
        clusterName: clusterName,
      },
      hadoopJob: {
        mainClass: 'Search',
        jarFileUris: [
          'gs://dataproc-staging-us-east1-207355824678-1tbxa1xf/Search.jar',
        ],
        args: ['gs://dataproc-staging-us-east1-207355824678-1tbxa1xf/wordSolution', 'gs://dataproc-staging-us-east1-207355824678-1tbxa1xf/'+dest_folder, word],
      },
    },
  };

  const [jobOperation] = await jobClient.submitJobAsOperation(job);
  const [jobResponse] = await jobOperation.promise();

  const matches = jobResponse.driverOutputResourceUri.match('gs://(.*?)/(.*)');

  console.log(matches)

  const output = await storage
    .bucket(matches[1])
    .file(dest_folder+'/part-r-00000')
    .download();

  // Output a success message.
  console.log(`Job finished successfully`);  
  storage.bucket(bucketName).deleteFiles({ prefix: dest_folder+'/' }, function(err) {})
  return output.toString();
  }

async function uploadFile(files) {
  
  await storage.bucket(bucketName).upload(files, {
    destination: "testination",
  });
  console.log(`${filePath} uploaded to ${bucketName}`);
}


app.post('/processfiles', async (req, res) => {
  console.log("PROCESSING FILES: " + req.body.files); 
  const files = req.body.files;
  for (var i = 0; i < files.length; i++) {
      await uploadFile(Buffer.from(files[i])).catch();
  }
  console.log('FILES should be in the right space, running wordcount hadoop job...')
  //await submitWordCountJob().catch();
  res.json('Completed')
});


app.post('/topn', async (req, res) => {
  console.log("requesting top-n job! N is " + req.body.n);
  results = await topN(req.body.n).catch(console.error);
  res.json(results)
});

app.post('/search', async (req, res) => {
  console.log("requesting search job! search is " + req.body.word);
  results = await search(req.body.word).catch();
  res.json(results);
});