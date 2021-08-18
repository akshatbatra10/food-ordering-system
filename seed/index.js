const mongoose = require('mongoose');

const dbUrl = process.env.DB_CONNECTION_URL;

mongoose.connect('mongodb+srv://AkshatBatra:g0t0@he11@cluster0.gia1c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Database connected');
});