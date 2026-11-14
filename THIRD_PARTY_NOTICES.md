# Third-party notices

## Champions Calc local Team Preview recognizer

- Upstream: https://github.com/SebNotFound/champions-calc
- Upstream license: GNU Affero General Public License v3.0 (AGPL-3.0)
- Original recognizer and sprite fingerprint data: Copyright the contributors to SebNotFound/champions-calc.
- Adapted browser implementation: `local-recognizer.js`
- Reference fingerprint dataset: `sprite-hashes.json`

The local recognizer and its integration are adapted from the upstream AGPL-3.0 project. This application is distributed as a combined work under AGPL-3.0; see `LICENSE`. The corresponding source is available in this public repository. Changes made for this integration are dated 2026-11-14.

The recognizer runs in the browser. The selected image is processed locally for recognition and is not sent to an AI/vision API or recognition server. A separate user-initiated match-save action may upload the image to the user's private Supabase storage for record keeping.

Recognition is experimental. It is designed for the standard Champions enemy (red) Team Preview column. Low-confidence matches are left blank and must be checked manually. It is not guaranteed to identify every Pokémon correctly.

This project is not affiliated with or endorsed by Pokémon, Nintendo, or The Pokémon Company.
