var path = require("path");

module.exports = {
    entry: {
        "newtab/bundle.js": "./src/newtab/scripts/index.js",
        "popup/bundle.js": "./src/popup/scripts/index.js"
    },

    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name]",
        publicPath: ""
    }
};
