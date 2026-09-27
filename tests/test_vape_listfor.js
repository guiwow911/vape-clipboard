/* 验证 VapeV4Clipboard「从某个面板添加内容」的归属逻辑
   直接从已发布的 src/web/app.js 抽取真实函数，避免测试与实现脱节 */
const fs = require('fs');
const APP = 'C:/Users/1/Desktop/vape-clipboard/src/web/app.js';
const lines = fs.readFileSync(APP, 'utf8').split(/\r?\n/);
// 1-based 行号区间（含端点）
const grab = (a, b) => lines.slice(a - 1, b).join('\n');
const src = [
  grab(211, 219),   // detectType
  grab(220, 220),   // oneLine
  grab(223, 223),   // clamp
  grab(365, 375),   // listFor
  grab(376, 376),   // entry
  grab(379, 379),   // catOpt
  grab(380, 401),   // addEntry
  grab(402, 409)    // trimHistory
].join('\n');

// ---- 最小桩 ----
let state, renders = 0, toasts = [];
const custom = [{ id: 'cTEST', name: '我的栏目' }];
const isCustom = id => custom.some(c => c.id === id);
const save = () => {};
const render = () => { renders++; };
const toast = m => toasts.push(m);
let seq = 1;
const nextId = () => 'e' + (seq++);
const t = k => k;

const factory = new Function('state', 'isCustom', 'save', 'render', 'toast', 'nextId', 't',
  src + '\nreturn { listFor, addEntry, catOpt, detectType };');

function fresh() {
  state = { entries: [], q: '', dedupe: true, limits: { min: 20, max: 120 } };
  renders = 0; toasts = [];
  return factory(state, isCustom, save, render, toast, nextId, t);
}

let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log('  PASS  ' + name); }
  else { fail++; console.log('  FAIL  ' + name + (extra ? '  -> ' + extra : '')); }
};

console.log('\n[1] 内置栏目「代码」点+粘贴普通文本 —— 应出现在代码面板里');
{
  const A = fresh();
  A.addEntry('hello world', A.catOpt('code'));
  ok('条目出现在 code 面板', A.listFor('code').length === 1, 'got ' + A.listFor('code').length);
  ok('条目出现在 全部', A.listFor('all').length === 1);
  ok('条目出现在 text 面板（按类型）', A.listFor('text').length === 1);
  ok('cat 已记录为 code', state.entries[0].cat === 'code', 'cat=' + state.entries[0].cat);
}

console.log('\n[2] 自定义栏目点+粘贴 —— 应出现在该栏目');
{
  const A = fresh();
  A.addEntry('some code {a:1}', A.catOpt('cTEST'));
  ok('条目出现在自定义栏目', A.listFor('cTEST').length === 1, 'got ' + A.listFor('cTEST').length);
  ok('条目出现在 全部', A.listFor('all').length === 1);
}

console.log('\n[3] 条目设置区/⋮菜单「粘贴」同一条（2 秒内）—— 旧版会静默丢弃');
{
  const A = fresh();
  A.addEntry('粘贴内容', A.catOpt('cTEST'));      // 先有一条
  const before = state.entries.length;
  const r = A.addEntry('粘贴内容', A.catOpt('cTEST')); // 立刻再粘贴同一条
  ok('不再静默返回（有 toast 反馈）', toasts.length > 0, 'toasts=' + JSON.stringify(toasts));
  ok('没有产生重复条目', state.entries.length === before, 'entries=' + state.entries.length);
  ok('该条目归属到当前栏目', A.listFor('cTEST').length === 1);
}

console.log('\n[4] 自动捕获（无 opts）—— 去重仍应保持静默');
{
  const A = fresh();
  A.addEntry('来自剪切板');
  const n1 = toasts.length;
  const r = A.addEntry('来自剪切板');   // 2 秒内重复
  ok('静默忽略，不弹提示', toasts.length === n1, 'toasts=' + JSON.stringify(toasts));
  ok('返回 false', r === false);
  ok('text 面板有 1 条', A.listFor('text').length === 1);
}

console.log('\n[5] 全部 / 收藏 是视图，不写归属');
{
  const A = fresh();
  ok('catOpt(all) === null', A.catOpt('all') === null);
  ok('catOpt(fav) === null', A.catOpt('fav') === null);
  ok('catOpt(null) === null', A.catOpt(null) === null);
  A.addEntry('视图内容', A.catOpt('all'));
  ok('cat 未被写成 all', state.entries[0].cat === null, 'cat=' + state.entries[0].cat);
}

console.log('\n[6] 回归：条目仍按类型出现在对应面板');
{
  const A = fresh();
  A.addEntry('https://example.com');
  ok('链接进 link 面板', A.listFor('link').length === 1, 'link=' + A.listFor('link').length);
  ok('链接不进 code 面板', A.listFor('code').length === 0);
  A.addEntry('const a = 1;');
  ok('代码进 code 面板', A.listFor('code').length === 1);
}

console.log('\n==== ' + pass + ' passed, ' + fail + ' failed ====');
process.exit(fail ? 1 : 0);
