import { BotClient } from './structs/BotClass.mts';
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import './server/express.mts';

const sharedClient = new BotClient(
  new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
  })
);

const allSockets = new Collection<string, any>();

export { sharedClient, allSockets };
