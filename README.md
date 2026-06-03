# .ini Editor

A [Scalpel](https://github.com/scalpelpoe/scalpel) plugin that edits the running game's `production_Config.ini` (PoE1) / `poe2_production_Config.ini` (PoE2) from inside the overlay.

Settings are grouped under collapsible sections and rendered as typed controls: toggles for booleans, dropdowns for enums, sliders for 0..1 decimals, scrubbers for numbers, a key recorder for keybinds, and text fields for everything else. Edits are held in memory behind an explicit Save; the whole file is rewritten atomically and the original is backed up on the first save of a session.

Heads-up: the game only reads this file at launch and rewrites it on exit, so edits apply at the next launch and can be clobbered if the game is running.

## Develop

```bash
npm install
npm test
npm run build   # produces dist/plugin.js + dist/manifest.json
```

Load `dist/` into Scalpel via Settings -> Developer -> Load unpacked plugin.

Requires Scalpel `>=0.9.12` (the release that ships `ctx.gameConfig`).
