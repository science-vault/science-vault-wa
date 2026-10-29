/* Restricted scientific arithmetic: numbers and supported maths functions only. */
(function(root){'use strict';
 function evaluate(input,mode='DEG',ans=0){
  const s=String(input).replace(/[×·]/g,'*').replace(/÷/g,'/').replace(/[−–]/g,'-').replace(/π/g,'pi').replace(/²/g,'^2').replace(/√/g,'sqrt').toLowerCase().replace(/\s+/g,'');
  if(!s||s.length>300)throw Error('Enter a calculation.');let p=0,depth=0;const tokens=[];
  while(p<s.length){let m;if((m=/^(?:\d*\.\d+|\d+\.?\d*)(?:e[+-]?\d+)?/.exec(s.slice(p)))){tokens.push({type:'number',value:Number(m[0])});p+=m[0].length;}else if((m=/^[a-z]+/.exec(s.slice(p)))){tokens.push({type:'name',value:m[0]});p+=m[0].length;}else if('+-*/^()!%'.includes(s[p]))tokens.push({type:s[p++]});else throw Error('Use numbers and mathematical operations only.');if(tokens.length>180)throw Error('Calculation is too long.');}
  const angle=x=>mode==='DEG'?x*Math.PI/180:x,output=x=>mode==='DEG'?x*180/Math.PI:x;
  const funcs={sqrt:Math.sqrt,abs:Math.abs,ln:Math.log,log:Math.log10,exp:Math.exp,sin:x=>Math.sin(angle(x)),cos:x=>Math.cos(angle(x)),tan:x=>{const a=angle(x);if(Math.abs(Math.cos(a))<1e-14)throw Error('Tangent is undefined at this angle.');return Math.tan(a);},asin:x=>output(Math.asin(x)),acos:x=>output(Math.acos(x)),atan:x=>output(Math.atan(x))};
  const expanded=[];for(const t of tokens){const prev=expanded.at(-1);const end=prev&&(prev.type==='number'||prev.type===')'||prev.type==='!'||prev.type==='%'||prev.type==='name'&&!Object.hasOwn(funcs,prev.value)),start=t.type==='number'||t.type==='name'||t.type==='(';if(end&&start){if(prev.type==='number'&&t.type==='number')throw Error('Add an operator between numbers.');expanded.push({type:'*'});}expanded.push(t);}
  let i=0;const take=type=>expanded[i]?.type===type?(i++,true):false;const finite=value=>{if(!Number.isFinite(value))throw Error('Calculation has no finite real result.');return value;};
  function atom(){if(++depth>32)throw Error('Too many nested brackets.');const t=expanded[i++];let value;if(!t)throw Error('Complete the calculation.');if(t.type==='number')value=t.value;else if(t.type==='name'){if(t.value==='pi')value=Math.PI;else if(t.value==='e')value=Math.E;else if(t.value==='ans')value=ans;else if(Object.hasOwn(funcs,t.value)){if(!take('('))throw Error('Add ( after '+t.value+'.');value=funcs[t.value](sum());if(!take(')'))throw Error('Close the function bracket.');}else throw Error('Unknown function: '+t.value);}else if(t.type==='('){value=sum();if(!take(')'))throw Error('Close the bracket.');}else throw Error('Check the calculation.');depth--;while(expanded[i]?.type==='!'||expanded[i]?.type==='%'){if(take('%'))value/=100;else{take('!');if(!Number.isInteger(value)||value<0||value>170)throw Error('Factorial needs an integer from 0 to 170.');let f=1;for(let n=2;n<=value;n++)f*=n;value=f;}}return finite(value);}
  function power(){const a=atom();if(!take('^'))return a;const b=unary();if(Math.abs(b)>1000)throw Error('Power is too large.');return finite(Math.pow(a,b));}
  function unary(){return take('+')?unary():take('-')?-unary():power();}
  function product(){let a=unary();while(['*','/'].includes(expanded[i]?.type)){const op=expanded[i++].type,b=unary();if(op==='/'&&b===0)throw Error('Cannot divide by zero.');a=finite(op==='*'?a*b:a/b);}return a;}
  function sum(){let a=product();while(['+','-'].includes(expanded[i]?.type)){const op=expanded[i++].type,b=product();a=finite(op==='+'?a+b:a-b);}return a;}
  const value=sum();if(i!==expanded.length)throw Error('Check the brackets and operators.');return finite(value);
 }
 root.StudioScientificCalculator={evaluate};
})(typeof window==='undefined'?globalThis:window);
