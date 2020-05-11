const axios = require('axios');
const { youtubeApiKey } = require('../config');

const apiUrl = 'https://www.googleapis.com/youtube/v3/search';
const queryParams = {
    key: youtubeApiKey,
    part: 'snippet',
    order: 'viewCount',
    type: 'video,channel',
};

const fetchFromYoutube = async (searchParams) => {
    const {
        subject,
        maxSongs = 50,
        maxMinutes = 0,
        minMinutes = 0,
    } = searchParams;

    if (!youtubeApiKey || !subject) {
        return 'Sorry, I can\'t help you with youtube search...';
    }

    queryParams.q = subject;
    queryParams.maxResults = maxSongs;

    if (maxMinutes || minMinutes) {
        if (maxMinutes <= 4) {
            queryParams.videoDuration = 'short';
        } else if (minMinutes >= 20) {
            queryParams.videoDuration = 'long';
        } else if (minMinutes >= 4 && maxMinutes <= 20) {
            queryParams.videoDuration = 'medium';
        }
    }

    try {
        const { data } = await axios.get(apiUrl, {
            params: { ...queryParams },
        });

        console.log('youtube res', JSON.stringify(data));
    } catch (error) {
        console.error('fetchFromYoutube error', searchParams, error.message);
        return 'Oooppss, I couldn\'t help with youtube';
    }

    return 'Yay, look at me!';
};

module.exports = {
    fetchFromYoutube,
};
