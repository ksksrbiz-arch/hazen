import test from 'node:test';
import assert from 'node:assert/strict';
import {worksheetText} from '../src/worksheet-model.js';
test('Worksheet exports retain review state and multiline notes without unrelated fields', () => {
  const text = worksheetText({
    title: 'Buyer checklist',
    items: [
      {label: 'Set priorities', reviewed: true},
      {label: 'Bring questions', reviewed: false}
    ],
    notes: 'Outdoor space\nAsk about access',
    privateNote: 'DO NOT EXPORT'
  });
  assert.match(text, /Prompts reviewed: 1 of 2/);
  assert.match(text, /\[reviewed\] Set priorities/);
  assert.match(text, /\[ \] Bring questions/);
  assert.match(text, /Outdoor space\nAsk about access/);
  assert.doesNotMatch(text, /DO NOT EXPORT/);
});
test('Empty and bounded worksheet exports remain honest about missing notes', () => {
  assert.match(worksheetText({}), /Prompts reviewed: 0 of 0/);
  assert.match(worksheetText({}), /No notes added/);
  const text = worksheetText({
    title: 't'.repeat(150),
    items: Array.from({length: 25}, () => ({label: 'x', reviewed: 'true'})),
    notes: 'n'.repeat(1300)
  });
  assert.match(text, /Prompts reviewed: 0 of 18/);
  assert.ok(!text.includes('t'.repeat(101)));
  assert.ok(!text.includes('n'.repeat(1201)));
});
