var express = require("express");
var router = express.Router();
var cassandra = require("cassandra-driver");
var idd;

var client = new cassandra.Client({
  contactPoints: ["127.0.0.1"],
  localDataCenter: "datacenter1",
  keyspace: "wwii",
});
client.connect(function (err, result) {
  console.log("editState: cassandra connected");
});

var getStateById = "SELECT * FROM wwii.states WHERE id = ?";

/* GET users listing. */
router.get("/:id", function (req, res, next) {
  client.execute(
    getStateById,
    [req.params.id],
    { hints: ["int"] },
    function (err, result) {
      if (err) {
        res.status(404).send(err);
      } else {
        res.render("editState", {
          id: result.rows[0].id,
          name: result.rows[0].name,
          ruler: result.rows[0].ruler,
          year_joined: result.rows[0].year_joined,
        });
      }
    }
  );
});

// POST Edited State
router.post("/", function (req, res) {
  var upsertState =
    "INSERT INTO wwii.states(id, name, ruler, year_joined) VALUES (?, ?, ?, ?)";
  client.execute(
    upsertState,
    [req.body.id, req.body.name, req.body.ruler, req.body.year_joined],
    { hints: ["int", "text", "text", "int"] },
    function (err, result) {
      if (err) {
        res.status(404).send({ err });
      } else {
        console.log("State Edited");
        res.redirect("/");
      }
    }
  );
});

module.exports = router;
