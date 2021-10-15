// Importing thing we need
const db = require("../db/connection");
// Services

// This service create new table
const creatTable = async() => {
    // Query
    const createTableQuery = `CREATE TABLE news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category VARCHAR (1000),
        link VARCHAR (1000),
        headline VARCHAR (1000),
        summary VARCHAR (5000)
    );`;
    // Executing query
    db.serialize(function() {
        db.run(createTableQuery, function(err) {
            if (err) throw err;
            return "Created";
        });
    });
};
// This service delete table
const deleteTable = async() => {
    // Query
    const deleteTableQuery = "DROP TABLE IF EXISTS news;";
    // Executing query
    db.serialize(function() {
        db.run(deleteTableQuery, function(err) {
            if (err) throw err;
            return "Deleted";
        });
    });
};
// This service insert data into table
const insertData = async(value) => {
    // Creating placeholders
    let placeHolders = value.map(() => "(?, ?, ?, ?)").join(", ");
    // Query
    let insertDataQuery =
        "INSERT INTO news (category, link, headline, summary) VALUES " +
        placeHolders;
    let jobs = [];
    value.forEach((arr) => {
        arr.forEach((item) => {
            jobs.push(item);
        });
    });
    // Executing query
    db.serialize(function() {
        db.run(insertDataQuery, jobs, function(err) {
            if (err) throw err;
            return "Added";
        });
    });
};

// This service get data from db
const getNews = async() => {
    const getDataQuery = "SELECT * FROM news";
    // Executing query
    const data = await new Promise((resolve, reject) => {
        db.all(getDataQuery, function(err, row) {
            if (err) reject(err);
            resolve(row);
        });
    });
    return data;
};
// Exporting services
module.exports = {
    creatTable,
    deleteTable,
    insertData,
    getNews,
};