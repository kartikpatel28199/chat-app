const socket = io();

socket.on('message', (message) => {
  console.log(message);
});

document.querySelector('#messageForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const message = e.target.elements.message.value;

  socket.emit('sendMessage', message);
});

document.querySelector('#send-location').addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Location not supported');
  }
  let location = {};
  navigator.geolocation.getCurrentPosition((position) => {
    location.longitude = position.coords.longitude;
    location.latitude = position.coords.latitude;
    socket.emit('sendLocation', location);
  });
});
