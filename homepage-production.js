(()=>{
  let initializedRoot;
  let revealObserver;
  function init(){
    const root=document.getElementById('page-content');
    if(root===initializedRoot) return;
    revealObserver?.disconnect();
    initializedRoot=null;
    if(!document.body.classList.contains('homepage')||!root) return;
    initializedRoot=root;
    revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('show');revealObserver.unobserve(entry.target);}
    }),{threshold:.12});
    root.querySelectorAll('.reveal').forEach(element=>revealObserver.observe(element));

    if(!document.querySelector('.mobile-endbar')){
      const brand=document.querySelector('.brand');
      const logo=brand?.querySelector('img')?.getAttribute('src')||'src/assets/images/logo_256.png';
      const brandText=brand?.querySelector('span')?.textContent?.trim()||'Genesis';
      const contact=document.querySelector('.contact');
      const contactHref=contact?.getAttribute('href')||'mailto:info@godscode.com.cn';
      const bar=document.createElement('div');
      bar.className='mobile-endbar';
      bar.innerHTML=`<a class="mobile-brand" href="#top"><img src="${logo}" alt="Genesis"><span>${brandText}</span></a><a class="mobile-contact" href="${contactHref}">联系我们</a>`;
      root.appendChild(bar);
    }

    const ids=['top','blind','build','use'];
    const sections=ids.map(id=>document.getElementById(id)).filter(Boolean);
    const closing=document.querySelector('.closing');
    if(closing){
      sections.push(closing);
      closing.querySelector('.cta')?.insertAdjacentHTML('beforebegin','<div class="closing-links"><a href="/product.html">了解产品 →</a><a href="/scenarios.html">查看应用场景 →</a><a href="/architecture.html">了解技术架构 →</a></div>');
    }
    sections.forEach(el=>el.classList.add('snap-page'));

    document.body.dataset.pageDots='top:概览|blind:AI 看到的是局部 不是全景|build:为 AI 绘制可信的业务地图|use:AI 有了地图才知道该怎么做';

    const cards=[...document.querySelectorAll('.triptych>section')];
    const cardTargets=['blind','build','use'];
    const cardLabels=['AI 看到的是局部 不是全景','为 AI 绘制可信的业务地图','AI 有了地图才知道该怎么做'];

    const cloneMapForChapter=(sourceSection,targetId,index)=>{
      const target=document.getElementById(targetId);
      const head=target?.querySelector('.chapter-head');
      const sourceMap=sourceSection?.querySelector('.map-card');
      if(!target||!head||!sourceMap||target.querySelector('.mobile-chapter-map')) return;
      const wrap=document.createElement('div');
      wrap.className='mobile-chapter-map';
      wrap.setAttribute('aria-hidden','true');
      const clone=sourceMap.cloneNode(true);
      const idMap=new Map();
      clone.querySelectorAll('[id]').forEach(el=>{
        const oldId=el.id;
        const newId=`mobile-map-${index}-${oldId}`;
        idMap.set(oldId,newId);
        el.id=newId;
      });
      clone.querySelectorAll('*').forEach(el=>{
        [...el.attributes].forEach(attr=>{
          let value=attr.value;
          idMap.forEach((newId,oldId)=>{value=value.split(`#${oldId}`).join(`#${newId}`);});
          if(value!==attr.value) el.setAttribute(attr.name,value);
        });
      });
      wrap.appendChild(clone);
      head.insertAdjacentElement('afterend',wrap);
    };
    cards.slice(0,3).forEach((card,i)=>cloneMapForChapter(card,cardTargets[i],i+1));

    cards.slice(0,3).forEach((card,i)=>{
      card.setAttribute('role','link');
      card.setAttribute('tabindex','0');
      card.setAttribute('aria-label',cardLabels[i]);
      const jump=()=>{
        window.GenesisPageNavigation?.navigate(cardTargets[i]);
      };
      card.addEventListener('click',jump);
      card.addEventListener('keydown',e=>{
        if(e.key==='Enter'||e.key===' '){e.preventDefault();jump();}
      });
    });


  }

  window.GenesisHomepage={init};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
