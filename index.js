require('dotenv').config()

// Dependencies
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

// Token
morgan.token('body', request => JSON.stringify(request.body));

// Middlewares
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors());
app.use(express.static('dist'))

// Import Model
const Person = require('./models/person')

// route handlers
app.get('/info', (request, response)=>{
  const date = new Date();
  Person.find({}).then(persons=>{
    response.send(`
      <p>Phonebook has info for ${persons.length} people</p> 
      <p>${date}</p>
  `);
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons=>{
    response.json(persons);
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person=>{
      if(person){
        response.json(person);
      }else{
        response.status(404).end()
      }
  })
  .catch(error=>{
    next(error);
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
  .then(result=>{
    response.status(204).end()
  })
  .catch(error=>next(error))
})

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if(!body){
      return response.status(400).json({
          error: 'content missing'
      })
  }
  const person = new Person({
      name: body.name,
      number: body.number
  })

  person.save().then(savedEntry=>{
    response.json(savedEntry)
  })
})

app.put('/api/persons/:id', (request, response, next)=>{
  const person = {
    name: request.body.name,
    number: request.body.number
  }
  console.log(person);
  Person.findByIdAndUpdate(request.params.id, person, { new:true })
  .then(updatedNote=>{
    response.json(updatedNote)
  })
  .catch(error=>next(error))
})

// invalid endpoint handler middleware
app.use((request, response)=>{
  response.status(404).send({ error: 'unknown endpoint' })
})

// invalid ID handler middleware
app.use((error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  next(error)
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})