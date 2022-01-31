var express = require("express");
var router = express.Router();
var cassandra = require("cassandra-driver");

var client = new cassandra.Client({
  contactPoints: ["127.0.0.1"],
  localDataCenter: "datacenter1",
  keyspace: "wwii",
});
client.connect(function (err, result) {
  console.log("state: cassandra connected");
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
        res.render("state", {
          id: result.rows[0].id,
          name: result.rows[0].name,
          ruler: result.rows[0].ruler,
          year_joined: result.rows[0].year_joined,
        });
      }
    }
  );
});

var deleteState = "DELETE FROM wwii.states WHERE id = ?";

router.delete("/:id", function (req, res) {
  client.execute(
    deleteState,
    [req.params.id],
    { hints: ["int"] },
    function (err, result) {
      if (err) {
        res.status(404).send({ err });
      } else {
        res.json(result);
      }
    }
  );
});

module.exports = router;
