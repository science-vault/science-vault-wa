// Build the overview counts from exactly the banks used by the upper-school builder.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(process.argv[2]||path.join(__dirname,'..'));
const html=fs.readFileSync(path.join(root,'upper-school-assessment-builder.html'),'utf8');
const files=[...new Set([...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)].map(m=>m[1].split('?')[0]).filter(f=>f.startsWith('upper-school-')&&f.includes('bank')&&f.endsWith('.js')))];
if(!files.length)throw Error('No upper-school banks found.');
const context=vm.createContext({window:{},console});for(const file of files){if(path.basename(file)!==file)throw Error('Unexpected bank path: '+file);vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file,timeout:10000})}
const rows=context.window.UpperSchoolQuestionBank;if(!Array.isArray(rows)||!rows.length)throw Error('The upper-school bank is empty.');
const unique=new Map();for(const q of rows){if(!q.id)throw Error('Question missing its ID.');unique.set(q.id,q)}
const byCourse={},byYear={};for(const q of unique.values()){const name=q.course||q.subject||'Other';byCourse[name]=(byCourse[name]||0)+1;byYear[q.year]=(byYear[q.year]||0)+1}
const result={version:1,total:unique.size,byCourse,byYear,bankFiles:files.length,generatedFrom:'upper-school-assessment-builder.html'};
fs.writeFileSync(path.join(root,'assessment-bank-counts.json'),JSON.stringify(result,null,2)+'\n');console.log('Upper-school coverage: '+result.total+' unique questions across '+files.length+' bank files.');
