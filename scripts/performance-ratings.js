const { Scraper, Root, DownloadContent, OpenLinks, CollectContent } = require('nodejs-web-scraper');
const fs = require('fs');

(async () => {


    const scraper = new Scraper(config);

    const root = new Root();

    const playerRatings = new OpenLinks('.CRdb', { name: 'performance' });

    root.addOperation(playerRatings);//Then we create a scraping "tree":


    await scraper.scrape(root);

    const pR = playerRatings.getData();

    fs.writeFile('./data.json', JSON.stringify(articles), () => { })

})()