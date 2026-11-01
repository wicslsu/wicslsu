// Cloudflare Worker + D1. Configure ALLOWED_ORIGIN as an environment variable.
const json=(obj,status=200,headers={})=>new Response(JSON.stringify(obj),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers}});
export default {async fetch(request,env){
 const origin=request.headers.get('Origin');const allowed=env.ALLOWED_ORIGIN;
 const cors=origin&&origin===allowed?{'Access-Control-Allow-Origin':origin,'Vary':'Origin','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}:{};
 if(request.method==='OPTIONS')return origin===allowed?new Response(null,{status:204,headers:cors}):new Response(null,{status:403});
 if(request.method!=='POST')return json({error:'Method not allowed'},405,cors);
 if(!origin||origin!==allowed)return json({error:'Origin not allowed'},403,cors);
 if(!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json'))return json({error:'JSON required'},415,cors);
 if(Number(request.headers.get('Content-Length')||0)>5000)return json({error:'Too large'},413,cors);
 let body;try{body=await request.json()}catch{return json({error:'Invalid JSON'},400,cors)}
 const name=String(body.name||'').trim(),email=String(body.email||'').trim().toLowerCase(),school=String(body.school||'').trim(),experience=String(body.experience||''),website=String(body.website||'');
 if(website)return json({ok:true},200,cors); // honeypot
 if(!name||name.length>120||!email||email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||school.length>160||!['','first-time','some','experienced'].includes(experience)||body.consent!==true)return json({error:'Invalid fields'},400,cors);
 try
 {await env.DB.prepare(
    'INSERT INTO interest_submissions (name,email,school,experience,consent) VALUES (?,?,?,?,1) ON CONFLICT(email) DO UPDATE SET name=excluded.name,school=excluded.school,experience=excluded.experience,consent=1').bind(name,email,school,experience).run();
    return json({ok:true},200,cors)}catch{return json({error:'Unable to save response'},500,cors)}
 }};
