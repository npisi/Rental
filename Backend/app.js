require("dotenv").config();
const express = require("express");
const app = express();
const connectDb = require("./config/db");
const cookieParser = require('cookie-parser')

app.use(express.json());
app.use(cookieParser())

const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoute");
const propertyRoutes = require('./routes/propertyRoutes')
const bookingRoutes = require('./routes/bookingRoutes')

const port = 5000;



const cors = require('cors');
app.use(cors({ 
  origin: "http://localhost:5173",
  credentials: true 
}));

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use('/api',propertyRoutes)
app.use('/api',bookingRoutes)

connectDb()
  .then(() => {
    console.log("DataBase Connected Successfully");
    app.listen(port, (req, res) => {
      console.log("Server is Listening");
    });
  })
  .catch((err) => {
    console.log("Error : " + err.message);
  });
