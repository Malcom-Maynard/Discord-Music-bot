const { SlashCommandBuilder } = require("@discordjs/builders")
//Creating Module for /Shuffle command
module.exports = {
	data: new SlashCommandBuilder().setName("shuffle").setDescription("Shuffles the queue"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		//IF queue is not empty, shuffle order of the songs inside
		if (!queue) return await interaction.editReply("There are no songs in the queue")

		queue.shuffle()
        await interaction.editReply(`The queue of ${queue.tracks.length} songs have been shuffled!`)
	},
}
