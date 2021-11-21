import {
  Client,
  DMChannel,
  Message,
  TextChannel,
  PartialDMChannel,
  NewsChannel,
  ThreadChannel,
} from 'discord.js';
import Scrapper, { News } from './scrapper';
import { capitalize } from './utils';

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
  scrapper: Scrapper;
  token = '';
  guildConfig: GuildConfig;
  lastNews = Array<News>();

  constructor({ token, intents }: BotParams) {
    this.client = new Client({ intents });
    this.scrapper = new Scrapper();
    this.guildConfig = {
      newsChannelId: '',
    };

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
    this.startNewsWatcher(1000);
  };

  messageHandler = async (msg: Message) => {
    if (msg.content === '!news') {
      this.sendNews(msg.channel);
    }
    if (msg.content === '!hltv-setchannel') {
      this.setNewsChannelId(msg.channelId);
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
    )}\n ${news.url}`;
  };

  startNewsWatcher = (interval: number) => {
    setInterval(async () => {
      if (this.guildConfig.newsChannelId) {
        const newsChannel = this.client.channels.cache.get(
          this.guildConfig.newsChannelId
        ) as TextChannel;
        const lastFiveNews = await (
          await this.scrapper.getNotices()
        ).slice(0, 5);

        if (this.lastNews.length === 0) {
          let resp = '';
          for (const aNews of lastFiveNews) {
            resp += this.buildNewsText(aNews) + '\n';
          }
          newsChannel.send(resp);
        } else {
          for (const aNews of lastFiveNews) {
            if (!this.lastNews.find((news) => news.title === aNews.title)) {
              const resp = this.buildNewsText(aNews);
              newsChannel.send(resp);
            }
          }
        }
        this.lastNews = [...lastFiveNews];
      }
    }, interval);
  };

  setNewsChannelId = (channelId: string) => {
    console.log('setting news channel id');
    this.guildConfig.newsChannelId = channelId;
  };
}

export default Bot;
