'use strict';
// 静态示例数据沿用原项目，不需要网络或模块加载。
const {companies,pairs,selves,items}=window.MatrixData;
const labels=['围串标问题数','投标文件雷同问题数','股权问题数','清单错误问题数'];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=paths=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+paths+'</svg>';
const grid=icon('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>');
const table=icon('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 9v12M15 9v12"/>');
document.getElementById('root').innerHTML=`<main><section class="card"><header class="header"><div><h1>雷同关系矩阵</h1><div class="legend">低<span class="gradient"></span>高<span class="note">（触发 ≥1 项规则标红，0 项标绿）</span></div></div><div class="controls"><div class="filters" role="group" aria-label="风险筛选">${[['all','全部'],['high','高危'],['medium','中危'],['normal','正常']].map(([key,label])=>`<button data-filter="${key}">${key==='all'?'':'<span class="dot"></span>'}${label}</button>`).join('')}</div><div class="views" role="group" aria-label="视图切换"><button data-view="matrix">${grid}矩阵</button><button data-view="table">${table}表格</button></div></div></header><div id="content"></div></section></main><aside id="popover" class="popover" aria-label="检测概况" hidden></aside>`;
const content=document.getElementById('content'),popover=document.getElementById('popover');
let view='matrix',filter='all',timer,anchor;
function matches(item){return filter==='all'||filter==='high'&&item.rules>=2||filter==='medium'&&item.rules===1||filter==='normal'&&item.rules===0;}
function names(item){return esc(companies[item.a][0])+(item.a===item.b?'': ' vs '+esc(companies[item.b][0]));}
function metrics(item){
 if(item.a===item.b)return [['清单审查',item.review.abnormal],['投标行为',item.behavior.length>0]].map(([label,abnormal])=>`<div class="metric-line"><span>${label}</span><strong class="${abnormal?'danger':'good'}">${abnormal?'异常':'无异常'}</strong></div>`).join('');
 return labels.map((label,i)=>`<div class="metric-line"><span>${label}</span><strong class="${item.counts[i]?'danger':''}">${item.counts[i]}</strong></div>`).join('');
}
function hidePopover(){clearTimeout(timer);popover.hidden=true;anchor=null;}
function scheduleHide(){clearTimeout(timer);timer=setTimeout(hidePopover,150);}
function render(){
 hidePopover();
 document.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter===filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);});
 document.querySelectorAll('[data-view]').forEach(b=>{const active=b.dataset.view===view;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);});
 if(view==='matrix'){
  content.innerHTML='<div class="matrix-scroll"><div class="matrix" aria-label="投标单位雷同关系矩阵"><div class="matrix-head"><div class="row-label"></div>'+companies.map(c=>`<div class="column-label" title="${esc(c[0])}">${c[2]}</div>`).join('')+'</div>'+companies.map((row,i)=>`<div class="matrix-row"><div class="row-label" title="${esc(row[0])}">${row[1]}</div>`+companies.map((col,j)=>{const item=i===j?selves[i]:items.get(Math.min(i,j)+'_'+Math.max(i,j));return `<button class="cell ${item.rules?'triggered ':''}${matches(item)?'':'dimmed'}" data-item="${item.id}" aria-label="${names(item)}${i===j?'（自身维度）':''}，触发 ${item.rules} 项规则">${i===j?'<span class="self-badge">自身</span>':''}<strong>${item.rules}</strong><span class="unit">项</span></button>`;}).join('')+'</div>').join('')+'</div></div>';
 }else{
  const filtered=pairs.filter(matches);
  content.innerHTML='<div class="table-scroll"><table aria-label="投标单位雷同分析列表"><thead><tr>'+['序','组合','问题总数',...labels].map(label=>`<th scope="col">${label}</th>`).join('')+'</tr></thead><tbody>'+(filtered.length?filtered.map((item,i)=>`<tr data-pair="${item.id}" class="${item.rules?'risk-row':''}"><td class="sequence">${i+1}</td><td class="pair-name"><span class="dot"></span><button class="pair-button" data-item="${item.id}">${esc(companies[item.a][0])}<span class="vs">vs</span>${esc(companies[item.b][0])}</button></td>`+[item.total,...item.counts].map(n=>`<td class="metric ${n?'nonzero':''}">${n}</td>`).join('')+'</tr>').join(''):'<tr><td colspan="7" class="empty">暂无符合筛选条件的比对记录</td></tr>')+'</tbody></table></div>';
 }
}
function showPopover(target){
 clearTimeout(timer);anchor=target;const item=items.get(target.dataset.item);
 popover.innerHTML='<div class="popover-title">'+(item.a===item.b?`<span title="${esc(companies[item.a][0])}">${esc(companies[item.a][0])}</span>`:`<span title="${esc(companies[item.a][0])}">${esc(companies[item.a][0])}</span><em>vs</em><span title="${esc(companies[item.b][0])}">${esc(companies[item.b][0])}</span>`)+`</div><div class="popover-summary"><span class="${item.rules?'bad':'good'}"><strong>${item.rules}</strong> 项规则触发</span><span class="badge ${item.rules?'badge-danger':''}">${item.a===item.b?(item.rules?'存在异常':'无异常'):(item.rules?'高危预警':'正常')}</span></div>`+metrics(item)+`<div class="popover-footer"><button class="link" data-detail="${item.id}">查看详细分析</button></div>`;
 popover.hidden=false;const r=target.getBoundingClientRect(),b=popover.getBoundingClientRect();
 popover.style.left=Math.max(8,Math.min(r.left+r.width/2-b.width/2,innerWidth-b.width-8))+'px';
 popover.style.top=Math.max(8,Math.min(r.top>b.height+18?r.top-b.height-10:r.bottom+10,innerHeight-b.height-8))+'px';
}
function openDetail(item){
 hidePopover();
 const url=new URL(item.a===item.b?'./tab-page.html':'../tab-page.html',location.href);
 if(item.a===item.b)url.searchParams.set('unit',companies[item.a][0]);
 else{url.searchParams.set('unitA',companies[item.a][0]);url.searchParams.set('unitB',companies[item.b][0]);}
 window.open(url.href,'_blank','noopener');
}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;render();}));
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.view;render();}));
content.addEventListener('click',e=>{const target=e.target.closest('[data-item],[data-pair]');if(target)openDetail(items.get(target.dataset.item||target.dataset.pair));});
content.addEventListener('mouseover',e=>{const cell=e.target.closest('.cell');if(cell&&cell!==anchor)showPopover(cell);});
content.addEventListener('mouseout',e=>{const cell=e.target.closest('.cell');if(cell&&!cell.contains(e.relatedTarget))scheduleHide();});
content.addEventListener('focusin',e=>{if(e.target.matches('.cell'))showPopover(e.target);});
content.addEventListener('focusout',e=>{if(e.target.matches('.cell')&&!popover.contains(e.relatedTarget))scheduleHide();});
popover.addEventListener('mouseenter',()=>clearTimeout(timer));popover.addEventListener('mouseleave',scheduleHide);
popover.addEventListener('focusin',()=>clearTimeout(timer));popover.addEventListener('focusout',scheduleHide);
popover.addEventListener('click',e=>{const b=e.target.closest('[data-detail]');if(b){openDetail(items.get(b.dataset.detail));}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')hidePopover();});
window.addEventListener('resize',hidePopover);window.addEventListener('scroll',e=>{if(!popover.contains(e.target))hidePopover();},true);
render();
