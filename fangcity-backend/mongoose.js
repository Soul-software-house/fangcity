const mongoose = require('mongoose');

console.log('MONGO_URL', process.env.MONGO_URL);

// connect to database
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch((error) => {
  console.log('error', error);
});

mongoose.connection.on('connected', () => {
  console.log('Connected to database');
});

