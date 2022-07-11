const {animals} = require('./data/animals');
const {application} = require('express');
const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();

// parse incoming string or array data
app.use(express.urlencoded({extended:true}));
// parse incoming JSON data
app.use(express.json()); 

function filterByQuery(query, animalsArray){
    let personalityTraitsArray =[];
    let filteredResults = animalsArray;
    if(query.personalityTraitsArray){
        if(typeof query.personalityTraitsArray == 'string'){
            personalityTraitsArray = [query.personalityTraits];       
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        personalityTraitsArray.forEach(trait => {
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if(query.diet){
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if(query.species){
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if(query.name){
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults
}

function findById(id, animalsArray){
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

function createNewAnimal(body, animalsArray){
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({animals: animalsArray}, null, 2)
    );
    return animal;
}

function validateAnimal(animal){
    if(!animal.name || typeof animal.name !== 'string'){
        return false;
    }
    if(!animal.species || typeof animal.species !== 'string'){
        return false;
    }
    if(!animal.personalityTraits || !Array.isArray(animal.personalityTraits)){
        return false
    }
    return true;
}
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
      results = filterByQuery(req.query, results);
    }
    res.json(results);
  });

app.get('/api/animals/:id', (req,res) => {
    const results = findById(req.params.id, animals);
    if(result){
    res.json(results);
    } else {
        res.spend(404);
    }
});

app.post('/api/animals', (req,res) => {animal
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();
    // add animal to json file and animals array in this function
    

    if(!validateAnimal(req.body)){
        res.status(400).send('The animal is not properly formatted.');
    }else{
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }
});

app.listen(PORT, () =>{
    console.log(`API server how on port ${PORT}!`);
}); 