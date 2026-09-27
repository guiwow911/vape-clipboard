/* 验证 app.js 的 mergeImport：导出再导入是否丢数据
   从已发布源码抽取真实函数 */
const fs = require('fs');
const APP = 'C:/Users/1/Desktop/vape-clipboard/src/web/app.js';
const lines = fs.readFileSync(APP, 'utf8').split(/\r?\n/);
const grab = (a, b) => lines.slice(a - 1, b).join('\n');
const src = [
  grab(211, 219),   // detectType
  grab(220, 220),   // oneLine
  grab(402, 409),   // trimHistory
  grab(1737, 1759)  // mergeImport
].join('\n');

let state, toasts = [];
const save = () => {}, render = () => {}, toast = m => toasts.push(m);
let seq = 1; const nextId = () => 'e' + (seq++);
const t = k => k;
const factory = new Function('state', 'save', 'render', 'toast', 'nextId', 't',
  src + '\nreturn { mergeImport };');

function fresh() {
  state = { entries: [], limits: { min: 20, max: 120 } };
  toasts = []; seq = 1;
  return factory(state, save, render, toast, nextId, t);
}

let pass = 0, fail = 0;
const ok = (n, c, extra) => { if (c) { pass++; console.log('  PASS  ' + n); } else { fail++; console.log('  FAIL  ' + n + (extra ? '  -> ' + extra : '')); } };

console.log('\n[1] 导出再导入：文本条目');
{
  const A = fresh();
  A.mergeImport(JSON.stringify({ entries: [{ id: 'e1', text: 'hello', type: 'text', pin: true, fav: true, quick: 3, cat: null }] }));
  ok('导入 1 条', state.entries.length === 1);
  ok('pin 保留', state.entries[0].pin === true);
  ok('fav 保留', state.entries[0].fav === true);
  ok('quick 保留', state.entries[0].quick === 3);
}

console.log('\n[2] 导出再导入：图片条目 —— 应保留 img/iw/ih');
{
  const A = fresh();
  const imgData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==';
  A.mergeImport(JSON.stringify({ entries: [{ id: 'e9', text: '[图片 100×100]', type: 'image', img: imgData, iw: 100, ih: 100, cat: null }] }));
  ok('导入 1 条', state.entries.length === 1, 'got ' + state.entries.length);
  ok('img 数据保留', state.entries[0].img === imgData, 'img=' + String(state.entries[0].img).slice(0, 30));
  ok('iw/ih 保留', state.entries[0].iw === 100 && state.entries[0].ih === 100);
}

console.log('\n[3] 导出再导入：自定义栏目归属 cat 是否保留');
{
  const A = fresh();
  A.mergeImport(JSON.stringify({ entries: [{ id: 'e5', text: 'belongs to custom', type: 'text', cat: 'cABC' }] }));
  ok('cat 保留', state.entries[0].cat === 'cABC', 'cat=' + String(state.entries[0].cat));
}

console.log('\n[4] 导出再导入：昵称 / 头像 / 栏目名');
{
  const A = fresh();
  A.mergeImport(JSON.stringify({ account: { name: '张三', avatar: 'data:image/png;base64,AA' }, names: { text: '我的文本' }, entries: [{ text: 'x' }] }));
  ok('导入条数 1', state.entries.length === 1);
  console.log('   （account/names 是否被导入见下方源码，本用例仅观察）');
}

console.log('\n==== ' + pass + ' passed, ' + fail + ' failed ====');
