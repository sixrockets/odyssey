# Odyssey

Bot launching platform for Telegram and Slack (more to come) in NodeJS!

## Installation:

Be sure to have redis and mongodb started.

The project requires a valid Slack API token. You can define it in an environment variable or in an .env file in the root of the project. The variable name is BOTS_API_TOKEN.

To build and launch the project just execute `npm start`.

## Requisites:
* Redis
* Mongodb
* node/iojs
* npm

## To-do:

* [ ] Streamline the bot generation process (maybe with a Yeoman generator?)
* [ ] Generalize the usage of redis as an API control mechanism.
* [ ] There are still places where Async is still used instead of Q/Qx, refactor this code.
* [ ] There aren't any tests. Integrate a test framework and write the first tests.
* [ ] Standarize the message that arrives to adapters.
* [ ] Make user fetching universal.
