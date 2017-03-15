'use strict';

const toBemjson = require('mdast-util-to-bemjson');

module.exports = plugin;

function plugin(options) {
    this.Compiler = compiler;

    function compiler(node, file) {
        const root = node && node.type && node.type === 'root';
        const bemjson = toBemjson(node, options);
        const bjsonString = JSON.stringify(bemjson, null, 2);

        if (file.extname) {
            file.extname = '.bemjson.js';
        }

        return root ? `module.exports = ${bjsonString}\n` : bjsonString;
    }
}
