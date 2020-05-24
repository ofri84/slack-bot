import { isYoutubeSupported, youtubeHelp } from './youtube';
import { msgList } from '../formattingMessages';

export interface HelpInput {
    service: string,
};

const supportedServices: Record<string, boolean> = {
    youtube: isYoutubeSupported,
};

const servicesMap: Record<string, (...args: any[]) => any> = {
    youtube: youtubeHelp,
};

export const help = async ({ service }: HelpInput): Promise<string | string[]> => {
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
