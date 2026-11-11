// 在原异常行为页初始化分页前，构造当前单位的演示记录。
(() => {
  const unit=new URLSearchParams(location.search).get('unit');
  if(!unit)return;
  const {companies,selves}=window.MatrixData;
  const index=companies.findIndex(c=>c[0]===unit);
  const records=selves[index]?.behavior||[];
  document.querySelectorAll('[data-accordion-item]').forEach(item=>{
    const title=item.querySelector('.accordion-title').textContent.trim();
    const tbody=item.querySelector('tbody');
    tbody.replaceChildren();
    records.filter(r=>r.group===title).forEach((record,i)=>{
      const row=document.createElement('tr');row.dataset.rowIndex=String(i);
      [i+1,unit,...record.values].forEach(value=>{const cell=document.createElement('td');cell.textContent=String(value);cell.title=String(value);if(value==='未下载')cell.className='download-missing';row.appendChild(cell);});
      tbody.appendChild(row);
    });
    item.hidden=tbody.children.length===0;
    item.querySelector('.total').textContent='共'+tbody.children.length+'条';
  });
  if(!records.length){const empty=document.createElement('p');empty.textContent=index<0?'未找到对应单位':unit+'：投标行为无异常';empty.style.cssText='margin:48px 16px;text-align:center;color:#5c5c5c';empty.setAttribute('role','status');document.querySelector('main').appendChild(empty);}
})();
