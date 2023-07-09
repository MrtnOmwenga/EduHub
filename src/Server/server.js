const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/Database/Files');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }).single('file');

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file);
  });
});

app.get('/file', (req, res) => {
  const filePath = req.query.fileName;
  res.sendFile(path.join(__dirname, `/Files/${filePath}`));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});
