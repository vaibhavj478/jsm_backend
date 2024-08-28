

const mongoose = require("mongoose");


const connDB = async () => {
    try {
        // Replace 'your_database_url' with your actual MongoDB connection string
        const dbUrl = 'mongodb+srv://vaibhav_j143:9414725512rubY.@cluster0.p53xw.mongodb.net/bhavesh?retryWrites=true&w=majority';
        await mongoose.connect(dbUrl, {
        });
        console.log('Connected to the database');
    } catch (error) {
        // console.log(error.message);
        console.log("Database connection failed");
    }
}


module.exports = connDB