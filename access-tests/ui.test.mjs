import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {JSDOM} from 'jsdom';
import {PAGES} from '../page-catalog.mjs';
import {canOpenPage,accessReason} from '../access-policy.mjs';
import {accountError,signupProblem} from '../account-helpers.mjs';
const root=new URL('../',import.meta.url);
const page=id=>PAGES.find(p=>p.id===id);
const user={uid:'test-student',email:'student@example.invalid',emailVerified:true};
const student={role:'student',status:'active',permissions:{}};
assert.equal(canOpenPage({user,member:student},page('student-quiz.html')),true);
assert.equal(canOpenPage({user,member:student},page('library.html')),false);
assert.equal(canOpenPage({user,member:{...student,permissions:{'student-quiz.html':false}}},page('student-quiz.html')),false);
assert.equal(canOpenPage({user,member:{...student,permissions:{'library.html':true}}},page('library.html')),true);
assert.equal(canOpenPage({user,member:{role:'teacher',status:'pending',permissions:{'library.html':true}}},page('library.html')),false);
assert.equal(canOpenPage({user:{...user,emailVerified:false},member:{role:'teacher',status:'active',permissions:{'library.html':true}}},page('library.html')),false);
assert.equal(canOpenPage({user,member:{...student,status:'suspended',permissions:{'library.html':true}}},page('library.html')),false);
assert.equal(canOpenPage({user:null,admin:true},page('library.html')),false);
assert.equal(canOpenPage({user,admin:true,error:Error('network')},page('library.html')),false);
const settle=()=>new Promise(r=>setTimeout(r,10));
async function loadModule(name,html,exports){const dom=new JSDOM(fs.readFileSync(new URL(html,root),'utf8'),{url:'https://science-vault.github.io/science-vault-wa/'+html,runScripts:'outside-only'});const context=dom.getInternalVMContext();dom.window.confirm=()=>true;const cache=new Map();
 const mock=(id,values)=>{if(cache.has(id))return cache.get(id);const m=new vm.SyntheticModule(Object.keys(values),function(){for(const [k,v]of Object.entries(values))this.setExport(k,v)},{context,identifier:id});cache.set(id,m);return m};
 const resolve=async spec=>{const key=spec.split('?')[0];const values=key.includes('page-catalog')?{PAGES}:key.includes('access-policy')?{canOpenPage,accessReason}:key.includes('account-helpers')?{accountError,signupProblem}:key.includes('firebase-client')?exports.firebase:exports.access;const m=mock(key,values);if(m.status==='unlinked')await m.link(resolve);if(m.status==='linked')await m.evaluate();return m};
 const module=new vm.SourceTextModule(fs.readFileSync(new URL(name,root),'utf8'),{context,importModuleDynamically:resolve});await module.link(resolve);await module.evaluate();await settle();return dom}
{
 let notify;const records=[{uid:'teacher-test',email:'teacher@example.invalid',displayName:'<script>Unsafe name</script>',role:'teacher',status:'pending',permissions:{},updatedAt:{toMillis:()=>1}},{uid:'student-test',email:'student@example.invalid',displayName:'Student',role:'student',status:'active',permissions:{},updatedAt:{toMillis:()=>1}}];let lastChange;
 const api={observeAccess(fn){notify=fn;fn({ready:true,user,admin:true})},async loadMembers(){return{members:records.map(x=>({...x})),more:false}},async saveMember(uid,changes){lastChange={uid,...changes};Object.assign(records.find(x=>x.uid===uid),changes);return{...records.find(x=>x.uid===uid)}},permissionError:e=>e.message};
 const dom=await loadModule('admin-access.mjs','admin-access.html',{access:api});const d=dom.window.document;
 assert.equal(d.getElementById('adminPanel').hidden,false);assert.equal(d.querySelectorAll('.admin-member').length,2);
 d.querySelector('.admin-member').click();assert.equal(d.querySelectorAll('.page-choice input').length,PAGES.length);assert.equal(d.querySelector('#memberName script'),null);
 assert.equal([...d.querySelectorAll('.page-choice input')].filter(i=>i.checked).length,0);
 d.getElementById('allowAll').click();assert.equal([...d.querySelectorAll('.page-choice input')].filter(i=>i.checked).length,PAGES.length);
 d.getElementById('pageSearch').value='PDF';d.getElementById('pageSearch').dispatchEvent(new dom.window.Event('input'));assert.equal(d.querySelectorAll('.page-choice input').length,1);
 d.getElementById('approveAccess').click();await settle();assert.equal(lastChange.status,'active');assert.equal(lastChange.permissions['library.html'],true);assert.equal(lastChange.permissions['pdf-preview.html'],true);
 d.getElementById('denyAll').click();d.getElementById('permissionForm').dispatchEvent(new dom.window.Event('submit',{cancelable:true}));await settle();assert.equal(lastChange.permissions['library.html'],false);assert.equal(lastChange.status,'active');
 d.getElementById('suspendAccess').click();await settle();assert.equal(lastChange.status,'suspended');
 notify({ready:true,user,admin:false});await settle();assert.equal(d.getElementById('adminPanel').hidden,true);assert.equal(d.querySelectorAll('.admin-member').length,0);assert.equal(d.getElementById('memberEmail').textContent,'');dom.window.close();
}
{
 let accessNotify,authNotify,member=null,roleSaved;const firebase={auth:{currentUser:null},onAuthStateChanged(auth,fn){authNotify=fn;fn()},persistence:async()=>{},async createUserWithEmailAndPassword(){firebase.auth.currentUser={...user,emailVerified:false};authNotify();accessNotify({ready:true,user:firebase.auth.currentUser,member:null,admin:false});return{user:firebase.auth.currentUser}},async updateProfile(u,{displayName}){u.displayName=displayName},async sendEmailVerification(){throw Error('Email unavailable')},async signOut(){firebase.auth.currentUser=null;authNotify();accessNotify({ready:true,user:null,member:null,admin:false})},async reload(u){u.emailVerified=true},async getIdToken(){},async sendPasswordResetEmail(){},async signInWithEmailAndPassword(){throw{code:'auth/invalid-credential'}}};
 const access={observeAccess(fn){accessNotify=fn;fn({ready:true,user:null,member:null,admin:false})},async registerMember(u,role){roleSaved=role;member={role,status:role==='teacher'?'pending':'active',permissions:{}};accessNotify({ready:true,user:u,member,admin:false})}};
 const dom=await loadModule('account.mjs','account.html',{access,firebase});const d=dom.window.document;
 d.getElementById('signupRole').value='teacher';d.getElementById('signupPassword').value='unique-password';d.getElementById('signupConfirm').value='unique-password';d.getElementById('signupName').value='Teacher';d.getElementById('signupForm').dispatchEvent(new dom.window.Event('submit',{cancelable:true}));await settle();
 assert.equal(roleSaved,'teacher');assert.equal(d.getElementById('signupPassword').value,'');assert.equal(d.getElementById('signupConfirm').value,'');assert.match(d.getElementById('accountStatus').textContent,/account is created/);assert.match(d.getElementById('accessStatus').textContent,/Waiting for owner approval/);assert.equal(d.querySelectorAll('#allowedPages a').length,0);
 firebase.auth.currentUser.emailVerified=true;accessNotify({ready:true,user:firebase.auth.currentUser,member:{role:'teacher',status:'active',permissions:{'library.html':true}},admin:false});await settle();assert.equal(d.querySelectorAll('#allowedPages a').length,1);assert.equal(d.querySelector('#allowedPages a').getAttribute('href'),'library.html');
 d.getElementById('logout').click();await settle();assert.equal(d.getElementById('signedIn').hidden,true);assert.equal(d.getElementById('accessPanel').hidden,true);dom.window.close();
}
console.log('Passed permission policy and admin/account UI checks: arbitrary grants/denials, search preserving hidden selections, approval, suspension, no name injection, signup roles and password clearing.');
{
 const dom=new JSDOM('<html><head></head><body><main>Protected practice content</main></body></html>',{url:'https://science-vault.github.io/science-vault-wa/student-quiz.html',runScripts:'outside-only'});const d=dom.window.document;Object.defineProperty(d,'currentScript',{value:{src:'https://science-vault.github.io/science-vault-wa/access-bootstrap.js'}});const context=dom.getInternalVMContext();let emit;
 const resolve=async spec=>{const id=String(spec);const values=id.includes('access-client')?{observeAccess(fn){emit=fn;fn({ready:true,user:null})}}:id.includes('access-policy')?{canOpenPage,accessReason}:{PAGES};const module=new vm.SyntheticModule(Object.keys(values),function(){for(const[k,v]of Object.entries(values))this.setExport(k,v)},{context});await module.link(()=>{});await module.evaluate();return module};
 const module=new vm.SourceTextModule(fs.readFileSync(new URL('access-bootstrap.js',root),'utf8'),{context,importModuleDynamically:resolve});await module.link(()=>{});await module.evaluate();await settle();
 assert.equal(d.documentElement.dataset.accessState,'denied');assert.ok(d.getElementById('accessGate'));
 emit({ready:true,user,member:student});assert.equal(d.documentElement.hasAttribute('data-access-state'),false);assert.equal(d.getElementById('accessGate'),null);
 emit({ready:true,user,member:{...student,permissions:{'student-quiz.html':false}}});assert.equal(d.documentElement.dataset.accessState,'denied');assert.ok(d.getElementById('accessGate'));
 emit({ready:true,user,member:student});emit({ready:false,user});assert.equal(d.documentElement.dataset.accessState,'checking');assert.ok(d.getElementById('accessGate'));dom.window.close();
 console.log('Passed page-gate checks: signed-out blocking, allowed page, live individual revocation, and overlay restoration during session changes.');
}
