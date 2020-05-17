const express = require('express');
const router = express.Router();

router.get('/youtube', (req, res) => {
    const { userId, videoId } = req.query;

    const youtubeWatchUrl = 'https://www.youtube.com/watch?v=';

    console.log(`user ${userId} clicked on video ${videoId}`);

    return res.redirect(`${youtubeWatchUrl}${videoId}`);
});

module.exports = router;
