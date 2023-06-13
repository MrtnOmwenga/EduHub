const students = require('./Database/Students').students
const express = require('express')
const app = express()

var cors = require('cors');
app.use(cors());

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/students', (request, response) => {
  response.json(students)
})

app.post('/api/students', (request, response) => {
    const student = request.body
    students.push(student)
    console.log(students)
    response.json(student)
  })

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
  })

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})