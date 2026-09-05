(() => {
  function init() {
    const header = document.querySelector('.site-header');
    let content = document.getElementById('page-content');
    if (!header || !content || !window.GenesisPageNavigation) return;

    const navigation = window.GenesisPageNavigation;
    const primaryLinks = [...header.querySelectorAll('[data-site-nav]')];
    const outlinePath = value => {
      const path = new URL(value, location.href).pathname;
      return path === '/index.html' ? '/' : path;
    };
    const outlineCache = new Map([[outlinePath(location.href), navigation.readOutline(document)]]);
    const outlineRequests = new Map();
    let previewRequest = 0;
    const loadOutline = href => {
      const path = outlinePath(href);
      if (outlineCache.has(path)) return Promise.resolve(outlineCache.get(path));
      if (!outlineRequests.has(path)) {
        const request = fetch(path).then(async response => {
          if (!response.ok) throw new Error('Outline unavailable');
          const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
          const entries = navigation.readOutline(doc);
          if (!entries.length) throw new Error('Empty outline');
          outlineCache.set(path, entries);
          return entries;
        }).finally(() => outlineRequests.delete(path));
        outlineRequests.set(path, request);
      }
      return outlineRequests.get(path);
    };
    const preview = async link => {
      const href = link.getAttribute('href');
      const label = link.textContent.trim();
      const cached = outlineCache.get(outlinePath(href));
      navigation.showOutline({href, label, entries: cached || [], loading: !cached});
      const request = ++previewRequest;
      if (cached) return;
      try {
        const entries = await loadOutline(href);
        if (request === previewRequest && navigation.outlineOpen) navigation.showOutline({href, label, entries});
      } catch {
        // The page link remains usable even if its outline could not be fetched.
        if (request === previewRequest && navigation.outlineOpen) navigation.showOutline({href, label, entries: []});
      }
    };
    window.addEventListener('page-outline:change', event => {
      const {href, open} = event.detail;
      if (!open) previewRequest++;
      primaryLinks.forEach(link => {
        const expanded = !!open && !!href && outlinePath(link.href) === outlinePath(href);
        link.classList.toggle('site-nav-preview', expanded);
        link.setAttribute('aria-expanded', String(expanded));
      });
    });
    primaryLinks.forEach(link => {
      link.setAttribute('aria-controls', 'page-outline');
      link.setAttribute('aria-expanded', 'false');
      link.addEventListener('pointerenter', event => {
        if (event.pointerType !== 'touch' && matchMedia('(hover: hover)').matches) preview(link);
      });
      link.addEventListener('focus', () => {
        if (link.matches(':focus-visible')) preview(link);
      });
    });
    const showCurrentOutline = () => {previewRequest++; navigation.showCurrentOutline();};
    header.querySelector('.brand').addEventListener('pointerenter', event => {
      if (event.pointerType !== 'touch' && matchMedia('(hover: hover)').matches) showCurrentOutline();
    });
    header.querySelector('.brand').addEventListener('focus', event => {
      if (event.target.matches(':focus-visible')) showCurrentOutline();
    });
    // Warm primary menus without applying another page's styles or content.
    Promise.allSettled(primaryLinks.map(link => loadOutline(link.href)));
    const paths = new Set([...primaryLinks.map(link => new URL(link.href).pathname), '/index.html', '/scenario-seekalpha.html', '/scenario-intelligent-ops.html']);
    const pageKey = url => (url.pathname === '/index.html' ? '/' : url.pathname) + url.search;
    const destination = value => {
      const url = new URL(value, location.href);
      if (['/', '/index.html'].includes(url.pathname) && url.hash === '#scenario') {
        url.pathname = '/scenarios.html';
        url.hash = '';
      }
      return url;
    };
    let mountedURL = new URL(location.href);
    let pending = null;
    let sequence = 0;
    const entryID = () => `${Date.now()}-${++sequence}`;
    let displayedEntry = history.state?.genesisEntry || entryID();
    const positions = new Map();
    history.replaceState({...history.state, genesisEntry: displayedEntry}, '', location.href);
    history.scrollRestoration = 'manual';

    const status = document.createElement('div');
    status.className = 'site-route-status';
    status.setAttribute('role', 'status');
    document.body.append(status);

    const savePosition = () => positions.set(displayedEntry, [scrollX, scrollY]);
    const syncCurrent = () => {
      const path = mountedURL.pathname;
      const primary = primaryLinks.find(link => outlinePath(link.href) === outlinePath(mountedURL));
      const key = primary?.dataset.siteNav || (/^\/scenario-/.test(path) ? 'scenarios' : 'home');
      header.querySelectorAll('[data-site-nav]').forEach(link => {
        const active = link.dataset.siteNav === key;
        link.classList.toggle('site-nav-current', active);
        if (active) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    };
    const writeHistory = (url, mode, entry) => {
      if (mode === 'pop') {
        displayedEntry = entry;
        if (location.href !== url.href) history.replaceState({genesisEntry: displayedEntry}, '', url);
      } else {
        displayedEntry = entryID();
        history[mode === 'replace' ? 'replaceState' : 'pushState']({genesisEntry: displayedEntry}, '', url);
      }
      mountedURL = new URL(url);
    };
    const restorePosition = position => {
      if (position) window.scrollTo({left: position[0], top: position[1], behavior: 'instant'});
      else navigation.restoreHash();
    };

    // Load the next page's styles without applying them to the visible page.
    // They become active in the same synchronous update as the new content.
    const prepareStyles = async (doc, signal) => {
      const nodes = [];
      try {
        await Promise.all([...doc.querySelectorAll('link[data-page-style]')].map(source => new Promise((resolve, reject) => {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = new URL(source.getAttribute('href'), location.origin).href;
          link.media = 'not all';
          nodes.push(link);
          const finish = error => {
            signal.removeEventListener('abort', abort);
            link.onload = link.onerror = null;
            if (error) reject(error); else resolve();
          };
          const abort = () => finish(new DOMException('Navigation cancelled', 'AbortError'));
          signal.addEventListener('abort', abort, {once: true});
          link.onload = () => finish();
          link.onerror = () => finish(new Error('Page stylesheet unavailable'));
          document.head.append(link);
          if (signal.aborted) abort();
        })));
        return nodes;
      } catch (error) {
        nodes.forEach(node => node.remove());
        throw error;
      }
    };

    async function visit(value, {mode = 'push', entry, position} = {}) {
      const url = destination(value);
      pending?.abort();
      pending = null;
      savePosition();
      // Stop an in-flight chapter scroll before replacing its page and styles.
      window.scrollTo({left: scrollX, top: scrollY, behavior: 'instant'});
      const controller = new AbortController();
      pending = controller;
      content.setAttribute('aria-busy', 'true');
      let styles = [];
      try {
        // Allow the browser to finish cancelling its compositor scroll before
        // setting a new position, including when cached pages load immediately.
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        if (controller.signal.aborted) return;
        if (pageKey(url) === pageKey(mountedURL)) {
          writeHistory(url, mode, entry);
          restorePosition(position);
          return;
        }
        const response = await fetch(url.pathname + url.search, {signal: controller.signal});
        if (!response.ok) throw new Error('Page unavailable');
        const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
        const nextContent = doc.getElementById('page-content');
        if (!nextContent || !doc.querySelector('link[data-page-style]')) throw new Error('Unsupported page');
        styles = await prepareStyles(doc, controller.signal);
        if (controller.signal.aborted) return;
        savePosition();

        // Preserve the actual header, its controls, outline and right rail nodes.
        // Only page content and page-specific styles are replaced.
        const oldStyles = [...document.querySelectorAll('link[data-page-style]')];
        const sharedStyle = document.querySelector('link[href^="page-dots.css"]');
        styles.forEach(link => {
          link.dataset.pageStyle = '';
          link.removeAttribute('media');
          document.head.insertBefore(link, sharedStyle);
        });
        oldStyles.forEach(link => link.remove());
        const focusWasInContent = content.contains(document.activeElement);
        content.replaceWith(nextContent);
        content = nextContent;
        document.body.className = doc.body.className;
        for (const name of ['pageDots', 'pageDotsLabel']) {
          if (doc.body.dataset[name]) document.body.dataset[name] = doc.body.dataset[name];
          else delete document.body.dataset[name];
        }
        document.title = doc.title;
        document.querySelector('meta[name="description"]')?.remove();
        const description = doc.querySelector('meta[name="description"]');
        if (description) document.head.append(description);
        writeHistory(url, mode, entry);
        outlineCache.set(outlinePath(url), navigation.readOutline(document));
        window.GenesisHomepage?.init();
        navigation.refresh();
        syncCurrent();
        if (focusWasInContent) {
          content.setAttribute('tabindex', '-1');
          content.focus({preventScroll: true});
        }
        restorePosition(position);
        status.textContent = `${doc.title}，页面已切换`;
        window.dispatchEvent(new CustomEvent('site-navigation:change', {detail: {url: url.href}}));
      } catch (error) {
        if (controller.signal.aborted) return;
        // Standalone URLs remain a functional fallback when enhanced navigation fails.
        if (mode === 'pop') location.replace(url.href);
        else location.assign(url.href);
      } finally {
        styles.filter(link => !link.hasAttribute('data-page-style')).forEach(link => link.remove());
        if (pending === controller) {
          pending = null;
          content.removeAttribute('aria-busy');
        }
      }
    }

    window.GenesisSiteNavigation = {
      pushHash(id) {
        pending?.abort();
        pending = null;
        content.removeAttribute('aria-busy');
        savePosition();
        const url = new URL(location.href);
        url.hash = id;
        writeHistory(url, 'push');
      }
    };
    header.querySelector('.page-outline-toggle').addEventListener('click', () => navigation.toggleOutline());
    document.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest('a[href]');
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
      const url = destination(link.href);
      if (url.origin !== location.origin || !paths.has(url.pathname)) return;
      event.preventDefault();
      visit(url);
    });
    window.addEventListener('popstate', event => {
      const entry = event.state?.genesisEntry || entryID();
      if (!event.state?.genesisEntry) history.replaceState({...event.state, genesisEntry: entry}, '', location.href);
      visit(location.href, {mode: 'pop', entry, position: positions.get(entry)});
    });
    syncCurrent();
    if (destination(location.href).href !== location.href) visit(location.href, {mode: 'replace'});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
