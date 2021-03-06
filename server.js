// Importing thing we need
const express = require("express");
const cors = require("cors");
require("dotenv").config();
// Creating app
const app = express();
// Middleware
app.use(express.json());
app.use(cors());
// Routes
app.use("/", require("./routes/routes"));
//Cron jobs
require("./jobs/jobs");
// Creating port
const PORT = process.env.PORT || 5000;
// Listening to the server
app.listen(PORT, () => {
    console.log(`Server in running on PORT ${PORT}`);
});