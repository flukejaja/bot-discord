const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'pings') {
    await interaction.reply('Pong!');
  }
  if (interaction.commandName === 'c') {
    let url = interaction.options.get('value').value.split('/').filter(Boolean)
    url[1] = '/' + 'play.laibaht.ovh'
    await interaction.reply({
      content: url.join('/')
    });
  }
  if (interaction.commandName === 'hell') {
    await interaction.reply('Pong!');
  }

});



client.login('token');