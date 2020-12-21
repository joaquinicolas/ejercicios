"use strict";
const { response } = require("express");
const express = require("express");
const router = express.Router();
const isKeyword = require("../services");

router.route("/", () => {
  response.send("Keyboard parser OK");
});

router.get("/healthz", (req, res) => {
  res.send("ok");
});

router.post("/keyword-parser", async (request, response) => {
  console.log("Incoming msg : " + JSON.stringify(request.body));

  const country = request.body.pais;
  const message = request.body.payload;
  const cant = message.split(" ").length;
  const msg = message.split(" ")[0];

  console.log(cant);

  if (cant >= 1 && cant < 4) {
    console.log("el msg del request tiene 1 string");
    if (await isKeyword(country, msg, cant)) {
      console.log("es keyword '" + msg + "' = true");
      response.status(200).send(
        JSON.stringify({
          isKeyword: "true",
        })
      );
    } else {
      console.log("es keyword '" + msg + "' = false");
      response.status(200).send(
        JSON.stringify({
          isKeyword: "false",
        })
      );
    }
  } else {
    console.log("es keyword '" + msg + "' = false");
    response.status(200).send(
      JSON.stringify({
        isKeyword: "false",
      })
    );
  }
});
module.exports = router;
