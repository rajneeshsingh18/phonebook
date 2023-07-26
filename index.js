console.log("Hello World");

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const express = require("express");
const app = express();

// Middleware
const morgan = require('morgan');

const cors = require('cors')

app.use(cors())

app.use(express.static('build'))


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
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.use(express.json());
app.use(requestLogger);



// 3.1: Phonebook backend step1
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

// 3.2: Phonebook backend step2
app.get("/info", (request, response) => {
  const currentTime = new Date();

  response.send(
    `<h1>PhoneBook has info for 2 people</h1> <br/> <p>${currentTime}</p>`
  );
});

//3.3: Phonebook backend step3

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  console.log(id);

  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

// 3.4: Phonebook backend step4

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((newPerson) => newPerson.id !== id);
  response.status(204).end();
});

// 3.5: Phonebook backend step5



// Function to generate a unique id with a large range.
const generateUniqueId = () => {
  return Math.floor(Math.random() * 1000000);
};

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({
      error: "Name and number are required",
    });
  }

  //The some method checks if any element in the array matches the condition, while the map method will create a new array with true/false values based on the condition.
  if (persons.some((entry) => entry.name === name)) {
    return response.status(400).json({
      error: "Name already exists in the phonebook",
    });
  }

  const newPerson = {
    id: generateUniqueId(),
    name: name,
    number: number,
    date: new Date(),
  };

  persons = persons.concat(newPerson);
  console.log(name, number);
  response.json(newPerson);
});


const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
