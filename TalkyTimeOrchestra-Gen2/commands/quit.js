const { SlashCommandBuilder } = require("@discordjs/builders")
//Creating the module for /quit command
module.exports = {
	data: new SlashCommandBuilder().setName("quit").setDescription("Stops the bot and clears the queue"),
	run: async ({ client, interaction }) => {

		//Gets users Queue
		const queue = client.player.getQueue(interaction.guildId)

		//If there is no more songs in the Queue, the bot leaves the chat
		if (!queue) return await interaction.editReply("There are no songs in the queue")
		
		queue.destroy()
        await interaction.editReply("Bye!")
	},
}
