(()=>{
  let initializedRoot;
  let revealObserver;
  let destroyMapMotion=()=>{};

  function setupMapMotion(root,cards){
    const maps=[...root.querySelectorAll('[data-map-motion]')];
    const pointer=matchMedia('(hover:hover) and (pointer:fine)');
    const reduced=matchMedia('(prefers-reduced-motion:reduce)');
    const visibility=new Map();
    const played=new Set();
    let candidate=null;
    let active=null;
    let startTimer=0;
    let endTimer=0;
    const stop=()=>{
      clearTimeout(startTimer);
      clearTimeout(endTimer);
      active?.classList.remove('is-map-playing');
      active=null;
      candidate=null;
    };
    const sync=()=>{
      if(document.hidden||reduced.matches||!root.isConnected||document.documentElement.classList.contains('site-contact-open')){
        stop();
        return;
      }
      if(pointer.matches){
        const hovered=cards.find(card=>card.matches(':hover'))?.querySelector('[data-map-motion]');
        if(hovered===active) return;
        stop();
        active=hovered;
        active?.classList.add('is-map-playing');
        return;
      }
      const center=(innerHeight+48)/2;
      const target=maps.filter(map=>(visibility.get(map)||0)>=.65&&!played.has(map)).sort((a,b)=>{
        const ratio=visibility.get(b)-visibility.get(a);
        if(Math.abs(ratio)>.02) return ratio;
        const boxA=a.getBoundingClientRect();
        const boxB=b.getBoundingClientRect();
        return Math.abs((boxA.top+boxA.bottom)/2-center)-Math.abs((boxB.top+boxB.bottom)/2-center);
      })[0];
      if(target===candidate) return;
      stop();
      candidate=target;
      if(!target||played.has(target)) return;
      // Ignore a quick swipe; play one short demonstration per viewport visit.
      startTimer=setTimeout(()=>{
        active=target;
        target.classList.add('is-map-playing');
        const duration={lost:6800,fresh:5800,guided:6400}[target.dataset.mapMotion];
        endTimer=setTimeout(()=>{
          target.classList.remove('is-map-playing');
          active=null;
          played.add(target);
          // Two maps may fit on a phone screen; give the other its turn.
          sync();
        },duration);
      },350);
    };
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        visibility.set(entry.target,entry.intersectionRatio);
        // A mostly departed map can play again on the next visit.
        if(entry.intersectionRatio<.25) played.delete(entry.target);
      });
      sync();
    },{rootMargin:'-48px 0px 0px',threshold:[0,.25,.5,.65,.75,.9,1]});
    maps.forEach(map=>observer.observe(map));
    cards.forEach(card=>{
      card.addEventListener('pointerenter',sync);
      card.addEventListener('pointerleave',sync);
    });
    const preferenceChanged=()=>{stop();sync();};
    pointer.addEventListener('change',preferenceChanged);
    reduced.addEventListener('change',preferenceChanged);
    document.addEventListener('visibilitychange',sync);
    // The contact card locks the root while its native modal covers the maps.
    const overlayObserver=new MutationObserver(sync);
    overlayObserver.observe(document.documentElement,{attributes:true,attributeFilter:['class']});
    sync();
    return ()=>{
      stop();
      observer.disconnect();
      overlayObserver.disconnect();
      pointer.removeEventListener('change',preferenceChanged);
      reduced.removeEventListener('change',preferenceChanged);
      document.removeEventListener('visibilitychange',sync);
      cards.forEach(card=>{
        card.removeEventListener('pointerenter',sync);
        card.removeEventListener('pointerleave',sync);
      });
    };
  }

  function init(){
    const root=document.getElementById('page-content');
    if(root===initializedRoot) return;
    revealObserver?.disconnect();
    destroyMapMotion();
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
    cards.slice(0,3).forEach((card,i)=>{
      const map=card.querySelector('.map-card');
      map.dataset.mapMotion=['lost','fresh','guided'][i];
      map.querySelectorAll('.slot').forEach((slot,index)=>{
        slot.style.setProperty('--map-phase',`${-((index*7)%20)*.21}s`);
      });
      const svgNode=(name,attributes)=>{
        const element=document.createElementNS('http://www.w3.org/2000/svg',name);
        Object.entries(attributes).forEach(([key,value])=>element.setAttribute(key,value));
        return element;
      };
      if(i===0){
        const traces=svgNode('svg',{'class':'map-search-traces map-motion-decoration',viewBox:'0 0 420 302',preserveAspectRatio:'none','aria-hidden':'true',focusable:'false'});
        ['M98 153 C120 149 125 121 151 124 L172 141 L151 152',
          'M328 208 C300 201 309 176 285 161 L261 176 L271 194'].forEach(d=>{
          traces.append(svgNode('path',{d,fill:'none'}));
        });
        map.querySelector('.map-area').append(traces);
      }
      if(i===2){
        const routes=map.querySelector('.route-svg');
        routes.querySelectorAll('path[marker-end]').forEach((path,index)=>{
          if(path.hasAttribute('stroke-dasharray')){
            path.classList.add('map-reasoning-route');
            return;
          }
          const stream=path.cloneNode();
          stream.removeAttribute('marker-end');
          stream.setAttribute('class','map-route-stream map-motion-decoration');
          stream.setAttribute('stroke','#fff');
          stream.setAttribute('stroke-width','2');
          stream.setAttribute('pathLength','100');
          routes.append(stream);
          for(let signal=0;signal<2;signal++){
            const traveler=svgNode('g',{'class':'map-route-traveler map-motion-decoration','aria-hidden':'true'});
            traveler.style.setProperty('--map-route',`path('${path.getAttribute('d')}')`);
            traveler.style.setProperty('--travel-phase',`${-signal*1.6-index*.35}s`);
            traveler.append(svgNode('path',{d:'M-5 -4 L0 0 L-5 4',fill:'none',stroke:'#fff','stroke-width':'2.5','stroke-linecap':'round','stroke-linejoin':'round'}));
            routes.append(traveler);
          }
        });
      }
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
    cards.slice(0,3).forEach((card,i)=>cloneMapForChapter(card,cardTargets[i],i+1));
    destroyMapMotion=setupMapMotion(root,cards);
  }

  window.GenesisHomepage={init};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
