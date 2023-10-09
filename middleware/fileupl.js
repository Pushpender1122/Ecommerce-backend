const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        try {
            // console.log(req.body);
            const itemPath = path.join('./uploads', req.body.item_name);
            // req.file.path = itemPath;
            // console.log(req.file.path);
            req.img = itemPath;
            // console.log(itemPath);

            fs.mkdirSync(itemPath, { recursive: true });
            cb(null, itemPath);
        } catch (err) {
            console.error(err.message);
            cb(err);
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});



const upload = multer({ storage: storage }).array('item_img', 5);

module.exports = upload;
