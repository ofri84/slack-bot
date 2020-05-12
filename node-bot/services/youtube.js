const axios = require('axios');
const { youtubeApiKey } = require('../config');

const { createLink, msgList } = require('../formattingMessages');

const youtubeWatchUrl = 'https://www.youtube.com/watch?v=';
const apiUrl = 'https://www.googleapis.com/youtube/v3/search';
const queryParams = {
    key: youtubeApiKey,
    part: 'snippet',
    order: 'viewCount',
    type: 'video,channel',
};

const isYoutubeSupported = !!youtubeApiKey;

const fetchFromYoutube = async (searchParams) => {
    const {
        subject,
        maxSongs = 50,
        maxMinutes = 0,
        minMinutes = 0,
    } = searchParams;

    if (!isYoutubeSupported || !subject) {
        return 'Sorry, I can\'t help you with youtube search...';
    }

    queryParams.q = subject;
    queryParams.maxResults = maxSongs;

    if (maxMinutes || minMinutes) {
        if (maxMinutes && maxMinutes <= 4) {
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

        const list = items.map((it) => {
            const {
                id: { videoId },
                snippet: { title },
            } = it;
            
            const link = `${youtubeWatchUrl}${videoId}`;
            return createLink(link, title);
        });

        return msgList(list);
    
    } catch (error) {
        console.error('fetchFromYoutube error', searchParams, error.message);
        return 'Oooppss, I couldn\'t help with youtube';
    }
};

const youtubeHelp = async () => {
    return Promise.resolve([
        'Usage example:  youtube "Moishe Oofnik" max 10 songs min 15 minutes',
        'Parameters to search: max songs, max/min minutes',
    ]);
};

module.exports = {
    fetchFromYoutube,
    isYoutubeSupported,
    youtubeHelp,
};
