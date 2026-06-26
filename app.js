const btnNovoLote=document.getElementById('novoLote');
const lista=document.getElementById('listaLotes');
const modal=document.getElementById('modalLote');
const appMain=document.getElementById('app');
const loteView=document.getElementById('loteView');
let loteAtual=null;
function banco(){return carregarBanco();}
function render(){
const b=banco();
document.getElementById('totalLotes').textContent=b.lotes.length;
let ta=0;b.lotes.forEach(l=>ta+=l.animais.length);document.getElementById('totalAnimais').textContent=ta;
lista.innerHTML='';
if(!b.lotes.length){lista.innerHTML='<p>Nenhum lote cadastrado.</p>';return;}
b.lotes.forEach(l=>{
 const c=document.createElement('div');
 c.className='lote-card';
 c.innerHTML=`<h3>${l.nome}</h3>
 <div class="lote-info"><span>Animais</span><strong>${l.animais.length}</strong></div>
 <button class="btn btn-abrir">Abrir</button>`;
 c.querySelector('button').onclick=()=>abrirLote(l.id);
 lista.appendChild(c);
});
}
function abrirLote(id){
const b=banco(); loteAtual=b.lotes.find(x=>x.id===id);
appMain.style.display='none'; loteView.style.display='block';
document.getElementById('tituloLote').textContent=loteAtual.nome;
if(document.getElementById('dataRef')) document.getElementById('dataRef').value=loteAtual.dataRef||new Date().toISOString().slice(0,10);
renderAnimais();
}
function renderAnimais(){
document.getElementById('qtAnimaisLote').textContent=loteAtual.animais.length;
const f=(document.getElementById('buscaAnimal')?.value||'').toLowerCase();
const lista=loteAtual.animais.filter(a=>!f||String(a.brinco).toLowerCase().includes(f));
document.getElementById('listaAnimais').innerHTML=lista.map((a,i)=>`<div class="lote-card"><h3>🐂 ${a.brinco}</h3><div>Peso: <b>${a.peso} kg</b></div><div>Sexo: ${a.sexo||'-'}</div><div>${a.obs||''}</div><div class='lote-botoes'><button class='btn btn-editar' onclick='editarAnimal(${i})'>Editar</button><button class='btn btn-excluir' onclick='excluirAnimal(${i})'>Excluir</button></div></div>`).join('')||'<p>Nenhum animal.</p>';
}
voltarDashboard.onclick=()=>{loteView.style.display='none';appMain.style.display='block';render();}
const modalAnimal=document.getElementById('modalAnimal');
let editIndex=-1;
btnNovoAnimal.onclick=()=>{editIndex=-1;aniBrinco.value='';aniPeso.value='';aniSexo.value='';aniObs.value='';modalAnimal.style.display='flex';};
cancelarAnimal.onclick=()=>{modalAnimal.style.display='none';editIndex=-1;};
salvarAnimal.onclick=()=>{
 if(editIndex===-1){
   loteAtual.animais.push({brinco:aniBrinco.value,peso:parseFloat(aniPeso.value||0),sexo:aniSexo.value,obs:aniObs.value});
 }else{
   loteAtual.animais[editIndex]={brinco:aniBrinco.value,peso:parseFloat(aniPeso.value||0),sexo:aniSexo.value,obs:aniObs.value};
 }
 const b=banco(); b.lotes[b.lotes.findIndex(x=>x.id===loteAtual.id)]=loteAtual; salvarBanco(b);
 modalAnimal.style.display='none';editIndex=-1;aniBrinco.value='';aniPeso.value='';aniObs.value='';
 renderAnimais(); render();
}
btnNovoLote.onclick=()=>modal.style.display='flex';
cancelarLote.onclick=()=>modal.style.display='none';
salvarLote.onclick=()=>{const l={id:Date.now(),nome:loteNome.value||'Novo Lote',dataRef:new Date().toISOString().slice(0,10),animais:[],pesagens:[],dieta:[],custos:[],relatorios:[]};adicionarLote(l);modal.style.display='none';render();};
render();

window.editarAnimal=function(i){
const a=loteAtual.animais[i];
aniBrinco.value=a.brinco;
aniPeso.value=a.peso;
aniSexo.value=a.sexo||'';
aniObs.value=a.obs||'';
editIndex=i;
modalAnimal.style.display='flex';
}

window.excluirAnimal=function(i){
if(!confirm('Excluir animal?')) return;
loteAtual.animais.splice(i,1);
const b=banco(); b.lotes[b.lotes.findIndex(x=>x.id===loteAtual.id)]=loteAtual; salvarBanco(b);
renderAnimais(); render();
}
document.addEventListener('input',e=>{if(e.target.id==='buscaAnimal') renderAnimais();});

const btnNovaPesagem=document.getElementById('btnNovaPesagem');
const pesagemBox=document.getElementById('pesagemBox');
btnNovaPesagem.onclick=()=>{pesagemBox.style.display='block';dataPesagem.value=new Date().toISOString().slice(0,10);}
salvarPesagem.onclick=()=>{
 const br=brincoPesagem.value.trim(); const p=parseFloat(pesoPesagem.value); const d=dataPesagem.value;
 const ani=loteAtual.animais.find(x=>String(x.brinco)===br);
 if(!ani){alert('Brinco não encontrado');return;}
 ani.historico=ani.historico||[];
 const ult=ani.historico.length?ani.historico[ani.historico.length-1].peso:parseFloat(ani.peso);
 const dataAnt=ani.historico.length?new Date(ani.historico[ani.historico.length-1].data):new Date(loteAtual.dataRef);
 const dias=Math.max(1,Math.round((new Date(d)-dataAnt)/86400000));
 const ganho=p-ult;
 const gmd=ganho/dias;
 ani.historico.push({data:d,peso:p,ganho,gmd});
 ani.peso=p;
 loteAtual.ultimaPesagem=d;
 const b=banco(); b.lotes[b.lotes.findIndex(x=>x.id===loteAtual.id)]=loteAtual; salvarBanco(b);
 alert('Pesagem salva. GMD: '+gmd.toFixed(2)+' kg/dia');
 brincoPesagem.value='';pesoPesagem.value='';brincoPesagem.focus();
 renderAnimais();render();
};
