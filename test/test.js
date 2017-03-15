'use strict';

const expect = require('chai').expect;
const remark = require('remark');
const nodeEval = require('node-eval');

const bemjson = require('../index');

function compare(tree, expected, options) {
    const bjsonString = remark().use(bemjson, options).stringify(tree);
    expect(tree.type === 'root' ? nodeEval(bjsonString) : JSON.parse(bjsonString)).to.deep.equal(expected);
}

describe('remark-bemjson()', () => {
    it('should be a function', () => {
        expect(bemjson).to.be.a('function');
    });

    it('should not throw exception when called without args', () => {
        expect(() => bemjson.call(remark())).to.not.throw(Error);
    });

    it('should throw should throw when not given a node', () => {
        expect(() => {
            remark().use(bemjson).stringify({
                type: 'root',
                children: [{ value: 'baz' }]
            });
        }).to.throw('AssertionError: Expected node, got \'[object Object]\'');
    });

    it('should stringify unknown nodes', () => {
        compare({ type: 'alpha' }, { block: 'alpha' });
    });

    it('should stringify unknown nodes with children', () => {
        compare({
            type: 'alpha', children: [{ type: 'strong', children: [{ type: 'text', value: 'bravo' }] }]
        }, {
            block: 'alpha', content: { block: 'strong', content: 'bravo' }
        });
    });

    it('should stringify tags with `option.tag=true`', () => {
        compare({ type: 'heading', depth: 1 }, { block: 'heading', mods: { level: 1 }, tag: 'h1' }, { tag: true });
    });

    it('should stringify `my-root` with `option.root=my-root`', () => {
        compare({ type: 'root' }, { block: 'my-root' }, { root: 'my-root' });
    });

    it('should stringify block as element with `option.scope=true`', () => {
        compare({ type: 'alpha' }, { elem: 'alpha' }, { scope: true });
    });

    it('should add `module.exports =` to the root', () => {
        const bjsonString = remark().use(bemjson).stringify({ type: 'root' });
        expect(bjsonString).to.contain('module.exports =');
    });
});
