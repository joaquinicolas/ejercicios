"use strict";
// funcion que identifica si una palabra es keyword o sinonimo
const db = require('../database/cloudant/cloudant');

async function isKeyword(country, word, cant) {
    let lista = await db.getKeywordList();
    console.log("isKeyword: " + word);
    let largo = word.length;

    if (largo !== 3) {
        word = word.split(/\d+/g)[0];
    }

    if (isNaN(word)) {
        word = word.toUpperCase();
    }

    for (let i = 0; i < lista.length; i++) {
        if (country !== lista[i].country) {
            continue;
        }
        if (
            word === lista[i].keyword &&
            new Date(lista[i].ActiveUntil) > new Date()
        ) {
            console.log(word + " es sinonimo de keyword");
            if (
                lista[i].ifAloneGoToBot === true &&
                cant === 1 &&
                word.length === largo
            ) {
                console.log(word + " puede ir a chatbot directo");
                return false;
            } else {
                return true;
            }
        }

        const aliases = lista[i].aliases;

        for (let j = 0; j < aliases.length; j++) {
            if (word === aliases[j] && new Date(lista[i].ActiveUntil) > new Date()) {
                console.log(word + "es sinonimo de alias");
                if (
                    lista[i].ifAloneGoToBot === true &&
                    cant === 1 &&
                    word.split(/\d+/g).length === 1
                ) {
                    console.log(word + " puede ir a chatbot directo");
                    return false;
                } else {
                    return true;
                }
            }
        }
    }
    return false;
}

module.exports = isKeyword;
