console.log("Hello World");

require('dotenv').config();
const express = require("express");
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const Person = require('./models/person');

app.use(cors());
app.use(express.static('build'));
app.use(express.json());

// Middleware for logging incoming requests with body data
morgan.token('body', req => {
  return JSON.stringify(req.body);
});
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};
app.use(requestLogger);

// Route to fetch all persons
app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

// Route to fetch a specific person by ID
app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

// Route to delete a person by ID
app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// Route to update a person's information by ID
app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  const { name, number } = request.body;
  const updatedPerson = { name, number };

  Person.findByIdAndUpdate(id, updatedPerson, { new: true })
    .then((result) => {
      response.json(result);
    })
    .catch((error) => next(error));
});

// Route to create a new person
app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;
  if (!name || !number) {
    return response.status(400).json({ error: 'content missing' });
  }

  Person.findOne({ name: name })
    .then(existingPerson => {
      if (existingPerson) {
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

// Middleware for handling unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

// Middleware for error handling
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
