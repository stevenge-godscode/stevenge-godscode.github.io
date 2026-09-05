(() => {
  const fallback = [
    ['problem', '业务问题'], ['ontology', '业务本体'], ['data', '数据治理'],
    ['methods', '规则与方法'], ['capability', '能力与判断'], ['application', '真实应用'],
    ['loop', '持续闭环'], ['value', '业务价值'], ['proof', '成熟度与证据']
  ];

  // Both the current page and global previews read the same page metadata.
  const readSections = doc => {
    const raw = doc.body.dataset.pageDots?.trim();
    const definitions = raw ? raw.split('|').map(item => {
      const colon = item.indexOf(':');
      return [item.slice(0, colon).trim(), item.slice(colon + 1).trim()];
    }) : [...fallback];
    const hero = doc.querySelector('#page-content > .hero');
    if (hero && !definitions.some(([id]) => doc.getElementById(id) === hero)) {
      hero.id ||= 'overview';
      definitions.unshift([hero.id, '概览']);
    }
    return definitions.map(([id, label]) => ({id, label, element: doc.getElementById(id)})).filter(section => section.element);
  };

  function init() {
    if (window.GenesisPageNavigation) return;
    const header = document.querySelector('.site-header');
    if (!header) return;
    let sections = [];

    header.classList.add('site-header');
    document.documentElement.classList.add('has-page-navigation');
    const outline = document.createElement('nav');
    outline.className = 'page-outline';
    outline.id = 'page-outline';
    outline.setAttribute('aria-label', '本页大纲');
    outline.setAttribute('aria-hidden', 'true');
    outline.inert = true;
    const inner = document.createElement('div');
    inner.className = 'page-outline-inner';
    const title = document.createElement('span');
    title.className = 'page-outline-title';
    title.textContent = '本页大纲';
    const list = document.createElement('div');
    list.className = 'page-outline-list';
    inner.append(title, list);
    outline.append(inner);
    header.after(outline);

    const rail = document.createElement('nav');
    rail.className = 'page-dots';
    rail.setAttribute('aria-label', document.body.dataset.pageDotsLabel || '章节导航');
    document.body.append(rail);
    const renderSections = () => sections.forEach(section => {
      section.element.classList.add('page-navigation-section');
      const link = document.createElement('a');
      link.className = 'page-dot';
      link.href = `#${section.id}`;
      link.dataset.target = section.id;
      link.setAttribute('aria-label', section.label);
      const label = document.createElement('span');
      label.className = 'page-dot-label';
      label.textContent = section.label;
      link.append(label);
      rail.append(link);
    });

    let offset = 0;
    let currentId = '';
    let frame = 0;
    let outlineOpen = false;
    let closeTimer = 0;
    let pointerInside = false;
    let suppressFocusOpen = false;
    let focusReturn = null;
    let currentOutline;
    let previewOutline = null;
    let shownOutline;
    let outlineSignature = '';
    const pagePath = value => {
      const path = new URL(value, location.href).pathname;
      return path === '/index.html' ? '/' : path;
    };
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const position = section => Math.max(0, section.element.getBoundingClientRect().top + scrollY - offset);
    const measure = () => {
      const headerHeight = header.getBoundingClientRect().height;
      // The menu overlays the page. Opening it must never reflow or move a chapter.
      offset = headerHeight;
      document.documentElement.style.setProperty('--site-header-height', `${headerHeight}px`);
      document.documentElement.style.setProperty('--page-navigation-offset', `${offset}px`);
    };
    const keepCurrentVisible = () => {
      const link = list.querySelector('[aria-current="location"]');
      if (!link) return;
      const bounds = list.getBoundingClientRect();
      const target = link.getBoundingClientRect();
      if (target.left < bounds.left || target.right > bounds.right) {
        // Only scroll the horizontal list; scrollIntoView would move the page too.
        list.scrollLeft += target.left - bounds.left - (bounds.width - target.width) / 2;
      }
    };
    const syncControls = () => {
      const isCurrentPage = shownOutline && pagePath(shownOutline.href) === pagePath(location.href);
      [rail, list].forEach(container => container.querySelectorAll('[data-target]').forEach(link => {
        const active = (container === rail || isCurrentPage) && link.dataset.target === currentId;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }));
      keepCurrentVisible();
    };
    const announceOutline = () => window.dispatchEvent(new CustomEvent('page-outline:change', {
      detail: {href: shownOutline?.href, open: outlineOpen}
    }));
    const renderOutline = model => {
      shownOutline = model;
      title.textContent = model.label;
      outline.setAttribute('aria-label', `${model.label}导航`);
      outline.dataset.page = pagePath(model.href);
      list.setAttribute('aria-busy', String(!!model.loading));
      const signature = JSON.stringify(model);
      if (signature !== outlineSignature) {
        const focusedID = list.contains(document.activeElement) ? document.activeElement.dataset.target : null;
        outlineSignature = signature;
        list.replaceChildren();
        list.scrollLeft = 0;
        for (const entry of model.entries) {
          const link = document.createElement('a');
          link.className = 'page-outline-link';
          link.href = `${model.href}#${entry.id}`;
          link.dataset.target = entry.id;
          link.textContent = entry.label;
          list.append(link);
        }
        if (!model.entries.length) {
          const link = document.createElement('a');
          link.className = 'page-outline-link';
          link.href = model.href;
          link.textContent = `打开${model.label} →`;
          list.append(link);
          if (model.loading) {
            const message = document.createElement('span');
            message.className = 'page-outline-message';
            message.textContent = '正在加载大纲…';
            list.append(message);
          }
        }
        if (focusedID && outlineOpen) {
          [...list.querySelectorAll('[data-target]')].find(link => link.dataset.target === focusedID)?.focus({preventScroll: true});
        }
      }
      syncControls();
      announceOutline();
    };
    const setOutlineOpen = open => {
      clearTimeout(closeTimer);
      const wasOpen = outlineOpen;
      outlineOpen = open;
      if (open && !wasOpen) renderOutline(currentOutline);
      if (!open) previewOutline = null;
      outline.classList.toggle('is-open', open);
      outline.inert = !open;
      outline.setAttribute('aria-hidden', String(!open));
      document.querySelector('.page-outline-toggle')?.setAttribute('aria-expanded', String(open));
      if (open) keepCurrentVisible();
      announceOutline();
    };
    const inNavigation = element => element instanceof Node && (header.contains(element) || outline.contains(element));
    const scheduleClose = () => {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => {
        const keyboardInside = inNavigation(document.activeElement) && document.activeElement.matches(':focus-visible');
        if (!pointerInside && !keyboardInside) setOutlineOpen(false);
      }, 180);
    };
    [header, outline].forEach(region => {
      region.addEventListener('pointerenter', event => {
        if (event.pointerType === 'touch' || !matchMedia('(hover: hover)').matches) return;
        pointerInside = true;
        setOutlineOpen(true);
      });
      region.addEventListener('pointerleave', event => {
        if (event.pointerType === 'touch' || !matchMedia('(hover: hover)').matches) return;
        pointerInside = inNavigation(event.relatedTarget);
        if (!pointerInside) scheduleClose();
      });
      region.addEventListener('focusin', event => {
        if (header.contains(event.target)) focusReturn = event.target;
        if (!suppressFocusOpen && event.target.matches(':focus-visible') && !event.target.closest('.page-outline-toggle')) setOutlineOpen(true);
      });
      region.addEventListener('focusout', event => {
        if (!inNavigation(event.relatedTarget)) scheduleClose();
      });
    });
    document.addEventListener('pointerdown', event => {
      if (!inNavigation(event.target)) setOutlineOpen(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !outlineOpen) return;
      event.preventDefault();
      if (outline.contains(document.activeElement)) {
        suppressFocusOpen = true;
        (focusReturn || header.querySelector('a'))?.focus({preventScroll: true});
        suppressFocusOpen = false;
      }
      setOutlineOpen(false);
    });
    const sync = () => {
      frame = 0;
      const marker = scrollY + offset + Math.min((innerHeight - offset) * .22, 160);
      let current = sections[0];
      for (const section of sections) {
        if (section.element.getBoundingClientRect().top + scrollY <= marker) current = section;
        else break;
      }
      if (current.id === currentId) return;
      currentId = current.id;
      syncControls();
      window.dispatchEvent(new CustomEvent('page-navigation:change', {detail: {id: currentId}}));
    };
    const requestSync = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };
    const navigate = (id, {history = true, smooth = true} = {}) => {
      const section = sections.find(item => item.id === id);
      if (!section) return;
      // Keep the menu and its keyboard focus available for another selection.
      // Hover, outside interaction and Escape own the disclosure state.
      measure();
      if (history && location.hash !== `#${id}`) {
        if (window.GenesisSiteNavigation) window.GenesisSiteNavigation.pushHash(id);
        else window.history.pushState(null, '', `#${id}`);
      }
      window.scrollTo({top: position(section), behavior: smooth && !reducedMotion.matches ? 'smooth' : 'instant'});
      requestSync();
    };
    // Also handle site navigation links targeting a chapter on this page.
    document.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest('a[href]');
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
      const url = new URL(link.href, location.href);
      const samePage = url.pathname === location.pathname ||
        [url.pathname, location.pathname].every(path => path === '/' || path === '/index.html');
      if (url.origin !== location.origin || !samePage || url.search !== location.search || !url.hash) return;
      let id;
      try { id = decodeURIComponent(url.hash.slice(1)); } catch { return; }
      if (!sections.some(section => section.id === id)) return;
      event.preventDefault();
      navigate(id);
    });
    const restoreHash = () => {
      let id;
      try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
      navigate(id || sections[0].id, {history: false, smooth: false});
    };
    window.addEventListener('hashchange', () => {
      if (!window.GenesisSiteNavigation) restoreHash();
    });
    window.addEventListener('scroll', requestSync, {passive: true});
    window.addEventListener('resize', () => {
      measure();
      requestSync();
      keepCurrentVisible();
    }, {passive: true});
    const resizeObserver = new ResizeObserver(() => {
      measure();
      requestSync();
    });
    const refresh = () => {
      // Switching pages updates the chapters without dismissing an open menu.
      resizeObserver.disconnect();
      sections = readSections(document);
      currentOutline = {href: location.pathname + location.search, label: '本页大纲', entries: sections.map(({id, label}) => ({id, label}))};
      currentId = '';
      rail.replaceChildren();
      rail.setAttribute('aria-label', document.body.dataset.pageDotsLabel || '章节导航');
      renderSections();
      resizeObserver.observe(header);
      resizeObserver.observe(outline);
      sections.forEach(section => resizeObserver.observe(section.element));
      measure();
      sync();
      renderOutline(previewOutline || currentOutline);
    };
    window.GenesisPageNavigation = {
      navigate, refresh, restoreHash,
      readOutline: doc => readSections(doc).map(({id, label}) => ({id, label})),
      showOutline: model => {
        setOutlineOpen(true);
        previewOutline = model;
        renderOutline(model);
      },
      showCurrentOutline: () => {
        setOutlineOpen(true);
        previewOutline = null;
        renderOutline(currentOutline);
      },
      closeOutline: () => setOutlineOpen(false),
      toggleOutline: () => setOutlineOpen(!outlineOpen),
      get outlineOpen() { return outlineOpen; },
      get currentId() { return currentId; },
      get offset() { return offset; }
    };
    refresh();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (location.hash) restoreHash();
      else requestSync();
    }));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
