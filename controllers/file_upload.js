const FileRoutes = require('express').Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/Database/Files');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }).single('file');

FileRoutes.post('/', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file);
  });
});

FileRoutes.get('/', (req, res) => {
  const filePath = req.query.fileName;
  res.sendFile(path.join(__dirname, `/Files/${filePath}`));
});

module.exports = FileRoutes;
