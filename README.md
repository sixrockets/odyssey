# Rubyroom Bot

Awesome bot for Slack in NodeJS!

## Requisites:
* Redis
* Mongodb
* Node
* npm
* grunt-cli

## To-do:

* [ ] Streamline the bot generation process (maybe with a Yeoman generator?)
* [ ] Make the baseParser more reusable, right now it's only a json parser
* [ ] Generalize the usage of redis as an API control mechanism.
* [ ] Right now only the KarmaBot is adapted to use the new RT API, adapt the rest of bots.
* [ ] There are still places where Async is still used instead of Q/Qx, refactor this code.
* [ ] There aren't any tests. Integrate a test framework and write the first tests.
