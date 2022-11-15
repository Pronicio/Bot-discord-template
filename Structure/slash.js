const { REST, Routes } = require("discord.js");

module.exports = class {
    constructor(client) {
        this.rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
        this.logger = client.logger;
    }

    async connect(commands) {
        try {
            this.logger.info(`Started refreshing ${commands.length} application (/) commands.`);

            const data = await this.rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands },
            );

            this.logger.info(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            this.logger.error(error);
        }
    }
}
