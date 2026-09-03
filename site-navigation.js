(()=>{
  const items=[
    {key:'home',label:'首页',href:'/'},
    {key:'scenarios',label:'真实案例',href:'/#scenario'},
    {key:'architecture',label:'技术架构',href:'/architecture.html'}
  ];
  const currentKey=()=>{
    const path=location.pathname;
    if(path.endsWith('/architecture.html')||path.endsWith('architecture.html')) return 'architecture';
    if(/scenario-(seekalpha|intelligent-ops)\.html$/.test(path)) return 'scenarios';
    if(path==='/'||path.endsWith('/index.html')||path.endsWith('index.html')) return location.hash==='#scenario'?'scenarios':'home';
    return '';
  };
  const apply=()=>{
    const nav=document.querySelector('.navright,.topbar .navlinks');
    if(!nav) return;
    const current=currentKey();
    nav.innerHTML='';
    items.forEach(item=>{
      const a=document.createElement('a');
      a.href=item.href;
      a.textContent=item.label;
      a.dataset.siteNav=item.key;
      if(item.key===current) a.classList.add('site-nav-current');
      nav.appendChild(a);
    });
    const contact=document.createElement('a');
    contact.className='contact';
    contact.href='mailto:info@godscode.com.cn';
    contact.textContent='联系我们';
    nav.appendChild(contact);
    const brand=document.querySelector('.brand');
    if(brand) brand.setAttribute('href','/');
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply); else apply();
  window.addEventListener('hashchange',apply);
})();
