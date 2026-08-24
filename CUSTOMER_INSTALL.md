# SuperDoc 2.8.0 viewing-mode comments patch

This patch allows the built-in comment composer to create comments from a text selection while `documentMode` is `viewing`. Document editing remains disabled.

## Install

Copy the two files from `vendor/` into your application, preserving their filenames. Then use local package references and force SuperDoc's transitive engine dependency to the patched engine:

```json
{
  "dependencies": {
    "@superdoc/docx-engine": "file:vendor/superdoc-docx-engine-0.7.0-viewing-comments-patched.tgz",
    "superdoc": "file:vendor/superdoc-2.8.0-viewing-comments-patched.tgz"
  },
  "pnpm": {
    "overrides": {
      "@superdoc/docx-engine": "file:vendor/superdoc-docx-engine-0.7.0-viewing-comments-patched.tgz"
    }
  }
}
```

Run `pnpm install`. The override is required: without it, pnpm may install the unpatched registry engine for SuperDoc's transitive dependency.

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

When switching modes on an existing React editor, change only the `documentMode` prop and keep rebuild-sensitive object props such as `user` and `modules` stable.

## Integrity

```text
7e8b48fe734ba70c4cafb7372195781b28a08f122f290bbb6980ff14b7db57c1  superdoc-2.8.0-viewing-comments-patched.tgz
db6330fe03c9a9985d7fe91c7f3fe7de881c613040d4cb13151215ff665109fe  superdoc-docx-engine-0.7.0-viewing-comments-patched.tgz
```

The readable source change is stored in `patches/0001-fix-comments-support-selection-comments-in-viewing-m.patch`.
