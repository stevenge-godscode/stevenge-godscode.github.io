// Run with: node tests/site-shell.cjs (local preview on port 8765)
const assert = require('node:assert/strict');
const {chromium, webkit} = require('playwright');
const base = process.env.NAVIGATION_TEST_URL || 'http://127.0.0.1:8765';

async function settled(page, path) {
  await page.waitForURL(url => url.pathname === path);
  await page.waitForFunction(() => !document.getElementById('page-content')?.hasAttribute('aria-busy') && window.GenesisPageNavigation?.currentId);
  await page.waitForTimeout(100);
}
async function geometry(page) {
  return page.locator('.site-header, .site-header a, .page-outline-toggle').evaluateAll(elements => elements.map(element => {
    const {x, y, width, height} = element.getBoundingClientRect();
    return {x, y, width, height, font: getComputedStyle(element).font};
  }));
}
async function rememberShell(page) {
  await page.evaluate(() => {
    window.savedShell = ['.site-header', '.site-header .brand', ...['home', 'product', 'scenarios', 'architecture'].map(key => `[data-site-nav="${key}"]`), '.page-outline', '.page-dots'].map(selector => ({selector, element: document.querySelector(selector)}));
  });
}
async function assertShell(page, boxes) {
  assert.ok(await page.evaluate(() => window.savedShell?.every(({selector, element}) => document.querySelector(selector) === element)), 'Actual shared DOM nodes survive every route change');
  assert.deepEqual(await geometry(page), boxes, 'All header positions, dimensions and font metrics stay identical');
  assert.equal(await page.locator('#page-content').count(), 1);
  assert.equal(await page.locator('.site-header').count(), 1);
  assert.equal(await page.locator('.page-outline').count(), 1);
  assert.equal(await page.locator('.page-dots').count(), 1);
  assert.equal(await page.locator('link[media="not all"]').count(), 0, 'No pending page styles remain');
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal overflow');
}
async function run(engine, name, width) {
  const browser = await engine.launch();
  try {
    const page = await browser.newPage({viewport: {width, height: 900}, reducedMotion: 'reduce', isMobile: width < 761, hasTouch: width < 761});
    const errors = [];
    const documents = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => {if (request.isNavigationRequest() && request.frame() === page.mainFrame()) documents.push(request.url());});
    await page.goto(base);
    await settled(page, '/');
    await rememberShell(page);
    const boxes = await geometry(page);
    for (const [key, path, count] of [['product', '/product.html', 6], ['architecture', '/architecture.html', 10], ['scenarios', '/scenarios.html', 4], ['home', '/', 4], ['architecture', '/architecture.html', 10]]) {
      await page.locator(`[data-site-nav="${key}"]`).click();
      await settled(page, path);
      await assertShell(page, boxes);
      assert.equal(await page.locator('.page-outline-link').count(), count);
      assert.equal(await page.locator('[aria-current="page"]').getAttribute('data-site-nav'), key);
      assert.equal(await page.locator('.page-outline').getAttribute('aria-hidden'), width < 761 ? 'true' : 'false', 'Route changes preserve menu disclosure');
      assert.ok(await page.evaluate(() => scrollY < 2), 'New pages start below the persistent header');
    }
    // Remember a position that is not exactly at a chapter's top.
    const savedScroll = await page.evaluate(() => {
      const section = document.getElementById('systems');
      scrollTo({top: section.getBoundingClientRect().top + scrollY + 180, behavior: 'instant'});
      return scrollY;
    });
    await page.locator('[data-site-nav="scenarios"]').click();
    await settled(page, '/scenarios.html');
    await page.goBack();
    await settled(page, '/architecture.html');
    await assertShell(page, boxes);
    assert.ok(Math.abs(await page.evaluate(() => scrollY) - savedScroll) < 2, 'Back restores the actual reading position');
    await page.goForward();
    await settled(page, '/scenarios.html');
    await page.locator('#seekalpha .scenario-feature').click();
    await settled(page, '/scenario-seekalpha.html');
    await assertShell(page, boxes);
    await page.locator('.scenario-backlink').click();
    await settled(page, '/scenarios.html');
    await assertShell(page, boxes);
    assert.equal(documents.length, 1, 'Internal route changes never reload the document');
    assert.deepEqual(errors, []);
    console.log(`PASS persistent header, content/style swap, history, scenario round trip: ${name} ${width}px`);
  } finally {await browser.close();}
}
async function rapidNavigation() {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({reducedMotion: 'reduce'});
    await page.goto(base);
    await settled(page, '/');
    await rememberShell(page);
    const boxes = await geometry(page);
    let release;
    const hold = new Promise(resolve => {release = resolve;});
    await page.route('**/architecture.html', async route => {await hold; await route.continue().catch(() => {});});
    await page.locator('[data-site-nav="architecture"]').click();
    await page.waitForFunction(() => document.getElementById('page-content').getAttribute('aria-busy') === 'true');
    await page.locator('[data-site-nav="scenarios"]').click();
    await settled(page, '/scenarios.html');
    release();
    await page.waitForTimeout(250);
    await assertShell(page, boxes);
    assert.equal(new URL(page.url()).pathname, '/scenarios.html', 'A stale response cannot overwrite the last selected page');
    await page.locator('[data-site-nav="home"]').click();
    await settled(page, '/');
    await page.locator('.triptych>section').nth(1).click();
    await page.waitForFunction(() => window.GenesisPageNavigation.currentId === 'build');
    assert.ok(await page.locator('#build .reveal').evaluate(el => el.classList.contains('show')), 'Home interactions and reveal effects reinitialize on return');
    await page.reload();
    await page.waitForFunction(() => window.GenesisPageNavigation?.currentId === 'build');
    assert.ok(await page.locator('#build').evaluate(el => Math.abs(el.getBoundingClientRect().top - 48) < 2), 'Direct URLs and refresh preserve deep links');
    console.log('PASS rapid navigation, stale response cancellation, home reinitialization and reload');
  } finally {await browser.close();}
}
(async () => {
  for (const [engine, name] of [[chromium, 'Chromium'], [webkit, 'WebKit']]) {
    for (const width of [1440, 390, 320]) await run(engine, name, width);
  }
  await rapidNavigation();
})().catch(error => {console.error(error); process.exit(1);});
