(function(){
'use strict';
const config=window.LVTrackingConfig||{},key='lv-tracking-session';
let session;try{session=JSON.parse(sessionStorage.getItem(key)||'null')}catch{session=null}
const configured=()=>/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(config.url||'')&&/^sb_publishable_/.test(config.publishableKey||'');
const save=s=>{session=s;try{s?sessionStorage.setItem(key,JSON.stringify(s)):sessionStorage.removeItem(key)}catch{}window.dispatchEvent(new Event('lv-auth-change'));};
async function request(path,body,auth=true,method=body?'POST':'GET'){
 if(!configured())throw Error('Live tracking has not been activated yet.');
 if(auth&&!session)throw Error('Sign in to use tracking.');
 if(auth&&session.expires_at<Date.now()/1000+30)await refresh();
 const headers={apikey:config.publishableKey,'Content-Type':'application/json'};if(auth)headers.Authorization='Bearer '+session.access_token;
 const r=await fetch(config.url.replace(/\/$/,'')+path,{method,headers,body:body?JSON.stringify(body):undefined});
 const result=await r.json().catch(()=>null);if(!r.ok)throw Error(result?.msg||result?.message||result?.error_description||'Request failed. Please try again.');return result;
}
let refreshing=null;
async function refresh(){if(!refreshing)refreshing=(async()=>{try{const s=await request('/auth/v1/token?grant_type=refresh_token',{refresh_token:session.refresh_token},false);save({...s,expires_at:Date.now()/1000+s.expires_in})}catch(e){save(null);throw e}finally{refreshing=null}})();return refreshing;}
const api={configured,session:()=>session,
 async signIn(email,password){const s=await request('/auth/v1/token?grant_type=password',{email,password},false);save({...s,expires_at:Date.now()/1000+s.expires_in});},
 async signUp(email,password,name){return request('/auth/v1/signup',{email,password,data:{display_name:name}},false);},
 async signOut(){try{if(session)await request('/auth/v1/logout',{},true)}catch{}finally{save(null)}},
 async profile(){const rows=await request('/rest/v1/lv_profiles?id=eq.'+encodeURIComponent(session.user.id)+'&select=id,display_name,role');return rows[0];},
 async get(table){let all=[],page;do{page=await request('/rest/v1/'+table+'?select=*&order='+({'lv_profiles':'id','lv_classes':'id','lv_members':'class_id,student_id','lv_progress':'student_id,module_key'}[table]||'id')+'&limit=500&offset='+all.length);all.push(...page)}while(page.length===500);return all;},
 rpc:(name,body)=>request('/rest/v1/rpc/'+name,body),
 request
};window.LVTracking=api;
})();
