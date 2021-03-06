const axios = require('axios');
import { botAnswersUrl } from '../config';
import { getList, pushToList } from '../sessions/redisClient';

export const handleUnrecognizedService = async (
    text: string,
    sessionMessages: string[],
    isOnPublicChannel: boolean)
    : Promise<string[]> => {

    // we can relate to sessionMessages as well

    const messagesReply: string[] = [];
    const userInput: string = text.toLowerCase();

    if (isOnPublicChannel) {
        messagesReply.push('Would like to move to my privte channel?');
    }

    let insertedBotAnswer = false;
    if (botAnswersUrl) {
        let rows = [];
        const cachedAnswers = await getList(userInput);
        if (cachedAnswers) {
            rows.push(`${userInput},${cachedAnswers.join(',')}`);
        } else {
            const { data } = await axios.get(botAnswersUrl);
            rows = data.split('\n');
        }

        for (let i = 0; i < rows.length; i++) {
            const [inputKey, ...answers] = rows[i].split(',');

            if (inputKey.toLowerCase() === userInput) {
                const cleanAnswers = answers.filter((ans: string) => ans.length > 0 && ans !== '\r');
                const randomIndex = Math.floor(Math.random() * cleanAnswers.length);
                const answer = cleanAnswers[randomIndex].replace('\r', '');
                messagesReply.unshift(answer);
                insertedBotAnswer = true;

                pushToList(userInput, cleanAnswers, { ttl: 86400 }); // expired after one day
                break;
            }
        }
    }
  
    if (!insertedBotAnswer) {
        messagesReply.unshift(`I'm not sure I understand you...`);
    }

    return Promise.resolve(messagesReply);
};
