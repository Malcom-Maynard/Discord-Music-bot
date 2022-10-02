const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

//Creating the module for the /info command 
module.exports = {
	data: new SlashCommandBuilder().setName("info").setDescription("Displays info about the currently playing song"),
	run: async ({ client, interaction }) => {

		//Collect the user Queue and check to see if its empty or not
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("There are no songs in the queue")

		let bar = queue.createProgressBar({
			queue: false,
			length: 19,
		})
		//Grab current song and display info on it to the user
        const song = queue.current
		
		await interaction.editReply({
			embeds: [new EmbedBuilder()
            .setThumbnail(song.thumbnail)
            .setDescription(`Currently Playing [${song.title}, by ${song.author}](${song.url} <:pikahappy:1002315558424956968> 
				)\n\n` + bar)
        ],
		})
	},
}
