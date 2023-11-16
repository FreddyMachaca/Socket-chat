// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Array para almacenar los mensajes en memoria
const mensajes = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('Usuario conectado');

  socket.on('nuevoUsuario', (nombre) => {
    io.emit('mensaje', { nombre: 'Sistema', mensaje: `${nombre} se unió al chat` });
  });

  // Enviar los mensajes almacenados al usuario recién conectado
  socket.emit('mensajesAnteriores', mensajes);

  socket.on('mensaje', (data) => {
    console.log('Mensaje recibido:', data);
    mensajes.push(data);
    io.emit('mensaje', data);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
