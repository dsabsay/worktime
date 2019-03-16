import assert from 'assert';
import { mergeThemes } from '../elementary.js';

function testMergeThemes1() {
  const parent = {
    textColor: 'blue',
    backgroundColor: 'white',
  };

  const child = {
    textColor: 'orange',
  };

  const expected = {
    textColor: 'orange',
    backgroundColor: 'white',
  };

  assert.deepEqual(mergeThemes(parent, child), expected);
}

function testMergeThemesRecursive() {
  const parent = {
    textColor: 'blue',
    sizes: {
      top: 1,
      middle: 2,
      bottom: 3,
    },
  };

  const child = {
    sizes: {
      middle: 50
    }
  };

  const expected = {
    textColor: 'blue',
    sizes: {
      top: 1,
      middle: 50,
      bottom: 3
    }
  };

  assert.deepEqual(mergeThemes(parent, child), expected);
}

function testMergeThemesNull() {
  const parent = null;
  const child = null;

  assert.deepEqual(mergeThemes(parent, child), {});
}

function testMergeThemesNullAndObj() {
  const parent = null;
  const child = { something: 'test' };

  assert.deepEqual(mergeThemes(parent, child), child);
}

function testMergeThemesColors() {
  const parent = {
    color: 'red',
    colors: {
      primary: '#353535',
      secondary: '#e2e2e2',
      background: 'white',
      accent: '#92cff3',
    }
  };

  const child = {
    textColor: 'orange',
    backgroundColor: 'green'
  };

  const expected = {
    color: 'red',
    colors: {
      primary: '#353535',
      secondary: '#e2e2e2',
      background: 'white',
      accent: '#92cff3',
    },
    textColor: 'orange',
    backgroundColor: 'green'
  };

  assert.deepEqual(mergeThemes(parent, child), expected);
}

testMergeThemes1();
testMergeThemesRecursive();
testMergeThemesNull();
testMergeThemesNullAndObj();
testMergeThemesColors();

console.log('elementary.test.js: Done.');
