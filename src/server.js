const express = require('express')
const multer = require('multer')
const cors = require('cors')

const app = express()

app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({storage}).single('file')

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err){
      return res.status(500).json(err)
    }
    return res.status(200).send(req.file)
  })
})

const PORT = 3006
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})