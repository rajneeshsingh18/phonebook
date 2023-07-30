// 3.12: Command-line database

//npm install mongoose
const mongoose = require("mongoose");

if (process.argv.length !== 5 && process.argv.length < 3) {
  console.log("Give a <password, name ,number> as arugumnet");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

// connection to the database
const url = `mongodb+srv://rajneeshsinghdev6453:${password}@cluster0.bq82q6x.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

//defiening schema for a person

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
  date: { type: Date, default: Date.now },
});

const Person = mongoose.model("Person", personSchema);

if (name && number) {
  const person = new Person({
    name: `${name}`,
    number: `${number}`,
    date: new Date(),
  });

  person.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((result) => {
    console.log("PhoneBook Entries");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}
