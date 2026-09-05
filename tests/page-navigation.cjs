// Run against a local checkout: python3 -m http.server 8765 --bind 127.0.0.1
// Requires Playwright: node tests/page-navigation.cjs
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const base = process.env.NAVIGATION_TEST_URL || 'http://127.0.0.1:8765';
const pages = ['/', '/product.html', '/scenarios.html', '/scenario-seekalpha.html', '/scenario-intelligent-ops.html', '/architecture.html'];

async function openOutline(page) {
  if (await page.evaluate(() => matchMedia('(hover: hover)').matches)) {
    await page.mouse.move(400, 200);
    await page.locator('.site-header .brand').hover();
  } else if (await page.locator('.page-outline').getAttribute('aria-hidden') === 'true') {
    await page.locator('.page-outline-toggle').tap();
  }
  await page.waitForFunction(() => document.querySelector('.page-outline').getAttribute('aria-hidden') === 'false');
}

async function chooseChapter(page, id) {
  await openOutline(page);
  await page.locator(`.page-outline-link[data-target="${id}"]`).click();
  assert.equal(await page.locator('.page-outline').getAttribute('aria-hidden'), 'false', 'Selecting a chapter keeps its menu available for another selection');
}

async function checkDisclosure(page, mobile) {
  const outline = page.locator('.page-outline');
  assert.equal(await outline.getAttribute('aria-hidden'), 'true', 'Outline starts collapsed');
  assert.equal(await outline.evaluate(element => element.inert), true, 'Collapsed links cannot receive keyboard focus');
  const geometry = () => page.evaluate(() => ({y: scrollY, top: document.querySelector('.hero').getBoundingClientRect().top, height: document.querySelector('.hero').getBoundingClientRect().height}));
  const before = await geometry();
  await openOutline(page);
  assert.deepEqual(await geometry(), before, 'Opening the outline must not shift content or scroll');
  if (mobile) {
    assert.equal(await page.locator('.page-outline-toggle').getAttribute('aria-expanded'), 'true');
    await page.touchscreen.tap(200, 170);
    assert.equal(await outline.getAttribute('aria-hidden'), 'true', 'Tapping outside dismisses the menu');
    await openOutline(page);
    await page.locator('.page-outline-toggle').tap();
  } else {
    await outline.hover();
    await page.waitForTimeout(250);
    assert.equal(await outline.getAttribute('aria-hidden'), 'false', 'Moving into the menu keeps it open');
    await page.mouse.move(400, 180);
    await page.waitForTimeout(400);
    assert.equal(await outline.getAttribute('aria-hidden'), 'true', 'Leaving both navigation areas dismisses the menu');
    await page.keyboard.press('Tab');
    await page.locator('.site-header .brand').focus();
    assert.equal(await outline.getAttribute('aria-hidden'), 'false', 'Keyboard focus opens the menu');
    await page.locator('.page-outline-link').first().focus();
    await page.keyboard.press('Escape');
    assert.equal(await outline.getAttribute('aria-hidden'), 'true', 'Escape dismisses without reopening on restored focus');
    assert.equal(await page.locator('.site-header .brand').evaluate(element => element === document.activeElement), true);
  }
  assert.deepEqual(await geometry(), before, 'Closing the outline also leaves the page in place');
}

async function aligned(page, id) {
  await page.waitForFunction(id => {
    const outline = document.querySelector('.page-outline');
    const section = document.getElementById(id);
    const header = document.querySelector('.site-header');
    return outline && section && header && (outline.inert || Math.abs(outline.getBoundingClientRect().top - header.getBoundingClientRect().bottom) < 1) &&
      Math.abs(section.getBoundingClientRect().top - header.getBoundingClientRect().bottom) < 2 &&
      document.querySelector('.page-outline-link[aria-current="location"]')?.dataset.target === id;
  }, id, {timeout: 5000});
  const state = await page.evaluate(id => {
    const outline = document.querySelector('.page-outline');
    const header = document.querySelector('.site-header');
    const link = document.querySelector('.page-outline-link[aria-current="location"]');
    const list = document.querySelector('.page-outline-list').getBoundingClientRect();
    const box = link?.getBoundingClientRect();
    return {
      top: header.getBoundingClientRect().top,
      gap: outline.inert ? 0 : outline.getBoundingClientRect().top - header.getBoundingClientRect().bottom,
      topActive: link?.dataset.target,
      sideActive: document.querySelector('.page-dot[aria-current="location"]')?.dataset.target,
      visible: box && box.left >= list.left - 2 && box.right <= list.right + 2,
      overflow: document.documentElement.scrollWidth - innerWidth
    };
  }, id);
  assert.equal(state.topActive, id);
  assert.equal(state.sideActive, id);
  assert.ok(Math.abs(state.top) < 1 && Math.abs(state.gap) < 1, JSON.stringify(state));
  assert.ok(state.visible, 'Current chapter must remain visible in the horizontal outline');
  assert.ok(state.overflow < 2, 'Navigation must not widen the document');
}

