import fs from 'fs';
import path from 'path';

export interface News {
  title: string;
  url: string;
  time: string;
  comments: number;
}

interface Guild {
  newsChannelId?: string;
  lastNews?: Array<News>;
}

class Database {
  public guildData = new Map<string, Guild>();
  private fileName = path.resolve(__dirname, 'db.json');
  constructor() {
    try {
      const databaseJSON = JSON.parse(
        fs.readFileSync(this.fileName).toString()
      );
      for (const item in databaseJSON) {
        this.guildData.set(item, databaseJSON[item]);
      }
    } catch (err) {
      console.log('Failed to load db' + err);
    }
  }

  private save = () => {
    try {
      fs.writeFileSync(
        path.resolve(__dirname, this.fileName),
        JSON.stringify(Object.fromEntries(this.guildData))
      );
    } catch (error) {
      console.log('failed to save database');
    }
  };

  setLastNews(guildId: string, lastNews: Array<News>) {
    this.guildData.set(guildId, {
      ...this.guildData.get(guildId),
      lastNews,
    });
    this.save();
  }

  setNewsChannelId(guildId: string, newsChannelId: string) {
    this.guildData.set(guildId, {
      ...this.guildData.get(guildId),
      newsChannelId,
    });
    this.save();
  }
}

export default Database;
