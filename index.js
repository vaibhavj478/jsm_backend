const express = require("express");
const connDB  = require("./database/connectDB");
const cors = require("cors");

const path = require('path');

const fs = require('fs');
const dotenv = require('dotenv')



const catRoute = require("./routes/cat.routes");
const prodRoute = require("./routes/product.routes");

const imageRoute = require("./routes/imageServices.routes");
const contactRoute = require("./routes/contact.routes");

// const moment = require("moment");


const app = express();
dotenv.config()

app.use(express.json());
app.use(cors());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.get("/", (req, res) => {
    res.send({
        project: "Mansa",
        message: "Hello app is started"
    })
})

// console.log( typeof moment().utcOffset("+05:30").format())

app.use("/api-v1",  contactRoute );
app.use("/api-v1",  imageRoute );
app.use("/api-v1", catRoute);
app.use("/api-v1", prodRoute);
// app.use("/api-v1", userRoute);
// app.use("/api-v1", billRoute);


const PORT = process.env.PORT;

app.listen(PORT, async () => {
    try {
        await connDB()
        console.log(`http://localhost:${PORT}`)   
    } catch (err) {
        console.log(err.message)
    }
})