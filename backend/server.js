const express = require("express");
const hourlyData = require("./data/hourlydata");
const cors = require("cors");
let battery = require("./data/battery");

const app = express();
app.use(cors());

console.log({ battery });

app.get("/battery", (req, res) => {
  battery = battery - 2;
  console.log(battery);
  res.send({battery});
});
app.get("/hourlyData", (req, res) => {
  console.log("data requested");

  res.send({ hourlyData });
});

app.get("/", (req, res) => {
  console.log("running");

  res.send("test");
});

app.listen(5000, () => {
  console.log("server running");
});
