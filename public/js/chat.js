const socket = io();

// Elements
const $messageForm = document.querySelector('#messageForm');
const $messaageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

// Template
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector(
  '#location-message-template',
).innerHTML;

// Options
const { userName, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on('message', (message) => {
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a'),
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('location', (message) => {
  console.log(message);
  const html = Mustache.render(locationMessageTemplate, {
    url: message.url,
    createdAt: moment(message.createdAt).format('h:mm a'),
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  $messageFormButton.setAttribute('disabled', 'disabled');

  const message = e.target.elements.message.value;

  socket.emit('sendMessage', message, (error) => {
    $messageFormButton.removeAttribute('disabled');
    $messaageFormInput.value = '';
    $messaageFormInput.focus();

    // Acknowledgement
    if (error) {
      return console.log(error);
    }

    console.log('Message sent');
  });
});

$sendLocationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Location not supported');
  }

  $sendLocationButton.setAttribute('disabled', 'disabled');

  let location = {};

  navigator.geolocation.getCurrentPosition((position) => {
    location.longitude = position.coords.longitude;
    location.latitude = position.coords.latitude;

    // Acknowledgement
    socket.emit('sendLocation', location, () => {
      $sendLocationButton.removeAttribute('disabled');
      console.log('Location Shared');
    });
  });
});

socket.emit('join', { userName, room });
