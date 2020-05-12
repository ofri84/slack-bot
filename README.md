# Slack-Bot

this is a bot for slack, using Node.js and Redis.

in order to run it (locally) you need to install Docker.

## Running

1. create .env file on ./node-bot

2. create slack-bot-app (classic app) on Slack and obtain a token for the bot. assing this token to BOT_TOKEN in your .env file

3. your bot name should be the same as BOT_NAME field in docker-compose.yml

4. run 
```bach
docker-compose up
```

## Services

if you want to have an option to search songs in youtube you need to obtain a google api token for youtube data and assing it to YOUTUBE_API_KEY field in your .env file. [https://developers.google.com/youtube/v3/docs]

## Conversations

if you want to add answers to input texts:

1. create a google sheet file where each row is an answer to an input text. the first column of the row should match the input text and the other columns are answers, which will be randomlly picked 

2. on File -> Publish to web -> select the relevant sheet and publish the file as .csv

3. put the link in BOT_RESPONSES_URL field in your .env file

## Usage

init a conversation with the bot by mentioning the bot name directly. e.g. '@benny here?'
afterwards a session of your user and the bot will be held for 30 seconds (see config.js), so you won't have to mention the bit name every time

## License
[MIT](https://choosealicense.com/licenses/mit/)


