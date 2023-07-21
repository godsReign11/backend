const express = require('express');
const app = express();
require('dotenv').config();
var multer = require("multer");
var upload = multer();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dashRoutes = require('./routes/dashboard/routes');
const appRoutes = require('./routes/app/appRoutes');

// const config = require('config');

const PORT = 8080;
const cors = require('cors');
const formData = require('express-form-data');

app.use(cors());
app.use(express.static(`${process.cwd()}/images`));
app.use(express.json())
app.use('/images', express.static(`${process.cwd()}/images`));
app.use(bodyParser.json({ limit: '50mb', }));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
}));
// app.use(formData.parse());
app.use(express.static('public'));

mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.connect('mongodb+srv://tech:6kzXMli9DKC0MnHs@cluster0.9tochqx.mongodb.net/GRTech', mongoOptions).then(() => {
    console.log('mongoDb connected!');
    app.emit('mongoConnected');
})
    .catch((err) => {
        console.log('Mongo Error', err);
    });


app.use('/api/auth', dashRoutes);
app.use('/api/auth', appRoutes);


// Listen on `port` and 0.0.0.0
app.listen(PORT, "0.0.0.0", function () {
    console.log(`Server is running on port ${PORT}`)
});
