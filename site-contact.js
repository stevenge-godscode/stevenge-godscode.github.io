(() => {
  function init() {
    if (document.getElementById('site-contact-dialog')) return;
    const email = 'info@godscode.com.cn';
    const dialog = document.createElement('dialog');
    dialog.id = 'site-contact-dialog';
    dialog.className = 'site-contact-dialog';
    dialog.setAttribute('aria-labelledby', 'site-contact-title');
    dialog.setAttribute('aria-describedby', 'site-contact-description');
    dialog.innerHTML = `
      <div class="site-contact-card">
        <button class="site-contact-close" type="button" aria-label="关闭联系卡片" autofocus><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
        <div class="site-contact-brand"><img src="/src/assets/images/logo_256.png" alt=""><span>Genesis <span>· 神典信息</span></span></div>
        <h2 id="site-contact-title">联系我们</h2>
        <p id="site-contact-description">产品咨询、场景验证或合作交流，<br>欢迎和我们聊聊你的业务需求。</p>
        <div class="site-contact-email"><span>企业邮箱</span><a href="mailto:${email}">${email}</a></div>
        <div class="site-contact-actions"><a class="site-contact-send" href="mailto:${email}">发送邮件 <span aria-hidden="true">↗</span></a><button class="site-contact-copy" type="button">复制邮箱</button></div>
        <p class="site-contact-status" role="status" aria-live="polite"></p>
      </div>`;
    document.body.append(dialog);

    let opener = null;
    let copyRequest = 0;
    let backdropPressed = false;
    const status = dialog.querySelector('.site-contact-status');
    const isContactLink = link => {
      if (!link || dialog.contains(link)) return false;
      const url = new URL(link.href, location.href);
      return url.protocol === 'mailto:' && url.pathname.toLowerCase() === email;
    };
    const decorateTriggers = () => {
      document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        if (!isContactLink(link)) return;
        link.setAttribute('aria-haspopup', 'dialog');
        link.setAttribute('aria-controls', dialog.id);
      });
    };
    const close = () => { if (dialog.open) dialog.close(); };
    const open = trigger => {
      if (dialog.open) return;
      opener = trigger;
      copyRequest++;
      status.textContent = '';
      backdropPressed = false;
      document.documentElement.classList.add('site-contact-open');
      dialog.showModal();
      window.GenesisPageNavigation?.closeOutline();
    };
    dialog.querySelector('.site-contact-close').addEventListener('click', close);
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const controls = [...dialog.querySelectorAll('a[href], button:not(:disabled)')];
      const current = controls.indexOf(document.activeElement);
      const next = current < 0 ? (event.shiftKey ? controls.length - 1 : 0)
        : (current + (event.shiftKey ? -1 : 1) + controls.length) % controls.length;
      event.preventDefault();
      controls[next].focus();
    });
    dialog.addEventListener('close', () => {
      document.documentElement.classList.remove('site-contact-open');
      copyRequest++;
      (opener?.isConnected ? opener : document.querySelector('.site-header .contact'))?.focus({preventScroll: true});
      window.GenesisPageNavigation?.closeOutline();
    });
    const outsideCard = event => {
      const box = dialog.getBoundingClientRect();
      return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
    };
    dialog.addEventListener('pointerdown', event => { backdropPressed = outsideCard(event); });
    dialog.addEventListener('pointerup', event => {
      if (backdropPressed && outsideCard(event)) close();
      backdropPressed = false;
    });
    dialog.querySelector('.site-contact-copy').addEventListener('click', async () => {
      const request = ++copyRequest;
      try {
        await navigator.clipboard.writeText(email);
        if (request === copyRequest && dialog.open) status.textContent = '邮箱已复制，可以粘贴到邮件应用中。';
      } catch {
        if (request !== copyRequest || !dialog.open) return;
        const range = document.createRange();
        range.selectNodeContents(dialog.querySelector('.site-contact-email a'));
        const selection = getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        status.textContent = '请复制已选中的邮箱地址。';
      }
    });
    document.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest('a[href]');
      if (!isContactLink(link)) return;
      event.preventDefault();
      open(link);
    });
    window.addEventListener('popstate', close);
    window.addEventListener('site-navigation:change', () => { close(); decorateTriggers(); });
    decorateTriggers();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
