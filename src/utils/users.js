const users = [];

const addUser = ({ id, userName, room }) => {
  // Data cleaning
  userName = userName.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Data validation
  if (!userName || !room) {
    return {
      error: 'Username and room required',
    };
  }

  // Check user exists
  const existingUser = users.find((user) => {
    return user.userName === userName && user.room === room;
  });

  if (existingUser) {
    return { error: 'User already exists!' };
  }

  const user = { userName, room };
  users.push(user);
  return user;
};

// Remove user
const removeUser = (id) => {
  const index = users.find((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1);
  }
};
