const mongoose = require('mongoose')

const url = "mongodb+srv://madhu:madhu069@cluster0.eu4wlhv.mongodb.net/project"

const connectDb = async () => {
    await mongoose.connect(url)
}

module.exports = connectDb