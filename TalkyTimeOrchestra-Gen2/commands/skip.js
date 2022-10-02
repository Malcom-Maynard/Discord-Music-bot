const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

//Creating Module for /Skip command
module.exports = {
	data: new SlashCommandBuilder().setName("skip").setDescription("Skips the current song"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("There are no songs in the queue")
        //IF queue is not empty, skip the current song and go to the next
        const currentSong = queue.current

		queue.skip()
        let embed = new EmbedBuilder()
        embed
        .setDescription(`${currentSong.title} has been skipped!`)
        .setThumbnail(currentSong.thumbnail)
        
        
        await interaction.editReply({
            embeds: [embed]   
        })
	},
}
