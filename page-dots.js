(()=>{
  const defs=[
    ['problem','业务问题'],['ontology','业务本体'],['data','数据治理'],['methods','规则与方法'],['capability','能力与判断'],['application','真实应用'],['loop','持续闭环'],['value','业务价值'],['proof','成熟度与证据']
  ];
  function init(){
    const sections=defs.map(([id,label])=>[document.getElementById(id),id,label]).filter(([el])=>el);
    if(!sections.length) return;
    let rail=document.querySelector(':scope > .page-dots');
    if(!rail){
      rail=document.createElement('div');
      rail.className='page-dots';
      rail.setAttribute('aria-label','章节导航');
      sections.forEach(([el,id,label])=>{
        const b=document.createElement('button');
        b.className='page-dot';
        b.type='button';
        b.dataset.target=id;
        b.setAttribute('aria-label',label);
        b.innerHTML=`<span class="page-dot-label">${label}</span>`;
        b.addEventListener('click',()=>{
          const nav=document.querySelector('.topbar');
          const top=Math.max(0,Math.round(el.getBoundingClientRect().top+window.scrollY-(nav?.offsetHeight||48)));
          window.scrollTo({top,behavior:'smooth'});
        });
        rail.appendChild(b);
      });
      document.body.appendChild(rail);
    }
    const dots=[...rail.querySelectorAll('.page-dot')];
    const navH=()=>document.querySelector('.topbar')?.offsetHeight||48;
    const sync=()=>{
      const marker=window.scrollY+navH()+Math.min(window.innerHeight*.38,280);
      let current=sections[0][1];
      for(const [el,id] of sections){
        const top=el.getBoundingClientRect().top+window.scrollY;
        if(top<=marker) current=id; else break;
      }
      dots.forEach(d=>d.classList.toggle('active',d.dataset.target===current));
    };
    let raf=0;
    const requestSync=()=>{if(!raf) raf=requestAnimationFrame(()=>{raf=0;sync();});};
    window.addEventListener('scroll',requestSync,{passive:true});
    window.addEventListener('resize',requestSync,{passive:true});
    sync();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
