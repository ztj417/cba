'use strict';
// 静态示例数据沿用原项目，不需要网络或模块加载。
const {companies,pairs,selves,items}=window.MatrixData;
const labels=['围串标问题数','投标文件雷同问题数','股权问题数','清单错误问题数'];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=paths=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+paths+'</svg>';
const grid=icon('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>');
const table=icon('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 9v12M15 9v12"/>');
<<<<<<< HEAD
document.getElementById('root').innerHTML=`<main><section class="card"><header class="header"><div><h1>清单问题矩阵</h1><div class="legend">低<span class="gradient"></span>高<span class="note">（当前规则范围：触发 ≥1 项规则标红，0 项标绿）</span></div></div><div class="controls"><div class="filters" role="group" aria-label="风险筛选">${[['all','全部'],['abnormal','异常'],['normal','正常']].map(([key,label])=>`<button data-filter="${key}">${key==='all'?'':'<span class="dot"></span>'}${label}</button>`).join('')}</div><div class="views" role="group" aria-label="视图切换"><button data-view="matrix">${grid}矩阵</button><button data-view="table">${table}表格</button></div></div></header><div class="rule-search"><label for="rule-category">规则：</label><select id="rule-category"><option value="all">全部</option><option value="keyIndicator">关键指标雷同</option><option value="docSimilarity">投标文件雷同</option><option value="equityRelation">股权关系</option><option value="listError">清单错误雷同</option></select><span id="scope-note">按规则类别查看两两单位的雷同情况</span></div><div id="content"></div></section></main><aside id="popover" class="popover" aria-label="检测概况" hidden></aside>`;
const content=document.getElementById('content'),popover=document.getElementById('popover');
let view='matrix',filter='all',category='all',page=1,pageSize=10,matrixScale=1,timer,anchor;
=======
document.getElementById('root').innerHTML=`<main><section class="card"><header class="header"><div><h1>清单问题矩阵</h1><div class="legend">低<span class="gradient"></span>高<span class="note">（当前规则范围：触发 ≥1 项规则标红，0 项标绿）</span></div></div><div class="controls"><div class="filters" role="group" aria-label="风险筛选">${[['all','全部'],['high','高危'],['medium','中危'],['normal','正常']].map(([key,label])=>`<button data-filter="${key}">${key==='all'?'':'<span class="dot"></span>'}${label}</button>`).join('')}</div><div class="views" role="group" aria-label="视图切换"><button data-view="matrix">${grid}矩阵</button><button data-view="table">${table}表格</button></div></div></header><div class="rule-search"><label for="rule-category">规则：</label><select id="rule-category"><option value="all">全部</option><option value="keyIndicator">关键指标雷同</option><option value="docSimilarity">投标文件雷同</option><option value="equityRelation">股权关系</option><option value="listError">清单错误雷同</option></select><span id="scope-note">按规则类别查看两两单位的雷同情况</span></div><div id="content"></div></section></main><aside id="popover" class="popover" aria-label="检测概况" hidden></aside>`;
const content=document.getElementById('content'),popover=document.getElementById('popover');
let view='matrix',filter='all',category='all',page=1,pageSize=10,timer,anchor;
>>>>>>> db4c365f6d90c2416d14d67e54819df21ffe05a4
const categoryDefinitions={
 keyIndicator:{index:0,metrics:[['机器码雷同',['机器码一致']],['标识码雷同',['标识码一致']],['锁号雷同',['锁号一致']],['IP雷同',['IP一致']],['单位联系人雷同',['单位联系人一致']]]},
 docSimilarity:{index:1,metrics:[['元数据雷同',['元数据一致']],['主体要素',['主体要素一致']],['技术标内容雷同',['技术标内容一致']]]},
 equityRelation:{index:2,metrics:[['控股关系',['间接控股','参股关系','控股关系']],['人员关系',['主要人员审查']],['信息相同',['年报邮箱审查','年报电话审查']]]},
 listError:{index:3,metrics:[['定额错套错误雷同',['定额错套错误雷同']],['定额工程量错误雷同',['定额工程量错误雷同']],['材料和特征不匹配错误雷同',['材料和特征不匹配错误雷同']],['材料错别字错误雷同',['材料错别字错误雷同']],['材料名称不规范错误雷同',['材料名称不规范错误雷同']],['材料规格型号不规范错误雷同',['材料规格型号不规范错误雷同']],['同类材料价格不规律错误雷同',['同类材料价格不规律错误雷同']]]}
};
function activeStats(item){
 if(item.a===item.b||category==='all')return {rules:item.rules,total:item.total,metrics:labels.map((label,i)=>({label,count:item.counts[i]}))};
 const definition=categoryDefinitions[category];
 const records=item.details.filter(d=>d.category===definition.index);
 const metrics=definition.metrics.map(([label,groups])=>({label,count:records.filter(d=>groups.includes(d.issueType||d.group)).length}));
 return {rules:metrics.filter(m=>m.count>0).length,total:records.length,metrics};
}
<<<<<<< HEAD
function matches(item){const {rules}=activeStats(item);return filter==='all'||filter==='abnormal'&&rules>0||filter==='normal'&&rules===0;}
=======
function matches(item){const {rules}=activeStats(item);return filter==='all'||filter==='high'&&rules>=2||filter==='medium'&&rules===1||filter==='normal'&&rules===0;}
>>>>>>> db4c365f6d90c2416d14d67e54819df21ffe05a4
function columnName(name){
 const suffix=['装饰工程有限公司','建工有限公司','工程有限公司','有限公司'].find(s=>name.endsWith(s));
 const split=suffix?name.length-suffix.length:Math.ceil(name.length/2);
 return '<span class="company-prefix">'+esc(name.slice(0,split))+'</span><span class="company-suffix">'+esc(name.slice(split))+'</span>';
}
function names(item){return esc(companies[item.a][0])+(item.a===item.b?'': ' vs '+esc(companies[item.b][0]));}
function metrics(item){
 if(item.a===item.b)return [['清单审查',item.review.abnormal],['投标行为',item.behavior.length>0]].map(([label,abnormal])=>`<div class="metric-line"><span>${label}</span><strong class="${abnormal?'danger':'good'}">${abnormal?'异常':'无异常'}</strong></div>`).join('');
 return activeStats(item).metrics.map(({label,count})=>`<div class="metric-line"><span>${label}</span><strong class="${count?'danger':''}">${count}</strong></div>`).join('');
}
function hidePopover(){clearTimeout(timer);popover.hidden=true;anchor=null;}
function scheduleHide(){clearTimeout(timer);timer=setTimeout(hidePopover,150);}
<<<<<<< HEAD
function updateMatrixScale(){
 const matrix=content.querySelector('.matrix');
 if(matrix)matrix.style.zoom=String(matrixScale);
 const label=content.querySelector('.zoom-level');
 if(label)label.textContent=Math.round(matrixScale*100)+'%';
}
=======
>>>>>>> db4c365f6d90c2416d14d67e54819df21ffe05a4
function render(){
 hidePopover();
 document.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter===filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);});
 document.querySelectorAll('[data-view]').forEach(b=>{const active=b.dataset.view===view;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);});
 document.getElementById('scope-note').textContent=category==='all'?'按规则类别查看两两单位的雷同情况':'当前类别仅筛选两两比对；自身方框仍展示清单审查与投标行为';
 if(view==='matrix'){
<<<<<<< HEAD
  content.innerHTML='<div class="matrix-zoom-tools"><span>滚轮缩放矩阵</span><span class="zoom-level" aria-live="polite">100%</span><button type="button" id="zoom-reset">恢复原大小</button></div><div class="matrix-scroll" tabindex="0" aria-label="可缩放矩阵，滚轮放大缩小"><div class="matrix" aria-label="投标单位清单问题矩阵"><div class="matrix-head"><div class="row-label"></div>'+companies.map(c=>`<div class="column-label" title="${esc(c[0])}">${columnName(c[0])}</div>`).join('')+'</div>'+companies.map((row,i)=>`<div class="matrix-row"><div class="row-label" title="${esc(row[0])}">${esc(row[0])}</div>`+companies.map((col,j)=>{
=======
  content.innerHTML='<div class="matrix-scroll"><div class="matrix" aria-label="投标单位清单问题矩阵"><div class="matrix-head"><div class="row-label"></div>'+companies.map(c=>`<div class="column-label" title="${esc(c[0])}">${columnName(c[0])}</div>`).join('')+'</div>'+companies.map((row,i)=>`<div class="matrix-row"><div class="row-label" title="${esc(row[0])}">${esc(row[0])}</div>`+companies.map((col,j)=>{
>>>>>>> db4c365f6d90c2416d14d67e54819df21ffe05a4
   const item=i===j?selves[i]:items.get(Math.min(i,j)+'_'+Math.max(i,j));
   const stats=activeStats(item);
   return `<button class="cell ${stats.rules?'triggered ':''}${matches(item)?'':'dimmed'}" data-item="${item.id}" aria-label="${names(item)}${i===j?'（自身维度）':''}，触发 ${stats.rules} 项规则">${i===j?'<span class="self-badge">自身</span>':''}<strong>${stats.rules}</strong><span class="unit">项</span></button>`;
  }).join('')+'</div>').join('')+'</div></div>';
<<<<<<< HEAD
  updateMatrixScale();
=======
>>>>>>> db4c365f6d90c2416d14d67e54819df21ffe05a4
 }else{
  const filtered=pairs.filter(matches);
  const totalPages=Math.max(1,Math.ceil(filtered.length/pageSize));
  page=Math.min(Math.max(1,page),totalPages);
  const offset=(page-1)*pageSize;
  const visible=filtered.slice(offset,offset+pageSize);
  const metricHeaders=activeStats(pairs[0]).metrics.map(m=>m.label);
  const headers=['序','组合',category==='all'?'问题总数':'触发项数',...metricHeaders];
  content.innerHTML='<div class="table-scroll"><table aria-label="投标单位雷同分析列表"><thead><tr>'+headers.map(label=>`<th scope="col">${esc(label)}</th>`).join('')+'</tr></thead><tbody>'+(filtered.length?visible.map((item,i)=>{
   const stats=activeStats(item);
   return `<tr data-pair="${item.id}" class="${stats.rules?'risk-row':''}"><td class="sequence">${offset+i+1}</td><td class="pair-name"><span class="dot"></span><button class="pair-button" data-item="${item.id}">${esc(companies[item.a][0])}<span class="vs">vs</span>${esc(companies[item.b][0])}</button></td>`+[category==='all'?stats.total:stats.rules,...stats.metrics.map(m=>m.count)].map(n=>`<td class="metric ${n?'nonzero':''}">${n}</td>`).join('')+'</tr>';
  }).join(''):`<tr><td colspan="${headers.length}" class="empty">暂无符合筛选条件的比对记录</td></tr>`)+'</tbody></table></div>';
  content.innerHTML+=`<nav class="table-pager" aria-label="表格分页"><span class="page-status" role="status">共 ${filtered.length} 条，第 ${page} / ${totalPages} 页</span><button type="button" data-page="${page-1}" ${page===1?'disabled':''} aria-label="上一页">${icon('<path d="m14 6-6 6 6 6"/>')}</button>${Array.from({length:totalPages},(_,i)=>`<button type="button" data-page="${i+1}" ${page===i+1?'aria-current="page"':''} aria-label="第 ${i+1} 页">${i+1}</button>`).join('')}<button type="button" data-page="${page+1}" ${page===totalPages?'disabled':''} aria-label="下一页">${icon('<path d="m10 6 6 6-6 6"/>')}</button><select id="page-size" aria-label="每页条数">${[10,20,50].map(n=>`<option value="${n}" ${n===pageSize?'selected':''}>${n} 条/页</option>`).join('')}</select><label class="page-jump-label">跳至 <input id="page-jump" type="number" min="1" max="${totalPages}" value="${page}" aria-label="跳转页码"> 页</label><button type="button" id="page-go">确定</button></nav>`;
 }
}
function showPopover(target){
 clearTimeout(timer);anchor=target;const item=items.get(target.dataset.item);const stats=activeStats(item);
<<<<<<< HEAD
 popover.innerHTML='<div class="popover-title">'+(item.a===item.b?`<span title="${esc(companies[item.a][0])}">${esc(companies[item.a][0])}</span>`:`<span title="${esc(companies[item.a][0])}">${esc(companies[item.a][0])}</span><em>vs</em><span title="${esc(companies[item.b][0])}">${esc(companies[item.b][0])}</span>`)+`</div><div class="popover-summary"><span class="${stats.rules?'bad':'good'}"><strong>${stats.rules}</strong> 项规则触发</span><span class="badge ${stats.rules?'badge-danger':''}">${item.a===item.b?(stats.rules?'存在异常':'无异常'):(stats.rules?'异常':'正常')}</span></div>`+metrics(item)+`<div class="popover-footer"><button class="link" data-detail="${item.id}">查看详细分析</button></div>`;
=======
 popover.innerHTML='<div class="popover-title">'+(item.a===item.b?`<span title="${esc(companies[item.a][0])}">${esc(companies[item.a][0])}</span>`:`<span title="${esc(companies[item.a][0])}">${esc(companies[item.a][0])}</span><em>vs</em><span title="${esc(companies[item.b][0])}">${esc(companies[item.b][0])}</span>`)+`</div><div class="popover-summary"><span class="${stats.rules?'bad':'good'}"><strong>${stats.rules}</strong> 项规则触发</span><span class="badge ${stats.rules?'badge-danger':''}">${item.a===item.b?(stats.rules?'存在异常':'无异常'):(stats.rules>=2?'高危预警':stats.rules===1?'中危预警':'正常')}</span></div>`+metrics(item)+`<div class="popover-footer"><button class="link" data-detail="${item.id}">查看详细分析</button></div>`;
>>>>>>> db4c365f6d90c2416d14d67e54819df21ffe05a4
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
document.getElementById('rule-category').addEventListener('change',e=>{category=e.target.value;page=1;render();});
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;page=1;render();}));
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.view;render();}));
content.addEventListener('click',e=>{const target=e.target.closest('[data-item],[data-pair]');if(target)openDetail(items.get(target.dataset.item||target.dataset.pair));});
function changePage(value){
 const last=Math.max(1,Math.ceil(pairs.filter(matches).length/pageSize));
 page=Math.min(last,Math.max(1,Math.trunc(Number(value))||1));
 render();
}
content.addEventListener('click',e=>{
 const button=e.target.closest('[data-page]');
 if(button&&!button.disabled){changePage(button.dataset.page);content.querySelector(`[data-page="${page}"][aria-current]`)?.focus();}
 if(e.target.closest('#page-go'))changePage(document.getElementById('page-jump').value);
});
content.addEventListener('change',e=>{
 if(e.target.id==='page-size'){pageSize=Number(e.target.value);page=1;render();document.getElementById('page-size').focus();}
});
content.addEventListener('keydown',e=>{
 if(e.target.id==='page-jump'&&e.key==='Enter'){e.preventDefault();changePage(e.target.value);document.getElementById('page-jump').focus();}
});
content.addEventListener('mouseover',e=>{const cell=e.target.closest('.cell');if(cell&&cell!==anchor)showPopover(cell);});
content.addEventListener('mouseout',e=>{const cell=e.target.closest('.cell');if(cell&&!cell.contains(e.relatedTarget))scheduleHide();});
content.addEventListener('focusin',e=>{if(e.target.matches('.cell'))showPopover(e.target);});
content.addEventListener('focusout',e=>{if(e.target.matches('.cell')&&!popover.contains(e.relatedTarget))scheduleHide();});
popover.addEventListener('mouseenter',()=>clearTimeout(timer));popover.addEventListener('mouseleave',scheduleHide);
popover.addEventListener('focusin',()=>clearTimeout(timer));popover.addEventListener('focusout',scheduleHide);
popover.addEventListener('click',e=>{const b=e.target.closest('[data-detail]');if(b){openDetail(items.get(b.dataset.detail));}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')hidePopover();});
<<<<<<< HEAD
// 仅在矩阵视口拦截滚轮；缩放以鼠标所在内容点为中心。
content.addEventListener('wheel',event=>{
 const viewport=event.target.closest('.matrix-scroll');
 if(!viewport||view!=='matrix'||event.deltaY===0)return;
 event.preventDefault();
 hidePopover();
 const previous=matrixScale;
 const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?viewport.clientHeight:1);
 matrixScale=Math.max(.5,Math.min(2,previous*Math.exp(-Math.max(-120,Math.min(120,delta))*.0015)));
 if(matrixScale===previous)return;
 const rect=viewport.getBoundingClientRect();
 const x=event.clientX-rect.left,y=event.clientY-rect.top;
 const contentX=(viewport.scrollLeft+x)/previous,contentY=(viewport.scrollTop+y)/previous;
 updateMatrixScale();
 viewport.scrollLeft=contentX*matrixScale-x;
 viewport.scrollTop=contentY*matrixScale-y;
},{passive:false});
content.addEventListener('click',event=>{
 if(event.target.closest('#zoom-reset')){
  matrixScale=1;hidePopover();updateMatrixScale();
  const viewport=content.querySelector('.matrix-scroll');
  viewport.scrollLeft=0;viewport.scrollTop=0;
 }
});
=======
>>>>>>> db4c365f6d90c2416d14d67e54819df21ffe05a4
window.addEventListener('resize',hidePopover);window.addEventListener('scroll',e=>{if(!popover.contains(e.target))hidePopover();},true);
render();
