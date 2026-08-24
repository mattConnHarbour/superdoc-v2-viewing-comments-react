# SuperDoc 2.8.0 viewing-mode comments patch

This patch enables the built-in comment composer for a text selection while `documentMode` is `viewing`. Document editing remains disabled.

## Apply the patches

Copy these files into your application's `patches/` directory:

- `patches/superdoc+2.8.0.patch`
- `patches/@superdoc+docx-engine+0.7.0.patch`

Install the official package versions and `patch-package`, then add the postinstall script:

```json
{
  "scripts": {
    "postinstall": "patch-package"
  },
  "dependencies": {
    "@superdoc/docx-engine": "0.7.0",
    "patch-package": "8.0.0",
    "superdoc": "2.8.0"
  }
}
```

Run `npm install`. Its output should confirm that both patches applied:

```text
Applying patches...
@superdoc/docx-engine@0.7.0 ✔
superdoc@2.8.0 ✔
```

Both patches are required. SuperDoc owns the built-in comment UI and the DOCX engine owns the v2 selection and comment capabilities.

## Configuration

```tsx
<SuperDocEditor
  document={document}
  documentMode="viewing"
  allowSelectionInViewMode
  comments={{ visible: true }}
  ui={{ comments: { displayMode: 'sidebar' } }}
  modules={{ comments: {} }}
  interaction={{
    comments: { readOnly: false, allowResolve: true },
  }}
  user={{ name: 'Example User', email: 'user@example.com' }}
/>
```

When switching modes, change only `documentMode` and keep rebuild-sensitive object props such as `user` and `modules` stable.
