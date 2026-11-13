(function(root){
const charts={
'teaching-osmosis':['Synthetic osmosis results with variation','Read concentration, mean percentage mass change and the labelled sample-SD bars. Estimate the zero crossing using the local trend. These are specified teaching data, not your own experimental results.'],
'teaching-glucose':['Synthetic glucose and insulin response','Compare the two panels using their separate units. Describe rise, peak and decline, then explain how absorption and insulin-related pathways can contribute. The values are teaching examples, not diagnostic thresholds.'],
'teaching-alleles':['Synthetic allele-frequency trajectories','Read the shared starting frequency and later changes. Random-sampling runs use 40 allele copies per generation in this model. The dashed line is an illustrative directional trend; shape alone does not diagnose selection in field data.'],
'teaching-pulse':['Synthetic pulse observations and fitted trend','Distinguish observed points from the fitted line. Estimate a gradient using points on the line, retain units and restrict interpretation to the plotted recovery interval. These are teaching data.']};
for(const [key,[title,guide]]of Object.entries(charts)){
 root.HBFreshImages[key]={title,src:'assets/human-biology/textbook/'+key+'.png',alt:title,author:'Learning Vault WA · original teaching chart',source:'human-biology-syllabus-coverage.html',license:'CC BY 4.0',licenseUrl:'https://creativecommons.org/licenses/by/4.0/',changes:'Created for this textbook using explicitly synthetic teaching data or models.'};root.HBFreshImageGuides[key]=guide;
}
root.HBFreshContent.find(m=>m.id==='inquiry-data').images.push('teaching-pulse');
})(window);
