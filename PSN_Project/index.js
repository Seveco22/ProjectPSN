//Se importan los modulos necesarios
const express = require('express');
const bodyParser = require('body-parser');
const { readData, writeData } = require('./src/files.js');
const app = express();

//libreria extra
const PDF = require('pdfkit');

app.use(bodyParser.json());

//Página principal
app.get('/', (req, res) => {
    res.send("welcome to the Main page of my first API - Web 2");
});

//Obtención de articulos dentro del JSON
app.get('/psnetwork', (req, res) => {
    const data = readData("./src/PSN.json");
    res.json(data.PlaystationNetwork);
});

//Obtención de articulos mediante el ID
app.get('/psnetwork/:id', (req, res) => {
    const data = readData("./src/PSN.json");
    const id = parseInt(req.params.id);
    const psn = data.PlaystationNetwork.find((psn) => psn.id === id);
    res.json(psn);
});

//Agregar un nuevo elemento dentro del JSON
app.post('/psnetwork', (req, res) =>{
    const data = readData("./src/PSN.json");
    const body = req.body;
    const newPSN = {
      id: data.PlaystationNetwork.length + 1,
      ...body,
    };
    data.PlaystationNetwork.push(newPSN);
    writeData(data, "./src/PSN.json");
    res.json(newPSN);
  });

//Actualizar un elemento existente en el JSON
app.put('/psnetwork/:id', (req, res) =>{
    const data = readData("./src/PSN.json");
    const body = req.body;
    const id = parseInt(req.params.id);
    const psnIndex = data.PlaystationNetwork.findIndex((psn) => psn.id === id);
    data.PlaystationNetwork[psnIndex] = { 
      ...data.PlaystationNetwork[psnIndex],
      ...body,
    };
    writeData(data, "./src/PSN.json");
    res.json({ message: "PSN article updated correctly" });
  });

//Eliminar un elemento dentro del JSON
app.delete('/psnetwork/:id', (req, res) =>{
    const data = readData("./src/PSN.json");
    const id = parseInt(req.params.id);
    const psnIndex = data.PlaystationNetwork.findIndex((psn) => psn.id === id);
    data.PlaystationNetwork.splice(psnIndex, 1);
    writeData(data, "./src/PSN.json");
    res.json({ message: "PSN article deleted correctly" });
  });

//Generar PDF de manera programática
app.get('/generate-pdf/aunque-no-sea-conmigo', (req, res) => {
    const doc = new PDF();
   
    const texto = `
                A placer
                Puedes tomarte el tiempo necesario
                Que por mi parte yo estaré esperando
                El día en que te decidas a volver y ser feliz como antes fuimos
                Sé muy bien
                Que como yo estarás sufriendo a diario
                La soledad de dos amantes que al dejarse
                Están luchando cada quien por no encontrarse
                Y no es por eso
                Que haya dejado de quererte un solo día
                Estoy contigo aunque estés lejos de mi vida
                Por tu felicidad a costa de la mía
                Pero si ahora tienes
                Tan solo la mitad del gran amor que aún te tengo
                Puedes jurar que al que te tiene lo bendigo
                Quiero que seas feliz
                Aunque no sea conmigo
                Y no es por eso
                Que haya dejado de quererte un solo día
                Estoy contigo aunque estés lejos de mi vida
                Por tu felicidad a costa de la mía
                Pero si ahora tienes
                Tan solo la mitad del gran amor que aún te tengo
                Puedes jurar que al que te tiene lo bendigo
                Quiero que seas feliz
                Aunque no sea conmigo
                    `;
    doc.fontSize(20);
    doc.text(texto);

    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);
    doc.end();
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
