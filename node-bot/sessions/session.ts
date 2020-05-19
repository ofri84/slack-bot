const { chatSessionPeriod } = require('../config');
import { initRedis, getList, pushToList } from './redisClient';

export const initCache = (): void => {
    initRedis();
};

export const getSession = async (userId: string): Promise<string[] | null> => {
    const session = await getList(userId);

    return session;
};

export const setSession = async (userId: string, text: string): Promise<string> => {
    const { status } = await pushToList(userId, [text], { ttl: chatSessionPeriod });

    return status;
};
