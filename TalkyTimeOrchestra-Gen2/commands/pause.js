const { SlashCommandBuilder } = require("@discordjs/builders")

//Creating the module for the /pause command
module.exports = {
	data: new SlashCommandBuilder().setName("pause").setDescription("Pauses the music"),
	run: async ({ client, interaction }) => {

		//Get users Queue
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("There are no songs in the queue")

		//Pause the Queue if not empty
		queue.setPaused(true)
        await interaction.editReply("Music has been paused! Use `/resume` to resume the music")
	},
}
