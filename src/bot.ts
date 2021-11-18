import {
  Client,
  DMChannel,
  Message,
  TextChannel,
  PartialDMChannel,
  NewsChannel,
  ThreadChannel,
} from 'discord.js';
import Scrapper from './scrapper';

interface BotParams {
  token: string;
  intents: Array<number>;
}

class Bot {
  client: Client;
  scrapper: Scrapper;
  token: string = '';

  constructor({ token, intents }: BotParams) {
    this.client = new Client({ intents });
    this.scrapper = new Scrapper();
    this.client.on('messageCreate', async (msg) => {
      if (msg.author.bot) return;
      this.messageHandler(msg);
    });
    this.client.login(token);
  }

  messageHandler = async (msg: Message) => {
    if (msg.content === '!news') {
      this.sendNews(msg.channel);
    }
  };

  sendNews = async (
    channel:
      | DMChannel
      | PartialDMChannel
      | TextChannel
      | NewsChannel
      | ThreadChannel
  ) => {
    const news = await (await this.scrapper.getNotices()).slice(0, 5);
    let resp = '';
    for (const newsElement of news) {
      resp += `[${newsElement.text}](${newsElement.url})\n`;
    }
    channel.send(resp);
  };
}

export default Bot;
