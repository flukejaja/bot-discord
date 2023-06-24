const { REST, Routes } = require('discord.js');
require('dotenv').config()
const commands = [
  {
    name: 'pings',
    description: 'Replies with Pong!',
  },
  {
    name:'hell',
    description: 'get args!',
    options:[
      {
        name:'link',
        description:'testing arguments',
        require:true,
        type: 3
      }
    ]
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.Token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationCommands(process.env.Id), { body: commands });
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();