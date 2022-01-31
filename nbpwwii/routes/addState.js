var express = require("express");
var router = express.Router();
var cassandra = require("cassandra-driver");
var id = 3;

var client = new cassandra.Client({
  contactPoints: ["127.0.0.1"],
  localDataCenter: "datacenter1",
  keyspace: "wwii",
});
client.connect(function (err, result) {
  console.log("addState: cassandra connected");
});

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("addState");
});

// update/insert

// POST
router.post("/", function (req, res) {
  id++;
  console.log(id);
  var upsertState =
    "INSERT INTO wwii.states(id, name, ruler, year_joined) VALUES (?, ?, ?, ?)";
  client.execute(
    upsertState,
    [id, req.body.name, req.body.ruler, req.body.year_joined],
    { hints: ["int", "text", "text", "int"] },
    function (err, result) {
      if (err) {
        res.status(404).send({ err });
      } else {
        console.log("State Added");
        res.redirect("/");
      }
    }
  );
});

module.exports = router;
