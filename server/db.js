import mysql from "mysql2/promise";

const connection = await mysql.createConnection({ 
  host: process.env.HOST || 'localhost', 
  user: 'root', 
  port: process.env.PORT || 3307,
  password: 'password', 
  database: 'unque' 
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});


export default connection;