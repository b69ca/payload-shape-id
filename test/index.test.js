import test from 'node:test';import assert from 'node:assert/strict';import { shapeId,diffShapes } from '../src/index.js';
test('values and key order do not affect id',()=>assert.equal(shapeId({b:2,a:'x'}).id,shapeId({a:'y',b:9}).id));
test('types affect id',()=>assert.notEqual(shapeId({a:1}).id,shapeId({a:'1'}).id));
test('arrays record unique item shapes independent of order',()=>assert.equal(shapeId([1,'x',2]).id,shapeId(['y',3]).id));
test('diff identifies nested changes',()=>assert.deepEqual(diffShapes({a:{x:1}},{a:{x:'1'},b:true}).map(x=>[x.path,x.kind]),[['$.a.x','type'],['$.b','added']]));
