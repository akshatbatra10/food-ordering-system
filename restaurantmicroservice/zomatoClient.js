if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
var zomatoApi = require("zomato-api");

const client = zomatoApi({
  userKey: process.env.ZOMATO_API_KEY,
});

module.exports = client;
