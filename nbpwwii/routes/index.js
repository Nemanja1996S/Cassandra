var express = require("express");
var router = express.Router();
var cassandra = require("cassandra-driver");

var client = new cassandra.Client({
  contactPoints: ["127.0.0.1"],
  localDataCenter: "datacenter1",
  keyspace: "wwii",
});
client.connect(function (err, result) {
  console.log("index: cassandra connected");
});

var getAllStates = "SELECT * FROM wwii.states";
/* GET home page. */
router.get("/", function (req, res, next) {
  client.execute(getAllStates, [], function (err, result) {
    if (err) {
      res.status(404).send(err);
    } else {
      res.render("index", {
        states: result.rows,
      });
    }
  });
});

module.exports = router;
