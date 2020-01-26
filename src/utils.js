
const ObjectsToCsv = require('objects-to-csv');
const fs = require ('fs')

exports.saveJsonToCSVFile = (jsonData, filename) => {
    new ObjectsToCsv(jsonData).toDisk(`./src/data/${filename}.csv`);
}

exports.saveJsonToFile = (jsonData, filename) => {
    console.log(jsonData)
    fs.writeFile(`./src/data/${filename}.json`, JSON.stringify(jsonData), function(err) {
    if (err) throw err;
    console.log('complete');
    })
}
exports.formatDate = (date) => {
    const formated_date = date.split(' ')[0].split('-')
    return formated_date[0].concat(formated_date[1], formated_date[2])
}