const mongoose = require('mongoose');

if (process.argv.length<3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url =
  `mongodb+srv://luisandreiouano:${password}@cluster0.whuzxsu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery',false);

mongoose.connect(url);

const name = process.argv[3];
const number = process.argv[4];

const personSchema = new mongoose.Schema({
  "name": String,
  "number": String
})

const Person = mongoose.model('Person', personSchema);

