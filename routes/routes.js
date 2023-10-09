const express = require('express');
const authcontrol = require('../controller/authcontroll');
const routes = express();
const upload = require('../middleware/fileupl');

// login page
routes.use(express.json());


routes.get('/auth/user/login', authcontrol.login_get);
routes.post('/auth/user/login', authcontrol.login_post);
routes.get('/auth/user/signup', authcontrol.signup_get);
routes.post('/auth/user/signup', authcontrol.signup_post);

// admin page
// const upload = multer({
//     dest: '../uploads/'
// });

// const uploadMiddleware = async (req, res, next) => {
//     try {
//         const uploadedImage = await upload.single('item_img')(req, res);

//         if (uploadedImage) {
//             req.body.img = uploadedImage.path;
//         }

//         next();
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('Error uploading image');
//     }
// };

// const upload = multer({
//     storage: multer.diskStorage({
//         destination: function (req, file, cb) {
//             // console.log(req.body);
//             const path = path.join(__dirname, '../uploads', req.body.item_name);
//             //recursive : true means if folder already exist they does not throw err if if false it throw err when folder already exist
//             try {
//                 fs.mkdirSync(path, { recursive: true });
//             } catch (err) {
//                 if (err.code !== 'EEXIST') {
//                     return cb(err);
//                 }
//             }
//             // fs.mkdirSync(path, { recursive: true });
//             // cb(null, '../uploads')
//         },
//         filename: (req, file, cb) => {
//             const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
//             cb(null, `${uniqueSuffix}-${file.originalname}`);
//         }
//     })
// }).array('item_img', 5);

routes.post('/auth/admin/addproduct', upload, authcontrol.addProduct);
// file upload
// routes.post('/auth/admin/fileupload', , authcontrol.fileUpload);



// home page

routes.get('/', authcontrol.homepage_get);

module.exports = routes;