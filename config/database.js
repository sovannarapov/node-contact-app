const mongoose = require('mongoose');

const database = async () => {
  try {
    const dbConnect = await mongoose.connect(process.env.DB_CONNECTION);
    console.log(
      'Database Connected: ',
      dbConnect.connection.host,
      dbConnect.connection.name
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = database;
