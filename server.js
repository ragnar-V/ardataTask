require('dotenv').config();
const app = require('./app');
const pool = require('./src/config/db');

// test database connection
pool.connect();
pool.on('connect', ()=>{
    console.log('connected to the database');
   // console.log(__dirname);
});

app.listen(3000,()=>{
    console.log("server is running on port 3000");
    
})