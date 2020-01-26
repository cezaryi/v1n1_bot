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

const confirmacao = Extra.markup(Markup.inlineKeyboard([
    Markup.callbackButton('Sim', 's'),
    Markup.callbackButton('Não', 'n'),
]))

const botoes = Extra.markup(Markup.inlineKeyboard([
        Markup.callbackButton('Cancelar', `cancel`)
    ]))

const confirmacaoHandler = new Composer()
confirmacaoHandler.action('s', ctx => {
    ctx.reply('Obrigado! Voce assinou nosso sistema.')
        let contador = 1

    
    const notificar = () => {
        telegram.sendMessage(env.userID, `Essa é uma mensagem de evento [${contador++}]`, botoes)
    }

    const notificacao = new schedule.scheduleJob('*/5 * * * * *', notificar)

    bot.action('cancel', ctx => {
        notificacao.cancel()
        ctx.scene.leave()
        ctx.reply('Ok! Parei de pertubar...')
        
    })
  
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