const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function load(){
 const response=await fetch('data/artwork-review-gallery.json');if(!response.ok)throw Error('Saved gallery could not load');
 const data=await response.json();
 document.querySelector('#counts').textContent=`${data.records.length} new/replacement pairs · ${data.records.length*2} phase images · ${data.queue.filter(r=>r.status==='held-for-repair').length} generation repairs held`;
 document.querySelector('#gallery').innerHTML=data.records.map(r=>`<article class="card"><span class="badge">${esc(r.day)} · AI reviewed · Coach review pending</span><h2>${esc(r.name)}</h2><div class="phases">${['start','movement'].map(phase=>`<figure><img src="${esc(r.imageSet[phase])}" alt="${esc(phase==='start'?r.altStart:r.altMovement)}" width="512" height="512" loading="lazy"><figcaption><strong>${phase==='start'?'Start':'Movement'}</strong><br>${esc(r[phase+'Instruction'])}</figcaption></figure>`).join('')}</div><details><summary>Equipment and review constraints</summary><p>${esc(r.equipment)}</p><p>${esc(r.grip)}</p><p>${esc(r.avoid)}</p></details></article>`).join('');
 const held=data.queue.filter(r=>r.status!=='pair-reviewed');
 document.querySelector('#pending').innerHTML=held.map(r=>`<article class="pending"><h3>${esc(r.name)}</h3><p>${esc(r.reason||r.status)}</p></article>`).join('')+`<details><summary>${data.unresolved.length} pending day/name entries (not a generation count)</summary><ul>${data.unresolved.map(r=>`<li>${esc(r.day)} — ${esc(r.name)} · ${esc(r.status)}</li>`).join('')}</ul></details>`;
}
load().catch(e=>document.querySelector('#counts').textContent=e.message);
