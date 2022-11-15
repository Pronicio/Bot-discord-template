const { readdirSync } = require('fs');
const { join } = require("path");

module.exports = class {
    constructor(client) {
        this.client = client;
        this.logger = client.logger;
    }

    async commands() {
        let count = 0;
        let commandsArray = []
        const folders = readdirSync(join(__dirname, "../Commands"));

        await folders.forEach(async folder => {
            const commands = readdirSync(join(__dirname, "../Commands", folder));
            await commands.forEach(async commandName => {
                count++
                try {
                    const command = require(join(__dirname, "../Commands", folder, commandName));
                    this.client.commands.set(command.name, command);
                    commandsArray.push(command.data.toJSON())
                } catch (error) {
                    this.logger.error(`[Commands] Unable to load the command ${commandName}: ${error.stack || error}.`)
                }
            })
        })

        await this.client.slash.connect(commandsArray)

        this.logger.info(`[Commands] Charged: ${this.client.commands.size}/${count} command(s).`)
    }

    async events() {
        let count = 0;
        const files = readdirSync(join(__dirname, "../Events"));

        await files.forEach(fileName => {
            try {
                count++;
                const eventName = fileName.split('.')[0];
                const event = require(join(__dirname, "../Events", fileName));

                this.client.on(eventName, event.bind(null, this.client));
                delete require.cache[require.resolve(join(__dirname, "../Events", fileName))];
            } catch (error) {
                throw new Error(`[Events] Unable to load the event ${fileName}: ${error.stack || error}.`)
            }
        });

        this.logger.info(`[Events] Charged: ${count}/${files.length} event(s).`)
    }
}
