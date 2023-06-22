const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
app.use(cors());

let name;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/Database/Files')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const upload = multer({storage}).single('file');

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json(err)
        }
        return res.status(200).send(req.file)
    })
});

app.post('/name', (req, res) => {
    name = req.name;
    console.log(name)
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`App is running on ${PORT}`)
});