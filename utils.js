
const fs = require('fs')

const getScore = async (inputData) => {
    const settings = {   
        "options": {
            "fs": {
                "hostname":"localhost", 
                "port":7070
            }
        },
        "data": {
            inputData
        }
    }
    try {
        const fetchResponse = await fetch(`http://0.0.0.0:9090/localhost/send_mortality_v1/ml/__main__`, settings);
        const data = await fetchResponse.json();
        console.log("Return message: ", data.message)
        return data;
    } catch (e) {
        return e;
    }
}


// let data = fs.readFileSync('./uploads/bee175840f81ecb1eb9ef37e82391538', 'utf-8');
let data = fs.readFileSync('./tests/test.json', 'utf-8');
// console.log(data)
// let res = getScore(data)
// console.log(res)
// fs.readFile('./uploads/bee175840f81ecb1eb9ef37e82391538', 'utf-8', (error, data) => {
//     if (error) {
//         console.log(error)
//         return;
//     }
// })
var postData = {   
    "options": {
        "fs": {
            "hostname": "localhost", 
            "port": 7070
        }
    },
    "data": JSON.parse(data)
}

// var http = require('http');

// // An object of options to indicate where to post to
// var post_options = {
//     host: 'http://0.0.0.0:9090/localhost/send_mortality_v1/ml/__main__',
//     method: 'POST',
// };

// // Set up the request
// var post_req = http.request(post_options, function(res) {
//     res.setEncoding('utf8');
//     res.on('data', function (chunk) {
//         console.log('Response: ' + chunk);
//     });
// });

// // post the data
// console.log(`Post data:\n${JSON.stringify(postData)}`)
// post_req.write(JSON.stringify(postData));
// post_req.end();

const request = require('request');

async function getPrediction (postData) {

    const options = {
        url: 'http://0.0.0.0:9090/localhost/send_mortality_v1/ml/__main__',
        json: true,
        body: postData
    };

    let response = await request.post(options)
    console.log(Object.keys(response), response.body)
    return response
}

let res = getPrediction(postData)
// (async () => {console.log(getPrediction(postData))})()

