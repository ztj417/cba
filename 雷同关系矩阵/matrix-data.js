// 矩阵和详情页共享的原型数据。问题明细为演示数据，数量与首页统计一致。
(() => {
  const companies=[['东棚建筑工程有限公司','东棚建筑工程...','东棚建筑...'],['晋建集团八建建工有限公司','晋建集团八建...','晋建集团...'],['热地亚市政工程有限公司','热地亚市政工...','热地亚市...'],['博天建设工程有限公司','博天建设工程...','博天建设...'],['悦达建筑装饰工程有限公司','悦达建筑装饰...','悦达建筑...'],['仕曙建设工程有限公司','仕曙建设工程...','仕曙建设...'],['美达建设工程有限公司','美达建设工程...','美达建设...']];
  const pairs=[],selves=[],items=new Map();
  function make(id,a,b,flag){
    const item={id,a,b};
    item.details=flag?[
      {category:0,group:'机器码一致',values:['DEMO-MACHINE-001','—','—'],description:'文件制作机器码一致（原型示例）'},
      {category:1,group:'元数据一致',values:['1','0','0'],description:'文件作者元数据一致（原型示例）'},
      {category:1,group:'技术标内容一致',values:['1','0','0'],description:'技术标文本内容一致（原型示例）'},
      {category:2,group:'股权关系',issueType:'间接控股',riskLevel:'高',relationPath:['演示投资主体甲分别持有两家单位 60% 和 55% 股权（虚构示例）'],description:'共同控股主体关联（原型示例）'},
      {category:2,group:'股权关系',issueType:'主要人员审查',riskLevel:'中',relationPath:['演示人员甲同时在两家单位担任董事（虚构示例）'],description:'主要人员交叉任职（原型示例）'},
      {category:2,group:'股权关系',issueType:'年报邮箱审查',riskLevel:'中',relationPath:['两家单位年报邮箱均为 demo@example.com（虚构示例）'],description:'年报邮箱相同（原型示例）'},
      {category:3,group:'定额工程量错误雷同',values:['DEMO-2-10-320','室内塑料排水管安装（演示）','86.40','95.60','两份清单的定额工程量均误填为 95.60，清单工程量为 86.40（原型示例）'],description:'定额工程量错误雷同（原型示例）'},
      {category:3,group:'材料错别字错误雷同',values:['DEMO-040101001','聚氨脂防水涂料','两份清单均将“聚氨酯”误写为“聚氨脂”（原型示例）'],description:'材料错别字错误雷同（原型示例）'},
      {category:3,group:'材料规格型号不规范错误雷同',values:['DEMO-040101002','PVC-U 排水管','DN110','两份清单均缺少环刚度等级，规格应补充为 dn110、SN8（原型示例）'],description:'材料规格型号不规范错误雷同（原型示例）'}
    ]:[];
    item.counts=[0,1,2,3].map(category=>item.details.filter(d=>d.category===category).length);
    item.rules=item.counts.filter(n=>n>0).length;
    item.total=item.counts.reduce((sum,n)=>sum+n,0);
    items.set(id,item);return item;
  }
  companies.forEach((a,i)=>{selves.push(make('s'+i,i,i,i===0||i===2));companies.slice(i+1).forEach((b,k)=>{const j=i+k+1;pairs.push(make(i+'_'+j,i,j,i===0&&j===2));});});
  // 自身维度独立于两两雷同：清单审查正常，东棚和热地亚有投标行为异常。
  selves.forEach((item,index)=>{
    item.review={checks:['--','--','--','--','--'],result:'无异常',abnormal:false};
    item.behavior=index===0||index===2?[
      {group:'标书编制页数异常',values:[index===0?'1,268':'1,186','1,000']},
      {group:'招标文件下载异常',values:['未下载']}
    ]:[];
    item.rules=Number(item.review.abnormal)+Number(item.behavior.length>0);
    item.total=item.behavior.length;
  });
  window.MatrixData={companies,pairs,selves,items};
})();
