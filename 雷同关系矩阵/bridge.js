(() => {
 const data=window.MatrixData,colors=['#f43f5e','#f97316','#f59e0b','#0ea5e9'],outer=['#fb7185','#fb923c','#fbbf24','#38bdf8'],names=['关键指标雷同','投标文件雷同','股权关系','清单错误雷同'];
 const ids=[['machineCode','idCode','lockNumber','ipAddress','contactPerson'],['metadata','mainElements','techBidContent'],['controllingInterest','personnelRelation','infoIdentical'],['quotaMismatch','quotaQuantityError','materialFeatureMismatch','materialTypoError','materialNameIrregular','materialSpecIrregular','materialPriceIrregular']];
 const rules=Object.entries(categoryDefinitions).map(([key,def],i)=>({key,name:names[i],color:colors[i],outerColor:outer[i],rules:def.metrics.map(([name,groups],j)=>({id:ids[i][j],name,groups}))}));
 const findings=data.pairs.flatMap(pair=>pair.details.map(detail=>({pair,detail})));
 const rows=data.companies.map((company,u)=>{const map={};rules.forEach((cat,i)=>cat.rules.forEach(rule=>{const fs=findings.filter(f=>(f.pair.a===u||f.pair.b===u)&&rule.groups.includes(f.detail.issueType||f.detail.group));const detail=fs[0]?.detail;map[rule.id]={subRuleId:rule.id,subRuleName:rule.name,category:cat.key,categoryName:cat.name,isTriggered:fs.length>0,relatedCompanies:[...new Set(fs.map(f=>data.companies[f.pair.a===u?f.pair.b:f.pair.a][0]))],evidenceValue:detail?.relationPath?.join('；')||detail?.values?.filter(v=>v!=='—').join(' / ')||'',evidenceFact:detail?.description||'',legalBasis:{statute:'原型示例 · '+rule.name,clause:'',originalText:'根据两家单位相应字段或内容的比对结果形成问题线索，具体内容以详细分析中的原始记录为准，供专家核查。'},pair:fs[0]?.pair};}));return {companyId:'c'+(u+1),companyName:company[0],ruleEvidenceMap:map,triggeredCount:findings.filter(f=>f.pair.a===u||f.pair.b===u).length};});
 const categories=rules.map((cat,i)=>{const count=findings.filter(f=>f.detail.category===i).length;return {...cat,count,percentage:findings.length?count/findings.length*100:0,subRules:cat.rules.map(rule=>{const fs=findings.filter(f=>rule.groups.includes(f.detail.issueType||f.detail.group));const units=[...new Set(fs.flatMap(f=>[f.pair.a,f.pair.b]))];return {id:rule.id,name:rule.name,count:units.length,companies:units.map(u=>data.companies[u][0]),evidence:fs[0]?.detail.description||''};}).filter(r=>r.count)};});
 const top=rows.filter(r=>r.triggeredCount).sort((a,b)=>b.triggeredCount-a.triggeredCount).slice(0,3).map((r,i)=>({rank:i+1,name:r.companyName,count:r.triggeredCount,rankColor:['bg-rose-500 text-white','bg-orange-500 text-white','bg-amber-500 text-white'][i],badgeColor:['bg-rose-50 text-rose-700 border-rose-200','bg-orange-50 text-orange-700 border-orange-200','bg-amber-50 text-amber-700 border-amber-200'][i]}));
 window.FaithfulData={rows,categories,top,total:findings.length,affected:rows.filter(r=>r.triggeredCount).length,groups:data.pairs.filter(p=>p.total).length};
 window.openMatrixDetail=openDetail;
 window.legacyMatrixCard=document.querySelector('#root main .card');
 window.legacyMatrixCard.id='unit-panel';
 window.legacyMatrixCard.append(document.getElementById('popover'));
 document.querySelector('#root main').remove();
})();

(() => {
 const popup=document.createElement('dialog');popup.id='analysis-popup';popup.setAttribute('aria-labelledby','analysis-popup-title');
 popup.innerHTML='<header><h2 id="analysis-popup-title">单位问题详细分析</h2><button type="button" aria-label="关闭详情弹窗">✕</button></header><iframe title="单位问题详细分析内容"></iframe>';
 document.body.append(popup);
 const frame=popup.querySelector('iframe');
 popup.querySelector('button').onclick=()=>popup.close();
 popup.addEventListener('close',()=>{frame.src='about:blank';});
 popup.addEventListener('click',e=>{if(e.target===popup){const r=popup.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)popup.close();}});
 window.showAnalysisPopup=url=>{frame.src=url;if(!popup.open)popup.showModal();};
})();
