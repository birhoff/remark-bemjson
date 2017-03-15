'use strict';

const toBemjson = require('mdast-util-to-bemjson');

function plugin(options) {
    this.Compiler = compiler;

    function compiler(node, file) {
        const root = node && node.type && node.type === 'root';
        const bemjson = toBemjson(node, options);
        const bjsonString = JSON.stringify(bemjson, null, 2);

        if (file.extname) {
            file.extname = '.js';
        }

        if (file.stem) {
            file.stem = file.stem + '.bemjson';
        }

        return root ? `module.exports = ${bjsonString}\n` : bjsonString;
    }
}

module.exports = plugin;
