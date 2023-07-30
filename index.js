console.log("Hello World");

require('dotenv').config();
const express = require("express");
const app = express();
const cors = require('cors');
const morgan = require('morgan');

// Importing the module
const Person = require('./models/person');

app.use(cors());
app.use(express.static('build'));
app.use(express.json()); // Add this line to parse JSON data

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

// 3.8*: Phonebook backend step8
morgan.token('body', req => {
  return JSON.stringify(req.body)
});

app.use(requestLogger);

// 3.1: Phonebook backend step1
// fetching all persons
app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

// Add the DELETE method
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;

  Person.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => {
      console.log(error);
      response.status(500).json({ error: 'Something went wrong' });
    });
});

// Add the PUT method
app.put('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const { name, number } = request.body;

  const updatedPerson = {
    name: name,
    number: number,
  };

  Person.findByIdAndUpdate(id, updatedPerson, { new: true })
    .then((result) => {
      response.json(result);
    })
    .catch((error) => {
      console.log(error);
      response.status(500).json({ error: 'Something went wrong' });
    });
});

app.post("/api/persons", (request, response) => {
  console.log(request.body);
  const { name, number } = request.body;
  if (name === undefined || number === undefined) {
    return response.status(400).json({ error: 'content missing' });
  }

  Person.find({ name: name }).then((result) => {
    if (result.length > 0) {
      return response.status(400).json({ error: "Name already exists in the phonebook" });
    }

    const person = new Person({
      name: name,
      number: number,
      date: new Date(),
    });

    person.save().then((savedPerson) => {
      response.json(savedPerson);
    });
  });
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// 3.2: Phonebook backend step2
// app.get("/info", (request, response) => {
//   const currentTime = new Date();

//   response.send(
//     `<h1>PhoneBook has info for 2 persons</h1> <br/> <p>${currentTime}</p>`
//   );
// });

//3.3: Phonebook backend step3

// app.get("/api/persons/:id", (request, response) => {
//   const id = Number(request.params.id);
//   console.log(id);

//   const person = persons.find((person) => person.id === id);

//   if (person) {
//     response.json(person);
//   } else {
//     response.status(404).end();
//   }
// });

// 3.4: Phonebook backend step4

// app.delete("/api/persons/:id", (request, response) => {
//   const id = Number(request.params.id);
//   persons = persons.filter((newPerson) => newPerson.id !== id);
//   response.status(204).end();
// });

// 3.5: Phonebook backend step5



// Function to generate a unique id with a large range.
// const generateUniqueId = () => {
//   return Math.floor(Math.random() * 1000000);
// };