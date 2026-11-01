/* Set this URL after deploying the Cloudflare Worker. Never put secrets here. */
const GEAUX_HACK_API_URL = "https://geauxhack-interest.wicslsu.workers.dev";
(() => {
 const modal=document.getElementById('gh-interest-modal'), dialog=modal?.querySelector('.gh-dialog'), form=document.getElementById('gh-interest-form'), status=document.getElementById('gh-form-status');
 if(!modal||!form)return;
 let previousFocus;
 function open(){previousFocus=document.activeElement;modal.hidden=false;document.body.classList.add('gh-modal-open');dialog.focus();}
 function close(){modal.hidden=true;document.body.classList.remove('gh-modal-open');previousFocus?.focus();}
 document.querySelectorAll('[data-open-interest]').forEach(b=>b.addEventListener('click',open));
 document.querySelectorAll('[data-close-interest]').forEach(b=>b.addEventListener('click',close));
 document.addEventListener('keydown',e=>{if(modal.hidden)return;if(e.key==='Escape')close();if(e.key==='Tab'){const focusable=[...modal.querySelectorAll('button:not([disabled]),input:not([disabled]):not([tabindex="-1"]),select,a[href]')].filter(el=>el.getClientRects().length);if(!focusable.length)return;const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
 form.addEventListener('submit',async e=>{
 e.preventDefault();if(!form.reportValidity())return;
 if(!GEAUX_HACK_API_URL){status.textContent='Interest form submissions are not enabled yet. Please check back soon.';return;}
 const submit=form.querySelector('[type=submit]');submit.disabled=true;status.textContent='Submitting…';
 const payload=Object.fromEntries(new FormData(form).entries());payload.consent=!!form.elements.consent.checked;
 try{const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),12000);
    let response;
    try{response=await fetch(GEAUX_HACK_API_URL,{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify(payload),
    signal:controller.signal})}finally{clearTimeout(timeout)}

 if(!response.ok)throw Error('Submission failed');form.reset();status.textContent='You’re on the interest list! Watch your inbox for updates.';
 }catch{status.textContent='We could not save your response. Please try again later or email wicslsu@gmail.com.'}finally{submit.disabled=false}
 });
})();
