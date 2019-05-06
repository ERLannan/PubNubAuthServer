if (process.env.NODE_ENV === 'production') {
  console.log('loading prod keys');
  module.exports = require('./keys_prod');
} else {
  console.log('loading dev keys');
  module.exports = require('./keys_dev');
}
