// 在原详情页初始化之前，将示例表格替换为所选单位组合的共享数据。
(() => {
  const params=new URLSearchParams(location.search);
  if(!params.has('unitA')||!params.has('unitB'))return;
  const {companies,pairs,selves}=window.MatrixData;
  const a=companies.findIndex(c=>c[0]===params.get('unitA'));
  const b=companies.findIndex(c=>c[0]===params.get('unitB'));
  const selected=a===b?selves[a]:pairs.find(p=>(p.a===a&&p.b===b)||(p.a===b&&p.b===a));
  const path=decodeURIComponent(location.pathname);
  const category=path.includes('/围串标/')?0:path.includes('/雷同性/')?1:path.includes('/股权/')?2:3;
  const records=selected?.details.filter(d=>d.category===category)||[];
  document.querySelectorAll('table.data-table,table.unit-table').forEach(table=>{
    const group=table.closest('[data-accordion-item]')?.querySelector('.accordion-title')?.textContent.trim();
    const template=table.querySelector('tbody tr')?.cloneNode(true);
    const tbody=table.querySelector('tbody');tbody.replaceChildren();
    if(category===2){
      if(!records.length||!template)return;
      const row=template.cloneNode(true);
      const counts=[1,companies[a][0],a===b?0:1,records.filter(r=>r.issueType==='间接控股').length,records.filter(r=>r.issueType==='主要人员审查').length,records.filter(r=>r.issueType==='年报邮箱审查').length];
      [...row.cells].forEach((cell,i)=>{if(i<6){cell.textContent=counts[i];cell.title=String(counts[i]);}});
      const button=row.querySelector('.view-link');
      if(button){button.dataset.unit=companies[a][0];button.title='查看所选单位的股权关联示例';button.setAttribute('aria-label','查看'+companies[a][0]+'的股权关联详情');}
      tbody.appendChild(row);return;
    }
    records.filter(d=>d.group===group).forEach((record,index)=>{
      if(!template)return;
      const row=template.cloneNode(true);row.dataset.rowIndex=String(index);row.dataset.matrixDetail=record.description;
      const heads=[...table.querySelectorAll('thead th')].map(th=>th.textContent.trim());
      let valueIndex=0;
      [...row.cells].forEach((cell,i)=>{
        let value;
        if(i===0)value=String(index+1);
        else if(heads[i]==='单位名称')value=companies[a][0];
        else if(heads[i].startsWith('关联单位'))value=companies[b][0];
        else if(heads[i]==='查看'){
          cell.querySelectorAll('button,a').forEach(button=>{button.setAttribute('aria-label','查看'+record.description);button.title='查看详情';});return;
        }else value=record.values[valueIndex++]??'—';
        cell.textContent=value;cell.title=value;
      });
      tbody.appendChild(row);
    });
  });
  // 原页面的空详情弹窗改为展示所选记录，不再加载空白页面。
  document.addEventListener('click',event=>{
    const button=event.target.closest('.view-button');
    const row=button?.closest('[data-matrix-detail]');if(!row)return;
    event.preventDefault();event.stopImmediatePropagation();
    const dialog=document.createElement('dialog');
    dialog.style.cssText='width:min(720px,calc(100vw - 32px));padding:24px;border:1px solid #ddd;border-radius:8px;color:#333;font:14px/1.8 Microsoft YaHei,sans-serif';
    const title=document.createElement('h2');title.textContent='投标文件雷同明细';title.style.fontSize='18px';
    const names=document.createElement('p');names.textContent=companies[a][0]+(a===b?'（自身维度）':' / '+companies[b][0]);
    const detail=document.createElement('p');detail.textContent=row.dataset.matrixDetail;
    const close=document.createElement('button');close.textContent='关闭';close.style.cssText='padding:6px 18px;border:0;border-radius:4px;background:#2590eb;color:white;cursor:pointer';close.onclick=()=>dialog.close();
    dialog.append(title,names,detail,close);document.body.append(dialog);dialog.addEventListener('close',()=>{dialog.remove();button.focus();});dialog.showModal();
  },true);
  document.addEventListener('DOMContentLoaded',()=>{
    if(category===2&&records.length&&typeof detailData!=='undefined'){
      detailData[companies[a][0]]=records.map(record=>({relatedUnit:a===b?companies[a][0]+'（自身维度）':companies[b][0],issueType:record.issueType,riskLevel:record.riskLevel,relationPath:[companies[a][0]+(a===b?'（自身维度）':' / '+companies[b][0]),...record.relationPath],evidence:record.description}));
    }
    const empty=document.querySelector('.unit-empty');
    if(empty)empty.textContent=selected?'当前'+(a===b?'单位自身':'单位组合')+'未发现'+['关键指标雷同','投标文件雷同','股权关系','清单错误'][category]+'问题':'未找到对应的单位组合';
  });
})();
