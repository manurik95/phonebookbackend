const express = require('express');
const http = require("http")
const morgan = require("morgan")
const cors = require("cors")

const app = express()


app.use(cors({
    origin: "http://localhost:3000"
}))

app.use(express.json())


morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms :body '));


let phonebookEntries = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    { 
        "id": 5,
        "name": "Manuel Gasenrik", 
        "number": "39-23-64123123"
      }
];



app.get("/info" ,(req, res) => {
    const currentTime = new Date()
    const htmlres = `<p> Phonebook has info for ${phonebookEntries.length} people</p>
                     <p> ${currentTime} </p>`
    res.send(htmlres)
})


app.get("/api/persons", (req,res) => {
    res.json(phonebookEntries)
})


app.get(`/api/persons/:id`, (req,res) => {
    const id = Number(req.params.id)
    const contact = phonebookEntries.find(p => p.id ===id)

    if (contact) {
        res.json(contact)
    } else  {
        res.status(404).end()
    }
})


app.delete(`/api/persons/:id`, (req,res) => {
    const id = Number(req.params.id)
    phonebookEntries = phonebookEntries.filter(p => p.id !== id)
    
    // returning phonebookEntries for testing purposes
    res.json(phonebookEntries)
    res.status(204).end()
})

app.post("/api/persons", (req, res) => {
    const contact = req.body
    const nameExists = phonebookEntries.some(p => p.name === contact.name);

    if (nameExists) {
        return res.status(400).json({error: "Name must be unique"})
    }
    if (!contact.name) {
        return res.status(400).json({error: "Name is missing"})
    }
    if (!contact.number) {
        return res.status(400).json({error: "Number is missing"})
    }
    
    const newId = Math.floor(Math.random() *1000000)
    contact.id = newId

    phonebookEntries = phonebookEntries.concat(contact)
    res.json(phonebookEntries)
})


const PORT =  process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
