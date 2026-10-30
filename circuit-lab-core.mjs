// DC steady-state solver: ideal wires/switches, one ideal source, ohmic loads.
export const COMPONENT_TYPES=['battery','resistor','lamp','switch','junction'];
export function terminalId(c,side){return c.id+':'+side;}
export function terminalPosition(c,side){const a=(c.rotation||0)*Math.PI/180,d=c.type==='junction'?0:side==='a'?-45:45;return{x:c.x+Math.cos(a)*d,y:c.y+Math.sin(a)*d,dx:Math.cos(a)*(side==='a'?-1:1),dy:Math.sin(a)*(side==='a'?-1:1)};}
function linearSolve(matrix,vector){const a=matrix.map((row,i)=>[...row,vector[i]]),n=a.length;for(let col=0;col<n;col++){let pivot=col;for(let i=col+1;i<n;i++)if(Math.abs(a[i][col])>Math.abs(a[pivot][col]))pivot=i;if(Math.abs(a[pivot][col])<1e-12)throw Error('Unreferenced circuit');[a[col],a[pivot]]=[a[pivot],a[col]];const k=a[col][col];for(let j=col;j<=n;j++)a[col][j]/=k;for(let i=0;i<n;i++)if(i!==col){const m=a[i][col];for(let j=col;j<=n;j++)a[i][j]-=m*a[col][j];}}return a.map(row=>row[n]);}
export function solveCircuit(circuit){
 const components=circuit.components||[],wires=circuit.wires||[],terminals=new Set(components.flatMap(c=>[terminalId(c,'a'),terminalId(c,'b')]));
 if(components.some(c=>!COMPONENT_TYPES.includes(c.type)))throw Error('Unknown component');
 const parent=new Map([...terminals].map(x=>[x,x]));const find=x=>{if(!parent.has(x))throw Error('Wire endpoint is not a component terminal');if(parent.get(x)!==x)parent.set(x,find(parent.get(x)));return parent.get(x);};const join=(a,b)=>parent.set(find(a),find(b));
 for(const w of wires)join(w.from,w.to);for(const c of components)if(c.type==='junction'||c.type==='switch'&&c.closed)join(terminalId(c,'a'),terminalId(c,'b'));
 const batteries=components.filter(c=>c.type==='battery');if(batteries.length>1)throw Error('Use one battery in this lab');
 const loads=components.filter(c=>c.type==='resistor'||c.type==='lamp');for(const c of loads)if(!Number.isFinite(c.resistance)||c.resistance<=0)throw Error('Resistance must be positive');
 const battery=batteries[0],empty={status:'no-battery',supplyCurrent:0,equivalentResistance:null,power:0,voltageByTerminal:{},readings:{},message:'Add one battery and connect a complete path through a resistor or lamp.'};
 if(!battery)return empty;if(!Number.isFinite(battery.voltage)||battery.voltage<=0)throw Error('Battery voltage must be positive');
 const positive=find(terminalId(battery,'a')),negative=find(terminalId(battery,'b'));
 if(positive===negative)return{...empty,status:'short',message:'Short circuit: the battery terminals are joined by ideal wires or closed switches. An ideal source has no finite current here. Add resistance or remove the bypass.'};
 const nodes=new Set([...terminals].map(find)),adj=new Map([...nodes].map(n=>[n,[]]));
 for(const c of loads){const a=find(terminalId(c,'a')),b=find(terminalId(c,'b'));adj.get(a).push(b);adj.get(b).push(a);}
 const reachable=new Set([positive,negative]),todo=[positive,negative];while(todo.length){for(const n of adj.get(todo.pop()))if(!reachable.has(n)){reachable.add(n);todo.push(n);}}
 const fixed=new Map([[positive,battery.voltage],[negative,0]]),unknown=[...reachable].filter(n=>!fixed.has(n)),index=new Map(unknown.map((n,i)=>[n,i])),matrix=unknown.map(()=>unknown.map(()=>0)),rhs=unknown.map(()=>0);
 for(const c of loads){const a=find(terminalId(c,'a')),b=find(terminalId(c,'b')),g=1/c.resistance;if(a===b)continue;for(const [n,other]of [[a,b],[b,a]]){if(!index.has(n))continue;const i=index.get(n);matrix[i][i]+=g;if(index.has(other))matrix[i][index.get(other)]-=g;else if(fixed.has(other))rhs[i]+=g*fixed.get(other);}}
 const solved=linearSolve(matrix,rhs),voltages=new Map(fixed);unknown.forEach((n,i)=>voltages.set(n,solved[i]));const voltageByTerminal=Object.fromEntries([...terminals].map(n=>[n,voltages.get(find(n))??null]));
 const readings=Object.create(null);let supplyCurrent=0;for(const c of loads){const a=find(terminalId(c,'a')),b=find(terminalId(c,'b')),va=voltages.get(a),vb=voltages.get(b),voltage=va===undefined||vb===undefined?null:va-vb,current=voltage===null?0:voltage/c.resistance;readings[c.id]={voltage,current,power:current*current*c.resistance};if(a===positive)supplyCurrent+=current;if(b===positive)supplyCurrent-=current;}
 supplyCurrent=Math.max(0,Math.abs(supplyCurrent)<1e-10?0:supplyCurrent);readings[battery.id]={voltage:battery.voltage,current:-supplyCurrent,power:-battery.voltage*supplyCurrent};
 return{status:supplyCurrent>1e-10?'closed':'open',supplyCurrent,equivalentResistance:supplyCurrent>1e-10?battery.voltage/supplyCurrent:null,power:battery.voltage*supplyCurrent,voltageByTerminal,readings,message:supplyCurrent>1e-10?'Complete circuit. Readings follow Ohm’s law and Kirchhoff’s rules.':'Open circuit: no current leaves the battery. Check wires and switches; disconnected sections can have floating voltages.'};
}
export function circuitPreset(kind='series'){
 const battery={id:'B1',type:'battery',voltage:12,x:140,y:260,rotation:90};
 if(kind==='empty')return{components:[],wires:[]};
 if(kind==='parallel')return{components:[battery,{id:'R1',type:'resistor',resistance:100,x:470,y:150,rotation:0},{id:'R2',type:'resistor',resistance:100,x:470,y:360,rotation:0}],wires:[{id:'W1',from:'B1:a',to:'R1:a',points:[[140,150]]},{id:'W2',from:'R1:a',to:'R2:a',points:[[330,150],[330,360]]},{id:'W3',from:'R1:b',to:'R2:b',points:[[650,150],[650,360]]},{id:'W4',from:'R2:b',to:'B1:b',points:[[650,360],[650,450],[140,450]]}]};
 if(kind==='lamp')return{components:[battery,{id:'L1',type:'lamp',resistance:10,x:460,y:150,rotation:0},{id:'S1',type:'switch',closed:true,x:460,y:360,rotation:0}],wires:[{id:'W1',from:'B1:a',to:'L1:a',points:[[140,150]]},{id:'W2',from:'L1:b',to:'S1:b',points:[[650,150],[650,360]]},{id:'W3',from:'S1:a',to:'B1:b',points:[[140,360]]}]};
 return{components:[battery,{id:'R1',type:'resistor',resistance:100,x:360,y:150,rotation:0},{id:'R2',type:'resistor',resistance:100,x:610,y:150,rotation:0},{id:'S1',type:'switch',closed:true,x:610,y:360,rotation:0}],wires:[{id:'W1',from:'B1:a',to:'R1:a',points:[[140,150]]},{id:'W2',from:'R1:b',to:'R2:a'},{id:'W3',from:'R2:b',to:'S1:b',points:[[730,150],[730,360]]},{id:'W4',from:'S1:a',to:'B1:b',points:[[140,360]]}]};
}
export function parallelChallenge(circuit,solution=solveCircuit(circuit)){const battery=circuit.components.find(c=>c.type==='battery'),r=circuit.components.filter(c=>c.type==='resistor'||c.type==='lamp');return solution.status==='closed'&&battery?.voltage===12&&r.length===2&&r.every(c=>c.type==='resistor'&&c.resistance===100&&Math.abs(Math.abs(solution.readings[c.id].voltage)-12)<1e-7)&&Math.abs(solution.supplyCurrent-.24)<1e-7;}
export function cleanCircuit(raw){
 if(!raw||!Array.isArray(raw.components)||!Array.isArray(raw.wires))return circuitPreset();
 const seen=new Set();let batteries=0;const valid=[];
 for(const c of raw.components){
  if(!c||!COMPONENT_TYPES.includes(c.type)||!/^[A-Za-z0-9_-]{1,32}$/.test(c.id)||seen.has(c.id)||c.type==='battery'&&batteries>0)continue;
  if(valid.length>=30)break;seen.add(c.id);if(c.type==='battery')batteries++;
  valid.push({id:c.id,type:c.type,x:Number.isFinite(c.x)?Math.max(65,Math.min(835,c.x)):350,y:Number.isFinite(c.y)?Math.max(70,Math.min(465,c.y)):250,rotation:[0,90,180,270].includes(c.rotation)?c.rotation:0,voltage:Number.isFinite(c.voltage)?Math.max(1,Math.min(24,c.voltage)):12,resistance:Number.isFinite(c.resistance)?Math.max(1,Math.min(1000,c.resistance)):100,closed:c.closed===true});
 }
 const terminals=new Set(valid.flatMap(c=>[terminalId(c,'a'),terminalId(c,'b')]));
 const wires=raw.wires.filter(w=>w&&terminals.has(w.from)&&terminals.has(w.to)&&w.from!==w.to).slice(0,80).map((w,i)=>({id:'W'+(i+1),from:w.from,to:w.to,points:Array.isArray(w.points)?w.points.filter(p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)).slice(0,20).map(([x,y])=>[Math.max(10,Math.min(890,x)),Math.max(10,Math.min(530,y))]):undefined}));return{components:valid,wires};
}
export const CIRCUIT_LAB={id:'circuit-builder',subject:'Science',strand:'Physics',icon:'ϟ',title:'Circuit Construction Lab',blurb:'Drag batteries, resistors, lamps and switches. Wire your own circuit and measure current and voltage.',minutes:15,controls:[],fields:[]};
