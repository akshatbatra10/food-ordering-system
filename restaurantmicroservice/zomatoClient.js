if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const zomato = require("zomato")
const client = zomato.createClient({
  userKey: process.env.ZOMATO_API_KEY,
});

module.exports = client;