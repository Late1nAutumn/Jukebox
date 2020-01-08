const express = require("express");
const bParser = require("body-parser");
const path = require("path");
const port = 3000;
const ctrl = require("./ctrl");
process.env.GOOGLE_APPLICATION_CREDENTIALS = './apikey/key.json';

const app = express();
app.use(bParser.json());
app.use(bParser.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "../client/dist")));
app.listen(port, () => {
  console.log("server online:" + port);
});

// app.get("/server/test", (req, res) => {
//   console.log("visited");
//   res.status(200).send(":" + port + " is watching you");
// });

app.post("/addlist/:name",ctrl.add);

app.get("/voice/:text", ctrl.voice);
app.get("/lists", ctrl.lists);
app.get("/list/:name", ctrl.list);