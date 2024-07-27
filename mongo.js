const mongoose = require('mongoose')
mongoose.set('strictQuery',false)

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}
const [, , password, new_name, new_number] = process.argv

mongoose.connect(`mongodb+srv://luisandreiouano:${password}@cluster0.whuzxsu.mongodb.net/personApp?retryWrites=true&w=majority&appName=Cluster0`)

const personSchema = new mongoose.Schema({
  'name': String,
  'number': String
})

const Person = mongoose.model('Person', personSchema)

if(!new_name && !new_number){
  Person.find({})
    .then(result => {
      console.log('phonebook:')
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      processEnd()
    })
}else{
  const person = new Person({
    name: new_name,
    number: new_number,
  })
  person.save().then(result => {
    console.log('note saved!', result)
    processEnd()
  })
}

function processEnd(){
  mongoose.connection.close()
  process.exit()
}