import { help as helpService } from './help';
import { handleUnrecognizedService } from './misc';
import { fetchFromYoutube } from './youtube';

const servicesMap: Record<string, (...args: any[]) => any> = {
    youtube: fetchFromYoutube,
    help: helpService,
};

const isQouting = (char: string): boolean => {
    return char === '“'
        || char === '”'
        || char === '’'
        || char === '\"'
        || char === '\'';
};

export const handleMessage = async (
    userId: string,
    text: string,
    sessionMessages: string [],
    isOnPublicChannel: boolean)
    :Promise<string | string[]> => {

    // we can also relate to sessionMessages

    const words = text.split(' ');
    const service = servicesMap[words[0]];
    const reqParams: any = { userId };

    let index = 1;
    while (index < words.length) {
        if (words[0] === 'help' && index === 1) {
            reqParams.service = words[index];
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

    if (!service) {
        return handleUnrecognizedService(text, sessionMessages, isOnPublicChannel);
    }

    return service(reqParams)
        .catch((error: Error) => {
            console.error('error on handleMessage Promise.all', text, error);
            return ['Ooopppsss... I can\'t help you...'];
        });
};
