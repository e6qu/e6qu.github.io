# Deck format

A deck is a directory under `presentations/` holding `slides.md` and an
`index.html` that presents it (`<main class="deck" data-markdown="slides.md">`,
loading the deck runtime from `assets/` as the existing decks do). The site
build publishes each deck as one minified bundle (see [Build](#build)). Every
deck has **classic mode**, the slides. A deck that declares `game: mario` also
has **Mario mode**: the same talk played as a platformer level, one room per slide.

The sheets themselves (`:: content`, `:: table`, kickers, code, `dense`…) are
described in [the design system](design-system.md#markdown-decks) and shown, one
of each, in `presentations/template/slides.md`. This page is the contract
between `slides.md`, the deck runtime (`assets/deck-markdown.js`,
`assets/slides.js`, `assets/deck-game.js`) and the game
([regular-mario](https://github.com/e6qu/regular-mario)'s talk library).

## Front matter

Optional, at the very top, between two `---` lines; one `key: value` per line.

| Key | Meaning |
| --- | --- |
| `title` | The deck's title: the page title, and the default footer. |
| `footer` | The footer on every slide that shows one. |
| `game` | `mario` turns on the platformer layer: the HUD and transitions in classic mode, and Mario mode. Any other value fails the build. |

## Per-slide game fields

On a slide's `::` line, after the sheet. In classic mode they need `game: mario`
to show; Mario mode reads them from the talk script.

| Field | Classic mode (`deck-game.js`) | Mario mode |
| --- | --- | --- |
| `world="N Name"` | The HUD's world, from this slide on. | "WORLD N" on the sign; the world's scenery and music, picked from its name, from this slide on. |
| `day=N` | The HUD's day (of 7), from this slide on. | — |
| `lives=N` | Resets the HUD's lives. | — |
| `transition=card\|run\|iris\|pipe\|ouch` | Plays going forward while presenting; `ouch` costs a life. | The way into this room, at the end of the one before: stairs, crates, flat ground, a pipe, an enemy. |
| `art=a+b+c` | — | The room's props, by name. |

Also read by the game:

- `![alt](pictures/<id>.svg)` on a section or content slide: the room shows
  that picture (the game's own pixel copy of it). Elsewhere it fails the build.
- A table row that opens with `![](icons/<prop>.svg)`: the game draws that prop
  beside the row.
- In a `:: diagram` slide's ` ```mermaid ` block, comment lines Mermaid ignores
  place a flowchart on the game's grid: `%% game at <node> <column> <row>
  [<prop>] [| <label>]` for every node, and `%% game icon <actor> <prop>` for a
  sequence diagram's actor. A flowchart with an unplaced node is shown in the
  game as the slide's list.
- `dialogue` (`Speaker: words` bullets) and `number=none` carry over.

`scripts/talk-json.mjs` turns `slides.md` into the talk script. The build
checks it with the library itself (`regular-mario/talk-script`):
`parseTalkScript` for the format, then `checkTalkSigns`, which lays out every
slide's sign as the game draws it. A deck the game can't play fails the build,
naming the deck and the problem:

- a bad field;
- a slide whose text overflows its sign, with the overflow in pixels;
- a slide without `art`.

The edit server refuses such a save too.

## Modes and addresses

- `#12` (or `#slide=12`) opens slide 12 in classic mode.
- `#slide=12&mode=mario` opens Mario mode at slide 12; the overview's **Play
  as a game** does the same for the slide on screen. While playing, the address
  follows the castaway's room.
- **Back to slides** (bottom left), or Exit in the game's Esc menu, returns to
  classic mode at the slide the castaway reached, with focus on Play as a game.
- Mario mode exists only in a built deck. A deck served straight from the
  repository presents its slides, HUD and transitions, without the Play button.

## Build

`python3 scripts/build.py` copies the site into `_site/`; then

```sh
npm ci
npm run build:decks
```

bundles every deck (`scripts/build-decks.mjs`). Each page's stylesheets and
scripts become one module entry; Vite minifies them into `/assets/bundle/`, where
decks share the runtime (`deck-runtime-<hash>.js` and `.css`). For a
`game: mario` deck the entry also defines the Mario mode loader: the talk script
(generated at build time), the regular-mario library, Phaser and the castaway's
sprites load as separate chunks only when someone presses Play.

The library is pinned in `package.json` to its GitHub Release tarball
(`regular-mario-<version>.tgz`); Phaser is pinned to the version the library
names as its peer dependency.
