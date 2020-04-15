const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const http = require('http');
const jwt = require('jsonwebtoken');
const db = require('../models');
const { passport, jwtOptions } = require('./passport-auth');

const port = process.env.PORT || 3000;
const serverName = process.env.NAME || 'Unknown';

app.use(cors());
// parse application/json
app.use(bodyParser.json());
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// initialize passport with express
app.use(passport.initialize());

const server = http.createServer(app);

// Routing
app.use(express.static(__dirname + '/../public'));

// register route
app.post('/register', async (req, res, next) => {
  
  const { username, password, confirmPassword } = req.body;
  // cjeck if confirm password match password
  const user = await db.User.create({ userName: username, password });
  const payload = { id: user.id, username: user.userName };
  const token = jwt.sign(payload, jwtOptions.secretOrKey);
  res.json({ msg: 'ok', token: token });
});

//login route
app.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  if (username && password) {
    const user = await db.User.findOne({
      where: { userName: username },
    });
    if (!user) {
      res.status(401).json({ message: 'No such user found' });
    }
    if (user.validPassword(password)) {
      const payload = { id: user.id, username: user.userName };
      const token = jwt.sign(payload, jwtOptions.secretOrKey);
      res.json({ msg: 'ok', token: token });
    } else {
      res.status(401).json({ msg: 'Password is incorrect' });
    }
  } else {
    res.status(400).json({ msg: 'username and password are required' });
  }
});

server.listen(port, () => {
  console.log('Server listening at port %d', port);
  console.log('Hello, I\'m %s, how can I help?', serverName);
});

module.exports = {
  server,
  app,
};
