const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    botToken: process.env.BOT_TOKEN,
    botName: process.env.BOT_NAME || 'benny',
    youtubeApiKey: process.env.YOUTUBE_API_KEY || null,
    redisHost: process.env.REDIS_HOST || 'redis',
    redisPort: process.env.REDIS_PORT || '6379',
    chatSessionPeriod: 30, // seconds
    botAnswersUrl: process.env.BOT_RESPONSES_URL || null,
};
