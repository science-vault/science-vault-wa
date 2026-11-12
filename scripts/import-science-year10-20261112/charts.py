import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from pathlib import Path
out=Path('output/assets/chemistry/practice-science-year10')
plt.rcParams.update({'font.size':12,'font.family':'DejaVu Sans'})
def chart(name,series,xlabel,ylabel,xlim,ylim,xticks,yticks):
 fig,ax=plt.subplots(figsize=(7,4.2),layout='constrained')
 for x,y,label in series:ax.plot(x,y,lw=2.3,label=label)
 ax.set(xlabel=xlabel,ylabel=ylabel,xlim=xlim,ylim=ylim,xticks=xticks,yticks=yticks);ax.grid(True,alpha=.35)
 if any(label for x,y,label in series):ax.legend()
 fig.savefig(out/(name+'.png'),dpi=160);plt.close(fig)
chart('sem2-position',[([0,4,8],[0,8,10],'')],'Time (s)','Position (m)',(0,10),(0,10),range(11),range(11))
chart('phys-displacement',[([0,10,15,35,65,75],[0,20,20,80,30,30],'')],'Time (s)','Displacement (m)',(0,75),(0,85),range(0,76,5),range(0,81,10))
chart('phys-speed',[([0,20,50,60],[0,25,25,0],'')],'Time (s)','Speed (m/s)',(0,60),(0,30),range(0,61,10),range(0,31,5))
chart('sem1-velocity',[([0,15],[10,10],'Sam'),([0,4,10,15],[0,0,15,15],'Joe')],'Time (s)','Velocity (m/s)',(0,15),(0,20),range(0,16),range(0,21,5))
