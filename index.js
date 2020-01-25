const TelegramBot = require( `node-telegram-bot-api` )

const TOKEN = `916708017:AAGMXnn9TS61RoD2E6Zr1XUDdtW3G9Lke_M`

const bot = new TelegramBot( TOKEN, { polling: true } )

bot.on('message', (msg) => {
    
    var Hi = "hi";
    if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
    bot.sendMessage(msg.chat.id,"Hello dear user");
    } 
        
    })