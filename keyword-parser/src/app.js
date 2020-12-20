const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const db = require("./database/cloudant/cloudant");
const router = require("./routes");

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use("/", router);

async function msj(url, path, numero, msg) {
  let response = await sendMsgWp(url, path, numero, msg);
  console.log(response);
}

var listener = app.listen(process.env.PORT, () =>
  console.log("Keyword Parser is listening on port " + listener.address().port)
);
