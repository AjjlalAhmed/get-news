// Importing thing we need
const cron = require("node-cron");
const axios = require("axios");
const service = require("../service/apiService");
// Calling job
cron.schedule("*/4 * * * *", async() => {
    console.log("running a task every 4 minute");
    try {
        // Fetching jobs data
        const response = await axios.get(
            `${process.env.HOST}/api/createnews?token=${process.env.TOKEN}`
        );
        // Extracting news data
        const data = response.data;
        // Creating empty array
        const value = [];
        if (data.status == 200) {
            const news = data.news;
            // Putting news into array
            for (let i = 0; i < news.length; i++) {
                news[i].forEach((item) => {
                    value.push([item.category, item.link, item.headline, item.summary]);
                });
            }
            // Calling delete table service
            await service.deleteTable().catch((err) => {
                throw err;
            });
            // Calling create table service
            await service.creatTable().catch((err) => {
                throw err;
            });
            // Calling insert data into table service
            await service.insertData(value).catch((err) => {
                throw err;
            });
        }
    } catch (error) {
        console.error(error);
    }
});