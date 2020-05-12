const redis = require('redis');

const { redisHost, redisPort } = require('../config');

let client = null;

const initRedis = () => {
    client = redis.createClient({
        host: redisHost,
        port: redisPort,
    });

    client.on('error', (error) => {
        console.error('redis error', error);
    });
};

// we wrap it with 'Promise' in case get/set will be async in the future
const get = async (key) => {
    if (!client) {
        return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
        client.get(key, (err, val) => {
            if (val) {
                return resolve(val);
            }
    
            return resolve(null);
        });
    });
};

const getList = async (key) => {
    if (!client) {
        return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
        client.lrange(key, 0, -1, (err, val) => {
            console.log('lrange', val);
            if (val && val.length > 0) {
                return resolve(val);
            }

            return resolve(null);
        })
    });
};

// we wrap it with 'Promise' in case get/set will be async in the future
const set = async (key, val, options = {}) => {
    const { ttl = 10 * 60 } = options;

    if (!client) {
        return Promise.resolve({ status: 'error', error: 'no redis client' });
    }

    return new Promise((resolve, reject) => {
        try {
            client.set(key, val, (err) => {
                if (err) {
                    throw err;
                }
    
                client.expire(key, ttl);
    
                return resolve({ status: 'ok' });
            });
        } catch (error) {
            console.error('redis error on set', key, val, error);
            return resolve({ status: 'error', error: error.message });
        }
    });
};

const pushToList = async (key, val, options = {}) => {
    const { ttl = 10 * 60 } = options;

    if (!client) {
        return Promise.resolve({ status: 'error', error: 'no redis client' });
    }

    return new Promise((resolve, reject) => {
        try {
            client.rpush([key, val], (err, reply) => {
                if (err) {
                    throw err;
                }
    
                client.expire(key, ttl);
    
                return resolve({ status: 'ok' });
            });
        } catch (error) {
            console.error('redis error on rpush', key, val, error);
            return resolve({ status: 'error', error: error.message });
        }
    });
};

module.exports = {
    initRedis,
    get,
    getList,
    set,
    pushToList,
};
