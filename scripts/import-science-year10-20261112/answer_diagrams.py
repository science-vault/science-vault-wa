from math import cos,sin,pi
from build import svg,EXTRA
# These precise vector diagrams supplement the written marking steps.
ions=''.join(f'<circle cx="{x}" cy="{y}" r="17" fill="#e3edf9" stroke="#235"/><text x="{x-10}" y="{y+5}">M⁺</text>' for y in (45,105) for x in (55,135,215,295))
electrons=''.join(f'<text x="{x}" y="{y}" fill="#a23">e⁻ →</text>' for x,y in ((85,80),(170,80),(250,145),(340,80)))
EXTRA['chem-B12']=svg(ions+electrons+'<text x="30" y="185">Fixed positive ions; mobile delocalised electrons</text>',600,210)
atom='<circle cx="170" cy="130" r="30" fill="#fff0c9" stroke="#235"/><circle cx="170" cy="130" r="55" fill="none" stroke="#789"/><circle cx="170" cy="130" r="95" fill="none" stroke="#789"/><text x="145" y="125">8 p⁺</text><text x="145" y="147">8 n</text>'
for r,n in ((55,2),(95,6)):
 for i in range(n):
  x=170+r*cos(2*pi*i/n);y=130+r*sin(2*pi*i/n);atom+=f'<circle cx="{x:.1f}" cy="{y:.1f}" r="5" fill="#246"/>'
EXTRA['sem1-B1']=svg(atom+'<text x="300" y="90">Oxygen-16</text><text x="300" y="125">Nucleus: 8 protons + 8 neutrons</text><text x="300" y="160">Electrons: 2 in shell 1; 6 in shell 2</text>',620,255)
EXTRA['chem-B7']=svg('<text x="35" y="100" font-size="25">CH₃ — CH₂ — CH₂ — CH₂ — CH₃</text><text x="35" y="150">Five carbons, twelve hydrogens; only single bonds</text>')
EXTRA['chem-B8']=svg('<text x="30" y="65" font-size="25">CH₃ — CH₂ — CH₃</text><text x="30" y="105">Propane: C₃H₈</text><text x="30" y="155" font-size="25">CH₂ = CH — CH₃</text><text x="30" y="195">Propene: C₃H₆; two fewer H atoms</text>')
EXTRA['chem-B11']=svg('<text x="20" y="45">Ethane: H₃C—CH₃ (discrete molecules)</text><text x="20" y="100">CaCl₂: repeating lattice with Ca²⁺:Cl⁻ ratio 1:2</text><text x="40" y="145" font-size="25">Cl⁻    Ca²⁺    Cl⁻    Cl⁻    Ca²⁺    Cl⁻</text><text x="40" y="190">Electrostatic attraction extends through the lattice</text>')
# Three head-to-tail force additions, arranged separately.
EXTRA['mid-A4']=svg('<defs><marker id="forcearrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#246"/></marker></defs><g fill="none" stroke="#246" stroke-width="2" marker-end="url(#forcearrow)"><path d="M20 65H105L150 110"/><path d="M215 45L260 90V145"/><path d="M415 65H500V120"/></g><g fill="none" stroke="#a43" stroke-width="2"><path d="M20 65L150 110M215 45L260 145M415 65L500 120"/></g><text x="20" y="25">A + B</text><text x="215" y="25">B + C</text><text x="415" y="25">A + C</text><text x="30" y="185">Blue: head-to-tail vectors. Red: resultant start → finish.</text>')
