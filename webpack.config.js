const path = require('path');
const webpack = require("webpack");

const config = {
    context: path.resolve("./src"),
    entry: {

    },
    output: {
        path: path.resolve("./dist"),
        filename: "[name].weblet.js"
    }
};

module.exports = config;