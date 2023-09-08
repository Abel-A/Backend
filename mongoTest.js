const mongoose = require('mongoose');

if (process.argv.length == 3) {
  const password = process.argv[2];
  const url = `mongodb+srv://aasrese:${password}@cluster0.nbe7tk2.mongodb.net/?retryWrites=true&w=majority`;

  mongoose.set('strictQuery', false);
  mongoose.connect(url);

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  });

  const Person = mongoose.model('Person', personSchema);

  Person.find({}).then((result) => {
    console.log('phonebook:');
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length == 5) {
  const password = process.argv[2];
  const url = `mongodb+srv://aasrese:${password}@cluster0.nbe7tk2.mongodb.net/?retryWrites=true&w=majority`;
  const personName = process.argv[3];
  const phoneNumber = process.argv[4];

  mongoose.set('strictQuery', false);
  mongoose.connect(url);

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  });

  const Person = mongoose.model('Person', personSchema);
  const person = new Person({
    name: `${personName}`,
    number: `${phoneNumber}`,
  });

  person.save().then((result) => {
    console.log(`added ${personName} number ${phoneNumber} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log('incorrect input');
  process.exit(1);
}
