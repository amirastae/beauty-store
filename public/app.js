const products=[
{id:1,name:"Luminous Barrier Serum",type:"skin",price:58,badge:"BESTSELLER",sub:"30 ML · SKIN",img:"https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=86"},
{id:2,name:"Velvet Skin Tint",type:"color",price:42,badge:"NEW",sub:"30 ML · COLOR",img:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=86"},
{id:3,name:"Cloud Cream",type:"skin",price:64,badge:"EDITOR'S PICK",sub:"50 ML · SKIN",img:"https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=86"},
{id:4,name:"No. 04 Skin Scent",type:"scent",price:86,badge:"LIMITED",sub:"50 ML · SCENT",img:"https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=86"},
{id:5,name:"Soft Focus Balm",type:"color",price:38,badge:"NEW",sub:"8 G · COLOR",img:"https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&w=900&q=86"},
{id:6,name:"Daily Reset Cleanser",type:"skin",price:36,badge:"ESSENTIAL",sub:"120 ML · SKIN",img:"https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=900&q=86"},
{id:7,name:"Rose Veil Oil",type:"skin",price:54,badge:"GLOW",sub:"30 ML · SKIN",img:"https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=86"},
{id:8,name:"Afterlight Eau de Parfum",type:"scent",price:92,badge:"SIGNATURE",sub:"50 ML · SCENT",img:"https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=86"}];

let cart=JSON.parse(localStorage.getItem("veloura-cart")||"[]");
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
function money(n){return "$"+n.toFixed(0)}
function renderProducts(filter="all"){const grid=$("#productGrid");grid.innerHTML=products.map(p=>`<article class="product-card reveal ${filter!=="all"&&p.type!==filter?"hide":""}" data-type="${p.type}">
<div class="product-media"><img loading="lazy" src="${p.img}" alt="${p.name}"><span class="badge">${p.badge}</span><button class="quick" data-quick="${p.id}">Quick view</button></div>
<div class="product-meta"><div class="top"><h3>${p.name}</h3><span class="price">${money(p.price)}</span></div><p>${p.sub}</p></div></article>`).join("");observeReveals()}
function updateCart(){localStorage.setItem("veloura-cart",JSON.stringify(cart));$("#cartCount").textContent=cart.reduce((a,b)=>a+b.qty,0);$("#cartTotal").textContent=money(cart.reduce((a,b)=>a+b.price*b.qty,0));$("#cartItems").innerHTML=cart.length?cart.map(x=>`<div class="cart-item"><img src="${x.img}" alt=""><div><h4>${x.name}</h4><p>Qty ${x.qty} · ${money(x.price)}</p></div><button data-remove="${x.id}" aria-label="Remove">×</button></div>`).join(""):'<p style="opacity:.55;font-size:12px">Your bag is waiting for something beautiful.</p>'}
function add(id){const p=products.find(x=>x.id===id),found=cart.find(x=>x.id===id);found?found.qty++:cart.push({...p,qty:1});updateCart();toast("Added to your bag")}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1600)}
function openCart(){updateCart();$("#cart").classList.add("open");$("#scrim").classList.add("show");$("#cart").setAttribute("aria-hidden","false")}
function closeCart(){$("#cart").classList.remove("open");$("#scrim").classList.remove("show");$("#cart").setAttribute("aria-hidden","true")}
function closeSearch(){$("#searchPanel").classList.remove("open");$("#searchPanel").setAttribute("aria-hidden","true")}
function openSearch(){$("#searchPanel").classList.add("open");$("#searchPanel").setAttribute("aria-hidden","false");setTimeout(()=>$("#searchInput").focus(),200)}
function renderSearch(q=""){const needle=q.trim().toLowerCase();const items=(needle?products.filter(p=>(p.name+" "+p.type+" "+p.badge).toLowerCase().includes(needle)):products.slice(0,4)).slice(0,4);$("#searchResults").innerHTML=items.map(p=>`<button class="search-result" data-quick="${p.id}" style="background:none;border:0;text-align:left;cursor:pointer"><img src="${p.img}" alt=""><div><strong>${p.name}</strong><span>${p.sub} · ${money(p.price)}</span></div></button>`).join("")}

