const assert=require('node:assert/strict');require('../practice-studio-calculator.js');const calc=globalThis.StudioScientificCalculator.evaluate;
for(const [expression,mode,expected] of [['2+3*4','DEG',14],['2^3^2','DEG',512],['-2^2','DEG',-4],['sqrt(9)+log(100)','DEG',5],['sin(30)','DEG',.5],['sin(pi/2)','RAD',1],['asin(0.5)','DEG',30],['5!','DEG',120],['25%*80','DEG',20],['2pi','RAD',2*Math.PI],['6.02e23*2','DEG',1.204e24]])assert.ok(Math.abs(calc(expression,mode)-expected)<=1e-12*Math.max(1,Math.abs(expected)),expression);
assert.equal(calc('ans*2','DEG',4),8);
for(const expression of ['1/0','sqrt(-1)','tan(90)','2+','alert(1)','globalThis.process.exit()','171!'])assert.throws(()=>calc(expression));
console.log('Scientific calculator: 19 arithmetic, angle-mode, domain and input checks passed.');
