///<reference path="../@types/youtube.d.ts" />
import { SearchParams, YoutubeQuery, YoutubeItem } from 'youtube';

const axios = require('axios');

import { youtubeApiKey,clicksUrl } from '../config';
import { createLink, msgList } from '../formattingMessages';

const apiUrl = 'https://www.googleapis.com/youtube/v3/search';
const queryParams: YoutubeQuery = {
    key: youtubeApiKey,
    part: 'snippet',
    // order: 'viewCount',
    type: 'video,channel',
};

export const isYoutubeSupported = !!youtubeApiKey;

export const fetchFromYoutube = async (searchParams: SearchParams): Promise<string> => {
    const {
        userId,
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

        const list = items.map((it: Partial<YoutubeItem>) => {
            const {
                id: { videoId },
                snippet: { title },
            } = it;

            const { protocol, host, port } = clicksUrl;
            const link = `${protocol}://${host}:${port}/click/youtube?userId=${userId}&videoId=${videoId}`;

            return createLink(link, title);
        });

        return msgList(list);
    
    } catch (error) {
        console.error('fetchFromYoutube error', searchParams, error.message);
        return 'Oooppss, I couldn\'t help with youtube';
    }
};

export const youtubeHelp = async (): Promise<string[]> => {
    return Promise.resolve([
        'Usage example:  youtube "Moishe Oofnik" max 10 songs min 15 minutes',
        'Parameters to search: max songs, max/min minutes',
    ]);
};