document.addEventListener("click",e=>{
const q=e.target.closest("[data-quick]");if(q){const p=products.find(x=>x.id===+q.dataset.quick);closeSearch();$("#quickView").innerHTML=`<div class="qv-grid"><img src="${p.img}" alt="${p.name}"><div class="qv-copy"><button class="close-qv">×</button><p class="eyebrow">${p.sub}</p><h3>${p.name}</h3><p>Performance-driven beauty with a refined, sensorial finish designed for everyday ritual.</p><h4>${money(p.price)}</h4><button class="btn btn-dark" data-add="${p.id}">Add to bag</button></div></div>`;$("#quickView").showModal()}
const a=e.target.closest("[data-add]");if(a){add(+a.dataset.add);$("#quickView").close()}
if(e.target.closest(".close-qv"))$("#quickView").close();
const r=e.target.closest("[data-remove]");if(r){cart=cart.filter(x=>x.id!==+r.dataset.remove);updateCart()}
if(e.target.closest("[data-cart-open]"))openCart();
if(e.target.closest("[data-cart-close]")||e.target.id==="scrim")closeCart();
if(e.target.closest("[data-search]")){renderSearch();openSearch()}
if(e.target.closest("[data-search-close]"))closeSearch();
if(e.target.closest(".mobile-menu a")){mobileMenu.classList.remove("open");mobileMenu.setAttribute("aria-hidden","true")}
});

$$(".chip").forEach(b=>b.addEventListener("click",()=>{$$(".chip").forEach(x=>x.classList.remove("active"));b.classList.add("active");$$(".product-card").forEach(c=>c.classList.toggle("hide",b.dataset.filter!=="all"&&c.dataset.type!==b.dataset.filter))}));
function observeReveals(){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.1});$$(".reveal:not(.in)").forEach(x=>io.observe(x))}
const hero=$("#heroProduct"),shell=hero.querySelector(".product-shell");
if(!reduced){hero.addEventListener("pointermove",e=>{const r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;shell.style.transform=`rotateY(${x*11}deg) rotateX(${-y*8}deg) translate3d(${x*10}px,${y*10}px,28px)`});hero.addEventListener("pointerleave",()=>shell.style.transform="");$$(".tilt").forEach(el=>{el.addEventListener("pointermove",e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateY(${x*3.5}deg) rotateX(${-y*3.5}deg)`});el.addEventListener("pointerleave",()=>el.style.transform="")})}
if(matchMedia("(pointer:fine)").matches){const c=$(".cursor");addEventListener("pointermove",e=>{c.style.left=e.clientX+"px";c.style.top=e.clientY+"px"});document.addEventListener("mouseover",e=>{if(e.target.closest("a,button,.product-card"))c.classList.add("big")});document.addEventListener("mouseout",e=>{if(e.target.closest("a,button,.product-card"))c.classList.remove("big")})}

const canvas=$("#heroCanvas"),ctx=canvas.getContext("2d");let pts=[];function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);pts=Array.from({length:innerWidth<600?16:28},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*2+.4,v:Math.random()*.18+.04}))}function draw(){ctx.clearRect(0,0,innerWidth,innerHeight);ctx.fillStyle="rgba(80,48,36,.18)";pts.forEach(p=>{p.y-=p.v;if(p.y<0)p.y=innerHeight;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()});if(!reduced)requestAnimationFrame(draw)}addEventListener("resize",resize);resize();draw();

const mobileMenu=$("#mobileMenu"),menuBtn=$("#menuBtn");menuBtn.addEventListener("click",()=>{const on=!mobileMenu.classList.contains("open");mobileMenu.classList.toggle("open",on);mobileMenu.setAttribute("aria-hidden",String(!on))});
$("#searchInput").addEventListener("input",e=>renderSearch(e.target.value));
$("#searchInput").addEventListener("keydown",e=>{if(e.key==="Escape")closeSearch()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeCart();closeSearch();if($("#quickView").open)$("#quickView").close()}});

addEventListener("scroll",()=>{const max=document.documentElement.scrollHeight-innerHeight,p=max>0?scrollY/max*100:0;$("#progress").style.width=p+"%";$("#nav").classList.toggle("compact",scrollY>50)},{passive:true});
$("#newsletterForm").addEventListener("submit",e=>{e.preventDefault();toast("Welcome to the private list");e.currentTarget.reset()});
renderProducts();renderSearch();updateCart();observeReveals();