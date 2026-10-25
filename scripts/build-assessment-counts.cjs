// Count the same Studio indexes consumed by Practice Studio and the assessment builder.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(process.argv[2]||path.join(__dirname,'..'));
const context=vm.createContext({window:{}});
vm.runInContext(fs.readFileSync(path.join(root,'practice-studio-catalog.js'),'utf8'),context,{timeout:1000});
const catalog=context.window.PracticeStudioCatalog;
if(!Array.isArray(catalog?.indices)||!catalog.indices.length)throw Error('No Practice Studio indexes configured.');
const ids=new Set(),hashes=new Set(),byCourse={},byYear={};
for(const file of catalog.indices){
 if(!/^practice-studio-[a-z0-9-]+\.json$/.test(file))throw Error('Unexpected Studio index path: '+file);
 const rows=JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
 if(!Array.isArray(rows))throw Error('Invalid Studio index: '+file);
 for(const raw of rows){
  const q=catalog.normalise(raw);
  if(!q.id||!q.subject||![11,12].includes(Number(q.year)))throw Error('Incomplete Studio question in '+file);
  if(ids.has(q.id)||(q.hash&&hashes.has(q.hash)))continue;
  ids.add(q.id);if(q.hash)hashes.add(q.hash);
  byCourse[q.subject]=(byCourse[q.subject]||0)+1;byYear[q.year]=(byYear[q.year]||0)+1;
 }
}
if(!ids.size)throw Error('The Practice Studio question bank is empty.');
const result={version:2,total:ids.size,byCourse,byYear,bankFiles:catalog.indices.length,generatedFrom:'practice-studio-catalog.js',source:'Practice Studio'};
fs.writeFileSync(path.join(root,'assessment-bank-counts.json'),JSON.stringify(result,null,2)+'\n');
console.log('Practice Studio coverage: '+result.total+' unique questions across '+catalog.indices.length+' indexes.');