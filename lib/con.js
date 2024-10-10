const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  database: "rc40_todo",
  user: "arya",
  password: "arya",
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client\n", err);
  }
});

module.exports = pool;

