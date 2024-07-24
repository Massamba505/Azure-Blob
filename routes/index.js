var express = require('express');
var router = express.Router();
const { BlobServiceClient } = require("@azure/storage-blob");

const accountName = process.env.ACCOUNT_NAME;
const sasToken = process.env.SAS_TOKEN;
const containerName = process.env.CONTAINER_NAME;

const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net/?${sasToken}`);
const containerClient = blobServiceClient.getContainerClient(containerName);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET photos. */
router.get('/photos', async function(req, res, next) {
  try {
    let blobList = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      const blobUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blob.name}`;
      blobList.push(blobUrl);
    }
    res.json(blobList);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving photos from Blob Storage");
  }
});

module.exports = router;
