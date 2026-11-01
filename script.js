const initialPhotos = [
  {id:'sample-1',name:'Gorilla Patcher — Tools',src:'assets/gorilla-screen-1.jpg',sample:true},
  {id:'sample-2',name:'Gorilla Patcher — Login',src:'assets/gorilla-screen-2.jpg',sample:true},
  {id:'sample-3',name:'Gorilla Patcher — Verification',src:'assets/gorilla-screen-3.jpg',sample:true}
];
const STORE='gpHubPhotosV1';
let photos=[];
try{photos=JSON.parse(localStorage.getItem(STORE)||'[]')}catch(e){photos=[]}
if(!Array.isArray(photos))photos=[];
let toastTimer;
function allPhotos(){return [...initialPhotos,...photos]}
function save(){localStorage.setItem(STORE,JSON.stringify(photos))}
function showToast(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2300)}
function render(){
 const items=allPhotos();
 document.getElementById('nav-count').textContent=items.length;
 document.getElementById('photo-count').textContent=`${items.length} picture${items.length===1?'':'s'}`;
 const makeCard=p=>`<article class="photo-card"><img src="${p.src}" alt="${escapeHtml(p.name)}"><div class="photo-info"><div><strong>${escapeHtml(p.name)}</strong><small>${p.sample?'Included screenshot':'Added by you'}</small></div>${p.sample?'':`<button class="remove-btn" data-remove="${p.id}">Remove</button>`}</div></article>`;
 document.getElementById('gallery-grid').innerHTML=items.length?items.map(makeCard).join(''):'<div class="empty-state">No pictures yet. Upload a picture to get started.</div>';
 document.getElementById('recent-grid').innerHTML=items.slice(0,3).map(makeCard).join('');
 document.querySelectorAll('[data-remove]').forEach(btn=>btn.addEventListener('click',()=>{photos=photos.filter(p=>p.id!==btn.dataset.remove);save();render();showToast('Picture removed from this browser.')}));
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function go(page){
 document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id===page));
 document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
 const titles={home:'Overview',verification:'Headset Verification',tools:'Tools & Options',gallery:'Picture Gallery'};
 document.getElementById('page-title').textContent=titles[page]||'Overview';
 window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.page)));
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
document.getElementById('file-input').addEventListener('change',async e=>{
 const files=[...e.target.files].filter(f=>f.type.startsWith('image/'));
 if(!files.length)return;
 let added=0;
 for(const file of files){
  try{
   const data=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)});
   photos.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),name:file.name.replace(/\.[^.]+$/,''),src:data,sample:false});added++;
  }catch(err){}
 }
 try{save();render();showToast(`${added} picture${added===1?'':'s'} added.`)}
 catch(err){showToast('Browser storage is full. Try smaller pictures.')}
 e.target.value='';
});
render();
