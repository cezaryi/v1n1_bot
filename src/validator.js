const chowdown = require('chowdown');

const buscape_api = "https://www.buscape.com.br/search?q="

exports.verifyItemDiscrepancyValue = (item) =>{ 
    return chowdown(`${buscape_api}cx+caneta+preta`)
        .collection('.customValue')
}
