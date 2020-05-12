const SlackBot = require('slackbots');

const { botName, botToken } = require('./config');
const { handleMessage } = require('./services/index');

let botUser = null;

const bot = new SlackBot({
    token: botToken,
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
    const { text = '', type, channel } = data;
    const { id: botId = 'botId' } = botUser || {};

    if (type !== 'message' || text.indexOf(botId) === -1) {
        return;
    }

    const msgText = text.replace(`<@${botId}>`, '');
    const respond = await handleMessage(msgText.trim());

    if (Array.isArray(respond)) {
        respond.forEach((msg) => {
            bot.postMessage(channel, msg);
        });
    }

    if (typeof respond === 'string') {
        bot.postMessage(channel, respond);
    }
});

// Error Handler
bot.on('error', (err) => {
    console.error('bot error', err);

    // ## slack app bug: not_allowed_token_type
    // https://github.com/slackapi/hubot-slack/issues/584#issuecomment-611808704
});

