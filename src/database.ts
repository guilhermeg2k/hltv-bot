import fs from 'fs';
import path from 'path';

interface DBObject {
  newsChannelId: string;
}

class Database {
  private fileName = path.resolve(__dirname, 'db.json');
  private data = new Map<string, DBObject>();

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
}

export default Database;
