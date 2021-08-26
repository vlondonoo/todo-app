import assert from 'assert';
import {existsFile, readJsonFromFile, readFile, walkDir, writeFile} from '../src/file-utils';
import {getTestPath as p, removeTmpFolder} from './test-utils';

suite('File Utils');

before(removeTmpFolder);
after(removeTmpFolder);

test('Testing existsFile', () => {
  assert.notEqual(existsFile(p('asdf.txt')), false);
});

test('Testing readFile', () => {
  assert.strictEqual(readFile(p('asdf.txt')), 'asdf\n');
});

test('Walking directory', () => {
  const result = [];
  const expected = [
    p('dir-to-walk/foo/a'),
    p('dir-to-walk/foo/b'),
    p('dir-to-walk/foo/c/d'),
    p('dir-to-walk/foo/c'),
    p('dir-to-walk/foo'),
    p('dir-to-walk/ignore/e'),
    p('dir-to-walk/ignore'),
    p('dir-to-walk')
  ];
  walkDir(p('dir-to-walk'), (filePath) => result.push(filePath));
  assert.deepEqual(
    expected.map(e => e.replace(/\//g, ' ').replace(/\\/g, ' ')), 
    result.map(e => e.replace(/\//g, ' ').replace(/\\/g, ' '))
  );
});

test('Testing writeFile', () => {
  writeFile(p('tmp/tmp/asdf.txt'), 'asdf\n');
  writeFile(p('tmp/asdf.txt'), 'asdf\n');
  assert.strictEqual(readFile(p('tmp/tmp/asdf.txt')), 'asdf\n');
  assert.strictEqual(readFile(p('tmp/asdf.txt')), 'asdf\n');
});

test('Read JSON file', () => {
  const expected = {
    featureModel: {
      struct: {
        name: 'SimpleSPL',
        mandatory: true,
        abstract: true,
        type: 'and',
        features: [
          {name: 'featureA'},
          {name: 'featureB'},
          {name: 'featureC'}
        ]
      },
      constraints: [
        {
          type: 'implies',
          first: 'featureA',
          second: 'featureC'
        }
      ]
    }
  };
  assert.deepEqual(readJsonFromFile(p('simpleSPL/model.json')), expected);
});
