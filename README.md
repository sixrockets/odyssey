# Rubyroom Bot

Awesome bot for Slack in NodeJS!

## Requisites:
* Redis
* Mongodb
* Node
* npm
* grunt-cli

## To-do:

* [ ] We could save channels and groups in mongodb to avoid querying for then so often
* [ ] The streamer must look for messages in public channels too
* [ ] Implement something like max(oldest, now-60seconds) for prevent responses to old messages
* [x] Config which bots are available for use by environment variable
