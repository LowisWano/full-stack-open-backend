const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors());
app.use(express.static('dist'))
require('dotenv').config()


const mongoose = require('mongoose');
mongoose.set('strictQuery',false);

// connect to MongoDB
async function connectDatabase(){
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Succesfully connected to MongoDB');
  } catch(error){
    console.log('Error connected to MongoDB:', error);
  }
}
connectDatabase();

// schema and Model definition
const personSchema = new mongoose.Schema({
  "name": String,
  "number": String
})
const Person = mongoose.model('Person', personSchema);

// routes
app.get('/info', (request, response)=>{
    const date = new Date();
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p> 
        <p>${date}</p>
    `);
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons=>{
      response.json(persons);
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find(person => person.id === id);

    person ? response.json(person): response.status(404).end();    
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateID = () => {
    return String(Math.floor(Math.random() * 10000000)) 
}

morgan.token('body', request => JSON.stringify(request.body));

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if(!body){
      return response.status(400).json({
          error: 'content missing'
      })
  }

  if(persons.find((person) => person.name === body.name)){
      return response.status(409).json({
          error: 'name must be unique'
      })
  }

  const person = {
      id: generateID(),
      name: body.name,
      number: body.number
  }

  persons = persons.concat(person);
  response.json(person);
})

// server initialization
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})