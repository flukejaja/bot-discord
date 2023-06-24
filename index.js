// const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config()

const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice');
const { Client, Intents, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const playdl = require('play-dl');
const wait = require('node:timers/promises').setTimeout;
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates
  ]
});
const queue = new Map();

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'hell') {
    try {
      // const url = interaction.options.getString('url');
      const url = interaction.options.get('link').value;
      const yt_info = await playdl.search(url, {
        limit: 1
      })
      const voiceChannel = interaction.member.voice.channel;

      if (!voiceChannel) {
        return interaction.followUp('คุณต้องเข้าร่วมห้องพูดก่อน!');
      }

      let serverQueue = queue.get(interaction.guildId);

      if (!serverQueue) {
        serverQueue = {
          textChannel: interaction.channel,
          voiceChannel,
          connection: null,
          songs: [],
          playing: false,
        };
        queue.set(interaction.guildId, serverQueue);
      }

      const songInfo = await playdl.video_info(yt_info[0].url);
      const song = {
        title: songInfo.video_details.title,
        url: songInfo.video_details.url,
      };
      serverQueue.songs.push(song);

      if (!serverQueue.playing) {
        serverQueue.playing = true;
        return play(serverQueue.songs[0], interaction);
      } else {
        const exampleEmbed = new EmbedBuilder()
          .setColor([255, 183, 0])
          .setTitle(`เพิ่มเพลง **${song.title}** เข้าคิวแล้ว!`)
        interaction.followUp({ embeds: [exampleEmbed] });
      }
    } catch (e) {
      interaction.channel.send(`err ${e}`)
    }
  }

});

async function play(song, interaction) {
  const serverQueue = queue.get(interaction.guildId);

  if (!song) {
    await wait(5000)
    const exampleEmbed = new EmbedBuilder()
      .setColor([255, 0, 0])
      .setTitle('ไปก่อนนนน้าาาา')
    serverQueue.textChannel.send({ embeds: [exampleEmbed] });
    serverQueue.connection.destroy();
    queue.delete(interaction.guildId);
    return;
  }

  const stream = await playdl.stream(song.url);
  const resource = createAudioResource(stream.stream, {
    inputType: stream.type
  })
  const player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Play,
    },
  });

  player.play(resource);
  serverQueue.connection = joinVoiceChannel({
    channelId: serverQueue.voiceChannel.id,
    guildId: serverQueue.voiceChannel.guild.id,
    adapterCreator: serverQueue.voiceChannel.guild.voiceAdapterCreator,
  });

  serverQueue.connection.subscribe(player);

  player.on('error', error => {
    console.error(error);
    serverQueue.songs.shift();
    play(serverQueue.songs[0], interaction);
  });

  player.on('stateChange', (oldState, newState) => {
    if (newState.status === 'idle' && oldState.status !== 'idle') {
      serverQueue.songs.shift();
      play(serverQueue.songs[0], interaction);
    }
  });
  const exampleEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(`กำลังเล่นเพลง **${song.title}**`)
  serverQueue.textChannel.send({ embeds: [exampleEmbed] });
}


client.login(process.env.Token);