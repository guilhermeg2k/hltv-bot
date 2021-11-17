import { Client, Intents } from 'discord.js';

interface BotParams {
  token: string;
  intents: Array<number>;
}

const Bot = ({ token, intents }: BotParams) => {
  const client = new Client({ intents });

  client.on('message', (msg) => {
    if (msg.author.bot) return;
    msg.channel.send(msg.content);
  });

  client.login(token);
};

export default Bot;
