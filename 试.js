// node 试.js 轮数 出文件.ppm [石头x,y,半径 ...] —— 跑网页里原样的脚本，不画到屏上，把 draw 出来的那张存成 ppm
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
let code=html.split('<script>')[1].split('</script>')[0];
const els={};let IMG=null;
const ctx={createImageData:(w,h)=>(IMG={width:w,height:h,data:new Uint8ClampedArray(w*h*4)}),putImageData(){}};
function el(id){return els[id]||(els[id]={id,textContent:'',style:{},classList:{toggle(){}},getContext:()=>ctx,getBoundingClientRect:()=>({left:0,top:0})})}
global.document={getElementById:el};global.window={};global.requestAnimationFrame=()=>{};
code=code.replace(/function loop\(\)[\s\S]*$/,'');
code+=';module.exports={step,draw,get rock(){return rock},get h(){return h},get v(){return v},idx,W,H,setWM:m=>windMode=m};';
const m={exports:{}};new Function('module',code)(m);const S=m.exports;
const [n,out,...rest]=process.argv.slice(2);
for(const a of rest){if(a.startsWith('wind=')){S.setWM(+a.slice(5));continue}const[x,y,r]=a.split(',').map(Number);for(let dy=-r;dy<r;dy++)for(let dx=-r;dx<r;dx++){const i=S.idx(x+dx,y+dy);S.rock[i]=1;S.h[i]=0}}
const t0=Date.now();for(let k=0;k<+n;k++)S.step();S.draw();
const head=`P6 ${IMG.width} ${IMG.height} 255\n`;const buf=Buffer.alloc(IMG.width*IMG.height*3);
for(let i=0;i<IMG.width*IMG.height;i++){buf[i*3]=IMG.data[i*4];buf[i*3+1]=IMG.data[i*4+1];buf[i*3+2]=IMG.data[i*4+2]}
fs.writeFileSync(out,Buffer.concat([Buffer.from(head),buf]));console.log('ms/step',(Date.now()-t0)/n);
