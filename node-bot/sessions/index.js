const { chatSessionPeriod } = require('../config');
const redisClient = require('./redis');

const initCache = () => {
    redisClient.initRedis();
};

const getSession = async (user) => {
    const session = await redisClient.getList(user);

    return session;
};

const setSession = async (user, text) => {
    const { status } = await redisClient.pushToList(user, text, { ttl: chatSessionPeriod });

    return status;
};

module.exports = {
    initCache,
    getSession,
    setSession,
};
