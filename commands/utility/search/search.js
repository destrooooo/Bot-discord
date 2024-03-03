const { GG_API_KEY, GG_CX } = require("../../config.json");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const imageSearch = require("../../image_search.js");
const resultMap = require("../../resultMap.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("françois_search")
    .setDescription("Search for an image")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("The search term")
        .setRequired(true)
    ),

  async runSearch(input) {
    const query = interaction.options.getString("input");
  },

  async execute(interaction) {
    const query = interaction.options.getString("input");
    const searchResult = await imageSearch.search(query);
    searchResult.resultArray.forEach((result, index) => {
      // console.log(`Image ${index + 1}:`);
      // console.log(result.image);
    });
    const url = searchResult.currentSearch().link;
    // Format the search term to replace spaces with %20 for custom search engine URL
    const cseURL = query.replaceAll(" ", "%20");
    const resultEmbed = new EmbedBuilder()
      .setTitle(`Images of ${query}`)
      .setURL(`https://cse.google.com/cse?cx=${GG_CX}#gsc.q=${cseURL}`)
      .setDescription(
        `Result ${searchResult.currentResult + 1} of ${
          searchResult.resultArray.length
        }`
      )

      .addFields(
        { name: "Title", value: searchResult.currentSearch().title },
        { name: "Link", value: searchResult.currentSearch().displayLink }
      )
      .setImage(url);
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("prev")
        .setLabel("Previous")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("next")
        .setLabel("Next")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        // .setCustomId("original")
        .setLabel("View Original")
        .setStyle(ButtonStyle.Link)
        .setURL(searchResult.currentSearch().image.contextLink)
    );

    const response = await interaction.reply({
      embeds: [resultEmbed],
      components: [row],
      fetchReply: true,
    });
    await resultMap.set(response.id, searchResult);
  },
};
