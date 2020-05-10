
const { fetchFromYoutube } = require('./youtube');

const handleMessage = async (text) => {
    const words = text.split(' ');
    const services = [];
    const reqParams = {};

    words.forEach((word, index) => {
        if (word === 'music' || word === 'youtube') {
            services.push(fetchFromYoutube);
            
            if (words.length > index) {
                reqParams.subject = words[index + 1];
            }
        }

        if ((word === 'max' || word === 'maximum')
            && (words[index + 1] === 'minutes' || words[index + 2] === 'minutes')) {
            const minutes1 = isNaN(parseInt(words[index + 1])) ? 0 : parseInt(words[index + 1]);
            const minutes2 = isNaN(parseInt(words[index + 2])) ? 0 : parseInt(words[index + 2]);
            reqParams.maxMinutes = minutes1 || minutes2;
        }

        if ((word === 'min' || word === 'minimum')
            && (words[index + 1] === 'minutes' || words[index + 2] === 'minutes')) {
            const minutes1 = isNaN(parseInt(words[index + 1])) ? 0 : parseInt(words[index + 1]);
            const minutes2 = isNaN(parseInt(words[index + 2])) ? 0 : parseInt(words[index + 2]);
            reqParams.minMinutes = minutes1 || minutes2;
        }
    });

    if (services.length === 0) {
        return Promise.resolve([`I'm not sure I understand you...`]);
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
