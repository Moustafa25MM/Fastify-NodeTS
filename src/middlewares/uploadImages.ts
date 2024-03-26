import path from 'path';

const cloudinary = require('cloudinary');
const multer = require('fastify-multer');

const cloudi = cloudinary.v2;
cloudi.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const randomNumber = Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
const maxSize = 1024 * 1024 * 2;

const productStorage = multer.diskStorage({
    destination: (req:any, file:any, cb:any) => {
        const uploadPath = path.join(__dirname, '../..', 'uploadedImages', 'products');
        cb(null, uploadPath);
    },
    filename: (req:any, file:any, cb:any) => {
      cb(null, Date.now() + randomNumber.toString() + file.originalname);
    },
  });

  const categoryStorage = multer.diskStorage({
    destination: (req:any, file:any, cb:any) => {
        const uploadPath = path.join(__dirname, '../..', 'uploadedImages', 'categories');
        cb(null, uploadPath);
    },
    filename: (req:any, file:any, cb:any) => {
      cb(null, Date.now() + randomNumber.toString() + file.originalname);
    },
  });

  function fileFilter(req: any, file: any, cb: any) {
    if (file.mimetype === 'image/png'
        || file.mimetype === 'image/jpg'
        || file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }

  const productUpload = multer({ fileFilter, storage: productStorage, limits: { fileSize: maxSize } });
  const categoryUpload = multer({ fileFilter, storage: categoryStorage, limits: { fileSize: maxSize } });

  export {
    productUpload,
    categoryUpload,
    cloudi
  };