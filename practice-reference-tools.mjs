/* Reference formulas are generic revision aids, not official examination formula sheets. */
export const formulaGroups={
 Physics:[['Motion','Speed = distance ÷ time','Acceleration = change in velocity ÷ time','Force = mass × acceleration','Momentum = mass × velocity'],['Energy and electricity','Work = force × displacement','Kinetic energy = ½mv²','Gravitational potential energy = mgh','Power = energy ÷ time','Voltage = current × resistance']],
 Mathematics:[['Algebra and geometry','Quadratic formula: x = (−b ± √(b² − 4ac)) ÷ 2a','Area of a circle = πr²','Circumference = 2πr','Pythagoras: a² + b² = c²'],['Trigonometry','sin θ = opposite ÷ hypotenuse','cos θ = adjacent ÷ hypotenuse','tan θ = opposite ÷ adjacent']],
 Chemistry:[['Amounts and concentrations','Amount (mol) = mass ÷ molar mass','Concentration (mol/L) = amount ÷ volume (L)','pH = −log₁₀[H⁺]'],['Gases and energy','Ideal gas law: PV = nRT','Heat energy: q = mcΔT']],
 Science:[['Motion and forces','Speed = distance ÷ time','Density = mass ÷ volume','Force = mass × acceleration'],['Electricity','Voltage = current × resistance','Power = voltage × current']]
};
export function formulasFor(course){const name=String(course||'').toLowerCase();if(name.includes('physics'))return formulaGroups.Physics;if(name.includes('math'))return formulaGroups.Mathematics;if(name.includes('chemistry'))return formulaGroups.Chemistry;return formulaGroups.Science}
export function calculatorPermitted(course,mode){return !String(course||'').toLowerCase().includes('math')||mode!=='free'}
export function calculate(left,operator,right){const a=Number(left),b=Number(right);if(!Number.isFinite(a)||!Number.isFinite(b))throw Error('Enter valid numbers');const result=operator==='+'?a+b:operator==='-'?a-b:operator==='×'?a*b:operator==='÷'?a/b:operator==='^'?Math.pow(a,b):NaN;if(!Number.isFinite(result))throw Error('Calculation is undefined');return Number(result.toPrecision(12))}
