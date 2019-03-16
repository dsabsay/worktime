import assert from 'assert';
import { get } from '../cake.js';

function testGet() {
  const obj = {
    theme: {
      colors: {
        primary: 'blue'
      }
    }
  };

  assert.equal(get(obj, ['theme', 'colors', 'primary'], 'red'), 'blue');
  assert.equal(get(obj, ['theme', 'colors', 'secondary'], 'red'), 'red');
  assert.equal(get(obj, ['theme', 'types', 'bla', 'red'], 'red'), 'red');
}

testGet();

console.log('cake.test.js: Done.');
