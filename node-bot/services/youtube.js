const axios = require('axios');
const { youtubeApiKey } = require('../config');

const { createLink } = require('../formattingMessages');

const youtubeWatchUrl = 'https://www.youtube.com/watch?v=';
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
        const { data: { items } } = await axios.get(apiUrl, {
            params: { ...queryParams },
        });

        return items.map((it) => {
            const {
                id: { videoId },
                snippet: { title },
            } = it;
            
            const link = `${youtubeWatchUrl}${videoId}`;
            return createLink(link, title);
        }).join('\n- ');

    } catch (error) {
        console.error('fetchFromYoutube error', searchParams, error.message);
        return 'Oooppss, I couldn\'t help with youtube';
    }
};

module.exports = {
    fetchFromYoutube,
};
