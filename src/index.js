const chowdown = require('chowdown');
const { saveJsonToFile } = require('./utils')
const { verifyItemDiscrepancyValue } = require('./validator')

const tce_api = "https://api.tce.ce.gov.br/index.php/sim/1_0"

const formatDate = (date) => {
    const formated_date = date.split(' ')[0].split('-')
    return formated_date[0].concat(formated_date[1], formated_date[2])
}

const getItensLicitacoes = async (licitacaoCode, munCode, date) => 
   chowdown(`${tce_api}/itens_licitacoes?codigo_municipio=${munCode}&data_realizacao_licitacao=${date}`)
        .collection('.itens_licitacoes', {
            mun: '.codigo_municipio',
            document: '.numero_documento_negociante',
            item: '.descricao_item_licitacao',
            valor_total: '.valor_vencedor_item_licitacao',
            valor_unit: '.valor_unitario_item_licitacao',
            licitacao: '.numero_licitacao',
            data: '.data_realizacao_licitacao' 
        }).filter((item) => item.licitacao === licitacaoCode)

const getAllLicitacoes = async () => {
    const chowdown_promises = []
    for (var mun = 2; mun <= 20; mun ++) {
        const munCode =  zeroFilled = ('000' + mun).substr(-3)
        chowdown_promises.push(chowdown(`${tce_api}/licitacoes?codigo_municipio=${munCode}&data_realizacao_autuacao_licitacao=20191201_20200101`)
            .collection('.licitacoes', {
                Municio: '.codigo_municipio',
                Numero: '.numero_licitacao',
                Objeto: '.descricao1_objeto_licitacao',
                Objeto2: '.descricao2_objeto_licitacao',
                Data: '.data_realizacao_autuacao_licitacao' 
            })
            .catch(() => [])
        )    
    }
    const licitacoes = await Promise.all(chowdown_promises)
    let licitacoes_list = []
    licitacoes.map((licitacao) => {
        licitacoes_list = [...licitacoes_list, ...licitacao]
    })
    return licitacoes_list
}


const getAllLicitacoesItens = async (licitacoes) => {
    return Promise.all(licitacoes.map(async (licitacao) => {
        const dataObject = { ...licitacao }
        const items = await getItensLicitacoes(licitacao.Numero, licitacao.Municio,  formatDate(licitacao.Data))
        dataObject['Document'] = items[0] && items[0].document
        return dataObject
    })).then((data) => {
        return data
    })
}

// getAllLicitacoes()
// .then((licitacoes) => {
//     getAllLicitacoesItens(licitacoes).then((data) =>{
//         saveJsonToFile(data, 'licitacoes')
//     })
// })

verifyItemDiscrepancyValue('test').then((result) => console.log(result))

// const verifyDiscrepancyInValue = () => {}