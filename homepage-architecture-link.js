(()=>{
  const add=()=>{
    const nav=document.querySelector('.navright');
    if(!nav||nav.querySelector('a[href="architecture.html"]')) return;
    const contact=nav.querySelector('.contact');
    const link=document.createElement('a');
    link.href='architecture.html';
    link.textContent='Architecture';
    if(contact) nav.insertBefore(link,contact); else nav.appendChild(link);
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(add,0));
  else setTimeout(add,0);
})();
