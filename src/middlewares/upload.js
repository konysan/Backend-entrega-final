const multer = require('multer');

const getDestination = function (req, file, cb) {
    let folder = 'documents'; // Carpeta predeterminada para otros tipos de archivos

    if (file.fieldname === 'profileImage') {
        folder = 'profiles';
    } else if (file.fieldname === 'productImage') {
        folder = 'products';
    }

    cb(null, `src/uploads/${folder}/`);
};

const storage = multer.diskStorage({
    destination: getDestination,
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); 
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