async function checkPage(browser, path, mobile) {
  const context = await browser.newContext({
    viewport: mobile ? {width: 390, height: 844} : {width: 1440, height: 900},
    isMobile: mobile, hasTouch: mobile, reducedMotion: 'reduce'
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base + path);
  await page.locator('.page-outline-link').first().waitFor({state: 'attached'});
  await page.waitForFunction(() => window.GenesisPageNavigation?.currentId);
  await checkDisclosure(page, mobile);
  const nav = page.locator('[data-site-nav]');
  assert.deepEqual(await nav.allTextContents(), ['首页', '产品介绍', '应用场景', '技术架构']);
  assert.deepEqual(await nav.evaluateAll(links => links.map(link => link.getAttribute('href'))), ['/', '/product.html', '/scenarios.html', '/architecture.html']);
  const activeSite = path === '/' ? 'home' : path === '/architecture.html' ? 'architecture' : path === '/product.html' ? 'product' : 'scenarios';
  assert.equal(await page.locator('[data-site-nav][aria-current="page"]').getAttribute('data-site-nav'), activeSite);
  assert.ok(await page.locator('.site-header a').evaluateAll(links => links.every(link => {
    const box = link.getBoundingClientRect();
    return box.top >= 0 && box.bottom <= 48 && box.width >= 18;
  })), 'Every top-level link must stay inside the shared header, not the side rail');

  const targets = await page.locator('.page-outline-link').evaluateAll(links => links.map(link => link.dataset.target));
  assert.equal(await page.locator('.page-outline').count(), 1);
  assert.equal(await page.locator('.page-dots').count(), 1);
  assert.deepEqual(await page.locator('.page-dot').evaluateAll(links => links.map(link => link.dataset.target)), targets);
  assert.deepEqual(await page.locator('.page-outline-link').allTextContents(), await page.locator('.page-dot').evaluateAll(links => links.map(link => link.getAttribute('aria-label'))));

  for (const id of targets) {
    await chooseChapter(page, id);
    await aligned(page, id);
    assert.equal(new URL(page.url()).hash, '#' + id);
  }
  if (!mobile) {
    await page.mouse.move(400, 150);
    await page.waitForTimeout(200);
    assert.ok(await page.locator('.page-dot-label').evaluateAll(labels => labels.every(label => getComputedStyle(label).visibility === 'hidden')));
    await page.locator('.page-dots').hover();
    await page.waitForTimeout(200);
    assert.ok(await page.locator('.page-dot-label').evaluateAll(labels => labels.every(label => getComputedStyle(label).visibility === 'visible')));
    await page.locator(`.page-dot[data-target="${targets[1]}"]`).click();
    await aligned(page, targets[1]);
    await page.mouse.move(400, 150);
    await page.waitForTimeout(200);
    assert.ok(await page.locator('.page-dot-label').evaluateAll(labels => labels.every(label => getComputedStyle(label).visibility === 'hidden')), 'Mouse focus must not leave labels visible');
    await page.keyboard.press('Tab');
    assert.ok(await page.locator('.page-dot:focus-visible .page-dot-label').isVisible(), 'Keyboard navigation exposes its label');
    await page.keyboard.press('Enter');
    await aligned(page, targets[2]);
  } else assert.equal(await page.locator('.page-dots').isVisible(), false);

  // Move the viewport independently of either navigation to verify scroll-driven state.
  await page.evaluate(id => {
    const section = document.getElementById(id);
    const bottom = document.querySelector('.site-header').getBoundingClientRect().bottom;
    window.scrollTo({top: section.getBoundingClientRect().top + scrollY - bottom, behavior: 'instant'});
  }, targets[3]);
  await aligned(page, targets[3]);
  await chooseChapter(page, targets[1]);
  await aligned(page, targets[1]);
  await chooseChapter(page, targets[2]);
  await aligned(page, targets[2]);
  await page.goBack();
  await aligned(page, targets[1]);
  await page.goForward();
  await aligned(page, targets[2]);
  await page.reload();
  await aligned(page, targets[2]);
  if (path === '/') {
    await page.locator('[data-site-nav="scenarios"]').click();
    await page.waitForURL('**/scenarios.html');
    await aligned(page, 'overview');
    assert.equal(await page.locator('[data-site-nav="scenarios"]').getAttribute('aria-current'), 'page');
    await page.locator('[data-site-nav="home"]').click();
    await page.waitForURL(base + '/');
    await aligned(page, 'top');
    assert.equal(await page.locator('#scenario,.scenario-feature').count(), 0, 'Home must not embed the scenario catalogue');
    await chooseChapter(page, 'top');
    await aligned(page, 'top');
    await page.locator('.triptych > section').nth(1).click();
    await aligned(page, 'build');
  }
  if (path === '/scenarios.html') {
    assert.equal(await page.locator('.scenario-feature').count(), 2);
    assert.equal(await page.locator('.scenario-standards li').count(), 9);
    assert.deepEqual(await page.locator('.scenario-evidence-metric b').allTextContents(), ['253 / 253', '2,069', '7', '7', '58', '2', '11', '18']);
    assert.ok((await page.locator('.scenario-evidence-foot').first().textContent()).includes('2026-07-24'));
  }
  assert.deepEqual(errors, []);
  console.log(`PASS ${mobile ? 'mobile' : 'desktop'} ${path} (${targets.length} chapters, scroll, history, deep link)`);
  await context.close();
}

(async () => {
  const browser = await chromium.launch({headless: true});
  try {
    // Hover and keyboard checks run sequentially so pages do not compete for focus.
    for (const mobile of [false, true]) {
      for (const path of pages) await checkPage(browser, path, mobile);
    }
    const page = await browser.newPage({viewport: {width: 1280, height: 720}});
    await page.goto(base + '/architecture.html');
    await page.locator('[data-site-nav="scenarios"]').click();
    await page.waitForURL('**/scenarios.html');
    await aligned(page, 'overview');
    for (const [id, path] of [['seekalpha', 'scenario-seekalpha.html'], ['intelligent-ops', 'scenario-intelligent-ops.html']]) {
      await chooseChapter(page, id);
      await aligned(page, id);
      await page.locator(`#${id} .scenario-feature`).click();
      await page.waitForURL('**/' + path);
      await aligned(page, 'overview');
      await page.locator('.scenario-backlink').click();
      await page.waitForURL('**/scenarios.html');
      await aligned(page, 'overview');
    }
    await page.locator('[data-site-nav="home"]').click();
    await page.waitForURL(base + '/');
    await aligned(page, 'top');
    await page.mouse.move(650, 400);
    await page.mouse.wheel(0, 650);
    await aligned(page, 'blind');
    assert.equal(await page.locator('[data-site-nav="home"]').getAttribute('aria-current'), 'page');
    await page.setViewportSize({width: 390, height: 844});
    await chooseChapter(page, 'use');
    await aligned(page, 'use');
    for (const path of ['/#scenario', '/index.html?from=legacy#scenario']) {
      await page.goto(base + path);
      await page.waitForURL(url => url.pathname === '/scenarios.html');
      await aligned(page, 'overview');
    }
    assert.equal(new URL(page.url()).search, '?from=legacy');
    await page.locator('[data-site-nav="architecture"]').click();
    await page.waitForURL('**/architecture.html');
    await aligned(page, 'overview');
    console.log('PASS independent routes, scenario details and returns, legacy redirects, desktop wheel snap, responsive resize');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
