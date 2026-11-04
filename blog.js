(function(){
var GROUPS=[
["Spin qubits",[["spin-qubits","Spin qubits"],["lanthanides","Lanthanides"],["magnetic-memory","Magnetic memory"],["quantum-states","Quantum states"]]],
["X-ray spectroscopy",[["xas","XAS"],["xes","XES"],["multireference","Multireference"],["l-edge","L-edge"],["spectroscopy","Spectroscopy"]]],
["Actinide periodicity",[["actinides","Actinides"],["dft","DFT"],["periodic-trends","Periodic trends"],["oxidation-states","Energetics"],["actinyl","Electronic Properties"]]],
["Separations",[["americium","Americium"],["curium","Curium"],["separation","Separation"],["ligand-design","Ligand design"],["nuclear-waste","Nuclear waste"]]],
["Collaborations",[["collaboration","Collaboration"],["materials","Materials"],["corrosion","Corrosion"],["fluorescent-probes","Fluorescent probes"],["tadf","TADF"]]],
["Chemical education",[["education-research","Education research"],["virtual-labs","Virtual labs"],["student-voice","Student voice"],["outreach","Outreach"]]]];
var LABEL={};GROUPS.forEach(function(g){g[1].forEach(function(t){LABEL[t[0]]=t[1]})});
var P=window.POSTS||[],page=document.body.getAttribute("data-page");
var qs=new URLSearchParams(location.search),sel=(qs.get("tag")||"").toLowerCase(),q=(qs.get("q")||"").trim();
var counts={};P.forEach(function(p){p.tags.forEach(function(t){counts[t]=(counts[t]||0)+1})});
var MON=["January","February","March","April","May","June","July","August","September","October","November","December"];
function fmt(d){if(!d)return"Date to be added";var s=d.split("-");return(+s[2])+" "+MON[s[1]-1]+" "+s[0]}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;")}
function plain(h){return h.replace(/<[^>]+>/g," ")}
function img(src,cls){return'<img'+(cls?' class="'+cls+'"':'')+' src="'+src+'" alt="" onerror="this.onerror=null;this.src=\'images/blog/placeholder.svg\'">'}
function chip(s,n){var c=counts[s]||0;return'<a class="chip'+(c?' has':'')+(s===sel?' on':'')+'" href="blog.html?tag='+s+'">'+LABEL[s]+(n&&c?'<small>'+c+'</small>':'')+'</a>'}
function slug(t){return t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}

function side(toc){
 var h='<aside id="side" aria-label="Search and browse"><form class="sbar" id="sform" action="blog.html" role="search"><input type="search" name="q" value="'+esc(q)+'" placeholder="Search posts" aria-label="Search posts" autocomplete="off"><button type="submit" aria-label="Search"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg></button></form>';
h+='<div class="spanel">'+(toc?'<div class="sh">Contents</div><div class="toc">'+toc+'</div>':'')+'<div class="sh">Browse by tags</div>'+GROUPS.map(function(g){return'<div class="tg">'+g[0]+'</div><div class="tags">'+g[1].map(function(t){return chip(t[0],true)}).join("")+'</div>'}).join("")+'<a class="dall" href="blog.html">Show all posts</a></div>';
 return h+'</aside>';
}
function mount(toc){
 document.getElementById("sidemount").innerHTML=side(toc);
 var s=document.getElementById("side"),tab=document.getElementById("sidetab"),bk=document.createElement("div");
 bk.id="sideback";document.body.appendChild(bk);
 tab.textContent=toc?"Search, tags & contents":"Search & tags";
 function set(o){s.classList.toggle("open",o);bk.classList.toggle("open",o);tab.hidden=o}
 tab.onclick=function(){set(true)};bk.onclick=function(){set(false)};
 document.addEventListener("keydown",function(e){if(e.key==="Escape")set(false)});
 s.querySelectorAll(".toc a").forEach(function(a){a.addEventListener("click",function(){set(false)})});
}

if(page==="list"){
 var box=document.getElementById("posts"),now=document.getElementById("now");
 function match(p){
  if(sel&&p.tags.indexOf(sel)<0)return false;
  if(q){var t=(p.title+" "+p.sub+" "+p.tags.map(function(x){return LABEL[x]}).join(" ")+" "+plain(p.body)).toLowerCase();
   return q.toLowerCase().split(/\s+/).every(function(w){return t.indexOf(w)>-1})}
  return true}
 function draw(){
  var r=P.filter(match);
  var msg=[];if(sel)msg.push("tagged "+(LABEL[sel]||sel));if(q)msg.push("matching “"+esc(q)+"”");
  now.hidden=!msg.length;
  if(msg.length)now.innerHTML='<span>'+r.length+(r.length===1?' post ':' posts ')+msg.join(" ")+'</span><a href="blog.html">Show all posts</a>';
  box.innerHTML=r.length?r.map(function(p){
   return'<article class="pcard">'+img(p.img)+'<div class="pb"><div class="pdate">'+fmt(p.date)+'</div><h3><a href="post.html?p='+p.id+'">'+p.title+'</a></h3><p class="psub">'+p.sub+'</p><div class="tags">'+p.tags.map(function(t){return chip(t)}).join("")+'</div></div></article>'}).join("")
   :'<div class="empty" style="grid-column:1/-1"><b>No posts found.</b><br>Posts on this topic will appear here once they are published. The external blogs at the bottom of the page may have related reading.</div>';
 }
 mount(null);draw();
 var inp=document.querySelector("#sform input");
 inp.addEventListener("input",function(){q=inp.value.trim();var u=new URL(location);q?u.searchParams.set("q",q):u.searchParams.delete("q");history.replaceState(null,"",u);draw()});
 document.getElementById("sform").addEventListener("submit",function(e){e.preventDefault()});
}

if(page==="post"){
 var id=qs.get("p"),i=P.map(function(p){return p.id}).indexOf(id),art=document.getElementById("art");
 if(i<0){art.innerHTML='<div class="empty"><b>Post not found.</b><br><a href="blog.html">Back to all posts</a></div>';mount(null)}
 else{
  var p=P[i];document.title=p.title+" | Abigail Jennifer";
  art.innerHTML='<article class="art">'+img(p.img,"banner")+'<div class="ah"><div class="pdate">'+fmt(p.date)+'</div><h1>'+p.title+'</h1><p class="psub">'+p.sub+'</p><div class="tags">'+p.tags.map(function(t){return chip(t)}).join("")+'</div></div><div class="abody" id="abody">'+p.body+'</div><div class="afoot"><a class="btn p" href="blog.html">← All blog posts</a></div></article>';
  var toc=null,hs=document.querySelectorAll("#abody h2,#abody h3");
  if(p.toc!==false&&hs.length){toc="";hs.forEach(function(h){h.id=slug(h.textContent);toc+='<a class="'+(h.tagName==="H3"?"l3":"l2")+'" href="#'+h.id+'">'+h.textContent+'</a>'})}
  mount(toc);
  var others=P.slice(i+1).concat(P.slice(0,i));
  if(others.length){
   var m=document.getElementById("more");
   m.innerHTML='<h2>Keep reading</h2><div class="mrow" id="mrow">'+others.map(function(o){return'<div class="mcard">'+img(o.img)+'<div><div class="pdate">'+fmt(o.date)+'</div><h3><a href="post.html?p='+o.id+'">'+o.title+'</a></h3></div></div>'}).join("")+'</div><div class="nc"><button type="button" id="mp" aria-label="Scroll left">‹</button><button type="button" id="mn2" aria-label="Scroll right">›</button></div>';
   var row=document.getElementById("mrow");
   function chk(){document.querySelector(".more .nc").style.display=row.scrollWidth>row.clientWidth+4?"flex":"none"}chk();window.addEventListener("resize",chk);
   document.getElementById("mp").onclick=function(){row.scrollBy({left:-row.clientWidth*.8,behavior:"smooth"})};
   document.getElementById("mn2").onclick=function(){row.scrollBy({left:row.clientWidth*.8,behavior:"smooth"})};
  }
 }
}
})();
