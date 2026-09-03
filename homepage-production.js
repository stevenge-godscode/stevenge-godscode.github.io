(()=>{
  function init(){
    const desktop=window.matchMedia('(min-width:1101px)');
    const nav=document.querySelector('nav');
    const navHeight=()=>desktop.matches?(nav?.offsetHeight||48):0;

    const use=document.getElementById('use');
    const caseEl=use&&use.querySelector('.case');
    if(use&&!document.getElementById('scenario')){
      if(caseEl) caseEl.remove();
      use.insertAdjacentHTML('afterend',`<section class="chapter scenario-chapter" id="scenario"><div class="shell chapter-inner"><div class="chapter-divider"><span class="chapter-num">04</span><span class="chapter-line"></span><span class="chapter-label">真实场景</span></div><div class="chapter-head"><h2>把地图用在真实工作里</h2><p>真实应用 · 统一标准 · 持续演进</p></div><a class="scenario-feature" href="scenario-seekalpha.html" aria-label="查看 SeekAlpha 市场研究与决策完整案例"><div class="scenario-feature-copy"><div class="scenario-feature-eyebrow">真实场景 001</div><div class="scenario-feature-status">真实应用 · Genesis 平台化演进中</div><h3>SeekAlpha 市场研究与决策</h3><div class="scenario-feature-question">今天哪些方向值得重点关注 为什么</div><p>把市场数据、事件和专业方法组织成持续可验证的市场判断，并逐步迁移到 Genesis 统一的数据、语义、能力和证据链。</p><div class="scenario-feature-tags"><span>业务本体</span><span>数据治理</span><span>专业方法</span><span>真实应用</span><span>持续闭环</span></div><div class="scenario-feature-link">查看完整案例 →</div></div><div class="scenario-feature-visual"><div class="scenario-evidence-board"><div class="scenario-evidence-title">已核实证据</div><div class="scenario-evidence-sub">只放有固定来源和日期的真实数字</div><div class="scenario-evidence-grid"><div class="scenario-evidence-metric"><b>253 / 253</b><span>符合条件的权益 ETF 覆盖</span></div><div class="scenario-evidence-metric"><b>2,069</b><span>基金日行情记录</span></div><div class="scenario-evidence-metric"><b>7</b><span>当前真实小程序页面</span></div><div class="scenario-evidence-metric"><b>7</b><span>市场情报输入数据合同</span></div></div><div class="scenario-feature-proof"><span>3 类数据合同可用</span><span>2 类部分可用</span><span>2 类暂不可用</span></div><div class="scenario-evidence-foot">数据快照：2026-07-24 预发布环境 · 合同状态：2026-09-02</div></div></div></a></div></section>`);
    }

    const navright=document.querySelector('.navright');
    if(navright) navright.querySelectorAll('a:not(.contact)').forEach(a=>a.remove());

    if(!document.querySelector('.mobile-endbar')){
      const brand=document.querySelector('.brand');
      const logo=brand?.querySelector('img')?.getAttribute('src')||'src/assets/images/logo_256.png';
      const brandText=brand?.querySelector('span')?.textContent?.trim()||'Genesis';
      const contact=document.querySelector('.contact');
      const contactHref=contact?.getAttribute('href')||'mailto:info@godscode.com.cn';
      const bar=document.createElement('div');
      bar.className='mobile-endbar';
      bar.innerHTML=`<a class="mobile-brand" href="#top"><img src="${logo}" alt="Genesis"><span>${brandText}</span></a><a class="mobile-contact" href="${contactHref}">联系我们</a>`;
      document.body.appendChild(bar);
    }

    const ids=['top','blind','build','use','scenario'];
    const sections=ids.map(id=>document.getElementById(id)).filter(Boolean);
    const closing=document.querySelector('.closing');
    if(closing) sections.push(closing);
    sections.forEach(el=>el.classList.add('snap-page'));

    const dotDefs=[
      ['blind','AI 看到的是局部 不是全景'],
      ['build','为 AI 绘制可信的业务地图'],
      ['use','AI 有了地图才知道该怎么做'],
      ['scenario','把地图用在真实工作里']
    ];
    if(!document.querySelector('.page-dots')){
      const rail=document.createElement('div');
      rail.className='page-dots';
      rail.setAttribute('aria-label','章节导航');
      dotDefs.forEach(([id,label])=>{
        const b=document.createElement('button');
        b.className='page-dot';
        b.type='button';
        b.dataset.target=id;
        b.setAttribute('aria-label',label);
        b.innerHTML=`<span class="page-dot-label">${label}</span>`;
        rail.appendChild(b);
      });
      document.body.appendChild(rail);
    }

    const dots=[...document.querySelectorAll('.page-dot')];
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

    const targetY=el=>Math.max(0,Math.round(el.getBoundingClientRect().top+window.scrollY-navHeight()));
    const nearest=()=>{
      let best=0,dist=Infinity;
      sections.forEach((el,i)=>{
        const d=Math.abs(window.scrollY-targetY(el));
        if(d<dist){dist=d;best=i;}
      });
      return best;
    };

    let locked=false;
    let wheelAccum=0;
    let raf=0;
    const syncDots=()=>{
      raf=0;
      const current=sections[nearest()];
      dots.forEach(d=>d.classList.toggle('active',current&&d.dataset.target===current.id));
    };
    const requestSync=()=>{if(!raf) raf=requestAnimationFrame(syncDots);};
    const goIndex=i=>{
      const n=Math.max(0,Math.min(sections.length-1,i));
      locked=true;
      wheelAccum=0;
      window.scrollTo({top:targetY(sections[n]),behavior:'smooth'});
      setTimeout(()=>{
        window.scrollTo({top:targetY(sections[n]),behavior:'auto'});
        locked=false;
        syncDots();
      },560);
    };
    const go=dir=>goIndex(nearest()+dir);

    dots.forEach(d=>d.addEventListener('click',()=>{
      const i=sections.findIndex(s=>s.id===d.dataset.target);
      if(i>=0) goIndex(i);
    }));

    cards.slice(0,3).forEach((card,i)=>{
      card.setAttribute('role','link');
      card.setAttribute('tabindex','0');
      card.setAttribute('aria-label',cardLabels[i]);
      const jump=()=>{
        const target=document.getElementById(cardTargets[i]);
        if(target) goIndex(sections.indexOf(target));
      };
      card.addEventListener('click',jump);
      card.addEventListener('keydown',e=>{
        if(e.key==='Enter'||e.key===' '){e.preventDefault();jump();}
      });
    });

    window.addEventListener('wheel',e=>{
      if(!desktop.matches||e.ctrlKey) return;
      e.preventDefault();
      if(locked) return;
      wheelAccum+=e.deltaY;
      if(Math.abs(wheelAccum)<18) return;
      go(wheelAccum>0?1:-1);
    },{passive:false});

    window.addEventListener('keydown',e=>{
      if(!desktop.matches||/INPUT|TEXTAREA|SELECT/.test(document.activeElement&&document.activeElement.tagName)) return;
      if(['ArrowDown','PageDown'].includes(e.key)||(e.key===' '&&!e.shiftKey)){e.preventDefault();go(1);}
      else if(['ArrowUp','PageUp'].includes(e.key)||(e.key===' '&&e.shiftKey)){e.preventDefault();go(-1);}
    });

    window.addEventListener('scroll',requestSync,{passive:true});
    window.addEventListener('resize',()=>{
      if(desktop.matches){
        const i=nearest();
        window.scrollTo({top:targetY(sections[i]),behavior:'auto'});
      }
      syncDots();
    });

    setTimeout(()=>{
      if(desktop.matches){
        const i=nearest();
        window.scrollTo({top:targetY(sections[i]),behavior:'auto'});
      }
      syncDots();
    },80);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
