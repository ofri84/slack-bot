const { handleUnrecognizedService } = require('./misc');
const { fetchFromYoutube } = require('./youtube');

const isQouting = (char) => {
    return char === '“'
        || char === '”'
        || char === '’'
        || char === '\"'
        || char === '\'';
};

const handleMessage = async (text) => {
    const words = text.split(' ');
    const services = [];
    const reqParams = {};

    let index = 0;
    while (index < words.length) {
        if (words[index] === 'music' || words[index] === 'youtube') {
            services.push(fetchFromYoutube);
        }

        if (isQouting(words[index].charAt(0))) {
            const subject = [];
            const regex = /[\',\",“,’,”]/g;
            
            while (index < words.length) {
                subject.push(words[index].replace(regex, ''));
                if (isQouting(words[index].charAt(words[index].length - 1))) {
                    break;
                }
                index++;
            }

            reqParams.subject = subject.join(' ');
            index++;
            continue;
        }

        if (words[index] === 'max' || words[index] === 'maximum') {
            let paramKey = null;
            if (words[index + 1] === 'minutes' || words[index + 2] === 'minutes') {
                paramKey = 'maxMinutes';
            }
            if (words[index + 1] === 'songs' || words[index + 2] === 'songs') {
                paramKey = 'maxSongs';
            }

            if (paramKey !== null) {
                const amount1 = isNaN(parseInt(words[index + 1])) ? 0 : parseInt(words[index + 1]);
                const amount2 = isNaN(parseInt(words[index + 2])) ? 0 : parseInt(words[index + 2]);
                reqParams[paramKey] = amount1 || amount2;
    
                index += 2;
                continue;
            }
        }

        if ((words[index] === 'min' || words[index] === 'minimum')
            && (words[index + 1] === 'minutes' || words[index + 2] === 'minutes')) {
            const minutes1 = isNaN(parseInt(words[index + 1])) ? 0 : parseInt(words[index + 1]);
            const minutes2 = isNaN(parseInt(words[index + 2])) ? 0 : parseInt(words[index + 2]);
            reqParams.minMinutes = minutes1 || minutes2;

            index += 2;
            continue;
        }

        index++;
    }

    if (services.length === 0) {
        return handleUnrecognizedService(text);
    }

    return Promise.all(services.map(service => service(reqParams)))
        .catch((error) => {
            console.error('error on handleMessage Promise.all', text, error);
            return ['Ooopppsss... I can\'t help you...'];
        });
};

module.exports = {
    handleMessage,
};
