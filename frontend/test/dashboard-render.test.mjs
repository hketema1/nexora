import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';

test('dashboard renders without a React runtime error', async () => {
  // Vite transforms JSX in the same way as the app's dev server.
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });
  try {
    const { default: App } = await vite.ssrLoadModule('/src/App.jsx');
    const html = renderToString(React.createElement(App));
    assert.match(html, /Budget overview/);
    assert.match(html, /Add a budget/);
    assert.match(html, /NEXORA/);
  } finally {
    await vite.close();
  }
});
