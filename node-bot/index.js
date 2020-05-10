const SlackBot = require('slackbots');
const dotenv = require('dotenv');

const { handleMessage } = require('./services/index');

dotenv.config();

const botName = process.env.BOT_NAME || 'benny';
let botUser = null;

const bot = new SlackBot({
    token: process.env.BOT_TOKEN,
    name: botName,
});

// Bot start
bot.on('start', async () => {
    console.log(`${botName} start`);

    try {
        const { members } = await bot.getUsers();
        botUser = members.find(user => user.name === botName);
    } catch (error) {
        console.error('bot.getUsers() error', error);
    }
});

// Message Handler
bot.on('message', async (data) => {
    console.log('message', data);
    const { text = '', type, channel } = data;
    const { id: botId = 'botId' } = botUser || {};

    if (type !== 'message' || text.indexOf(botId) === -1) {
        return;
    }

    const msgText = text.replace(`<@${botId}>`, '');
    const messages = await handleMessage(msgText.trim());
    messages.forEach((msg) => {
        bot.postMessage(channel, msg);
    });
});

// Error Handler
bot.on('error', (err) => {
    console.error('bot error', err);

    // ## slack app bug: not_allowed_token_type
    // https://github.com/slackapi/hubot-slack/issues/584#issuecomment-611808704
});

