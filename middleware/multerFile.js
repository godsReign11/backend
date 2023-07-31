var multer = require('multer');

// var storage = multer.memoryStorage();
// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname)
//     }
// });

// var upload = multer({
//     storage,
// });

var storage = multer.memoryStorage();

var upload = multer({
    storage,
});

module.exports = upload;


module.exports ={upload};