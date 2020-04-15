
const ioInit = require('socket.io');
const redis = require('socket.io-redis');
const socketioAuth = require('socketio-auth');
const jwt = require('jsonwebtoken');
const { jwtOptions } = require('./passport-auth');
const { server } = require('./express-app');

const io = ioInit(server);

const serverName = process.env.NAME || 'Unknown';

const socketAuthenticate = (client, data, callback) => {
  console.log(data);
  const { token } = data;
  try {
    const user = jwt.verify(token, jwtOptions.secretOrKey);
    // console.log(user && user.username)
    // callback(null, user && user.username);
    if(user && user.username) {
      console.log({user});
      // we store the username in the socket session for this client
      client.username = user.username;
      callback(null, user.username);
    } else {
      callback(null, false);
    }
  } catch (error) {
    callback(error);
  }
};

const getConnectedClients = () => {
  return new Promise((resolve, reject) => {
    io.clients((error, clientIds) => {
      if(error) {
        reject(error);
      } else {
        resolve(clientIds);
      }
    });
  });
};

const getRandomArrayElement = anArray => anArray[Math.floor(Math.random() * anArray.length)];
const getRandomSoketId = async () => {
  const socketIds = await getConnectedClients();
  return getRandomArrayElement(socketIds);
}
const getRandomSoketIds = async amount => {
  const socketIds = await getConnectedClients();
  if(amount.length >= socketIds.length) {
    return socketIds;
  }
  const ids = [];
  let withotFound = socketIds.slice();
  let id;
  for (let index = 0; index < amount; index++) {
    id = getRandomArrayElement(withotFound);
    withotFound = withotFound.filter(item => item != id);
    ids.push(id)
  }
  return ids;
}
const handler = async socket => {
  socket.emit('my-name-is', serverName);
  clientIds = await getConnectedClients();
  console.log('connected clients: ', clientIds.length);

  // when the client emits 'new message', this listens and executes
  socket.on('new message', data => {
    // we tell the client to execute 'new message'
    console.log({
      username: socket.username,
      message: data
    });
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  socket.on('spin', async () => {
    console.log('spin');
    const randomSoketId = await getRandomSoketId();
    io.to(randomSoketId).emit('spin', {
      username: socket.username
    });
  });

  socket.on('wild', async wildAmount => {
    console.log('wild', wildAmount);
    const randomSoketIds = await getRandomSoketIds(wildAmount);
    console.log(randomSoketIds);
    randomSoketIds.forEach(randomSoketId => {
      io.to(randomSoketId).emit('wild', {
        username: socket.username
      });
    });
  });

  socket.on('blast', () => {
    console.log('blast');
    socket.broadcast.emit('blast', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    // echo globally that this client has left
    socket.broadcast.emit('user left', {
      username: socket.username,
      numUsers: Object.keys(io.sockets.sockets).length - 1
    });
  });
};

socketioAuth(io, { 
  authenticate: socketAuthenticate, 
  postAuthenticate: handler,
});

// set shared storage between instances
io.adapter(redis({
  host: 'redis',
  // host: 'localhost',
  port: 6379,
}));

module.exports = {
  handler,
}