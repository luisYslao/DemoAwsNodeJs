'use strict';
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://demoMongo:Casa123@cluster0.trobz.mongodb.net/swapi?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}); 
var personaSchemaJSON = {
  nombre: String,
  genero: String,
  altura: Number,
};
var Persona =  mongoose.model('Personas', new mongoose.Schema(personaSchemaJSON));

module.exports.persona_post = async (event, context, callback) => {
  const axios = require('axios');

  await axios.get('https://swapi.py4e.com/api/people')
    .then(function (response) {
      Persona.deleteMany({}, callback);
      
      Persona.insertMany(response.data.results.map(function(item) {
        return new Persona({
          nombre: item.name, 
          genero: item.gender,
          altura: item.height
        }); 
      }), callback);

    })
    .catch(function (error) {
      console.log(error);
    });

  const response = {
    statusCode: 200,
    body: true
  };

  callback(null, response);
};

module.exports.persona_get = async (event, context, callback) => {

  var data = await Persona.find({}, callback);

  const response = {
    statusCode: 200,
    body: data,
  };

  callback(null, response);
};