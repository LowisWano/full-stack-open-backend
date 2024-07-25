
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

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema);