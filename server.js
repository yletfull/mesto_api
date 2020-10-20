/* eslint-disable no-console */
const mongoose = require('mongoose');
const path = require('path');

const { PORT = 3001 } = process.env;
const { app } = require(path.join(__dirname, './app'));

const mongooseConnection = () => {
  const servUrl = 'mongodb://localhost:27017/mestoProjectDB';
  mongoose.connect(servUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  mongoose.connection.on('connected', () => {
    console.log(`Succesfully connected to MongoDB Database "${servUrl}"`);
  });
  mongoose.connection.on('error', (err) => {
    console.error(`Database "${servUrl}" Connection error: ${err}`);
  });
};

mongooseConnection();
app.listen(PORT, () => {});
