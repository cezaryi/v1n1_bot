
const ObjectsToCsv = require('objects-to-csv');

exports.saveJsonToFile = (jsonData, filename) => {
    new ObjectsToCsv(jsonData).toDisk(`./src/data/${filename}.csv`);
}
