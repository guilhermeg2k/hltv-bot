import * as dotenv from 'dotenv';
import Bot from './bot';
import { Intents } from 'discord.js';

dotenv.config({});

Bot({
  token: process.env.TOKEN || '',
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
