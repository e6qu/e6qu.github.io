// scripts/talk-json.mjs: slides.md → talk.json for Regular Mario's talk mode.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, writeFileSync, readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';

const script = new URL('../scripts/talk-json.mjs', import.meta.url).pathname;

function convert(markdown) {
  const dir = mkdtempSync(join(tmpdir(), 'talk-json-'));
  writeFileSync(join(dir, 'slides.md'), markdown);
  execFileSync(process.execPath, [script, join(dir, 'slides.md')], {stdio: 'ignore'});
  return JSON.parse(readFileSync(join(dir, 'talk.json'), 'utf8')).slides;
}

test('a diagram slide reaches the game as content, by its list, without the mermaid source', () => {
  const [slide] = convert(':: diagram\n\n## Flow\n\n```mermaid title="A flow"\nflowchart LR\n  a --> b\n```\n\n- a calls b\n');
  assert.equal(slide.template, 'content');
  assert.deepEqual(slide.lead, []);
  assert.deepEqual(slide.bullets, ['a calls b']);
});

test('an unplaced flowchart gets no diagram: the game shows its list', () => {
  const [slide] = convert(':: diagram\n\n## Flow\n\n```mermaid\nflowchart LR\n  a --> b\n```\n\n- a calls b\n');
  assert.equal(slide.diagram, undefined);
});

test('a placed flowchart becomes nodes and edges, with the hints\' icons and labels', () => {
  const [slide] = convert(':: diagram\n\n## Flow\n\n```mermaid\nflowchart LR\n  dev["Developer\'s agent"] --> api["Sandbox API<br/>E2B-style"] -.-> db[("Snapshots")]\n  %% game at dev 0 0 developer\n  %% game at api 1 0 plug | Sandbox API\n  %% game at db 2 0\n```\n');
  assert.deepEqual(slide.diagram, {
    kind: 'flow',
    nodes: [
      {id: 'dev', lines: ["Developer's agent"], icon: 'developer', column: 0, row: 0},
      {id: 'api', lines: ['Sandbox API'], icon: 'plug', column: 1, row: 0},
      {id: 'db', lines: ['Snapshots'], icon: null, column: 2, row: 0},
    ],
    edges: [
      {from: 'dev', to: 'api', dotted: false},
      {from: 'api', to: 'db', dotted: true},
    ],
  });
});

test('a sequence diagram keeps its actors, messages, replies and notes', () => {
  const [slide] = convert(':: diagram\n\n## Seq\n\n```mermaid\nsequenceDiagram\n  actor Dev as Developer\n  participant VM as microVM\n  %% game icon Dev developer\n  Dev->>VM: Build it\n  VM-->>Dev: Done\n  Note over Dev,VM: Stopped\n```\n');
  assert.deepEqual(slide.diagram, {
    kind: 'sequence',
    actors: [{id: 'Dev', label: 'Developer', icon: 'developer'}, {id: 'VM', label: 'microVM', icon: null}],
    steps: [
      {kind: 'message', from: 'Dev', to: 'VM', text: 'Build it', reply: false},
      {kind: 'message', from: 'VM', to: 'Dev', text: 'Done', reply: true},
      {kind: 'note', over: ['Dev', 'VM'], text: 'Stopped'},
    ],
  });
});

test('a hint for an unknown node is an error', () => {
  assert.throws(() => convert(':: diagram\n\n## Flow\n\n```mermaid\nflowchart LR\n  a --> b\n  %% game at c 0 0\n```\n'));
});

test('any other fenced block still shows line by line', () => {
  const [slide] = convert('## Run\n\n```sh\nfwe   --pull alpine\n```\n');
  assert.deepEqual(slide.lead, ['fwe --pull alpine']);
});

test('a section or content picture reaches the game by name; elsewhere it is an error', () => {
  const [slide] = convert(':: section\n\n## Kernel Caverns\n\n![Cave painting](pictures/cave-painting.svg)\n');
  assert.equal(slide.picture, 'cave-painting');
  assert.deepEqual(slide.lead, []);
  assert.equal(convert('## Content\n\n- a bullet\n\n![Fleet](pictures/container-fleet.svg)\n')[0].picture, 'container-fleet');
  assert.throws(() => convert(':: quote\n\n> Words\n\n![Cave painting](pictures/cave-painting.svg)\n'));
});

test('an image outside pictures/ on a section is the deck\'s alone', () => {
  const [slide] = convert(':: section\n\n## Switch Palaces\n\n![Blocks](animations/switch-palaces.svg)\n');
  assert.equal(slide.picture, undefined);
  assert.deepEqual(slide.lead, []);
});
