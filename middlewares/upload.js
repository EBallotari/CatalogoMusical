const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/artistasEDiscos/');  
  },
  
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);  
    const filename = Date.now() + ext;  
    cb(null, filename);  
  }
});

const upload = multer({
  storage: storage,  

  limits: {
    fileSize: 5 * 1024 * 1024  
  },

  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;  
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase()); 
    const mimetype = fileTypes.test(file.mimetype);  

    if (extname && mimetype) {
      return cb(null, true);  
    } else {

      cb(new Error('Formato de arquivo inválido. Apenas imagens JPEG, PNG ou GIF são permitidas.'));
    }
  }
});

module.exports = upload;  