const { REST, Routes } = require('discord.js');
const commands = [
  {
    name: 'pings',
    description: 'Replies with Pong!',
  },
  {
    name: 'hell',
    description: 'Replies with Pong!',
  },
  {
    name:'c',
    description: 'get args!',
    options:[
      {
        name:'value',
        description:'testing arguments',
        require:true,
        type: 3
      }
    ]
  }
];

const rest = new REST({ version: '10' }).setToken('token');

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands('token'), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();