const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    botToken: process.env.BOT_TOKEN,
    botName: process.env.BOT_NAME || 'benny',
};
