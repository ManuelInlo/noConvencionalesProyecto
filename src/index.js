
const express = require('express');
const axios = require('axios');
const responseTime = require('response-time');
const redis = require('redis');

const client = redis.createClient({
    //Se puede crear la conexion sin parametros
    host:'127.0.0.1',
    port: 6379
})

const app = express();

app.use(responseTime());

app.get("/character", async (req, res) => {
    const response = await axios.get("https://rickandmortyapi.com/api/character");
    
    client.set('variableGuardar', JSON.stringify(response.data), (err,reply) => {
        //console.log("Dentro del metodo");
        if(err) console.log(err);
        console.log(reply); 
        
        //res.json(response.data);
    });
    
   res.json(response.data);
});

console.log("Prueba de test");

app.listen(3000);
console.log('Server on port 3000');



//OTRO METODO CON PROMESAS EN REDIS
/*
const express = require('express');
const axios = require('axios');
const responseTime = require('response-time');
const redis = require('redis');
const { promisify } = require('util');

// Crear cliente de Redis
const client = redis.createClient({
    host: '127.0.0.1',
    port: 6379
});

client.on('error', (err) => {
    console.log('Redis error:', err);
});

// Promisificar los métodos de Redis
const setAsync = promisify(client.set).bind(client);

const app = express();

app.use(responseTime());

app.get("/character", async (req, res) => {
    try {
        const response = await axios.get("https://rickandmortyapi.com/api/character");
        
        // Guardar los datos en Redis
        await setAsync('variableGuardar', JSON.stringify(response.data));
        console.log("hello"); //mensaje de prueba de conexion
        res.json(response.data);
    } catch (error) {
        console.error('API request error:', error);
        res.status(500).send('Error fetching data from API');
    }
});

app.listen(3000, () => {
    console.log('Server on port 3000');
});
*/