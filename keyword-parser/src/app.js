const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const router = require("./routes");

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use("/", router);

const listener = app.listen(process.env.PORT, () =>
  console.log("Keyword Parser is listening on port " + listener.address().port)
);
