const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")
const fetch = require('isomorphic-unfetch');
const { getData} = require('spotify-url-info')(fetch)

//Creating module for /play command
module.exports = {
    //Creating descriptions for the commands for users to see
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("loads songs from youtube")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("song")
				.setDescription("Loads a single song from a url")
				.addStringOption((option) => option.setName("url").setDescription("the song's url").setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("playlist")
				.setDescription("Loads a playlist of songs from a url")
				.addStringOption((option) => option.setName("url").setDescription("the playlist's url").setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("search")
				.setDescription("Searches for sogn based on provided keywords")
				.addStringOption((option) =>
					option.setName("searchterms").setDescription("the search keywords").setRequired(true)
				)
		),
	run: async ({ client, interaction }) => {

        //Check if user is in a VC and if the bot is in the VC
		if (!interaction.member.voice.channel) return interaction.editReply("You need to be in a VC to use this command")

		const queue = await client.player.createQueue(interaction.guild)
		if (!queue.connection) await queue.connect(interaction.member.voice.channel)

		let embed = new EmbedBuilder()

        //if user is looking for a single song
		if (interaction.options.getSubcommand() === "song") {

            //Get the URL and check its type
            let url = interaction.options.getString("url")
            
            if (isSpotifyURL(url)==true){
                console.log("Spotify link")
                var result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.SPOTIFY_SONG
                })

            }

            else{
                var result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_VIDEO
                })
            }
            
            //if it couldn't be found, tell the user else add it to the Queue
            if (result.tracks.length === 0)
                return interaction.editReply("No results")
            

            const song = result.tracks[0]
            
            
            await queue.addTrack(song)
            //Send embed to the user 
            embed
                .setDescription(`**[${song.title}](${song.url})** by ${song.author} has been added to the Queue<:VicPOG:761579915010768916>`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: NA`})

		} 
        //If the user is looking for a playlist
        else if (interaction.options.getSubcommand() === "playlist") {

            //Get the URL and check its type
            let url = interaction.options.getString("url")
            
            if (isSpotifyURL(url)==true){
                console.log("spotify")
                var result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.SPOTIFY_PLAYLIST
                })

                
                
            }
            else{
                
                var result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_PLAYLIST
                })
            }
            
            //if it couldn't be found, tell the user else add it to the Queue
            if (result.tracks.length === 0)
                return interaction.editReply("No results")
            
            const playlist = result.playlist
            await queue.addTracks(result.tracks)
            //Send embed to the user 
            embed
                .setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue <:VicPOG:761579915010768916>`)
                .setThumbnail(playlist.thumbnail)
		} 
        //If user wants to search for song without a URL
        else if (interaction.options.getSubcommand() === "search") {
            //Search for the song using user search terms
            let url = interaction.options.getString("searchterms")+" (Official Audio)"
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })
            //if it couldn't be found, tell the user else add it to the Queue
            if (result.tracks.length === 0)
                return interaction.editReply("No results")
            
            const song = result.tracks[0]
            await queue.addTrack(song)
            //Send embed to the user 
            embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the Queue <:VicPOG:761579915010768916>`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})
		}
        if (!queue.playing) await queue.play()
        await interaction.editReply({
            embeds: [embed]
        })
	},
}

//Checks if URL matches a Spotify URL
function isSpotifyURL(str) {
    var res = str.match(/^(spotify:|https:\/\/[a-z]+\.spotify\.com\/)/)
    return (res !== null)
 }