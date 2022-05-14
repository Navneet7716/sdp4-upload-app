require('dotenv').config({path: __dirname + '/config.env'});
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const uploadRouter = require("./routes/uploadRoute");


const app = express();

app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by");


const PORT = 4001;

app.get("/test", (req, res) => {
    res.json({
        "status" : "running 🟢"
    })
})

app.use("/convert", uploadRouter);


app.listen(PORT, () => {
    console.log(`App Running on ${PORT}`)
})