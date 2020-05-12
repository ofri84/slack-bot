const { isYoutubeSupported, youtubeHelp } = require('./youtube');
const { msgList } = require('../formattingMessages');

const supportedServices = {
    youtube: isYoutubeSupported,
};

const servicesMap = {
    youtube: youtubeHelp,
};

const help = async ({ service }) => {
    const defaultMessage = 'Ooohh, it seems that we can only have a small talk with each other...';

    if (!service) {
        const services = Object.keys(supportedServices).filter(serv => supportedServices[serv]);
        
        const res = services.length > 0
            ? msgList([
                `I can search in ${services.join(', ')}`,
                `Just type ${services[0]} ...`,
                `If you are not sure about how, type: help ${services[0]}`,
            ])
            : defaultMessage;

        return Promise.resolve(res);
    }

    return servicesMap[service]
        ? servicesMap[service]()
        : Promise.resolve(defaultMessage);
};

module.exports = {
    help,
};
