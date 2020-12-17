const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const db = require('./database/cloudant/cloudant');  

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json())

// endpoints
app.get("/", function (request, response) {
    response.send('Keyword parser OK');
});

app.get("/healthz", function (request, response) {
    response.send('ok');
});

app.post("/keyword-parser", async function (request, response) {
    console.log('Incoming msg : ' + JSON.stringify(request.body));

    var country = request.body.pais;
    var message = request.body.payload;
    var cant = message.split(' ').length
    var msg = message.split(' ')[0];

    console.log(cant)

    if (cant >= 1 && cant < 4) {
        console.log("el msg del request tiene 1 string");
        if (await isKeyword(country, msg, cant)) {
            console.log("es keyword '" + msg + "' = true");
            response.status(200).send(JSON.stringify({
                isKeyword: "true"
            }));
        } else {
            console.log("es keyword '" + msg + "' = false");
            response.status(200).send(JSON.stringify({
                isKeyword: "false"
            }));
        }
    } else {
        console.log("es keyword '" + msg + "' = false");
        response.status(200).send(JSON.stringify({
            isKeyword: "false"
        }));
    }
});

// funcion que identifica si una palabra es keyword o sinonimo
async function isKeyword(country, word, cant) {
    let lista = await db.getKeywordList();
    console.log('isKeyword: ' + word);
    let largo = word.length

    if (largo != 3) {
        word = word.split(/\d+/g)[0]
    }
    
    if (isNaN(word)) {
        word = word.toUpperCase()
    }

    for (var i = 0; i < lista.length; i++) {
        if (country != lista[i].country) {
            continue;
        }
        if (word == lista[i].keyword && new Date(lista[i].ActiveUntil) > new Date()) {
            console.log(word + " es sinonimo de keyword")
            if (lista[i].ifAloneGoToBot == true && cant == 1 && word.length == largo) {
                console.log(word + " puede ir a chatbot directo")
                return false
            } else {
                return true;
            }
        }
        
        var aliases = lista[i].aliases;
        
        for (var j = 0; j < aliases.length; j++) {
        
            if (word == aliases[j] && new Date(lista[i].ActiveUntil) > new Date()) {
                console.log(word + "es sinonimo de alias")
                if (lista[i].ifAloneGoToBot == true && cant == 1 && word.split(/\d+/g).length == 1) {
                    console.log(word + " puede ir a chatbot directo")
                    return false
                } else {
                    return true;
                }
            }
        }
    }
    return false;
}

async function msj(url, path, numero, msg) {
    let response = await sendMsgWp(url, path, numero, msg)
    console.log(response)
}

var listener = app.listen(process.env.PORT, () =>
    console.log('Keyword Parser is listening on port ' + listener.address().port)
);