const R = require('ramda')

const tce_api = "https://api.tce.ce.gov.br/index.php/sim/1_0"
const chowdown = require('chowdown');
 
// Returns a promise
chowdown('http://somewebpage.com')
  .collection('.author', {
    name: '.name',
    age: '.age'
  });

const getAllItensLicitacoes = async () => {
    const chowdown_promises = []
    for (var mun = 2; mun <= 185; mun ++) {
        const munCode =  zeroFilled = ('000' + mun).substr(-3)
        chowdown_promises.push(chowdown(`${tce_api}/itens_licitacoes?codigo_municipio=${munCode}&data_realizacao_licitacao=20191201_20200101`)
            .collection('.itens_licitacoes', {
                mun: '.codigo_municipio',
                document: '.numero_documento_negociante',
                item: '.descricao_item_licitacao',
                valor_total: '.valor_vencedor_item_licitacao',
                valor_unit: '.valor_unitario_item_licitacao',
                licitacao: '.numero_licitacao' 
            })
            .catch(() => [])
        )    
    }
    const lics = await Promise.all(chowdown_promises)
    let itens_licitacoes = []
    lics.map((lic) => {
        itens_licitacoes = [...itens_licitacoes, ...lic]
    })
    return itens_licitacoes
}

getAllItensLicitacoes()
.then((result) => console.log(result))