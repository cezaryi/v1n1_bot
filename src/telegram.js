const TelegramBot = require( `node-telegram-bot-api` )

const TOKEN = `916708017:AAGMXnn9TS61RoD2E6Zr1XUDdtW3G9Lke_M`

const bot = new TelegramBot( TOKEN, { polling: true } )

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    console.log(msg)

    switch(msg.text.toLowerCase().trim()){
        case '/start':
            bot.sendMessage(chatId, 'Olá sou o bot v1n1, responsável por analisar os dados irregulares, você gostaria de receber notificações a respeito? Sim ou Não?');
            break
        
        case 'sim':
            bot.sendMessage(chatId, 'Você foi inscrito, eviaremos notificações assim que encontramos.');
            break

        case 'nao':
        case 'não':
            bot.sendMessage(chatId, 'Obrigado por me visitar, volte sempre! :D');
            break

        default:
            bot.sendMessage(chatId, 'Você poderia escrever "/start" para que eu possa começar os trabalhos?');
            break
        }
    
  });

