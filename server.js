// server.js
const { response } = require("express");
const express = require("express");
const multer = require("multer");
const fs = require('fs');
const request = require('request');
const path = require('path');
const fileParse = require('./utils/fileParse')

require('dotenv').config();

const upload = multer({ dest: "uploads/" });

const app = express();
app.use(express.static("frontend"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

PORT = process.env.PORT
HOST = process.env.HOST
FS_PORT = process.env.FS_PORT
MORTALITY_URL = process.env.MORTALITY_URL

console.log(`mortality_url: ${MORTALITY_URL}`)

function getPostOptions(data) {

    let postData = {   
        "options": {
            "fs": {
                "hostname": "localhost", 
                "port": FS_PORT
            }
        },
        "data": data
    }

    const postOptions = {
        url: MORTALITY_URL,
        json: true,
        body: postData
    };

    return postOptions
}


app.get('/', function(req, res){
    res.sendFile('index.html')
})


app.post("/mortality_score", upload.single("file"), mortalityScore);
function mortalityScore(req, res) {
    console.log('[Start]')
    console.log(req.body);
    console.log(req.file)

    let stepData
    const fileType = path.extname(req.file.originalname);

    if (fileType == '.xml') {
        stepData = fileParse.retrieveLastWeekStepDataFromAppleHealth(req.file.path)
    }
    else if (fileType == '.json') {
        const stepDataStr = fs.readFileSync(req.file.path, 'utf-8');
        stepData = JSON.parse(stepDataStr)
    }
    else {
        throw new Error(`Unsupported input file format ${fileType}`)
    }

    let postOptions = getPostOptions(stepData);
    
    request.post(postOptions, (error, response, body) => {
        if (error) {
            res.json(error)
        }
        if (Object.keys(body).includes('mlError')) {
            res.status(400).send({
                message: 'Invalid data input.'
            })
        }
        else {
            console.log(`Status: ${response.statusCode}`);
            console.log(body);
            res.status(200).json(body)
        }
    });

}


app.listen(PORT, HOST, () => {
    console.log(`Server started at ${HOST}:${PORT}`);
});