const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');
let mysql = require('mysql');
const {json} = require("express");
const {element} = require("protractor");

const io = new Server(http, {
  cors: {
    // addresse du client qu'on veut autoriser
    origin: "http://localhost:8100"
  }
});

//Create mysql connection
const dbConnect = mysql.createConnection(
  {
    host : "localhost",
    user : "myUser",
    password : "momota007009",
    database : "plasi_naka",
    multipleStatements : true
  }
);
dbConnect.connect((error) => {
  if (error) {
    throw error;
    console.log('Database Connection failed', error);
    return;
  }
})
io.on('connection', (socket) => {
  socket.on('getLignes', (req) => {
    let querys = 'SELECT * FROM ligne';
    dbConnect.query(querys, (err, res ) => {
      if (err) {
        console.log('Error', err.code);
        // socket.emit('Error', err.code);
      } else {
        const data = Object.values(JSON.parse(JSON.stringify(res)));
        io.emit('resLignes', {data: data});
        console.log('>>>> ', data);
      }
    })
  })

  socket.on('getBus', (req) => {

    let querys = 'SELECT * FROM bus';
    dbConnect.query(querys, (err, res ) => {
      if (err) {
        console.log('Error', err.code);
        // socket.emit('Error', err.code);
      } else {
        const data = Object.values(JSON.parse(JSON.stringify(res)));
        io.emit('resBus', {data: data});
        console.log('>>>> ', data);
      }
    })
  });

  socket.on('getReserver', (req) => {

    let querys = 'SELECT * FROM reserver';
    dbConnect.query(querys, (err, res ) => {
      if (err) {
        console.log('Error', err.code);
        // socket.emit('Error', err.code);
      } else {
        const data = Object.values(JSON.parse(JSON.stringify(res)));
        io.emit('resReserver', {data: data});
        console.log('>>>> ', data);
      }
    })
  });

  socket.on('getVoyageur', (req) => {

    let querys = 'SELECT * FROM voyageur';
    dbConnect.query(querys, (err, res ) => {
      if (err) {
        console.log('Error', err.code);
      } else {
        const data = Object.values(JSON.parse(JSON.stringify(res)));
        io.emit('resVoyageur', {data: data});
        console.log('>>>> ', data);
      }
    })
  });
});

let port = process.env.PORT || 3001;

http.listen(port, function(){
  console.log('listening in http://localhost:' + port);
});
