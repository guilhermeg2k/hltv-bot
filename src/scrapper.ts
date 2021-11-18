import axios from 'axios';
import cheerio from 'cheerio';

export interface News {
  text: string;
  url: string;
}

class Scrapper {
  private Axios = axios.create();
  getNotices = async (): Promise<Array<News>> => {
    const news = Array<News>();
    try {
      const res = await this.Axios.get('https://www.hltv.org/');
      const page = cheerio.load(res.data);
      const pageNews = page('.newsline.article');
      pageNews.each((i, newsElement) => {
        news.push({
          text: page(newsElement).find('.newstext').text(),
          url: 'https://www.hltv.org/'+page(newsElement).attr().href,
        });
      });
      return Promise.resolve(news);
    } catch (err) {
      return Promise.reject('Failed to get notices');
    }
  };
}

export default Scrapper;
