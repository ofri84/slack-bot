const redis = require('redis');
import { RedisClient } from "redis";

const { redisHost, redisPort } = require('../config');

interface Options {
    ttl: number;
}
const defOptions: Partial<Options> = { ttl: 600 }; 

let client: RedisClient | null = null;

const initRedis = () =>  {
    client = redis.createClient({
        host: redisHost,
        port: redisPort,
    });

    client?.on('error', (error) => {
        console.error('redis error', error);
    });
};

// we wrap it with 'Promise' in case get/set will be async in the future
const get = async (key: string): Promise<any | null> => {
    if (!client) {
        return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
        client?.get(key, (err, val) => {
            if (val) {
                return resolve(val);
            }
    
            return resolve(null);
        });
    });
};

// return a list of items or null
const getList = async (key: string): Promise<any[] | null> => {
    if (!client) {
        return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
        client?.lrange(key, 0, -1, (err, val) => {
            if (val && val.length > 0) {
                return resolve(val);
            }

            return resolve(null);
        })
    });
};

// we wrap it with 'Promise' in case get/set will be async in the future
const set = async (key: string, val: any, options = defOptions): Promise<object> => {
    const { ttl = defOptions.ttl } = options;
    
    if (!client) {
        return Promise.resolve({ status: 'error', error: 'no redis client' });
    }

    return new Promise((resolve, reject) => {
        try {
            client?.set(key, val, (err) => {
                if (err) {
                    throw err;
                }
    
                client?.expire(key, ttl!!);
    
                return resolve({ status: 'ok' });
            });
        } catch (error) {
            console.error('redis error on set', key, val, error);
            return resolve({ status: 'error', error: error.message });
        }
    });
};

const pushToList = async (key: string, values: string[], options = defOptions): Promise<object> => {
    const { ttl = defOptions.ttl } = options;

    if (!client) {
        return Promise.resolve({ status: 'error', error: 'no redis client' });
    }

    return new Promise((resolve, reject) => {
        try {
            const res = client?.rpush(key, values);
            if (!res) {
                throw new Error(`fail to insert items per key ${key}`);
            }
            client?.expire(key, ttl!!);
            return resolve({ status: 'ok' });
        } catch (error) {
            console.error('redis error on rpush', key, values, error);
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
