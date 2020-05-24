///<reference path="./@types/slackbots.d.ts" />
import { User, Channel, MessageData } from 'slackbots';
const SlackBot = require('slackbots');
const { initCache, getSession, setSession } = require('./sessions/session');

const { botName, botToken } = require('./config');
const { handleMessage } = require('./services/index');

let botUser: Partial<User> | null | undefined = null;
let publicChannels: Partial<Channel>[] = [];
let botChannels: Partial<Channel>[] = [];

const bot = new SlackBot({
    token: botToken,
    name: botName,
});

// Bot start
bot.on('start', async () => {
    console.log(`${botName} start`);

    initCache();

    try {
        const { members } = await bot.getUsers();
        botUser = members.find((user: Partial<User>) => user.name === botName);
        
        const { channels } = await bot.getChannels();
        publicChannels = channels;

        const { ims } = await bot.getImChannels();
        botChannels = ims;
    } catch (error) {
        console.error('bot.getUsers() error', error);
    }
});

// Message Handler
bot.on('message', async (data: Partial<MessageData>) => {
    const { text = '', type, channel, user } = data;
    const { id: botId = 'botId' } = botUser || {};
    
    if (type !== 'message' || !user) {
        return;
    }    
    
    const isBotChannel = botChannels.some((ch) => ch.id === channel);
    const session = await getSession(user);
    // verify its a message referring to the bot
    if (!isBotChannel && !session && text.indexOf(botId) === -1) {
        return;
    }

    const isPublicChannel = publicChannels.some((ch) => ch.id === channel);

    const msgText = text.replace(`<@${botId}>`, '').trim();
    await setSession(user, msgText);
    const respond = await handleMessage(user, msgText, session || [], isPublicChannel);

    if (Array.isArray(respond)) {
        Promise.all(respond.map((msg) => bot.postMessage(channel!!, msg)))
            .catch((error) => {
                console.error('error on multi postMessage', error);
            });
    }

    if (typeof respond === 'string') {
        bot.postMessage(channel!!, respond);
    }
});

// Error Handler
bot.on('error', (err: Error) => {
    console.error('bot error', err);

    // ## slack app bug: not_allowed_token_type
    // https://github.com/slackapi/hubot-slack/issues/584#issuecomment-611808704
});

