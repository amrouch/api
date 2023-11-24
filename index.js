const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const ProductRoutes = require('./routes/ProductRoutes');
const categoryRoute = require('./routes/CategoryRoutes');
const userRoute = require('./routes/UserRoutes');
const authRoute = require('./routes/AuthRoutes');
const cookieParser = require('cookie-parser');

const app = express();
dotenv.config();

require('./db/db');

app.use(cookieParser());
app.use(express.json());
app.use(cors());


app.use(function (err, req, res, next) {
    res.status(422).send({ error: err.message });
});

app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/category", categoryRoute)
app.use("/api/products", ProductRoutes)

app.listen(process.env.port || 3000, function () {
    console.log('now listening for requests')
});