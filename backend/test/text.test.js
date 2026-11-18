import test from 'node:test';
import assert from 'node:assert/strict';
import { slugify, stripTags, escapeLike, clean } from '../src/utils/text.js';

test('slugify makes url-safe slugs', () => {
  assert.equal(slugify('Summer Hackathon 2026!'), 'summer-hackathon-2026');
  assert.equal(slugify('  --Hello   World--  '), 'hello-world');
  assert.equal(slugify(''), '');
});

test('stripTags removes html tags', () => {
  assert.equal(stripTags('Hi <script>alert(1)</script> there'), 'Hi alert(1) there');
  assert.equal(stripTags('a < b'), 'a < b');
});

test('escapeLike escapes wildcards', () => {
  assert.equal(escapeLike('50%_off!'), '50!%!_off!!');
});

test('clean trims and removes control characters', () => {
  assert.equal(clean('  hello\u0000 world  '), 'hello world');
});
