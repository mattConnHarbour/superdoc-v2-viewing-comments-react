import { expect, test } from '@playwright/test';

test('selects text and opens the built-in comment composer in viewing mode', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Ready - viewing mode')).toBeVisible({ timeout: 30_000 });
  await expect
    .poll(() => page.locator('.v2-super-editor').evaluate((root) => root.textContent?.includes('Lorem ipsum') ?? false), {
      timeout: 30_000,
    })
    .toBe(true);

  const selectionRect = await page.evaluate(() => {
    const root = document.querySelector('.v2-super-editor');
    if (!root) throw new Error('V2 document surface was not found.');

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const text = node.nodeValue ?? '';
      const start = text.indexOf('Lorem');
      if (start < 0) continue;

      const range = document.createRange();
      range.setStart(node, start);
      range.setEnd(node, start + 'Lorem'.length);
      const rect = range.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      }
    }
    throw new Error('Selectable document text was not found.');
  });

  const y = selectionRect.y + selectionRect.height / 2;
  await page.mouse.move(selectionRect.x + 1, y);
  await page.mouse.down();
  await page.mouse.move(selectionRect.x + selectionRect.width - 1, y, { steps: 6 });
  await page.mouse.up();

  await expect.poll(() => page.evaluate(() => window.getSelection()?.toString().trim().length ?? 0)).toBeGreaterThan(0);
  const commentTool = page.locator('.superdoc__tools [data-id="is-tool"]');
  await expect(commentTool).toBeVisible();
  await commentTool.click();
  await expect(page.locator('.comments-dialog.is-active textarea.superdoc-field')).toBeVisible();
  await page.screenshot({ path: 'artifacts/viewing-comment-composer.png', fullPage: false });
});

test('switches document modes without rebuilding the editor', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Ready - viewing mode')).toBeVisible({ timeout: 30_000 });
  expect(
    await page.evaluate(() => {
      const config = window.__superdocDemoInstance?.config;
      return {
        documentMode: config?.documentMode,
        allowSelectionInViewMode: config?.allowSelectionInViewMode,
        commentsVisible: config?.comments?.visible,
        commentsReadOnly: config?.modules?.comments && config.modules.comments.readOnly,
        allowResolve: config?.modules?.comments && config.modules.comments.allowResolve,
      };
    }),
  ).toEqual({
    documentMode: 'viewing',
    allowSelectionInViewMode: true,
    commentsVisible: true,
    commentsReadOnly: false,
    allowResolve: true,
  });
  const readyCount = await page.evaluate(() => window.__superdocDemoReadyCount);

  await page.getByRole('button', { name: 'Edit', exact: true }).click();
  await expect(page.getByText('Ready - editing mode')).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__superdocDemoReadyCount)).toBe(readyCount);

  await page.getByRole('button', { name: 'View', exact: true }).click();
  await expect(page.getByText('Ready - viewing mode')).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__superdocDemoReadyCount)).toBe(readyCount);
});
