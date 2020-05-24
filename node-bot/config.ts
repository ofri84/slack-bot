const dotenv = require('dotenv');

dotenv.config();

export const botToken: string | undefined = process.env.BOT_TOKEN;
export const botName: string = process.env.BOT_NAME || 'benny';
export const youtubeApiKey: string | null = process.env.YOUTUBE_API_KEY || null;
export const redisHost: string = process.env.REDIS_HOST || 'redis';
export const redisPort: string = process.env.REDIS_PORT || '6379';
export const chatSessionPeriod: number = 30; // seconds
export const botAnswersUrl: string | null = process.env.BOT_RESPONSES_URL || null;
export const clicksUrl: any = {
    protocol: process.env.CLICK_API_PROTOCOL || 'http',
    host: process.env.CLICKS_API_HOST || 'localhost',
    port: process.env.CLICKS_API_PORT || '3000',
};
