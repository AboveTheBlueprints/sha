// node 试草.js 轮数 出.ppm 样子 —— 样子：横（拦风的竖条）/ 顺（顺风的横条）/ 点（同样多撒开）/ 块 / 无。看草剩多少
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
let code=html.split('<script>')[1].split('</script>')[0];
const els={};let IMG=null;
const ctx={createImageData:(w,h)=>(IMG={width:w,height:h,data:new Uint8ClampedArray(w*h*4)}),putImageData(){}};
function el(id){return els[id]||(els[id]={id,textContent:'',style:{},classList:{toggle(){}},getContext:()=>ctx,getBoundingClientRect:()=>({left:0,top:0})})}
global.document={getElementById:el};global.window={};global.requestAnimationFrame=()=>{};
code=code.replace(/function loop\(\)[\s\S]*$/,'');
code+=';module.exports={step,draw,get rock(){return rock},get h(){return h},get v(){return v},idx,W,H};';
const m={exports:{}};new Function('module',code)(m);const S=m.exports;
const [n,out,kind]=process.argv.slice(2);const W=S.W,H=S.H;const A=Math.round(W*H*0.15);let cnt=0;
const put=(x,y)=>{const i=S.idx(x,y);if(S.v[i]<1){S.v[i]=1;cnt++}};
if(kind=='横'){const w=Math.ceil(A/H);for(let x=100;x<100+w;x++)for(let y=0;y<H;y++)put(x,y)}
if(kind=='顺'){const hh=Math.ceil(A/W);for(let y=50;y<50+hh;y++)for(let x=0;x<W;x++)put(x,y)}
if(kind=='块'){const s=Math.ceil(Math.sqrt(A));for(let y=20;y<20+s;y++)for(let x=80;x<80+s;x++)put(x,y)}
if(kind=='点'){while(cnt<A){const x=(Math.random()*W)|0,y=(Math.random()*H)|0;for(let dy=0;dy<3;dy++)for(let dx=0;dx<3;dx++)put(x+dx,y+dy)}}
const mean=()=>{let s=0;for(let i=0;i<W*H;i++)s+=S.v[i];return (s/W/H).toFixed(2)};
const r=[mean()];for(let k=1;k<=+n;k++){S.step();if(k%(n/5)==0)r.push(mean())}
S.draw();console.log(kind,r.join(' '));
const head=`P6 ${IMG.width} ${IMG.height} 255\n`;const buf=Buffer.alloc(IMG.width*IMG.height*3);
for(let i=0;i<IMG.width*IMG.height;i++){buf[i*3]=IMG.data[i*4];buf[i*3+1]=IMG.data[i*4+1];buf[i*3+2]=IMG.data[i*4+2]}
fs.writeFileSync(out,Buffer.concat([Buffer.from(head),buf]));
