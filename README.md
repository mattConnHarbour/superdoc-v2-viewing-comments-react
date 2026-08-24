# SuperDoc v2 viewing-mode comments patch demo

Standalone React reproduction for `superdoc@2.8.0`, the latest stable v2 release when this patch was prepared.

The app starts in viewing mode with `allowSelectionInViewMode: true`. Select document text and use the built-in comment action. The document remains non-editable, while the selection highlight and comment composer remain available.

See `CUSTOMER_INSTALL.md` for delivery instructions. This demo installs the official registry packages and applies the two checked-in files under `patches/` through its `postinstall` script. It contains no vendored or prepatched package artifacts.

```bash
npm install
npm run dev
```

The demo config is in `src/App.tsx`. Viewing mode uses `allowSelectionInViewMode`, visible built-in comment UI, and the canonical `interaction.comments` write policy. Its rebuild-sensitive `user` and `modules` props use stable references, so the Edit and View buttons call the wrapper's mode-update path without destroying the editor.

With the dev server running on port 4175, run `npm run verify:e2e` to exercise the patched selection and built-in comment composer.
