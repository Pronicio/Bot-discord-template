const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');

const pino = require('pino')
const pretty = require('pino-pretty')

require('dotenv').config()

const i18n = require('./Structure/i18n.js')
const Handler = require('./Structure/handler.js');
const Slash = require('./Structure/slash.js')

class App extends Client {
    constructor() {
        super({
            disableMentions: "everyone",
            partials: [ Partials.User, Partials.Message, Partials.Channel, Partials.Reaction ],
            intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages,
                GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent
            ]
        });

        this.logger = pino(pretty())
        this.i18n = i18n()

        process
            .on('unhandledRejection', error => {
                this.logger.error(error);
            })
            .on('warning', (warning) => {
                this.logger.warn(warning.stack);
            });

        this.on("disconnect", () => this.logger.info("Bot is disconnecting..."))
            .on("reconnecting", () => this.logger.info("Bot reconnecting..."))
            .on("error", (error) => this.logger.error(error))
            .on("warn", (info) => this.logger.warn(info));

        this.login(process.env.TOKEN).then(() => {
            this.logger.info("Successful connected to Discord!");

            this.launch().then(() => {
                this.logger.info("Successful launch of the bot, connecting to Discord...");
            }).catch(e => {
                throw new Error(e);
            })
        });
    }

    async launch() {
        this.commands = new Collection();
        this.slash = new Slash(this);

        const handlers = new Handler(this);
        await handlers.commands();
        handlers.events();
    }
}

module.exports = new App();
