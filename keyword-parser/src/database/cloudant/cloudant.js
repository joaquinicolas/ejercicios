"use strict";
const Cloudant = require("cloudant");
const logger = require("winston");
let connection;

let listKeywords = null;

let cron_exp;
if (process.env.NODE_ENV !== "prod") {
    cron_exp = "0 */1 * * * *"; // cada 1 minutos;
} else {
    cron_exp = "0 */5 * * * *"; // cada 5 minutos;
}

let CronJob = require("cron").CronJob;

let keywords_refresh_time_job = new CronJob(
    cron_exp,
    deleteKeywordList,
    null,
    true,
    null
);
keywords_refresh_time_job.start();

async function connect() {
    if (connection) {
        return {error: null, connection: connection};
    }

    Cloudant(process.env.CLOUDANT_CONNECTIONSTRING, function (err, client) {
        if (err) {
            logger.error("connect error: " + err);
            return {error: err, connection: null};
        }

        connection = client;

        return {error: null, connection: connection};
    });
}

async function deleteKeywordList() {
    listKeywords = null;
    logger.info("keyword list deleted");
}

async function getKeywordList() {
    if (listKeywords == null) {
        logger.info("getKeywordList: keyword list was empty");
        listKeywords = await getkeywordsStored(process.env.KEYWORDS_DATABASE_NAME);
    }

    return listKeywords;
}

async function getkeywordsStored(dbName) {
    const {err, client} = await connect();
    if (err) {
        logger.error("getkeywordsStored connect error:" + err);
        return null;
    }
    let db = client.db.use(dbName);

    db.find(
        {
            selector: {},
            fields: [
                "keyword",
                "aliases",
                "action",
                "country",
                "ifAloneGoToBot",
                "ActiveUntil",
            ],
        },
        function (err, body) {
            if (err) {
                logger.error("getkeywordsStored find error " + err);
                return [];
            } else if (body) {
                return body.docs;
            } else {
                return null;
            }
        }
    );
}

module.exports = {
    getKeywordList,
};
