const { chatSessionPeriod } = require('../config');
const redisClient = require('./redis');

const initCache = () => {
    redisClient.initRedis();
};

const getSession = async (user) => {
    const session = await redisClient.getList(user);
    console.log('get session', session);
    return session;
};

const setSession = async (user, text) => {
    const { status } = await redisClient.pushToList(user, text, { ttl: chatSessionPeriod });
    console.log('set session', status);
    return status;
};

module.exports = {
    initCache,
    getSession,
    setSession,
};
