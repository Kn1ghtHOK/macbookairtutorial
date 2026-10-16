/* Renders each page from data.js, and powers the search box on every page. */
(function(){
  var D=window.GUIDE,G=D.G,X=D.X,SECS=D.SECS,PAGES=D.PAGES,TIPS=D.TIPS;
  var page=document.body.dataset.page;
  var app=document.getElementById('app');

  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')}
  function plain(s){return String(s).replace(/&amp;/g,'&')}
  var secById={},pageOfSec={},pageByKey={};
  SECS.forEach(function(s){secById[s.id]=s});
  PAGES.forEach(function(p){pageByKey[p.key]=p;(p.secs||[]).forEach(function(s){pageOfSec[s]=p})});

  /* ---------- panels ---------- */
  function padHTML(g){
    var edge=g.edge?'<i class="edge '+g.edge+'"></i>':'';
    var key=g.key?'<b class="key">'+g.key+'</b>':'';
    var it=g.item?'<i class="item" style="--x:'+g.item.x+';--y:'+g.item.y+';--dx:'+g.item.dx+';--dy:'+g.item.dy+';--w:'+g.item.w+';--h:'+g.item.h+'"></i>':'';
    var fs=g.fingers.map(function(p){return '<i class="f" style="--x:'+p.x+';--y:'+p.y+';--dx:'+p.dx+';--dy:'+p.dy+'"></i>'}).join('');
    var inner=g.a==='rot'?'<div class="grp" style="--rot:'+g.rot+'">'+fs+'</div>':fs;
    return '<div class="pad'+(g.ring?' ring':'')+'" data-a="'+g.a+'" aria-hidden="true">'+edge+key+it+inner+'</div>';
  }
  function keyText(keys){return keys.map(function(k){return typeof k==='string'?k:k.join(' ')}).join(' ')}
  function keyHTML(keys){
    return '<div class="kpanel" role="img" aria-label="'+keyText(keys).replace(/"/g,'')+'">'+keys.map(function(k){
      if(typeof k==='string')return '<span class="sep">'+k+'</span>';
      return '<span class="grp2">'+k.map(function(x){
        var wide=x.length>1&&!/^F\d+$/.test(x);
        return '<kbd'+(wide?' class="w"':'')+'>'+x+'</kbd>';
      }).join('')+'</span>';
    }).join('')+'</div>';
  }
  function stepHTML(steps){
    return '<div class="kpanel chain" role="img" aria-label="'+steps.join(', then ').replace(/"/g,'')+'">'+steps.map(function(s,i){
      return (i?'<i class="chev">›</i>':'')+'<span class="step">'+esc(s)+'</span>';
    }).join('')+'</div>';
  }
  function panelOf(g){return g.fingers?padHTML(g):(g.keys?keyHTML(g.keys):stepHTML(g.steps))}

  /* ---------- index for search and lookup ---------- */
  var byId={},IDX=[];
  G.concat(X).forEach(function(g){
    byId[g.id]=g;
    var pg=pageOfSec[g.sec];
    var kind=g.fingers?'Trackpad gesture':g.kind;
    var extra=g.keys?keyText(g.keys):(g.steps||[]).join(' ');
    IDX.push({
      title:plain(g.t),
      sub:plain(pg.name)+' · '+(g.keys?keyText(g.keys):kind),
      href:pg.file+'#c-'+g.id,
      text:plain((g.t+' '+g.d+' '+(g.path||'')+' '+(g.fl||'')+' '+kind+' '+extra+' '+pg.name)).toLowerCase()
    });
  });
  TIPS.forEach(function(t){
    var pg=pageByKey.trackpad;
    IDX.push({title:t.t,sub:'Trackpad · Setting',href:pg.file+'#tip-'+t.id,text:(t.t+' '+t.d+' '+t.p+' trackpad setting').toLowerCase()});
  });

  /* ---------- search ---------- */
  function mkSearch(input,panel){
    var items=[];
    function links(){return panel.querySelectorAll('a.res')}
    function run(){
      var q=input.value.trim().toLowerCase();
      if(!q){panel.hidden=true;return}
      var words=q.split(/\s+/),res=[];
      IDX.forEach(function(e,i){
        for(var k=0;k<words.length;k++){if(e.text.indexOf(words[k])<0)return}
        var tl=e.title.toLowerCase(),s=0;
        words.forEach(function(w){s+=tl.indexOf(w)===0?3:(tl.indexOf(w)>-1?2:1)});
        res.push([s,i,e]);
      });
      res.sort(function(a,b){return b[0]-a[0]||a[1]-b[1]});
      items=res.slice(0,8).map(function(r){return r[2]});
      panel.innerHTML=items.length
        ?items.map(function(e){return '<a class="res" href="'+e.href+'"><b>'+esc(e.title)+'</b><span>'+esc(e.sub)+'</span></a>'}).join('')+(res.length>8?'<p class="more">'+(res.length-8)+' more. Keep typing to narrow it down.</p>':'')
        :'<p class="none">Nothing matches. Try a shorter word, like copy, window or file.</p>';
      panel.hidden=false;
    }
    function move(d){
      var l=links();if(!l.length)return;
      var cur=-1;Array.prototype.forEach.call(l,function(a,i){if(a.classList.contains('on'))cur=i});
      if(cur>-1)l[cur].classList.remove('on');
      cur=(cur+d+l.length)%l.length;
      l[cur].classList.add('on');l[cur].scrollIntoView({block:'nearest'});
    }
    input.addEventListener('input',run);
    input.addEventListener('focus',run);
    input.addEventListener('keydown',function(e){
      if(e.key==='ArrowDown'){e.preventDefault();move(1)}
      else if(e.key==='ArrowUp'){e.preventDefault();move(-1)}
      else if(e.key==='Enter'){
        var on=panel.querySelector('a.res.on')||panel.querySelector('a.res');
        if(on){e.preventDefault();on.click()}
      }else if(e.key==='Escape'){panel.hidden=true;input.blur()}
    });
    panel.addEventListener('click',function(){setTimeout(function(){panel.hidden=true;input.value=''},0)});
    document.addEventListener('click',function(e){
      if(!panel.hidden&&e.target!==input&&!panel.contains(e.target))panel.hidden=true;
    });
  }

  /* ---------- header and footer ---------- */
  document.getElementById('top').innerHTML=
    '<div class="wrap bar"><a class="brand" href="index.html">MacBook Air <span>Guide</span></a><nav aria-label="Pages">'+
    PAGES.map(function(p){return '<a href="'+p.file+'"'+(p.key===page?' aria-current="page"':'')+'>'+p.nav+'</a>'}).join('')+
    '</nav><div class="hsearch"><input id="hq" type="search" placeholder="Search" aria-label="Search the guide" autocomplete="off"><div class="results" id="hr" hidden></div></div></div>';
  mkSearch(document.getElementById('hq'),document.getElementById('hr'));

  document.getElementById('foot').innerHTML=
    '<div class="wrap"><div class="links">'+PAGES.map(function(p){return '<a href="'+p.file+'">'+p.nav+'</a>'}).join('')+'</div>'+
    '<p>Names and menu paths follow macOS 27 and can shift between versions. Shortcuts use the standard US layout, and the function keys can differ slightly between MacBook Air models. If a menu looks different, open System Settings and search for the setting by name. Press / on any page to search.</p></div>';

  document.addEventListener('keydown',function(e){
    var t=e.target&&e.target.tagName;
    if(e.key==='/'&&t!=='INPUT'&&t!=='TEXTAREA'){e.preventDefault();var s=document.getElementById('bq')||document.getElementById('hq');s.focus()}
  });

  /* ---------- card rendering ---------- */
  function cardHTML(g){
    var chips=g.fingers
      ?'<span class="chip">'+g.fl+'</span><span class="'+(g.tag==='On by default'?'chip on':'chip')+'">'+g.tag+'</span>'
      :'<span class="chip">'+g.kind+'</span>';
    return '<article class="card" id="c-'+g.id+'"'+(g.f?' data-f="'+g.f.join(',')+'"':'')+'>'+panelOf(g)+
      '<div class="body"><div class="meta">'+chips+'</div><h3>'+g.t.replace(/&(?!amp;)/g,'&amp;')+'</h3><p>'+g.d+'</p>'+
      (g.path?'<p class="path">'+esc(g.path)+'</p>':'')+'</div></article>';
  }
  function sectionHTML(s){
    var inner='';
    if(s.tips){
      inner='<div class="tips">'+TIPS.map(function(t){
        return '<div class="tip" id="tip-'+t.id+'"><h3>'+esc(t.t)+'</h3><p>'+esc(t.d)+'</p><code>'+esc(t.p)+'</code></div>';
      }).join('')+'</div>';
    }else{
      inner=(s.id==='point'?'<div class="pills" role="group" aria-label="Filter trackpad gestures by finger count" id="pills"></div>':'')+
        '<div class="grid">'+G.concat(X).filter(function(g){return g.sec===s.id}).map(cardHTML).join('')+'</div>';
    }
    var html='<section class="block" id="'+s.id+'"><div class="wrap"><p class="eyebrow">'+s.eye+'</p><h2>'+s.h+'</h2><p class="sub">'+s.sub+'</p>'+inner+'</div></section>';
    return s.band?'<div class="band">'+html+'</div>':html;
  }

  /* ---------- pages ---------- */
  var cycle=[
    ['refresh','Swipe down with two fingers'],
    ['shotarea','Press all three together'],
    ['scroll','Slide two fingers'],
    ['spotlight','Search anything on your Mac'],
    ['pinch','Spread or pinch with two fingers'],
    ['undo','Fix a mistake'],
    ['tfdrag','Slide three fingers to move a window'],
    ['quicklook','Preview a file without opening it'],
    ['mission','Swipe up with three fingers']
  ];
  var start=['spotlight','shotarea','secondary','undo','switchapp','forcequit'];

  if(page==='home'){
    app.innerHTML=
      '<div class="wrap hero"><p class="eyebrow">MacBook Air &nbsp;·&nbsp; macOS 27 Golden Gate</p>'+
      '<h1>Everything you do<br><em>on a Mac.</em></h1>'+
      '<p class="lede">Trackpad gestures, screenshots, search, shortcuts, files and windows. Every card shows exactly what to press or where to click.</p>'+
      '<div class="herosearch"><input id="bq" type="search" placeholder="Search the guide. Try screenshot or right-click" aria-label="Search the guide" autocomplete="off"><div class="results" id="br" hidden></div></div>'+
      '<div class="chassis" id="demo"></div><p class="cap" id="cap"><b>&nbsp;</b><span>&nbsp;</span></p></div>'+
      '<section class="block" id="start"><div class="wrap"><h2>Start here</h2><p class="sub">Six things you will use every day.</p><div class="grid">'+
      start.map(function(id){
        var g=byId[id],pg=pageOfSec[g.sec];
        return '<a class="card mini" href="'+pg.file+'#c-'+g.id+'">'+panelOf(g)+'<div class="body"><div class="meta"><span class="chip">'+esc(plain(pg.name))+'</span></div><h3>'+g.t.replace(/&(?!amp;)/g,'&amp;')+'</h3><p>'+g.d+'</p></div></a>';
      }).join('')+'</div></div></section>'+
      '<section class="block" id="browse"><div class="wrap"><h2>Browse the guide</h2><div class="tiles">'+
      PAGES.filter(function(p){return p.secs}).map(function(p){
        var n=G.concat(X).filter(function(g){return p.secs.indexOf(g.sec)>-1}).length+(p.key==='trackpad'?TIPS.length:0);
        return '<a class="tile" href="'+p.file+'"><h3>'+p.name+'</h3><p>'+p.blurb+'</p><span class="go">'+n+' cards ›</span></a>';
      }).join('')+'</div></div></section>';
    mkSearch(document.getElementById('bq'),document.getElementById('br'));

    var demo=document.getElementById('demo'),cap=document.getElementById('cap'),i=0;
    var show=function(){
      var c=cycle[i],g=byId[c[0]];
      demo.innerHTML=panelOf(g);
      cap.innerHTML='<b>'+g.t.replace(/&(?!amp;)/g,'&amp;')+'</b><span>'+c[1]+'</span>';
    };
    show();
    var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!reduce){
      setInterval(function(){
        cap.classList.add('fade');
        setTimeout(function(){i=(i+1)%cycle.length;show();cap.classList.remove('fade')},250);
      },3600);
    }
  }else{
    var p=pageByKey[page];
    app.innerHTML='<div class="wrap phead"><p class="eyebrow">MacBook Air Guide</p><h1>'+p.name+'</h1><p class="lede">'+p.blurb+'</p></div>'+
      p.secs.map(function(id){return sectionHTML(secById[id])}).join('');

    if(page==='trackpad'){
      var pills=document.getElementById('pills'),n='all';
      var applyPills=function(){
        document.querySelectorAll('.card[data-f]').forEach(function(c){
          c.hidden=!(n==='all'||c.dataset.f.split(',').indexOf(n)>-1);
        });
        ['point','scroll','drag','more'].forEach(function(id){
          var s=document.getElementById(id);
          s.hidden=!Array.prototype.some.call(s.querySelectorAll('.card'),function(c){return !c.hidden});
        });
        Array.prototype.forEach.call(pills.children,function(b){b.setAttribute('aria-pressed',String(b.dataset.n===n))});
      };
      [['all','All gestures'],['1','1 finger'],['2','2 fingers'],['3','3 fingers'],['4','4 fingers']].forEach(function(o){
        var b=document.createElement('button');
        b.className='pill';b.type='button';b.dataset.n=o[0];b.textContent=o[1];
        b.addEventListener('click',function(){n=o[0];applyPills()});
        pills.appendChild(b);
      });
      applyPills();
    }
  }

  /* ---------- jump to a card from a search result ---------- */
  function focusHash(){
    var h=decodeURIComponent(location.hash.slice(1));
    if(!h)return;
    var el=document.getElementById(h);
    if(!el)return;
    Array.prototype.forEach.call(document.querySelectorAll('.hit'),function(x){x.classList.remove('hit')});
    if(el.hidden)el.hidden=false;
    el.classList.add('hit');
    el.scrollIntoView({block:'center'});
  }
  window.addEventListener('hashchange',focusHash);
  focusHash();
})();
