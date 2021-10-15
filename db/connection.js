// Impoting thing we need
const sqlLite3 = require("sqlite3").verbose();
// Connecting to db
const db = new sqlLite3.Database("./db/news.db");
// Exproting db
module.exports = db;