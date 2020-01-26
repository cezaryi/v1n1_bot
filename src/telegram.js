const env = require('../.env')
const schedule = require('node-schedule')
const Telegraf = require('telegraf')
const Telegram = require('telegraf/telegram')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const telegram = new Telegram(env.token)
const Composer = require('telegraf/composer')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const WizardScene = require('telegraf/scenes/wizard')

let alreadySendedFirst = false

const confirmacao = Extra.markup(Markup.inlineKeyboard([
    Markup.callbackButton('Sim', 's'),
    Markup.callbackButton('Não', 'n'),
]))

const confirmacaoHandler = new Composer()
confirmacaoHandler.action('s', ctx => {
    ctx.reply('Obrigado! Voce assinou nosso sistema.')        
        const notificar = () => {
        alreadySendedFirst = !alreadySendedFirst
        const msg = alreadySendedFirst ? `Possível fraude em licitação de código "09.001/2019-SRP" \n Possível superfaturamento na compra de: \n 1 PROJETOR DE MULTIMIDIA \n Valor comprado: R$7200,00 \n Média de valor encontrado R$2168,79. \nfonte:'https://www.buscape.com.br/search?q=PROJETOR+DE+MULTIMIDIA+-'` : `Possível fraude em licitação de código "2019.12.19.01" \n Empresa com diversos cnaes genêricos`
        telegram.sendMessage(env.userID, msg)
    }

    const notificacao = new schedule.scheduleJob('*/7 * * * * *', notificar)  
})

confirmacaoHandler.action('n', ctx => {
    ctx.reply('Volte sempre, se mudar de ideia digite /start para comecar tudo do zero.')
    ctx.scene.leave()
})

confirmacaoHandler.use(ctx => ctx.reply('Apenas confirme', confirmacao))

const wizardAssinatura = new WizardScene('assinar',
    ctx => {
        ctx.reply('Voce deseja receber notificacoes de licitacoes possivelmente irregulares?')
        ctx.wizard.next()
    },
    confirmacaoHandler
)

const bot = new Telegraf(env.token)
const stage = new Stage([wizardAssinatura], { default: 'assinar' })
bot.use(session())
bot.use(stage.middleware())

bot.startPolling()