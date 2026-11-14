/*
 * Local Champions enemy Team Preview recognizer.
 * Adapted from SebNotFound/champions-calc (AGPL-3.0), modified 2026-11-14.
 * Upstream: https://github.com/SebNotFound/champions-calc
 * This file and the associated sprite hash data are provided under AGPL-3.0.
 * Runs entirely in the user's browser; no image is uploaded for recognition.
 */
import HASHES from './sprite-hashes.json' with { type: 'json' };

const THUMB=16, CTHUMB=8, COLOR_WEIGHT=.45, MATCH_THRESHOLD=.70, MENTION_THRESHOLD=.45;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const JA_NAMES={"Venusaur":"フシギバナ","Blastoise":"カメックス","Beedrill":"スピアー","Charizard":"リザードン","Pidgeot":"ピジョット","Arbok":"アーボック","Pikachu":"ピカチュウ","Raichu-Alola":"ライチュウ","Ninetales-Alola":"キュウコン","Ninetales":"キュウコン","Clefable":"ピクシー","Raichu":"ライチュウ","Arcanine-Hisui":"ウインディ","Arcanine":"ウインディ","Alakazam":"フーディン","Machamp":"カイリキー","Slowbro-Galar":"ヤドラン","Victreebel":"ウツボット","Slowbro":"ヤドラン","Gengar":"ゲンガー","Kangaskhan":"ガルーラ","Starmie":"スターミー","Pinsir":"カイロス","Tauros":"ケンタロス","Gyarados":"ギャラドス","Ditto":"メタモン","Vaporeon":"シャワーズ","Jolteon":"サンダース","Flareon":"ブースター","Aerodactyl":"プテラ","Snorlax":"カビゴン","Dragonite":"カイリュー","Meganium":"メガニウム","Typhlosion-Hisui":"バクフーン","Typhlosion":"バクフーン","Feraligatr":"オーダイル","Ariados":"アリアドス","Ampharos":"デンリュウ","Azumarill":"マリルリ","Politoed":"ニョロトノ","Espeon":"エーフィ","Umbreon":"ブラッキー","Slowking-Galar":"ヤドキング","Slowking":"ヤドキング","Forretress":"フォレトス","Steelix":"ハガネール","Scizor":"ハッサム","Heracross":"ヘラクロス","Skarmory":"エアームド","Houndoom":"ヘルガー","Tyranitar":"バンギラス","Pelipper":"ペリッパー","Sableye":"ヤミラミ","Gardevoir":"サーナイト","Aggron":"ボスゴドラ","Medicham":"チャーレム","Manectric":"ライボルト","Sharpedo":"サメハダー","Camerupt":"バクーダ","Torkoal":"コータス","Altaria":"チルタリス","Milotic":"ミロカロス","Castform-Rainy":"ポワルン","Castform-Snowy":"ポワルン","Castform-Sunny":"ポワルン","Castform":"ポワルン","Banette":"ジュペッタ","Chimecho":"チリーン","Absol":"アブソル","Glalie":"オニゴーリ","Torterra":"ドダイトス","Empoleon":"エンペルト","Infernape":"ゴウカザル","Luxray":"レントラー","Roserade":"ロズレイド","Rampardos":"ラムパルド","Bastiodon":"トリデプス","Lopunny":"ミミロップ","Spiritomb":"ミカルゲ","Garchomp":"ガブリアス","Lucario":"ルカリオ","Hippowdon":"カバルドン","Toxicroak":"ドクロッグ","Abomasnow":"ユキノオー","Weavile":"マニューラ","Rhyperior":"ドサイドン","Leafeon":"リーフィア","Glaceon":"グレイシア","Gliscor":"グライオン","Mamoswine":"マンムー","Gallade":"エルレイド","Froslass":"ユキメノコ","Rotom-Fan":"ロトム","Rotom-Frost":"ロトム","Rotom-Heat":"ロトム","Rotom-Mow":"ロトム","Rotom-Wash":"ロトム","Serperior":"ジャローダ","Rotom":"ロトム","Emboar":"エンブオー","Samurott-Hisui":"ダイケンキ","Samurott":"ダイケンキ","Liepard":"レパルダス","Watchog":"ミルホッグ","Simisage":"ヤナッキー","Simisear":"バオッキー","Simipour":"ヒヤッキー","Excadrill":"ドリュウズ","Audino":"タブンネ","Conkeldurr":"ローブシン","Whimsicott":"エルフーン","Krookodile":"ワルビアル","Cofagrigus":"デスカーン","Garbodor":"ダストダス","Zoroark-Hisui":"ゾロアーク","Zoroark":"ゾロアーク","Reuniclus":"ランクルス","Vanilluxe":"バイバニラ","Emolga":"エモンガ","Chandelure":"シャンデラ","Beartic":"ツンベアー","Stunfisk-Galar":"マッギョ","Stunfisk":"マッギョ","Golurk":"ゴルーグ","Hydreigon":"サザンドラ","Volcarona":"ウルガモス","Chesnaught":"ブリガロン","Delphox":"マフォクシー","Greninja":"ゲッコウガ","Diggersby":"ホルード","Talonflame":"ファイアロー","Vivillon":"ビビヨン","Floette-Eternal":"フラエッテ","Florges":"フラージェス","Pangoro":"ゴロンダ","Furfrou":"トリミアン","Aegislash-Blade":"ギルガルド","Aromatisse":"フレフワン","Slurpuff":"ペロリーム","Clawitzer":"ブロスター","Heliolisk":"エレザード","Tyrantrum":"ガチゴラス","Aurorus":"アマルルガ","Sylveon":"ニンフィア","Hawlucha":"ルチャブル","Dedenne":"デデンネ","Goodra-Hisui":"ヌメルゴン","Goodra":"ヌメルゴン","Klefki":"クレッフィ","Trevenant":"オーロット","Gourgeist-Super":"パンプジン","Gourgeist-Large":"パンプジン","Gourgeist-Small":"パンプジン","Avalugg-Hisui":"クレベース","Avalugg":"クレベース","Noivern":"オンバーン","Decidueye-Hisui":"ジュナイパー","Decidueye":"ジュナイパー","Incineroar":"ガオガエン","Primarina":"アシレーヌ","Crabominable":"ケケンカニ","Toucannon":"ドデカバシ","Lycanroc-Dusk":"ルガルガン","Lycanroc-Midnight":"ルガルガン","Toxapex":"ドヒドイデ","Mudsdale":"バンバドロ","Araquanid":"オニシズクモ","Salazzle":"エンニュート","Tsareena":"アマージョ","Oranguru":"ヤレユータン","Passimian":"ナゲツケサル","Drampa":"ジジーロン","Kommo-o":"ジャラランガ","Flapple":"アップリュー","Corviknight":"アーマーガア","Appletun":"タルップル","Sandaconda":"サダイジャ","Polteageist":"ポットデス","Hatterene":"ブリムオン","Runerigus":"デスバーン","Alcremie":"マホイップ","Dragapult":"ドラパルト","Wyrdeer":"アヤシシ","Kleavor":"バサギリ","Sneasler":"オオニューラ","Meowscarada":"マスカーニャ","Skeledirge":"ラウドボーン","Quaquaval":"ウェーニバル","Pawmot":"パーモット","Garganacl":"キョジオーン","Armarouge":"グレンアルマ","Ceruledge":"ソウブレイズ","Bellibolt":"ハラバリー","Scovillain":"スコヴィラン","Espathra":"クエスパトラ","Tinkaton":"デカヌチャン","Palafin-Hero":"イルカマン","Orthworm":"ミミズズ","Glimmora":"キラフロル","Farigiraf":"リキキリン","Kingambit":"ドドゲザン","Sinistcha":"ヤバソチャ","Archaludon":"ブリジュラス","Hydrapple":"カミツオロチ","Tauros-Paldea-Aqua":"ケンタロス（パルデア・みず）","Tauros-Paldea-Blaze":"ケンタロス（パルデア・ほのお）","Tauros-Paldea-Combat":"ケンタロス（パルデア・かくとう）","Meowstic":"ニャオニクス","Aegislash":"ギルガルド","Gourgeist":"パンプジン","Lycanroc":"ルガルガン","Mimikyu":"ミミッキュ","Mr. Rime":"バリコオル","Morpeko":"モルペコ","Basculegion":"イダイトウ","Maushold":"イッカネズミ","Palafin":"イルカマン"};
const japaneseName=name=>JA_NAMES[name]||'未登録のポケモン';
function decodeImage(blob){
 return new Promise((resolve,reject)=>{
  const url=URL.createObjectURL(blob),img=new Image();
  img.onload=()=>{try{
   const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;
   const x=c.getContext('2d',{willReadFrequently:true});if(!x)throw Error('Canvas不可');
   x.drawImage(img,0,0);const d=x.getImageData(0,0,c.width,c.height);
   URL.revokeObjectURL(url);resolve({data:d.data,width:c.width,height:c.height});
  }catch(e){URL.revokeObjectURL(url);reject(e)}};
  img.onerror=()=>{URL.revokeObjectURL(url);reject(Error('画像を読み込めません'))};img.src=url;
 });
}
function isRed(r,g,b){return r>55&&r>g*1.8&&b>g&&r>b*1.1}
function detectColumn(img){
 const {data,width:W,height:H}=img,counts=new Uint32Array(W),threshold=H*.12;
 for(let x=0;x<W;x++)for(let y=0;y<H;y++){const i=(y*W+x)*4;if(isRed(data[i],data[i+1],data[i+2]))counts[x]++}
 let x1=W-1;while(x1>0&&counts[x1]<threshold)x1--;
 let x0=x1;while(x0>0&&counts[x0-1]>=threshold)x0--;
 return [x0,x1];
}
function rowProfile(img,x0,x1){
 const rows=new Float64Array(img.height),W=img.width,d=img.data;
 for(let y=0;y<img.height;y++)for(let x=x0;x<=x1;x++){const i=(y*W+x)*4;if(isRed(d[i],d[i+1],d[i+2]))rows[y]++}
 return rows;
}
function detectSlots(img,x0,x1){
 const H=img.height,rows=rowProfile(img,x0,x1),th=(x1-x0)*.3,raw=[];let s=-1;
 for(let y=0;y<H;y++){if(rows[y]>=th){if(s<0)s=y}else if(s>=0){raw.push([s,y-1]);s=-1}}
 if(s>=0)raw.push([s,H-1]);
 const runs=[];for(const r of raw){const p=runs[runs.length-1];if(p&&r[0]-p[1]<=8)p[1]=r[1];else runs.push([...r])}
 if(runs.length){
  const hs=runs.map(r=>r[1]-r[0]).sort((a,b)=>a-b),med=hs[Math.floor(hs.length/2)]||1;
  const tops=runs.filter(r=>Math.abs(r[1]-r[0]-med)<=med*.25).map(r=>r[0]).sort((a,b)=>a-b);
  if(tops.length>=5){let pitch=Infinity;for(let i=1;i<tops.length;i++)pitch=Math.min(pitch,tops[i]-tops[i-1]);if(!isFinite(pitch))pitch=med;return Array.from({length:6},(_,i)=>[Math.round(tops[0]+i*pitch),Math.round(tops[0]+i*pitch+med)])}
 }
 const pref=new Float64Array(H+1);for(let y=0;y<H;y++)pref[y+1]=pref[y]+rows[y];
 const sum=(a,b)=>pref[clamp(b,0,H)]-pref[clamp(a,0,H)];
 let best=null,bs=-Infinity;const min=Math.max(8,Math.floor(H/14)),max=Math.max(min+1,Math.floor(H/6));
 for(let pitch=min;pitch<=max;pitch++){const win=Math.round(pitch*.8),gap=pitch-win,mt=H-(5*pitch+win);
  for(let top=0;top<=mt;top+=2){let inside=0,gaps=0;for(let k=0;k<6;k++){const y=top+k*pitch;inside+=sum(y,y+win);if(k<5)gaps+=sum(y+win,y+pitch)}
   const score=inside/(6*win)-(gap?gaps/(5*gap):0);if(score>bs){bs=score;best={top,pitch}}}
 }
 if(!best)return [];
 return Array.from({length:6},(_,k)=>{const y=best.top+k*best.pitch;return [y,Math.min(y+Math.round(best.pitch*.9),H)]});
}
function crop(img,sx,sy,w,h){const out=new Uint8ClampedArray(w*h*4);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const a=((sy+y)*img.width+sx+x)*4,b=(y*w+x)*4;out[b]=img.data[a];out[b+1]=img.data[a+1];out[b+2]=img.data[a+2];out[b+3]=255}return out}
function flood(w,h,accept){const mask=new Uint8Array(w*h),stack=[];const seed=k=>{if(!mask[k]&&accept(k)){mask[k]=1;stack.push(k)}};for(let x=0;x<w;x++){seed(x);seed((h-1)*w+x)}for(let y=0;y<h;y++){seed(y*w);seed(y*w+w-1)}while(stack.length){const k=stack.pop(),x=k%w,ns=[x>0?k-1:-1,x<w-1?k+1:-1,k-w,k+w];for(const n of ns)if(n>=0&&n<w*h&&!mask[n]&&accept(n)){mask[n]=1;stack.push(n)}}return mask}
function removeBg(rgba,w,h){
 const pal=[],seen=new Set();const sample=k=>{const i=k*4,r=rgba[i],g=rgba[i+1],b=rgba[i+2],key=(r>>4)+'_'+(g>>4)+'_'+(b>>4);if(!seen.has(key)){seen.add(key);pal.push([r,g,b])}};
 for(let x=0;x<w;x++){sample(x);sample((h-1)*w+x)}for(let y=0;y<h;y++){sample(y*w);sample(y*w+w-1)}
 const tol2=46*46,p=flood(w,h,k=>{const i=k*4,r=rgba[i],g=rgba[i+1],b=rgba[i+2];return pal.some(v=>(r-v[0])**2+(g-v[1])**2+(b-v[2])**2<tol2)}),
 red=flood(w,h,k=>{const i=k*4,r=rgba[i],g=rgba[i+1],b=rgba[i+2];return(r>45&&r>g*1.25&&r>b*1.1)||(r>175&&g>160&&b>160&&r>=g&&r>=b-4)});
 for(let k=0;k<w*h;k++)if(p[k]&&red[k])rgba[k*4+3]=0;
 const labels=new Int32Array(w*h).fill(-1),stack=[];let best=-1,bestN=0;
 for(let start=0;start<w*h;start++){if(labels[start]!==-1||rgba[start*4+3]<=16)continue;labels[start]=start;stack.push(start);let n=0;while(stack.length){const k=stack.pop();n++;const x=k%w,ns=[x>0?k-1:-1,x<w-1?k+1:-1,k-w,k+w];for(const q of ns)if(q>=0&&q<w*h&&labels[q]===-1&&rgba[q*4+3]>16){labels[q]=start;stack.push(q)}}if(n>bestN){bestN=n;best=start}}
 if(best>=0)for(let k=0;k<w*h;k++)if(labels[k]!==best)rgba[k*4+3]=0;
 return rgba;
}
function thumbs(rgba,w,h){
 const rows=new Uint16Array(h),cols=new Uint16Array(w);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(rgba[(y*w+x)*4+3]>16){rows[y]++;cols[x]++}
 const mr=Math.max(...rows),mc=Math.max(...cols);if(!mr)return [new Uint8Array(256).fill(128),new Uint8Array(192).fill(128)];
 let y0=0,y1=h-1,x0=0,x1=w-1;while(y0<h&&rows[y0]<Math.max(1,mr*.06))y0++;while(y1>y0&&rows[y1]<Math.max(1,mr*.06))y1--;while(x0<w&&cols[x0]<Math.max(1,mc*.06))x0++;while(x1>x0&&cols[x1]<Math.max(1,mc*.06))x1--;
 const bw=x1-x0+1,bh=y1-y0+1,side=Math.max(bw,bh),ox=(side-bw)>>1,oy=(side-bh)>>1,sq=new Float32Array(side*side).fill(128),cs=new Float32Array(side*side*3).fill(128);
 for(let y=0;y<bh;y++)for(let x=0;x<bw;x++){const i=((y+y0)*w+x+x0)*4,a=rgba[i+3]/255,k=(y+oy)*side+x+ox;sq[k]=.299*(rgba[i]*a+128*(1-a))+.587*(rgba[i+1]*a+128*(1-a))+.114*(rgba[i+2]*a+128*(1-a));cs[k*3]=rgba[i]*a+128*(1-a);cs[k*3+1]=rgba[i+1]*a+128*(1-a);cs[k*3+2]=rgba[i+2]*a+128*(1-a)}
 const gray=new Uint8Array(256),color=new Uint8Array(192);
 for(let ty=0;ty<16;ty++)for(let tx=0;tx<16;tx++){const ax=Math.floor(tx*side/16),bx=Math.max(ax+1,Math.floor((tx+1)*side/16)),ay=Math.floor(ty*side/16),by=Math.max(ay+1,Math.floor((ty+1)*side/16));let s=0,n=0;for(let y=ay;y<by;y++)for(let x=ax;x<bx;x++){s+=sq[y*side+x];n++}gray[ty*16+tx]=Math.round(s/n)}
 for(let ty=0;ty<8;ty++)for(let tx=0;tx<8;tx++){const ax=Math.floor(tx*side/8),bx=Math.max(ax+1,Math.floor((tx+1)*side/8)),ay=Math.floor(ty*side/8),by=Math.max(ay+1,Math.floor((ty+1)*side/8));let r=0,g=0,b=0,n=0;for(let y=ay;y<by;y++)for(let x=ax;x<bx;x++){const k=(y*side+x)*3;r+=cs[k];g+=cs[k+1];b+=cs[k+2];n++}const k=(ty*8+tx)*3;color[k]=Math.round(r/n);color[k+1]=Math.round(g/n);color[k+2]=Math.round(b/n)}
 return [gray,color];
}
function normalize(a){let m=0;for(const x of a)m+=x;m/=a.length;let n=0;const v=new Float32Array(a.length);for(let i=0;i<a.length;i++){v[i]=a[i]-m;n+=v[i]*v[i]}n=Math.sqrt(n)||1;for(let i=0;i<v.length;i++)v[i]/=n;return v}
function cosine(a,b){let d=0;for(let i=0;i<a.length;i++)d+=a[i]*b[i];return d}
function b64(s){const z=atob(s),a=new Uint8Array(z.length);for(let i=0;i<z.length;i++)a[i]=z.charCodeAt(i);return a}
let refs;
function getRefs(){if(!refs)refs=HASHES.map(h=>({species:h.species,g:normalize(b64(h.t)),c:normalize(b64(h.c))}));return refs}
function flip(rgba,w,h){const out=new Uint8ClampedArray(rgba.length);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const s=(y*w+x)*4,d=(y*w+w-1-x)*4;out.set(rgba.subarray(s,s+4),d)}return out}
function match(rgba,w,h,learned=[]){
 const f=flip(rgba,w,h),[g,c]=thumbs(rgba,w,h),[fg,fc]=thumbs(f,w,h),gv=normalize(g),cv=normalize(c),fgv=normalize(fg),fcv=normalize(fc);
 let best={species:'',score:-1,learned:false};
 for(const ref of getRefs()){const shape=Math.max(cosine(gv,ref.g),cosine(fgv,ref.g)),color=Math.max(cosine(cv,ref.c),cosine(fcv,ref.c)),score=.55*shape+.45*color;if(score>best.score)best={species:ref.species,score,learned:false}}
 for(const ref of learned){const rg=normalize(ref.g),rc=normalize(ref.c),shape=Math.max(cosine(gv,rg),cosine(fgv,rg)),color=Math.max(cosine(cv,rc),cosine(fcv,rc)),score=.55*shape+.45*color;if(score>best.score)best={species:ref.species,score,learned:true}}
 return {...best,sample:{gray:Array.from(g),color:Array.from(c)}};
}
const LEARN_DB='champions-local-learning',LEARN_STORE='samples';
function openLearnDb(){return new Promise((resolve,reject)=>{const req=indexedDB.open(LEARN_DB,1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(LEARN_STORE))req.result.createObjectStore(LEARN_STORE,{keyPath:'id',autoIncrement:true})};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
export async function getLearnedSamples(){const db=await openLearnDb();return new Promise((resolve,reject)=>{const tx=db.transaction(LEARN_STORE,'readonly'),req=tx.objectStore(LEARN_STORE).getAll();req.onsuccess=()=>{db.close();resolve(req.result||[])};req.onerror=()=>{db.close();reject(req.error)}})}
export async function saveLearnedSample(sample,species){if(!sample?.gray||!sample?.color||!species?.trim())throw Error('学習画像またはポケモン名がありません');const db=await openLearnDb();return new Promise((resolve,reject)=>{const tx=db.transaction(LEARN_STORE,'readwrite');tx.objectStore(LEARN_STORE).add({species:species.trim(),g:sample.gray,c:sample.color,createdAt:Date.now()});tx.oncomplete=()=>{db.close();resolve(true)};tx.onerror=()=>{db.close();reject(tx.error)}})}

// Some Champions screenshots arrange the six enemy cards as a 3-column × 2-row grid.
// Detect that layout first; otherwise use the upstream single red-column layout.
function detectGridCells(img){
 const {data,width:W,height:H}=img,xc=new Uint32Array(W),yc=new Uint32Array(H);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*4;if(isRed(data[i],data[i+1],data[i+2])){xc[x]++;yc[y]++}}
 const runs=(a,threshold,minLen)=>{const out=[];let st=-1;for(let i=0;i<a.length;i++){if(a[i]>=threshold){if(st<0)st=i}else if(st>=0){if(i-st>=minLen)out.push([st,i-1]);st=-1}}if(st>=0&&a.length-st>=minLen)out.push([st,a.length-1]);return out};
 const xs=runs(xc,H*.12,Math.max(8,Math.floor(W*.025)));
 if(xs.length!==3)return null;
 const x0=xs[0][0],x1=xs[2][1],rows=new Uint32Array(H);
 for(let y=0;y<H;y++)for(let x=x0;x<=x1;x++){const i=(y*W+x)*4;if(isRed(data[i],data[i+1],data[i+2]))rows[y]++}
 const ys=runs(rows,(x1-x0+1)*.22,Math.max(8,Math.floor(H*.08)));
 if(ys.length!==2)return null;
 return ys.flatMap(y=>xs.map(x=>({x0:x[0],x1:x[1],y0:y[0],y1:y[1]})));
}
export async function recognizeOpponentImage(file){
 const img=await decodeImage(file),grid=detectGridCells(img),results=[],learned=await getLearnedSamples();
 if(grid&&grid.length===6){
  for(const cell of grid){const cw=cell.x1-cell.x0+1,ch=cell.y1-cell.y0+1,sw=Math.round(cw*.7),sy=cell.y0+Math.round(ch*.08),sh=Math.max(8,Math.round(ch*.84));
   const rgba=removeBg(crop(img,cell.x0,sy,sw,sh),sw,sh),m=match(rgba,sw,sh,learned),conf=clamp(m.score,0,1);
   results.push({name:conf>=MATCH_THRESHOLD?japaneseName(m.species):'',candidate:conf>=MENTION_THRESHOLD?japaneseName(m.species):'',confidence:conf,uncertain:conf<MATCH_THRESHOLD,learnedMatch:!!m.learned,sample:m.sample});
  }
 }else{
  const [x0,x1]=detectColumn(img);
  if(x1-x0<20)throw Error('相手側の赤いパネルを検出できません。Championsの選出画面スクショか確認してください');
  const slots=detectSlots(img,x0,x1),valid=slots.filter(([a,b])=>a>=0&&b<=img.height&&b-a>=8);
  if(valid.length!==6)throw Error('相手6枠を6つに分割できませんでした。画像の解像度や画面レイアウトを確認してください');
  const spriteW=Math.round((x1-x0)*.7);
  for(const [top,bottom] of valid){const h=bottom-top;if(spriteW<8||h<8){results.push({name:'',confidence:0,uncertain:true});continue}
   const rgba=removeBg(crop(img,x0,top,spriteW,h),spriteW,h),m=match(rgba,spriteW,h,learned),conf=clamp(m.score,0,1);
   results.push({name:conf>=MATCH_THRESHOLD?japaneseName(m.species):'',candidate:conf>=MENTION_THRESHOLD?japaneseName(m.species):'',confidence:conf,uncertain:conf<MATCH_THRESHOLD,learnedMatch:!!m.learned,sample:m.sample});
  }
 }
 while(results.length<6)results.push({name:'',candidate:'',confidence:0,uncertain:true,sample:null});
 results.length=6;
 return {pokemon:results,recognized:results.filter(x=>x.name).length,engine:'local'};
}
