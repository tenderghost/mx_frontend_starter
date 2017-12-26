const path = require('path');
const webpack = require("webpack");

const config = {
    context: path.resolve("./src/typescripts"),
    entry: {
        qxgl: ['./qxgl/weblet.ts']
    },
    output: {
        path: path.resolve("./sgpms"),
        filename: "[name]/[name]/scripts/[name].weblet.js"
    },
    module: {
        rules: [{
            enforce: "pre",
            test: /\.ts?$/,
            exclude: ["node_modules"],
            use: ["awesome-typescript-loader"]
        }]
    },
    resolve: {
        extensions: [".ts"]
    }
};

module.exports = config;