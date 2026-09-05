// Run against the local preview with: node tests/global-navigation.cjs
const assert = require('node:assert/strict');
const {chromium, webkit} = require('playwright');
const base = process.env.NAVIGATION_TEST_URL || 'http://127.0.0.1:8765';
const targets = page => page.locator('.page-outline-link[data-target]').evaluateAll(links => links.map(link => link.dataset.target));
async function hover(page, key, chapter) {
  await page.locator(`[data-site-nav="${key}"]`).hover();
  await page.locator(`.page-outline-link[data-target="${chapter}"]`).waitFor({state:'visible'});
}
async function aligned(page, path, id) {
  await page.waitForURL(url => url.pathname === path && url.hash === '#' + id);
  await page.waitForFunction(id => window.GenesisPageNavigation.currentId === id && Math.abs(document.getElementById(id).getBoundingClientRect().top - 48) < 2, id);
  assert.equal(await page.locator('.page-outline').getAttribute('aria-hidden'), 'false');
}
async function globalMenus(engine, name) {
  const browser = await engine.launch();
  try {
    const page = await browser.newPage({viewport:{width:1440,height:900}, reducedMotion:'reduce'});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base + '/#build');
    await page.waitForFunction(() => window.GenesisPageNavigation?.currentId === 'build');
    await page.evaluate(() => {window.originalHeader = document.querySelector('.site-header');window.originalContent = document.getElementById('page-content');});
    const y = await page.evaluate(() => scrollY);
    await hover(page, 'architecture', 'trust');
    assert.equal(await page.locator('.page-outline-title').textContent(), '技术架构');
    assert.equal(await page.locator('.page-outline-link[data-target="trust"]').getAttribute('href'), '/architecture.html#trust');
    assert.equal(await page.locator('.page-outline-link[aria-current]').count(), 0, 'A foreign menu has no false current-chapter highlight');
    assert.equal(await page.locator('.page-dot[aria-current]').getAttribute('data-target'), 'build');
    assert.equal(await page.locator('[data-site-nav][aria-current="page"]').getAttribute('data-site-nav'), 'home');
    await hover(page, 'scenarios', 'intelligent-ops');
    assert.deepEqual(await targets(page), ['overview','seekalpha','intelligent-ops','standards']);
    await hover(page, 'home', 'build');
    assert.equal(await page.locator('.page-outline-link[aria-current]').getAttribute('data-target'), 'build');
    assert.equal(await page.evaluate(() => scrollY), y, 'Hovering never moves the reading position');
    assert.equal(page.url(), base + '/#build');
    assert.ok(await page.evaluate(() => originalContent === document.getElementById('page-content')), 'Hovering never replaces content');

    await hover(page, 'architecture', 'trust');
    await page.locator('.page-outline').hover();
    await page.waitForTimeout(250);
    await page.locator('.page-outline-link[data-target="trust"]').click();
    await aligned(page, '/architecture.html', 'trust');
    await page.locator('.page-outline-link[data-target="systems"]').click();
    await aligned(page, '/architecture.html', 'systems');
    await page.goBack();
    await aligned(page, '/architecture.html', 'trust');
    await hover(page, 'scenarios', 'intelligent-ops');
    await page.locator('.page-outline-link[data-target="intelligent-ops"]').click();
    await aligned(page, '/scenarios.html', 'intelligent-ops');
    await page.locator('#intelligent-ops .scenario-feature').click();
    await page.waitForURL('**/scenario-intelligent-ops.html');
    await page.waitForFunction(() => window.GenesisPageNavigation.currentId === 'overview');
    await hover(page, 'scenarios', 'seekalpha');
    assert.equal(await page.locator('.page-dot').count(), 10, 'The detail page keeps its own right outline during a global preview');
    assert.equal((await targets(page)).length, 4);
    assert.equal(await page.locator('.page-outline-link[aria-current]').count(), 0, 'Identical overview IDs on different pages must not share current state');
    await page.locator('.page-outline-link[data-target="seekalpha"]').click();
    await aligned(page, '/scenarios.html', 'seekalpha');

    await page.keyboard.press('Tab');
    await page.locator('[data-site-nav="architecture"]').focus();
    await page.locator('.page-outline-link[data-target="trust"]').waitFor({state:'visible'});
    await page.locator('.page-outline-link[data-target="trust"]').focus();
    await page.keyboard.press('Enter');
    await aligned(page, '/architecture.html', 'trust');
    assert.equal(await page.locator('.page-outline-link[data-target="trust"]').evaluate(el => el === document.activeElement), true, 'Keyboard focus survives a cross-page chapter selection');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(250);
    assert.equal(await page.locator('.page-outline').getAttribute('aria-hidden'), 'true');
    assert.ok(await page.evaluate(() => originalHeader === document.querySelector('.site-header')));
    assert.deepEqual(errors, []);
    console.log(`PASS ${name}: global hover menus, page/chapter links, local scroll state, continuous selection, keyboard and stable header`);
  } finally {await browser.close();}
}
async function delayedMenus() {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({viewport:{width:1440,height:900}, reducedMotion:'reduce'});
    let releaseArchitecture, releaseScenarios;
    const architecture = new Promise(resolve => {releaseArchitecture = resolve;});
    const scenarios = new Promise(resolve => {releaseScenarios = resolve;});
    await page.route('**/architecture.html', async route => {await architecture; await route.continue();});
    await page.route('**/scenarios.html', async route => {await scenarios; await route.continue();});
    await page.goto(base);
    await page.waitForFunction(() => window.GenesisSiteNavigation);
    await page.locator('[data-site-nav="architecture"]').hover();
    assert.equal(await page.locator('.page-outline').getAttribute('data-page'), '/architecture.html');
    assert.deepEqual(await targets(page), [], 'Pending menus never expose the previous page’s chapters');
    await hover(page, 'home', 'build');
    releaseArchitecture();
    await page.waitForResponse(response => response.url().endsWith('/architecture.html'));
    await page.waitForTimeout(100);
    assert.equal(await page.locator('.page-outline-title').textContent(), '首页', 'A delayed response cannot replace the latest hovered menu');
    await page.locator('[data-site-nav="scenarios"]').hover();
    await page.keyboard.press('Escape');
    releaseScenarios();
    await page.waitForResponse(response => response.url().endsWith('/scenarios.html'));
    await page.waitForTimeout(250);
    assert.equal(await page.locator('.page-outline').getAttribute('aria-hidden'), 'true', 'A delayed response cannot reopen a dismissed menu');
    await page.mouse.move(600, 200);
    await hover(page, 'scenarios', 'seekalpha');
    assert.equal(page.url(), base + '/');
    console.log('PASS delayed menus: correct placeholders, latest hover wins, dismissal stays closed, later retry');
  } finally {await browser.close();}
}
(async () => {
  await globalMenus(chromium, 'Chromium');
  await globalMenus(webkit, 'WebKit');
  await delayedMenus();
})().catch(error => {console.error(error);process.exit(1);});
