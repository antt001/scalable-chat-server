const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'someSecret',
};

const strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
  console.log('payload received', jwt_payload);
  let user = getUser({ id: jwt_payload.id });

  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

// use the strategy
passport.use(strategy);

module.exports = {
  passport,
  jwtOptions,
};
