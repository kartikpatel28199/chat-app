const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const req = require('express/lib/request');
const Filter = require('bad-words');
const {
  generateMessage,
  generateLocationMessage,
} = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, '../public');
const port = 3000;

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
  console.log('New Scoket connection established');

  socket.on('join', ({ userName, room }) => {
    socket.join(room);

    socket.emit('message', generateMessage('Welcome'));
    socket.broadcast
      .to(room)
      .emit('message', generateMessage(`${userName} has joined...!`));
  });

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback('Bad words not allowed');
    }

    io.emit('message', generateMessage(message));
    callback();
  });

  socket.on('sendLocation', (location, callback) => {
    io.emit('location', generateLocationMessage(location));
    callback();
  });

  socket.on('disconnect', () => {
    io.emit('message', generateMessage('A user has left!'));
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
