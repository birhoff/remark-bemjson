'use strict';

const toBemjson = require('mdast-util-to-bemjson');

module.exports = plugin;

function plugin(options) {
    const settings = options || {};
    const handlers = settings.handlers || {};

    this.Compiler = compiler;

    function compiler(node, file) {
        const root = node && node.type && node.type === 'root';
        const bemjson = toBemjson(node, { handlers });
        const bjsonString = JSON.stringify(bemjson, null, 4);

        if (file.extname) {
            file.extname = '.bemjson.js';
        }

        return root ? `module.exports = ${bjsonString}\n` : bjsonString;
    }
}
