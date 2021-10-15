// Importing thing we need
const puppeteer = require("puppeteer");
const jwt = require("jsonwebtoken");
const service = require("../service/apiService");
// Controllers

// This controller send HTML to client
const sendHTML = async(req, res) => {
    res.send("Welcome to Get News");
};
// This controller scraped jobs data from https://www.sciencedaily.com/news/computers_math/information_technology and send to client
const createNews = async(req, res) => {
    // Extracting token
    const token = req.query.token;
    const urlToFetchFrom = [{
            category: "ai",
            link: "https://www.sciencedaily.com/news/computers_math/artificial_intelligence/",
        },
        {
            category: "communications",
            link: "https://www.sciencedaily.com/news/computers_math/communications/",
        },
        {
            category: "computer science",
            link: "https://www.sciencedaily.com/news/computers_math/computer_science/",
        },
        {
            category: "hacking",
            link: "https://www.sciencedaily.com/news/computers_math/hacking/",
        },
        {
            category: "quantum computers",
            link: "https://www.sciencedaily.com/news/computers_math/quantum_computers/",
        },
        {
            category: "software",
            link: "https://www.sciencedaily.com/news/computers_math/software/",
        },
    ];
    // Verifying token
    jwt.verify(token, process.env.PASSWORD, async function(err, decoded) {
        if (err) {
            res.send({
                status: 401,
                request: "reject",
            });
        } else {
            // Lanuching browser
            const browser = await puppeteer
                .launch({
                    headless: false,
                    args: [
                        "--window-size=1920,1080",
                        "--no-sandbox",
                        "--disable-setuid-sandbox",
                    ],
                    defaultViewport: null,
                })
                .catch(async(e) => {
                    res.send({
                        status: 204,
                        work: "Incompelete",
                    });
                });
            // Trying to fetch news data
            try {
                const allNews = [];
                // Fetching news
                await new Promise(async(resolve, reject) => {
                    //Using for loop to go to different urls
                    for (let index = 0; index < urlToFetchFrom.length; index++) {
                        // Job data array
                        const newsData = [];
                        // Opening new page
                        const page = await browser.newPage();
                        // Going to given URL
                        await page.goto(urlToFetchFrom[index].link, {
                            waitUntil: "networkidle2",
                        });
                        // Wait for selector
                        page.waitForSelector(".latest-head").then(async() => {
                            // Extracting news link
                            const newsLinks = await page.evaluate(() =>
                                Array.from(
                                    document.querySelectorAll(".latest-head"),
                                    (element) => element.firstChild.href
                                )
                            );
                            // Extracting headlines
                            const headline = await page.evaluate(() =>
                                Array.from(
                                    document.querySelectorAll(".latest-head"),
                                    (element) => element.firstChild.textContent
                                )
                            );
                            // Extracting summary
                            const summary = await page.evaluate(() =>
                                Array.from(
                                    document.querySelectorAll(".latest-summary"),
                                    (element) => element.textContent
                                )
                            );
                            // Putting all data into news data array
                            await (async() => {
                                for (let i = 0; i < newsLinks.length; i++) {
                                    newsData.push({
                                        category: urlToFetchFrom[index].category,
                                        link: newsLinks[i],
                                        headline: headline[i],
                                        summary: summary[i],
                                    });
                                }
                                // Closing page
                                page.close();
                                // Putting newsData allnews
                                allNews.push(newsData);
                                if (index == urlToFetchFrom.length - 1) {
                                    page.close();
                                    // Resolving the promise
                                    resolve(newsData);
                                }
                            })();
                        });
                    }
                }).catch((e) => {
                    throw e;
                });
                // Sending news to client
                await new Promise(async(resolve, reject) => {
                    // // Closing browser
                    await browser.close();
                    // Resolving the promise
                    resolve(
                        res.send({
                            status: 200,
                            totalNews: allNews.length,
                            news: allNews,
                        })
                    );
                }).catch((e) => {
                    throw e;
                });
            } catch (e) {
                browser.close();
                // Sending news to client
                res.send({
                    status: 204,
                    work: "Incompelete",
                });
            }
        }
    });
};
// This controller send data to client
const getNews = async(req, res) => {
    // Calling get data service
    const data = await service.getNews();
    if (data) {
        res.send({
            status: 200,
            news: data,
        });
    }
};
// Exporting functions
module.exports = { sendHTML, createNews, getNews };