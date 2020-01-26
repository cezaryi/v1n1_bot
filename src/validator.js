const chowdown = require('chowdown');

const buscape_api = "https://www.buscape.com.br/search?q="
const items_size = 5

const invalid_units = ['SER', 'SERVICO', 'DIA', 'HORA', 'MES', 'SEMANA', 'ANO', 'PES', 'CTN']
const unit_names = ['UND', 'UNIDADE']

exports.verifyLicitacao = (licitacao) => { 
    return Promise.all(licitacao && licitacao.items && licitacao.items.filter(({unidade, descricao}) => !invalid_units.includes(unidade) && !descricao.includes('SERVICO'))
    .map((item) => verifyItemDiscrepancyValue(item)))
    .catch(() => {})

}

const verifyItemDiscrepancyValue = async (item) => {
    const descricao = item.descricao.replace('.', '').replace(',', '').split(' ').join('+') 
    const search_string = !unit_names.includes(item.unidade) ? `${item.unidade}+${descricao}` : `${descricao}`
    const found_values = await chowdown(`${buscape_api}${search_string}`)
        .collection('.customValue')

    const values = found_values.slice(0, items_size)
    const sum = values.map((value) => Number(value.toLowerCase().replace('r$ ', '').replace('.', '').replace(',','.'))).reduce((a, b) => a + b, 0)
    const average = sum / values.length  
    const has_discrepancy = item.valor_unit < average * 1.4    
    return {...item, hasDiscrepancy: has_discrepancy, buscapeAvg: average,buscapeUrl: `${buscape_api}${search_string}` }
}
