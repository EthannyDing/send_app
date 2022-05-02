
const fs = require('fs');
const parser = require('xml2json');

// var xmlFilePath = '../uploads/99f7fbeca7e0df3d9e6689eab94b3786'
const stepDataType = 'HKQuantityTypeIdentifierStepCount'
const dataPointCount = 10080


function parseXML(xmlFilePath) {

    const xml_str = fs.readFileSync(xmlFilePath, 'utf-8');
    let jsonstr_data = parser.toJson(xml_str);
    let json_data = JSON.parse(jsonstr_data);

    return json_data
}

function convertRawWeeklyDataIntoMinuteLevel(rawWeeklyData) {

    let averagedStepData = {step_count: []}
    let stepCountValueSum = 0;

    rawWeeklyData.forEach((entry) => {
        if ( isNaN(Number(entry.value)) ){
            return
        }
        stepCountValueSum += Number(entry.value)
    })
    const stepCountPerMinute = Math.round(stepCountValueSum / dataPointCount)
    averagedStepData.step_count = Array(dataPointCount).fill(stepCountPerMinute)

    return averagedStepData
}

function retrieveOnlyLastWeeklyStepData(appleHealthData) {

    let stepCountData = appleHealthData.HealthData.Record.filter(entry => {
        return entry.type == stepDataType
    })
    let sortedStepCountData = stepCountData.slice().sort((a, b) => {
        return new Date(b.startDate) - new Date(a.startDate)
    })
    
    const mostRecentDate = new Date(sortedStepCountData[0].startDate)
    const aWeekBefore = new Date(mostRecentDate.setDate(mostRecentDate.getDate() - 7))
    const oneWeekStepData = []

    for (var entry of sortedStepCountData) {
        var date = new Date(entry.startDate)
        if (date > aWeekBefore) {
            oneWeekStepData.push(entry)
        }
        else{
            break
        }
    }

    return oneWeekStepData
}


function retrieveLastWeekStepDataFromAppleHealth(xmlFilePath) {

    const json_data = parseXML(xmlFilePath)
    const oneWeekData = retrieveOnlyLastWeeklyStepData(json_data)
    const averageStepData = convertRawWeeklyDataIntoMinuteLevel(oneWeekData)

    console.log(`Averaged step count per minute: ${averageStepData.step_count[0]}`)

    return averageStepData
}


exports.retrieveLastWeekStepDataFromAppleHealth = retrieveLastWeekStepDataFromAppleHealth;
// module.exports = { retrieveLastWeekStepDataFromAppleHealth };
// const oneWeekData = retrieveLastWeekStepDataFromAppleHealth(xmlFilePath);


// console.log(`number of entries in final data: ${oneWeekData.step_count.length}`)
// console.log(`averaged step count per minute: ${oneWeekData.step_count[0]}`)
// console.log(`Most recent data: ${oneWeekData[0].startDate}`)
// console.log(`A week prior to most recent data: ${oneWeekData[oneWeekData.length - 1].startDate}`)

// fs.writeFile('../tests/last7DayStepCount.json', JSON.stringify(oneWeekData), 'utf-8', (err) => {
//     if (err) {
//         return console.log(err)
//     }
//     console.log("File saved successfully.")
// })
