import fs from 'fs';
import path from 'path';

export interface News {
  title: string;
  url: string;
  time: string;
  comments: number;
}

interface DBObject {
  newsChannelId?: string;
  lastNews?: Array<News>;
}

class Database {
  public data = new Map<string, DBObject>();
  private fileName = path.resolve(__dirname, 'db.json');
  constructor() {
    try {
      const databaseJSON = JSON.parse(
        fs.readFileSync(this.fileName).toString()
      );
      for (const item in databaseJSON) {
        this.data.set(item, databaseJSON[item]);
      }
    } catch (err) {
      console.log('Failed to load db' + err);
    }
  }

  private save = () => {
    try {
      fs.writeFileSync(
        path.resolve(__dirname, this.fileName),
        JSON.stringify(Object.fromEntries(this.data))
      );
    } catch (error) {
      console.log('failed to save database');
    }
  };

  setLastNews(guildId: string, lastNews: Array<News>) {
    this.data.set(guildId, {
      ...this.data.get(guildId),
      lastNews,
    });
    this.save();
  }

  setNewsChannelId(guildId: string, newsChannelId: string) {
    this.data.set(guildId, {
      ...this.data.get(guildId),
      newsChannelId,
    });
    this.save();
  }

  guilds = () => Array.from(this.data);
}

export default Database;
