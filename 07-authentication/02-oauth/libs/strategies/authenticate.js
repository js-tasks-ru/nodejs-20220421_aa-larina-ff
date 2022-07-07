const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) done(null, false, 'Не указан email');

  const user = await User.findOne({email: email});
  if (user) {
    done(null, user);
  } else {
    try {
      const newUser = await User.create({
        email: email,
        displayName: email.split('@')[0],
      });
      done(null, newUser);
    } catch (err) {
      if (err.name !== 'ValidationError') throw err;
      done(err, false, err.errors.email.message);
    }
  }
};
