const axios = require('axios');
const { botAnswersUrl } = require('../config');

const handleUnrecognizedService = async (text, sessionMessages, isOnPublicChannel) => {
    // TODO: relate to sessionMessages?
    const messagesReply = [];

    if (isOnPublicChannel) {
        messagesReply.push('Would like to move to my privte channel?');
    }

    let insertedBotAnswer = false;
    if (botAnswersUrl) {
        // TODO: add cache for this
        const { data } = await axios.get(botAnswersUrl);

        const rows = data.split('\n');
        for (let i = 0; i < rows.length; i++) {
            const [inputKey, ...answers] = rows[i].split(',');

            if (inputKey.toLowerCase() === text.toLowerCase()) {
                const cleanAnswers = answers.filter(ans => ans.length > 0 && ans !== '\r');
                const randomIndex = Math.floor(Math.random() * cleanAnswers.length);
                const answer = cleanAnswers[randomIndex].replace('\r', '');
                messagesReply.unshift(answer);
                insertedBotAnswer = true;
            }
        }
    }
  
    if (!insertedBotAnswer) {
        messagesReply.unshift(`I'm not sure I understand you...`);
    }

    return Promise.resolve(messagesReply);
};

module.exports = {
    handleUnrecognizedService,
};
