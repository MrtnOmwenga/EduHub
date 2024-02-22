const FileRoutes = require('express').Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/Files');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB limit
  },
  fileFilter: (req, file, cb) => {
    // Validate file types
    if (!file.originalname.match(/\.(pdf)$/)) {
      return cb(new Error('Only image and PDF files are allowed!'), false);
    }
    cb(null, true);
  }
}).single('file');

FileRoutes.post('/', (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.status(400).json({ message: 'File upload error', error: err });
    } else if (err) {
      // An unknown error occurred
      return res.status(500).json({ message: 'Internal server error', error: err });
    }
    return res.status(200).send(req.file);
  });
});

FileRoutes.get('/', (req, res) => {
  const filePath = req.query.fileName;
  if (!filePath) {
    return res.status(400).json({ message: 'File name is required!' });
  }
  // Sanitize file name to prevent directory traversal attacks
  const sanitizedFileName = path.basename(filePath);
  res.sendFile(path.join(__dirname, `/../public/Files/${sanitizedFileName}`));
});

module.exports = FileRoutes;
