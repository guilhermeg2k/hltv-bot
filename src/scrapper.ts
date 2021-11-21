import axios from 'axios';
import cheerio from 'cheerio';
import { News } from './database';


class Scrapper {
  private Axios = axios.create();
  getNotices = async (): Promise<Array<News>> => {
    const news = Array<News>();
    try {
      const res = await this.Axios.get('https://www.hltv.org/');
      const page = cheerio.load(res.data);
      const pageNews = page('.newsline.article');
      pageNews.each((i, newsElement) => {
        const commentsRegex = /([0-9]+) comments/;
        const comments = page(newsElement)
          .find('.newstc')
          .text()
          .match(/([0-9]+) comments/);
        const numberOfComments = comments ? parseInt(comments[0]) : 0;

        news.push({
          title: page(newsElement).find('.newstext').text(),
          url: 'https://www.hltv.org' + page(newsElement).attr().href,
          time: page(newsElement).find('.newsrecent').text(),
          comments: numberOfComments,
        });
      });
      return Promise.resolve(news);
    } catch (err) {
      return Promise.reject('Failed to get notices');
    }
  };
}

export default Scrapper;
