//* ------------------------- Core Modules -------------------------
const fastify = require("fastify")({bodyLimit: 5 * 1024 * 1024});
const mysql = require('mysql');
const path = require('path');
const datetime = require('luxon').DateTime;
const fs = require('fs/promises');

//* ------------------------- Export Modules -------------------------
module.exports = {
    fastify,
    mysql,
    path,
    datetime,
    fs
};