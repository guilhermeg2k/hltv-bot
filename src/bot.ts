import {
  Client,
  DMChannel,
  Message,
  NewsChannel,
  PartialDMChannel,
  TextChannel,
  ThreadChannel,
} from 'discord.js';
import Database, { News } from './database';
import Scrapper from './scrapper';
import { capitalize } from './utils';

const NEWS_WATCHER_INTERVAL = 1 * 60000;

interface BotParams {
  token: string;
  intents: Array<number>;
}

interface GuildConfig {
  newsChannelId: string;
}

type Channel =
  | DMChannel
  | PartialDMChannel
  | TextChannel
  | NewsChannel
  | ThreadChannel;

class Bot {
  client: Client;
  scrapper = new Scrapper();
  database = new Database();

  constructor({ token, intents }: BotParams) {
    this.client = new Client({ intents });

    this.client.on('ready', async () => {
      this.readyHandler();
    });
    this.client.on('messageCreate', async (msg) => {
      if (msg.author.bot) return;
      this.messageHandler(msg);
    });

    this.client.login(token);
  }

  readyHandler = async () => {
    console.log(`Logged in as ${this.client.user?.tag}!`);
    this.startNewsWatcher(NEWS_WATCHER_INTERVAL);
  };

  messageHandler = async (msg: Message) => {
    if (msg.content === '!news') {
      this.sendNews(msg.channel);
    }
    if (msg.content === '!hltv-setchannel') {
      this.handleSetNewsChannelId(msg);
    }
  };

  sendNews = async (channel: Channel) => {
    const news = (await this.scrapper.getNotices()).slice(0, 5);
    let resp = '';
    for (const newsElement of news) {
      resp += `[${newsElement.title}](${newsElement.url})\n`;
    }
    channel.send(resp);
  };

  buildNewsText = (news: News) => {
    return `[${news.time}] [${news.comments} comments] ${capitalize(
      news.title
    )}\n`;
  };

  startNewsWatcher = (interval: number) => {
    setInterval(async () => {
      this.database.data.forEach(async (guild, guildId) => {
        if (guild.newsChannelId) {
          const newsChannel = this.client.channels.cache.get(
            guild.newsChannelId
          ) as TextChannel;
          const lastNews = (await this.scrapper.getNotices()).slice(0, 5);

          if (guild.lastNews?.length === 0) {
            let response = '';
            for (const aNews of lastNews) {
              response += this.buildNewsText(aNews);
            }
            newsChannel.send(response);
          } else {
            let response = '';
            let hasNewsToSend = false;
            for (const aNews of lastNews) {
              if (!guild.lastNews?.find((news) => news.title === aNews.title)) {
                hasNewsToSend = true;
                response += this.buildNewsText(aNews);
              }
            }
            if (hasNewsToSend) {
              newsChannel.send(response);
            }
          }
          this.database.setLastNews(guildId, [...lastNews]);
        }
      });
    }, interval);
  };

  handleSetNewsChannelId = (msg: Message) => {
    console.log('Settings channel id');
    this.database.setNewsChannelId(msg.guildId as string, msg.channelId);
  };
}

export default Bot;
