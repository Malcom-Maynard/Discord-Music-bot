const { SlashCommandBuilder } = require("@discordjs/builders")
//Creating Module for /Resume command
module.exports = {
	data: new SlashCommandBuilder().setName("resume").setDescription("Resumes the music"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("There are no songs in the queue")

		//If queue is not empty, un pause the song
		queue.setPaused(false)
        await interaction.editReply("Music has been paused! Use `/pause` to resume the music")
	},
}
