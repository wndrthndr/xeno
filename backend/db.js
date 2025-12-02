const net = require("net");
const tls = require("tls");
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },

  // 🔥 Force IPv4 at socket level
  connectionFactory: () => {
    const socket = net.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      family: 4   // force IPv4
    });

    return tls.connect({ socket, rejectUnauthorized: false });
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};
