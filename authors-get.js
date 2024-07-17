const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeJapaneseAuthors() {
  try {
    // Wikipedia の日本の小説家一覧ページをスクレイピング
    const url = 'https://ja.wikipedia.org/wiki/日本の小説家一覧';
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const authors = [];

    // リストから作家名を抽出
    $('div.mw-parser-output ul li').each((index, element) => {
      let authorName = $(element).text().trim();
      if (authorName) {
        // 番号を削除
        authorName = authorName.replace(/^\d+\.\s*/, '');
        
        // 余計な文言を削除
        authorName = authorName.replace(/→.*を参照。?/, '').trim();
        
        if (authorName) {
          authors.push(authorName);
        }
      }
    });

    console.log('スクレイピングした日本人作家名:');
    authors.forEach((author, index) => {
      console.log(`${index + 1}. ${author}`);
    });

    // 結果をJSONファイルに保存
    fs.writeFileSync('authors.json', JSON.stringify(authors, null, 2), 'utf8');
    console.log('結果をauthors.jsonに保存しました。');

  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

scrapeJapaneseAuthors();