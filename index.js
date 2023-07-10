const express = require('express');
const app = express();
var multer = require("multer");
var upload = multer();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const userRoutes = require('./routes/userRoutes');
// const config = require('config');

const PORT = 8080;
const cors = require('cors');
const formData = require('express-form-data');

app.use(cors());
app.use(express.static(`${process.cwd()}/images`));
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

mongoose.connect('mongodb+srv://op24lark:2424lark@cluster0.mldekxu.mongodb.net/OP', mongoOptions).then(() => {
    console.log('mongoDb connected!');
    app.emit('mongoConnected');
})
    .catch((err) => {
        console.log('Mongo Error', err);
    });


// app.use('/api/auth', userRoutes);

// Error middleware
app.use((err, req, res, next) => {
    if (['production', 'staging'].includes(process.env.NODE_ENV)) {
        apm.captureError(err);
    }
    console.error('Error in app', err);
    const errorStatus = err.status || 500;
    const errorMessage = err.message || 'Something Went Wrong';
    res.status(errorStatus).json({
        success: false,
        message: errorMessage,
        status_code: errorStatus,
        debug: err.stack,
    });
});

// Listen on `port` and 0.0.0.0
app.listen(PORT, "0.0.0.0", function () {
    console.log(`Server is running on port ${PORT}`)
});
